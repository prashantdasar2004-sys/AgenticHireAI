import { Candidate } from "../models/Candidate.js";
import { Workflow } from "../models/Workflow.js";
import { WorkflowLog } from "../models/WorkflowLog.js";
import { runEmbeddingAgent } from "../agents/embedding.agent.js";
import { runEmailAgent } from "../agents/email.agent.js";
import { runInterviewAgent } from "../agents/interview.agent.js";
import { runMatchingAgent } from "../agents/matching.agent.js";
import { runResumeParser } from "../agents/resumeParser.agent.js";
import { runShortlistingAgent } from "../agents/shortlisting.agent.js";
import { retrieveHiringContext } from "../rag/qdrant.service.js";
import { loadHiringSpec, loadSpec, loadWorkflowSpec } from "../utils/specLoader.js";

const agentHandlers = {
  resume_parser: async (context) => {
    const parsedResume = await runResumeParser(context);
    context.workflow.state.parsedResume = parsedResume;
    await Candidate.findByIdAndUpdate(context.candidate._id, { parsed_resume_json: parsedResume.data });
    return parsedResume;
  },
  embedding_agent: async (context) => {
    return runEmbeddingAgent({ ...context, parsedResume: context.workflow.state.parsedResume });
  },
  matching_agent: async (context) => {
  const ragContext = await retrieveHiringContext(
    context.job.title
  );

  const matchResult = await runMatchingAgent({
    ...context,
    parsedResume:
      context.workflow.state.parsedResume,
    ragContext,
  });

  context.workflow.state.matchResult =
    matchResult;

  await Candidate.findByIdAndUpdate(
    context.candidate._id,
    {
      match_score:
        matchResult.data.match_score,

      matched_skills:
        matchResult.data.matched_skills || [],

      missing_skills:
        matchResult.data.missing_skills || [],
    }
  );

  return matchResult;
},
  shortlisting_agent: async (context) => {
    const shortlisting = await runShortlistingAgent({
      ...context,
      matchResult: context.workflow.state.matchResult
    });
    context.workflow.state.shortlisting = shortlisting;
    await Candidate.findByIdAndUpdate(context.candidate._id, { status: shortlisting.data.decision });
    return shortlisting;
  },
  interview_agent: async (context) => {
    const interview = await runInterviewAgent({
      ...context,
      parsedResume: context.workflow.state.parsedResume
    });
    context.workflow.state.interview = interview;
    return interview;
  },
  email_agent: async (context) => {
    return runEmailAgent({
      ...context,
      shortlisting: context.workflow.state.shortlisting
    });
  }
};

async function logWorkflow(workflow, agentName, input, output, status, error = null) {
  await WorkflowLog.create({
    workflow_id: workflow._id,
    agent_name: agentName,
    input,
    output,
    status,
    error: error?.message || null,
    stack: error?.stack || null
  });
}

async function executeAgentWithRetry(agentName, context) {
  const retryPolicy = await loadSpec("system/retry-policy.json");
  const workflow = context.workflow;
  const currentRetries = workflow.retries?.get(agentName) || 0;

  try {
    await logWorkflow(workflow, agentName, { candidate_id: context.candidate._id, job_id: context.job._id }, {}, "running");
    const output = await agentHandlers[agentName](context);
    await logWorkflow(workflow, agentName, {}, output, "success");
    return output;
  } catch (error) {
    await logWorkflow(workflow, agentName, {}, {}, "failed", error);
    if (currentRetries < retryPolicy.max_retries) {
      workflow.retries.set(agentName, currentRetries + 1);
      await workflow.save();
      return executeAgentWithRetry(agentName, context);
    }
    throw error;
  }
}

export async function startWorkflowForCandidate(candidate, job, existingWorkflow = null) {
  const hiringSpec = await loadHiringSpec(job.hiring_spec_id);
  const workflowSpec = await loadWorkflowSpec(job.workflow_spec_id);
  const workflow =
    existingWorkflow ||
    (await Workflow.create({
      candidate_id: candidate._id,
      job_id: job._id,
      status: "created",
      current_state: "created"
    }));

  const context = { candidate, job, hiringSpec: { ...hiringSpec, min_experience: job.min_experience }, workflow };

  workflow.status = "running";
  await workflow.save();

  try {
    for (const agentName of workflowSpec.workflow) {
      if (agentName === "human_approval") {
        workflow.current_state = "human_approval";
        workflow.status = "waiting_approval";
        await workflow.save();
        await logWorkflow(workflow, agentName, {}, { message: "Waiting for recruiter approval" }, "waiting_approval");
        return workflow;
      }

      workflow.current_state = agentName;
      await workflow.save();
      await executeAgentWithRetry(agentName, context);
      workflow.markModified("state");
      await workflow.save();
    }

    workflow.current_state = "completed";
    workflow.status = "completed";
    await workflow.save();
    return workflow;
  } catch (error) {
    workflow.status = "failed";
    await workflow.save();
    throw error;
  }
}

export async function continueWorkflowAfterApproval(workflowId, approved) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) {
    const error = new Error("Workflow not found");
    error.statusCode = 404;
    throw error;
  }

  const candidate = await Candidate.findById(workflow.candidate_id);
  const job = await import("../models/Job.js").then((module) => module.Job.findById(workflow.job_id));
  const hiringSpec = await loadHiringSpec(job.hiring_spec_id);

  if (!approved) {
    workflow.current_state = "completed";
    workflow.status = "completed";
    workflow.state.humanApproval = { approved: false };
    workflow.markModified("state");
    await Candidate.findByIdAndUpdate(candidate._id, { status: "rejected_by_recruiter" });
    await workflow.save();
    return workflow;
  }

  workflow.status = "running";
  workflow.state.humanApproval = { approved: true };
  workflow.markModified("state");
  await workflow.save();

  const context = { candidate, job, hiringSpec: { ...hiringSpec, min_experience: job.min_experience }, workflow };
  for (const agentName of ["interview_agent", "email_agent"]) {
    workflow.current_state = agentName;
    await workflow.save();
    await executeAgentWithRetry(agentName, context);
    workflow.markModified("state");
    await workflow.save();
  }

  workflow.current_state = "completed";
  workflow.status = "completed";
  await Candidate.findByIdAndUpdate(candidate._id, { status: "interview_invited" });
  await workflow.save();
  return workflow;
}
