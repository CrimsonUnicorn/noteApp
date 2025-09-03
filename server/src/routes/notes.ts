import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { Note } from '../models/Note';

const router = Router();
router.use(requireAuth);

router.post('/', async (req: AuthedRequest, res) => {
  const schema = z.object({ title: z.string().min(1), content: z.string().optional() });
  const { title, content } = schema.parse(req.body);
  const note = await Note.create({ userId: req.user!.sub, title, content: content || '' });
  res.status(201).json(note);
});

router.get('/', async (req: AuthedRequest, res) => {
  const notes = await Note.find({ userId: req.user!.sub }).sort({ createdAt: -1 });
  res.json(notes);
});

router.delete('/:id', async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const note = await Note.findOneAndDelete({ _id: id, userId: req.user!.sub });
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;
