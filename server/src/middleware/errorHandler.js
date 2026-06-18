import { fail } from "../utils/apiResponse.js";

export function errorHandler(error, req, res, next) {
  if (error.name === "ZodError") {
    return fail(res, "Invalid request schema", 422, error.errors);
  }

  if (error.name === "MulterError") {
    return fail(res, error.message, 400);
  }

  console.error(error);
  return fail(res, error.message || "Unexpected server error", error.statusCode || 500);
}
