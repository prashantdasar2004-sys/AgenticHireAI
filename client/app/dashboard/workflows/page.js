"use client";

import { useState } from "react";
import { WorkflowGraph } from "../../../features/workflows/WorkflowGraph";
import { Button, Field, Input, Panel } from "../../../components/ui";
import { api } from "../../../lib/api";

export default function WorkflowsPage() {
  const [workflowId, setWorkflowId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function loadWorkflow() {
    try {
      setError("");
      const result = await api(`/workflow/${workflowId}`);
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  }

  async function approve(approved) {
    try {
      const result = await api("/workflow/approve", {
        method: "POST",
        body: JSON.stringify({
          workflow_id: workflowId,
          approved,
        }),
      });

      setData((current) => ({
        ...current,
        workflow: result.workflow,
      }));

      await loadWorkflow();
    } catch (err) {
      setError(err.message);
    }
  }

  const interview =
    data?.workflow?.state?.interview?.data;

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-semibold">
        Workflow Monitoring
      </h1>

      <Panel className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Field label="Workflow ID">
          <Input
            value={workflowId}
            onChange={(event) =>
              setWorkflowId(event.target.value)
            }
          />
        </Field>

        <Button
          className="self-end"
          onClick={loadWorkflow}
        >
          Load
        </Button>
      </Panel>

      {error ? (
        <p className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      {data ? (
        <>
          <WorkflowGraph
            workflow={data.workflow}
            logs={data.logs}
          />

          {data.workflow.status ===
          "waiting_approval" ? (
            <Panel className="flex gap-3">
              <Button
                onClick={() => approve(true)}
              >
                Approve
              </Button>

              <Button
                variant="danger"
                onClick={() => approve(false)}
              >
                Reject
              </Button>
            </Panel>
          ) : null}

          {interview ? (
            <Panel className="grid gap-4">
              <h2 className="text-xl font-semibold">
                AI Interview Questions
              </h2>

              <ol className="list-decimal pl-5 space-y-2">
                {interview.questions?.map(
                  (question, index) => (
                    <li key={index}>
                      {question}
                    </li>
                  )
                )}
              </ol>

              <div>
                <h3 className="font-semibold">
                  Coding Task
                </h3>

                <p className="text-muted">
                  {interview.coding_task}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  Evaluation Rubric
                </h3>

                <ul className="list-disc pl-5">
                  {interview.rubric?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </Panel>
          ) : null}
        </>
      ) : null}
    </div>
  );
}