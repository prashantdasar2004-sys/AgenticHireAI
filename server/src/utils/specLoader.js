import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../..");

export async function loadSpec(relativePath) {
  const specPath = path.join(rootDir, "specs", relativePath);
  const raw = await fs.readFile(specPath, "utf8");
  return JSON.parse(raw);
}

export async function loadHiringSpec(specId = "frontend-developer") {
  return loadSpec(`hiring/${specId}.json`);
}

export async function loadWorkflowSpec(specId = "default-hiring-workflow") {
  return loadSpec(`workflow/${specId}.json`);
}
