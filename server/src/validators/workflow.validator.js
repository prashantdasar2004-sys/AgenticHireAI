import { z } from "zod";

export const workflowIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({}).optional(),
  query: z.object({}).optional()
});

export const startWorkflowSchema = z.object({
  body: z.object({
    candidate_id: z.string().min(1),
    job_id: z.string().min(1)
  })
});

export const approveWorkflowSchema = z.object({
  body: z.object({
    workflow_id: z.string().min(1),
    approved: z.boolean()
  })
});
