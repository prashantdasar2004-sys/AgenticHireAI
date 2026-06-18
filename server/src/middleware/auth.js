import jwt from "jsonwebtoken";
import { fail } from "../utils/apiResponse.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return fail(res, "Authentication required", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "local-dev-secret");
    const user = await User.findById(payload.sub).select("-password");
    if (!user) return fail(res, "User not found", 401);
    req.user = user;
    next();
  } catch {
    return fail(res, "Invalid token", 401);
  }
}
