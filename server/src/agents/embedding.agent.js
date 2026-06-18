import { upsertResumeEmbedding } from "../rag/qdrant.service.js";

export async function runEmbeddingAgent({ candidate, parsedResume }) {
  await upsertResumeEmbedding(candidate, parsedResume.data.raw_text || "");
  return {
    success: true,
    data: {
      stored: true,
      collection: "resumes",
      candidate_id: candidate._id.toString()
    }
  };
}
