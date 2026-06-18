import { Router } from "express";
import * as controller from "../controllers/job.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createJobSchema, jobIdSchema } from "../validators/job.validator.js";

const router = Router();

router.post("/", requireAuth, validate(createJobSchema), asyncHandler(controller.createJob));
router.get("/", requireAuth, asyncHandler(controller.listJobs));
router.get("/:id", validate(jobIdSchema), asyncHandler(controller.getJob));
router.put("/:id", requireAuth, asyncHandler(controller.updateJob));

export default router;
