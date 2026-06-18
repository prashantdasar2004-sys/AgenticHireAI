export async function runMatchingAgent({
parsedResume,
hiringSpec,
ragContext,
}) {
const candidateSkills = (
parsedResume.data.skills || []
).map((skill) => String(skill).toLowerCase());

const required = hiringSpec.required_skills || [];
const preferred = hiringSpec.preferred_skills || [];

function hasSkill(skill) {
const target = String(skill).toLowerCase();


return candidateSkills.some((candidateSkill) => {
  return (
    candidateSkill.includes(target) ||
    target.includes(candidateSkill)
  );
});


}

const requiredMatches = required.filter((skill) =>
hasSkill(skill)
);

const preferredMatches = preferred.filter((skill) =>
hasSkill(skill)
);

const missingSkills = [...required, ...preferred].filter(
(skill) => !hasSkill(skill)
);

console.log("MATCHED SKILLS:", [
...requiredMatches,
...preferredMatches,
]);

console.log("MISSING SKILLS:", missingSkills);

const requiredScore = required.length
? (requiredMatches.length / required.length) * 65
: 65;

const preferredScore = preferred.length
? (preferredMatches.length / preferred.length) * 20
: 20;

const experienceScore =
parsedResume.data.experience >=
(hiringSpec.min_experience || 0)
? 15
: 5;

const matchScore = Math.round(
requiredScore +
preferredScore +
experienceScore
);

return {
success: true,
data: {
match_score: Math.min(matchScore, 100),


  matched_skills: [
    ...requiredMatches,
    ...preferredMatches,
  ],

  missing_skills: missingSkills,

  required_matches: requiredMatches.length,
  required_total: required.length,

  preferred_matches: preferredMatches.length,
  preferred_total: preferred.length,

  recommendation:
    matchScore >= hiringSpec.minimum_score
      ? "Shortlist"
      : "Review",

  rag_context_used: ragContext.length,
},


};
}
