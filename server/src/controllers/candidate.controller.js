import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";
import { startWorkflowForCandidate } from "../workflows/hiringWorkflow.js";
import { ok } from "../utils/apiResponse.js";

export async function uploadCandidate(req, res) {
  if (!req.file) {
    const error = new Error("Resume PDF is required");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(req.body.job_id);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  const candidate = await Candidate.create({
    ...req.body,
    resume_url: req.file.path,
    status: "uploaded"
  });

  const workflow = await startWorkflowForCandidate(candidate, job);
  return ok(res, { candidate, workflow }, 201);
}

export async function listCandidates(req, res) {
  const candidates = await Candidate.find().populate("job_id").sort({ created_at: -1 });
  return ok(res, { candidates });
}

export async function getCandidate(req, res) {
  const candidate = await Candidate.findById(req.params.id).populate("job_id");
  if (!candidate) {
    const error = new Error("Candidate not found");
    error.statusCode = 404;
    throw error;
  }
  return ok(res, { candidate });
}
