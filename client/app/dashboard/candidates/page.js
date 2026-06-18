"use client";

import { useEffect, useState } from "react";
import { Panel } from "../../../components/ui";
import { api } from "../../../lib/api";

export default function CandidatesPage() {
const [candidates, setCandidates] = useState([]);
const [error, setError] = useState("");

useEffect(() => {
api("/candidates")
.then((data) => {
const rankedCandidates = [...data.candidates].sort(
(a, b) => (b.match_score || 0) - (a.match_score || 0)
);


    setCandidates(rankedCandidates);
  })
  .catch((err) => setError(err.message));


}, []);

const getBadge = (score) => {
if (score >= 90) {
return {
text: "🏆 Top Candidate",
color: "text-green-600",
};
}


if (score >= 80) {
  return {
    text: "⭐ Strong Match",
    color: "text-blue-600",
  };
}

if (score >= 60) {
  return {
    text: "⚠ Review",
    color: "text-yellow-600",
  };
}

return {
  text: "❌ Reject",
  color: "text-red-600",
};


};

return ( <div className="grid gap-5"> <h1 className="text-3xl font-semibold">
Candidate Rankings </h1>


  {error && (
    <p className="text-sm text-danger">
      {error}
    </p>
  )}

  <div className="grid gap-4">
    {candidates.map((candidate, index) => {
      const score = candidate.match_score || 0;
      const badge = getBadge(score);

      return (
        <Panel
          key={candidate._id}
          className="p-5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted">
                Rank
              </p>
              <p className="text-2xl font-bold">
                #{index + 1}
              </p>
            </div>

            <p className={badge.color}>
              {badge.text}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted">
                Candidate
              </p>
              <p className="font-semibold">
                {candidate.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted">
                Job
              </p>
              <p>{candidate.job_id?.title}</p>
            </div>

            <div>
              <p className="text-xs text-muted">
                Match Score
              </p>
              <p className="text-xl font-bold">
                {score}%
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted">
              Status
            </p>
            <p className="capitalize">
              {candidate.status}
            </p>
          </div>
        </Panel>
      );
    })}
  </div>
</div>

);
}
