import { runShortlistingAgent } from "../src/agents/shortlisting.agent.js";

test("shortlisting thresholds come from supplied hiring spec", async () => {
  const result = await runShortlistingAgent({
    matchResult: { data: { match_score: 72 } },
    hiringSpec: { shortlist_score: 90, hold_score: 70, minimum_score: 70 }
  });

  expect(result.data.decision).toBe("hold");
});
