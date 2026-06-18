import { Router } from "express";
import * as controller from "../controllers/candidate.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { resumeUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCandidateSchema } from "../validators/candidate.validator.js";
import { jobIdSchema } from "../validators/job.validator.js";

const router = Router();

router.post("/upload", resumeUpload.single("resume"), validate(uploadCandidateSchema), asyncHandler(controller.uploadCandidate));
router.get("/", requireAuth, asyncHandler(controller.listCandidates));
router.get("/:id", requireAuth, validate(jobIdSchema), asyncHandler(controller.getCandidate));

export default router;
