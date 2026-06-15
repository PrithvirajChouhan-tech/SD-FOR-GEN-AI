import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRouter from './routes/chat.js';
import sessionsRouter from './routes/sessions.js';
import statusRouter from './routes/status.js';



// Load .env from root project dir
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`\x1b[36m[${ts}]\x1b[0m \x1b[32m${req.method}\x1b[0m ${req.path}`);
  next();
});

// Serve static files from Vite built folder
const distPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
app.use(express.static(distPath));

// ── Routes ──
app.use('/api/chat', chatRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/status', statusRouter);




// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ZENITH AI Backend',
    model: process.env.AI_MODEL || 'deepseek-ai/DeepSeek-V4-Pro',
    apiKeyConfigured: !!process.env.FEATHERLESS_API_KEY && process.env.FEATHERLESS_API_KEY !== 'your_featherless_api_key_here',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// SPA wildcard fallback: Serve index.html for client-side routing (except for API paths)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(join(distPath, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server only when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log('\n\x1b[35m╔════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[35m║\x1b[0m        \x1b[1mZENITH AI — Backend\x1b[0m           \x1b[35m║\x1b[0m');
    console.log('\x1b[35m╚════════════════════════════════════════╝\x1b[0m');
    console.log(`\x1b[32m✓\x1b[0m  Server running at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[32m✓\x1b[0m  Model: \x1b[33m${process.env.AI_MODEL || 'deepseek-ai/DeepSeek-V4-Pro'}\x1b[0m`);
    const hasKey = process.env.FEATHERLESS_API_KEY && process.env.FEATHERLESS_API_KEY !== 'your_featherless_api_key_here';
    console.log(`${hasKey ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m  API Key: ${hasKey ? '\x1b[32mconfigured\x1b[0m' : '\x1b[31mnot set — add to .env\x1b[0m'}`);
    console.log('\x1b[35m────────────────────────────────────────\x1b[0m\n');
  });
}

export default app;
