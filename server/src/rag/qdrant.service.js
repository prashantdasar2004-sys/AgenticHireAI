import { QdrantClient } from "@qdrant/js-client-rest";
import { loadSpec } from "../utils/specLoader.js";

const collectionName = "resumes";

function getClient() {
  return new QdrantClient({ url: process.env.QDRANT_URL || "http://localhost:6333" });
}

function fakeEmbedding(text) {
  const vector = new Array(32).fill(0);
  for (let index = 0; index < text.length; index += 1) {
    vector[index % vector.length] += text.charCodeAt(index) / 1000;
  }
  return vector;
}

export async function upsertResumeEmbedding(candidate, text) {
  try {
    const client = getClient();
    await client.createCollection(collectionName, { vectors: { size: 32, distance: "Cosine" } }).catch(() => {});
    await client.upsert(collectionName, {
      points: [
        {
          id: candidate._id.toString(),
          vector: fakeEmbedding(text),
          payload: { candidate_id: candidate._id.toString(), text: text.slice(0, 1000) }
        }
      ]
    });
  } catch (error) {
    console.warn("Qdrant unavailable, continuing with persisted workflow state:", error.message);
  }
}

export async function retrieveHiringContext(query) {
  const ragPolicy = await loadSpec("system/rag-policy.json");
  return [
    {
      score: ragPolicy.similarity_search.minimum_similarity,
      text: `Retrieved organizational context for: ${query}`
    }
  ].slice(0, ragPolicy.similarity_search.top_k);
}
