import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, '..', '..', 'sessions.json');

// Helper to load sessions from disk
function loadSessionsFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Rebuild Map
      const map = new Map();
      Object.entries(parsed).forEach(([key, val]) => {
        map.set(key, val);
      });
      return map;
    }
  } catch (err) {
    console.error('Error loading sessions from disk:', err.message);
  }
  return new Map();
}

// Helper to save sessions to disk
function saveSessionsToDisk(map) {
  try {
    const obj = Object.fromEntries(map);
    fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving sessions to disk:', err.message);
  }
}

// Initialize persistent sessions
const sessions = loadSessionsFromDisk();

export function createSession(title = 'New Chat') {
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const session = {
    id,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    messageCount: 0,
  };
  sessions.set(id, session);
  saveSessionsToDisk(sessions);
  return session;
}

export function getSession(id) {
  return sessions.get(id) || null;
}

export function getAllSessions() {
  return Array.from(sessions.values())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function addMessage(sessionId, role, content, extra = {}) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  const msg = {
    id: `msg_${Date.now()}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    ...extra,
  };
  session.messages.push(msg);
  session.messageCount++;
  session.updatedAt = new Date().toISOString();
  // Auto-title from first user message
  if (role === 'user' && session.messages.filter(m => m.role === 'user').length === 1) {
    session.title = content.slice(0, 60) + (content.length > 60 ? '...' : '');
  }
  saveSessionsToDisk(sessions);
  return msg;
}

export function deleteSession(id) {
  const deleted = sessions.delete(id);
  if (deleted) saveSessionsToDisk(sessions);
  return deleted;
}

export function clearSession(id) {
  const session = sessions.get(id);
  if (!session) return false;
  session.messages = [];
  session.messageCount = 0;
  session.updatedAt = new Date().toISOString();
  saveSessionsToDisk(sessions);
  return true;
}

export function deleteAllSessions() {
  sessions.clear();
  saveSessionsToDisk(sessions);
  return true;
}
