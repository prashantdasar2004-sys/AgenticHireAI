import mongoose from "mongoose";

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return mongoose.connection.asPromise();
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log("MongoDB connected");
  return mongoose.connection;
}
