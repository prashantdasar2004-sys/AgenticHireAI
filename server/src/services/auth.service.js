import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET || "local-dev-secret", {
    expiresIn: "7d"
  });
}

export async function signup(payload) {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const password = await bcrypt.hash(payload.password, 12);
  const user = await User.create({ ...payload, password });
  return { token: signToken(user), user: sanitizeUser(user) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return { token: signToken(user), user: sanitizeUser(user) };
}

export function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}
