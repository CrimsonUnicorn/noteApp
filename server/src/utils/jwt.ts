import jwt from "jsonwebtoken";
import { env } from "../config/env";

// ✅ Make sure secrets are always treated as strings
const accessSecret = env.JWT_ACCESS_SECRET as string;
const refreshSecret = env.JWT_REFRESH_SECRET as string;

export function signAccess(payload: object) {
  return jwt.sign(payload, accessSecret, {
    expiresIn: env.JWT_ACCESS_EXPIRES || "15m",
  });
}

export function signRefresh(payload: object) {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: env.JWT_REFRESH_EXPIRES || "7d",
  });
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, refreshSecret);
}
