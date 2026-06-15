import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Code2, FileText, Cpu, Database, TestTube2, User, Loader2 } from 'lucide-react';

// AI Orchestration SVG
function AIOrchestrationDiagram() {
  return (
    <svg viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 500 }}>
      {/* Center - AI Core */}
      <circle cx="250" cy="100" r="40" fill="rgba(37,99,235,0.1)" stroke="#2563EB" strokeWidth="2.5" />
      <text x="250" y="96" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563EB" fontFamily="Space Grotesk">Zenith</text>
      <text x="250" y="112" textAnchor="middle" fontSize="9" fill="#2563EB" fontFamily="Inter">AI Core</text>
      {/* Satellite modules */}
      {[
        { label: 'Requirements', x: 80, y: 40, color: '#8B5CF6' },
        { label: 'Architecture', x: 420, y: 40, color: '#22C55E' },
        { label: 'Testing', x: 50, y: 160, color: '#F59E0B' },
        { label: 'DevOps', x: 450, y: 160, color: '#EF4444' },
        { label: 'Database', x: 250, y: 190, color: '#06B6D4' },
      ].map(m => (
        <g key={m.label}>
          <line x1="250" y1="100" x2={m.x} y2={m.y} stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx={m.x} cy={m.y} r={28} fill={`${m.color}10`} stroke={m.color} strokeWidth="1.5" />
          <text x={m.x} y={m.y + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill={m.color} fontFamily="Space Grotesk">{m.label}</text>
        </g>
      ))}
    </svg>
  );
}

const quickPrompts = [
  { icon: FileText, label: 'Generate SRS', prompt: 'Generate a complete SRS document for my e-commerce platform' },
  { icon: Cpu, label: 'Design Architecture', prompt: 'Recommend the best architecture for a scalable SaaS application' },
  { icon: Database, label: 'Create Schema', prompt: 'Design a database schema for a multi-tenant application' },
  { icon: TestTube2, label: 'Generate Tests', prompt: 'Generate unit tests for the authentication module' },
  { icon: Code2, label: 'Review Code', prompt: 'Review this code for security vulnerabilities and best practices' },
];

const initialMessages = [
  {
    role: 'assistant',
    content: `Hello! I'm **Zenith AI**, your complete software engineering copilot. 🚀

I can help you with:
- 📋 **Requirements Analysis** — Functional & non-functional requirements
- 🏗️ **System Architecture** — Design patterns, tech stack recommendations  
- 📊 **UML Diagrams** — Use case, class, sequence, and activity diagrams
- 🗄️ **Database Design** — ER diagrams and SQL schema generation
- 🌐 **API Design** — REST endpoints and GraphQL schemas
- 🧪 **Test Cases** — Unit, integration, and system tests
- 🚀 **DevOps** — CI/CD pipelines, Docker, and Kubernetes configs

What would you like to build today?`,
    time: 'Now',
  },
];

const aiResponses = [
  `I'll analyze your requirements and create a comprehensive SRS document. Here's what I'll include:

**1. System Overview**
The e-commerce platform will be a cloud-native, multi-tenant SaaS solution targeting B2C retail businesses.

**2. Functional Requirements**
- User authentication (OAuth 2.0 + MFA)
- Product catalog management (up to 1M SKUs)
- Real-time inventory tracking
- Order management with state machine
- Payment processing (Stripe integration)
- Analytics dashboard

**3. Non-Functional Requirements**
- Performance: < 100ms API response time (p99)
- Scalability: 10,000+ concurrent users
- Availability: 99.9% uptime SLA
- Security: SOC 2 Type II compliance

Shall I generate the full SRS document with these specifications?`,
  `Great choice! For a scalable SaaS application, I recommend the following architecture:

**Recommended: Microservices + API Gateway**

\`\`\`
Client Layer: React + Next.js (SSR)
API Gateway: Kong / AWS API Gateway
Services: Node.js microservices (Docker)
Message Queue: RabbitMQ / Kafka
Database: PostgreSQL + Redis
Infrastructure: AWS EKS (Kubernetes)
\`\`\`

**Why Microservices?**
✓ Independent deployment per service
✓ Technology flexibility per domain
✓ Fault isolation
✓ Horizontal scaling per service

Shall I create the detailed architecture diagram?`,
];

function MessageBubble({ message }) {
  const isAI = message.role === 'assistant';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: 12, marginBottom: 24, flexDirection: isAI ? 'row' : 'row-reverse' }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isAI ? 'linear-gradient(135deg, #2563EB, #06B6D4)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
      }}>
        {isAI ? <Bot size={18} color="white" /> : <User size={16} color="white" />}
      </div>
      <div style={{ maxWidth: '75%' }}>
        <div style={{
          padding: '14px 18px', borderRadius: 16,
          background: isAI ? 'white' : '#2563EB',
          border: isAI ? '1px solid #E2E8F0' : 'none',
          boxShadow: isAI ? '0 2px 8px rgba(0,0,0,0.06)' : '0 4px 12px rgba(37,99,235,0.25)',
        }}>
          {message.content.split('\n').map((line, i) => {
            if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
            if (line.startsWith('**') && line.endsWith('**')) {
              return <div key={i} style={{ fontWeight: 700, color: isAI ? '#0F172A' : 'white', fontSize: 13, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>;
            }
            if (line.startsWith('```')) return null;
            if (line.startsWith('- ')) {
              return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: isAI ? '#475569' : 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: isAI ? '#2563EB' : 'rgba(255,255,255,0.7)' }}>•</span>
                <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>;
            }
            if (line.startsWith('✓')) {
              return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: isAI ? '#475569' : 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: '#22C55E' }}>✓</span>
                <span>{line.slice(1).trim()}</span>
              </div>;
            }
            return <p key={i} style={{ fontSize: 13, color: isAI ? '#475569' : 'rgba(255,255,255,0.95)', lineHeight: 1.7, marginBottom: 4 }}
              dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
          })}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 5, textAlign: isAI ? 'left' : 'right' }}>{message.time}</div>
      </div>
    </motion.div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const responseIndex = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: text, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setTimeout(() => {
      const response = aiResponses[responseIndex.current % aiResponses.length];
      responseIndex.current++;
      setMessages(prev => [...prev, { role: 'assistant', content: response, time: 'Just now' }]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>AI Assistant</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Your intelligent software engineering copilot</p>
          </div>
          <div>
            <AIOrchestrationDiagram />
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Chat Area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px' }}>
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{ padding: '14px 18px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map(delay => (
                    <motion.span key={delay} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: '#FAFBFC' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea
                className="textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask me to generate requirements, design architecture, create tests..."
                rows={2}
                style={{ flex: 1, resize: 'none', height: 'auto' }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                className="btn-primary"
                style={{ padding: '0 18px', alignSelf: 'stretch' }}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Quick Actions</div>
          {quickPrompts.map(qp => (
            <motion.button key={qp.label} whileHover={{ x: 2, scale: 1.02 }} onClick={() => sendMessage(qp.prompt)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              borderRadius: 10, border: '1px solid #E2E8F0', background: 'white',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569',
              fontFamily: 'Inter', textAlign: 'left', transition: 'all 0.15s ease',
            }}>
              <qp.icon size={14} color="#2563EB" />
              {qp.label}
            </motion.button>
          ))}
          <div style={{ marginTop: 12, padding: 14, borderRadius: 12, background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Sparkles size={13} color="#2563EB" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB' }}>Pro Tip</span>
            </div>
            <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.6 }}>Press Enter to send, Shift+Enter for a new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
