import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",                 // local development
    "https://note-app-nine-omega.vercel.app" // deployed frontend
  ],
  credentials: true,
}));


app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use(errorHandler);

mongoose.connect(env.MONGODB_URI).then(() => {
  app.listen(env.PORT, () => console.log(`Server listening on http://localhost:${env.PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
