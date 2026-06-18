import { Workflow } from "../models/Workflow.js";
import { WorkflowLog } from "../models/WorkflowLog.js";
import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";
import { continueWorkflowAfterApproval, startWorkflowForCandidate } from "../workflows/hiringWorkflow.js";
import { ok } from "../utils/apiResponse.js";

export async function start(req, res) {
  const candidate = await Candidate.findById(req.body.candidate_id);
  const job = await Job.findById(req.body.job_id);
  if (!candidate || !job) {
    const error = new Error("Candidate or job not found");
    error.statusCode = 404;
    throw error;
  }
  const workflow = await startWorkflowForCandidate(candidate, job);
  return ok(res, { workflow }, 201);
}

export async function retry(req, res) {
  const workflow = await Workflow.findById(req.body.workflow_id || req.params.id);
  if (!workflow) {
    const error = new Error("Workflow not found");
    error.statusCode = 404;
    throw error;
  }
  const candidate = await Candidate.findById(workflow.candidate_id);
  const job = await Job.findById(workflow.job_id);
  const updated = await startWorkflowForCandidate(candidate, job, workflow);
  return ok(res, { workflow: updated });
}

export async function approve(req, res) {
  const workflow = await continueWorkflowAfterApproval(req.body.workflow_id, req.body.approved);
  return ok(res, { workflow });
}

export async function get(req, res) {
  const workflow = await Workflow.findById(req.params.id).populate("candidate_id").populate("job_id");
  if (!workflow) {
    const error = new Error("Workflow not found");
    error.statusCode = 404;
    throw error;
  }
  const logs = await WorkflowLog.find({ workflow_id: workflow._id }).sort({ created_at: 1 });
  return ok(res, { workflow, logs });
}
