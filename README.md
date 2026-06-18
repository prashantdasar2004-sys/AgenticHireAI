# AI Recruitment Organization

Spec-driven multi-agent recruitment platform built with `/client`, `/server`, and shared `/specs`.

## Local Development

1. Start MongoDB and Qdrant:
   ```bash
   docker compose up -d
   ```
2. Copy environment files:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.local.example client/.env.local
   ```
3. Run the backend on `localhost:5000` and frontend on `localhost:3000`.

Business rules, thresholds, workflow order, email templates, RAG policy, and prompts live in `/specs`.
