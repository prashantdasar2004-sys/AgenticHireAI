"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Panel } from "../../../components/ui";
import { api } from "../../../lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/jobs").then((data) => setJobs(data.jobs)).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <Link href="/dashboard/jobs/create"><Button>Create job</Button></Link>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="grid gap-3">
        {jobs.map((job) => (
          <Panel key={job._id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-muted">{job.required_skills?.join(", ")}</p>
            </div>
            <Link className="text-sm text-brand" href={`/jobs/${job._id}/apply`}>Public apply page</Link>
          </Panel>
        ))}
      </div>
    </div>
  );
}
