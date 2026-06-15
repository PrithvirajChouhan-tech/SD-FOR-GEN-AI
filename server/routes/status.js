import { Router } from 'express';
import { getAllSessions } from '../lib/sessions.js';

const router = Router();

// GET /api/status — dashboard status
router.get('/', (req, res) => {
  const sessions = getAllSessions();
  const totalMessages = sessions.reduce((a, s) => a + s.messageCount, 0);
  const apiKeyOk = process.env.FEATHERLESS_API_KEY &&
    process.env.FEATHERLESS_API_KEY !== 'your_featherless_api_key_here';

  res.json({
    service: 'ZENITH AI',
    version: '1.0.0',
    status: 'running',
    model: process.env.AI_MODEL || 'deepseek-ai/DeepSeek-V3-0324',
    apiProvider: 'Featherless AI',
    apiKeyConfigured: !!apiKeyOk,
    stats: {
      totalSessions: sessions.length,
      totalMessages,
      activeSessions: sessions.filter(s => s.messageCount > 0).length,
    },
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.round(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
