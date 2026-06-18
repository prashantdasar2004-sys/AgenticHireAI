import { Router } from "express";
import * as controller from "../controllers/workflow.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { approveWorkflowSchema, startWorkflowSchema, workflowIdSchema } from "../validators/workflow.validator.js";

const router = Router();

router.post("/start", requireAuth, validate(startWorkflowSchema), asyncHandler(controller.start));
router.post("/retry", requireAuth, asyncHandler(controller.retry));
router.post("/approve", requireAuth, validate(approveWorkflowSchema), asyncHandler(controller.approve));
router.get("/:id", requireAuth, validate(workflowIdSchema), asyncHandler(controller.get));

export default router;
