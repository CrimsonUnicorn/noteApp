import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccess(payload: object) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES });
}
export function signRefresh(payload: object) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES });
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
