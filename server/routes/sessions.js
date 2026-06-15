import { Router } from 'express';
import {
  createSession, getAllSessions, getSession,
  deleteSession, clearSession, deleteAllSessions
} from '../lib/sessions.js';

const router = Router();

// GET /api/sessions — list all sessions
router.get('/', (req, res) => {
  const sessions = getAllSessions().map(s => ({
    id: s.id,
    title: s.title,
    messageCount: s.messageCount,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
  res.json({ sessions });
});

// DELETE /api/sessions — delete all sessions
router.delete('/', (req, res) => {
  deleteAllSessions();
  res.json({ success: true });
});

// POST /api/sessions — create new session
router.post('/', (req, res) => {
  const session = createSession(req.body?.title || 'New Chat');
  res.json({ session });
});

// GET /api/sessions/:id — get session with messages
router.get('/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json({ session });
});

// DELETE /api/sessions/:id — delete session
router.delete('/:id', (req, res) => {
  const deleted = deleteSession(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Session not found' });
  res.json({ success: true });
});

// POST /api/sessions/:id/clear — clear messages
router.post('/:id/clear', (req, res) => {
  const cleared = clearSession(req.params.id);
  if (!cleared) return res.status(404).json({ error: 'Session not found' });
  res.json({ success: true });
});

export default router;
