"use client";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import { Panel } from "../../components/ui";

const order = ["resume_parser", "embedding_agent", "matching_agent", "shortlisting_agent", "human_approval", "interview_agent", "email_agent"];
const colors = {
  running: "#2563eb",
  success: "#16a34a",
  failed: "#dc2626",
  waiting_approval: "#ca8a04",
  pending: "#98a2b3"
};

export function WorkflowGraph({ workflow, logs }) {
  const latestStatus = new Map();
  logs.forEach((log) => latestStatus.set(log.agent_name, log.status));

  const nodes = order.map((name, index) => {
    const status = workflow.current_state === name && workflow.status === "running" ? "running" : latestStatus.get(name) || "pending";
    return {
      id: name,
      position: { x: (index % 4) * 210, y: Math.floor(index / 4) * 140 },
      data: { label: `${name.replaceAll("_", " ")}\n${status}` },
      style: { borderColor: colors[status], borderWidth: 2, whiteSpace: "pre-line" }
    };
  });

  const edges = order.slice(1).map((name, index) => ({
    id: `${order[index]}-${name}`,
    source: order[index],
    target: name
  }));

  return (
    <Panel className="h-[520px] p-0">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </Panel>
  );
}
