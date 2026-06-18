"use client";

import Link from "next/link";
import { BriefcaseBusiness, GitBranch, Users } from "lucide-react";
import { Button, Panel } from "../../components/ui";

export default function DashboardPage() {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Recruiter dashboard</h1>
          <p className="text-sm text-muted">Create jobs, review candidates, and monitor autonomous AI workflows.</p>
        </div>
        <Link href="/dashboard/jobs/create"><Button>Create job</Button></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Panel><BriefcaseBusiness className="mb-3 text-brand" /><h2 className="font-semibold">Jobs</h2><p className="text-sm text-muted">Manage hiring specifications and public apply links.</p></Panel>
        <Panel><Users className="mb-3 text-success" /><h2 className="font-semibold">Candidates</h2><p className="text-sm text-muted">Review parsed resumes, scores, and statuses.</p></Panel>
        <Panel><GitBranch className="mb-3 text-warning" /><h2 className="font-semibold">Workflows</h2><p className="text-sm text-muted">Track agent execution, retries, failures, and approvals.</p></Panel>
      </div>
    </div>
  );
}
