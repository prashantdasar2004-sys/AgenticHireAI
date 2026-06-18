import { Job } from "../models/Job.js";
import { ok } from "../utils/apiResponse.js";
import { loadHiringSpec } from "../utils/specLoader.js";

export async function createJob(req, res) {
  const hiringSpec = await loadHiringSpec(req.body.hiring_spec_id);
  const job = await Job.create({
    ...req.body,
    required_skills: req.body.required_skills.length ? req.body.required_skills : hiringSpec.required_skills,
    preferred_skills: req.body.preferred_skills.length ? req.body.preferred_skills : hiringSpec.preferred_skills,
    created_by: req.user._id
  });

  return ok(res, { job, public_apply_url: `/jobs/${job._id}/apply` }, 201);
}

export async function listJobs(req, res) {
  const jobs = await Job.find().sort({ created_at: -1 });
  return ok(res, { jobs });
}

export async function getJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }
  return ok(res, { job });
}

export async function updateJob(req, res) {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }
  return ok(res, { job });
}
