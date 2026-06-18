export async function runShortlistingAgent({ matchResult, hiringSpec }) {
  const score = matchResult.data.match_score;
  let decision = "reject";
  if (score >= hiringSpec.shortlist_score) decision = "shortlist";
  else if (score >= hiringSpec.hold_score) decision = "hold";

  return {
    success: true,
    data: {
      decision,
      score,
      thresholds: {
        shortlist_score: hiringSpec.shortlist_score,
        hold_score: hiringSpec.hold_score,
        minimum_score: hiringSpec.minimum_score
      }
    }
  };
}
