import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import cookie from 'cookie';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { env } from '../config/env';

const router = Router();
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
});

function setRefreshCookie(res: any, token: string, remember: boolean) {
  res.setHeader('Set-Cookie', cookie.serialize('refresh_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true in prod (HTTPS)
    path: '/api/auth/refresh',
    maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24
  }));
}

router.post('/request-otp', async (req, res) => {
  const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email(),
    dob: z.string().optional()
  });
  const { name, email, dob } = schema.parse(req.body);

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { name, email, dob: dob ? new Date(dob) : undefined, otpHash, otpExpires } },
    { upsert: true, new: true }
  );

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Your Notely OTP',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  });

  res.json({ message: 'OTP sent' });
});

router.post('/verify-otp', async (req, res) => {
  const schema = z.object({ email: z.string().email(), otp: z.string().length(6), remember: z.boolean().optional() });
  const { email, otp, remember } = schema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user || !user.otpHash || !user.otpExpires) return res.status(400).json({ error: 'OTP not requested' });
  if (user.otpExpires.getTime() < Date.now()) return res.status(400).json({ error: 'OTP expired' });

  const ok = await bcrypt.compare(otp, user.otpHash);
  if (!ok) return res.status(400).json({ error: 'Invalid OTP' });

  user.emailVerified = true;
  user.otpHash = null;
  user.otpExpires = null;
  await user.save();

  const access = signAccess({ sub: user.id, email: user.email, name: user.name });
  const refresh = signRefresh({ sub: user.id, email: user.email, name: user.name });
  setRefreshCookie(res, refresh, !!remember);
  res.json({ accessToken: access, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/google', async (req, res) => {
  const schema = z.object({ idToken: z.string(), remember: z.boolean().optional() });
  const { idToken, remember } = schema.parse(req.body);
  const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email) return res.status(400).json({ error: 'No email from Google' });
  const email = payload.email;
  const name = payload.name || 'User';
  const sub = payload.sub!;
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email, name, googleId: sub, emailVerified: true });

  const access = signAccess({ sub: user.id, email: user.email, name: user.name });
  const refresh = signRefresh({ sub: user.id, email: user.email, name: user.name });
  setRefreshCookie(res, refresh, !!remember);
  res.json({ accessToken: access, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), remember: z.boolean().optional() });
  const { email, remember } = schema.parse(req.body);
  const user = await User.findOne({ email });
  if (!user?.emailVerified) return res.status(400).json({ error: 'User not verified' });
  const access = signAccess({ sub: user.id, email: user.email, name: user.name });
  const refresh = signRefresh({ sub: user.id, email: user.email, name: user.name });
  setRefreshCookie(res, refresh, !!remember);
  res.json({ accessToken: access, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/refresh', async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['refresh_token'];
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  try {
    const payload = verifyRefresh(token) as any;
    const access = signAccess({ sub: payload.sub, email: payload.email, name: payload.name });
    res.json({ accessToken: access });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', async (_req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('refresh_token', '', {
    httpOnly: true, sameSite: 'lax', secure: false, path: '/api/auth/refresh', maxAge: 0
  }));
  res.json({ message: 'Logged out' });
});

export default router;
