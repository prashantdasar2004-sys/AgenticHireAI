import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = createApp();

connectDatabase()
  .catch((error) => {
    console.error("MongoDB connection failed. API will still start, but DB routes need MongoDB.", error.message);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`AgenticHireAI server listening on http://localhost:${port}`);
    });
  });
