import { Router } from 'express';
import { createFeatherlessClient, MODEL, SYSTEM_PROMPT } from '../lib/ai.js';
import {
  createSession, getSession, addMessage
} from '../lib/sessions.js';

const router = Router();

// POST /api/chat — streaming chat
router.post('/', async (req, res) => {
  const { message, sessionId, stream = true, model } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Get or create session
  let session = sessionId ? getSession(sessionId) : null;
  if (!session) {
    session = createSession();
    if (model) session.model = model;
  } else if (model && !session.model) {
    session.model = model;
  }

  // Save user message
  addMessage(session.id, 'user', message);

  // Build messages array for API
  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...session.messages.slice(-20).map(m => ({ role: m.role, content: m.content })),
  ];

  try {
    const client = createFeatherlessClient();

    // Configure thinking/reasoning parameters based on .env
    const extraBody = {};
    const thinkingMode = process.env.AI_THINKING || 'disabled';
    if (thinkingMode === 'disabled' || thinkingMode === 'enabled') {
      extraBody.thinking = { type: thinkingMode };
    }

    if (stream) {
      // ── Streaming response (SSE) ──
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Session-Id', session.id);

      let fullContent = '';
      let streamResp = null;
      let attempts = 0;
      const maxAttempts = 3;

      const requestedModel = model || session.model || MODEL;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          streamResp = await client.chat.completions.create({
            model: requestedModel,
            messages: apiMessages,
            stream: true,
            max_tokens: 4096,
            temperature: 0.7,
            ...(Object.keys(extraBody).length > 0 && { extra_body: extraBody }),
          });
          break; // Success
        } catch (err) {
          console.warn(`[Featherless API Connection Attempt ${attempts} Failed]:`, err.message);
          if (attempts >= maxAttempts) throw err;
          // Wait 1.5 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      for await (const chunk of streamResp) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullContent += delta;
          res.write(`data: ${JSON.stringify({ delta, sessionId: session.id })}\n\n`);
        }
      }

      // Save assistant message
      addMessage(session.id, 'assistant', fullContent);

      res.write(`data: ${JSON.stringify({ done: true, sessionId: session.id, title: session.title })}\n\n`);
      res.end();

    } else {
      // ── Non-streaming ──
      let completion = null;
      let attempts = 0;
      const maxAttempts = 3;

      const requestedModel = model || session.model || MODEL;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          completion = await client.chat.completions.create({
            model: requestedModel,
            messages: apiMessages,
            stream: false,
            max_tokens: 4096,
            temperature: 0.7,
            ...(Object.keys(extraBody).length > 0 && { extra_body: extraBody }),
          });
          break; // Success
        } catch (err) {
          console.warn(`[Featherless API Connection Attempt ${attempts} Failed]:`, err.message);
          if (attempts >= maxAttempts) throw err;
          // Wait 1.5 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      const content = completion.choices[0]?.message?.content || '';
      addMessage(session.id, 'assistant', content);

      res.json({
        content,
        sessionId: session.id,
        title: session.title,
        usage: completion.usage,
      });
    }

  } catch (err) {
    console.error('[Chat Error]', err.message);

    // Send proper error even mid-stream
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message, done: true })}\n\n`);
      res.end();
    } else {
      const status = err.status || 500;
      let userMessage = err.message;

      if (err.message?.includes('API key')) {
        userMessage = 'API key not configured. Please add your FEATHERLESS_API_KEY to the .env file.';
      } else if (err.status === 429 || err.message?.includes('concurrency') || err.message?.includes('Concurrency') || err.message?.includes('429')) {
        userMessage = 'Featherless Concurrency Limit Exceeded. Your previous requests to the heavy DeepSeek V4 Pro model are still running on Featherless in the background. Please wait 1-2 minutes for them to clear, or switch to a faster model (like deepseek-ai/DeepSeek-V3-0324) in your .env.';
      } else if (err.status === 401) {
        userMessage = 'Invalid API key. Please check your FEATHERLESS_API_KEY in the .env file.';
      }

      res.status(status).json({ error: userMessage, sessionId: session.id });
    }
  }
});

export default router;
