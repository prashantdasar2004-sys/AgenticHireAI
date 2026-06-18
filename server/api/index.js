import dotenv from "dotenv";
import { createApp } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = createApp();
let databasePromise;

function isHealthCheck(req) {
  const pathname = req.url?.split("?")[0];
  return pathname === "/" || pathname === "/health" || pathname === "/api" || pathname === "/api/health";
}

function ensureDatabase() {
  if (!databasePromise) {
    databasePromise = connectDatabase().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}

export default async function handler(req, res) {
  if (isHealthCheck(req)) {
    return app(req, res);
  }

  try {
    await ensureDatabase();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: "Database connection failed",
        details: process.env.NODE_ENV === "production" ? undefined : error.message
      }
    });
  }

  return app(req, res);
}
