import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || '8080',
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  EMAIL_FROM: process.env.EMAIL_FROM || 'Notely <no-reply@example.com>',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!
};
