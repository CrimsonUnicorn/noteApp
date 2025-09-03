import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const accessSecret = env.JWT_ACCESS_SECRET as string;
const refreshSecret = env.JWT_REFRESH_SECRET as string;

export function signAccess(payload: object) {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES || "15m" };
  return jwt.sign(payload, accessSecret, options);
}

export function signRefresh(payload: object) {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES || "7d" };
  return jwt.sign(payload, refreshSecret, options);
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, refreshSecret);
}
