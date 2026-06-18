"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel } from "../../../components/ui";
import { api } from "../../../lib/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    api("/candidates")
      .then((data) => setCandidates(data.candidates))
      .catch(() => setCandidates([]));
  }, []);

  const stats = useMemo(() => {
    const shortlisted = candidates.filter((c) =>
      ["shortlist", "interview_invited"].includes(c.status)
    ).length;

    const hold = candidates.filter(
      (c) => c.status === "hold"
    ).length;

    const rejected = candidates.filter(
      (c) => c.status === "reject"
    ).length;

    const averageScore = candidates.length
      ? Math.round(
          candidates.reduce(
            (sum, item) => sum + (item.match_score || 0),
            0
          ) / candidates.length
        )
      : 0;

    return {
      total: candidates.length,
      shortlisted,
      hold,
      rejected,
      averageScore,
    };
  }, [candidates]);

  const statusData = [
    {
      name: "Shortlisted",
      value: stats.shortlisted,
    },
    {
      name: "Hold",
      value: stats.hold,
    },
    {
      name: "Rejected",
      value: stats.rejected,
    },
  ];

  const scoreData = candidates.map((candidate) => ({
    name: candidate.name,
    score: candidate.match_score || 0,
  }));

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">
        Recruitment Analytics
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Panel>
          <p className="text-sm text-muted">
            Total Candidates
          </p>
          <p className="text-4xl font-bold">
            {stats.total}
          </p>
        </Panel>

        <Panel>
          <p className="text-sm text-muted">
            Shortlisted
          </p>
          <p className="text-4xl font-bold">
            {stats.shortlisted}
          </p>
        </Panel>

        <Panel>
          <p className="text-sm text-muted">
            Hold
          </p>
          <p className="text-4xl font-bold">
            {stats.hold}
          </p>
        </Panel>

        <Panel>
          <p className="text-sm text-muted">
            Average Score
          </p>
          <p className="text-4xl font-bold">
            {stats.averageScore}
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-lg font-semibold">
            Candidate Status
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell />
                  <Cell />
                  <Cell />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold">
            Candidate Scores
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={scoreData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}