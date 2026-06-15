import React, { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, MessageSquare, Send, Sparkles,
  Copy, Check, Code2, Bot, AlertCircle, X, Menu,
  Square, Loader, BookOpen, Cpu, Database, TestTube2,
  GitBranch, Globe, PenTool, FileText, Container, Zap,
  ChevronRight, ChevronDown, Sun, Moon, Maximize2, RotateCw,
  BarChart2, Zap as ZapIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VoiceInput from './components/VoiceInput';
import FileUpload, { FileChips, buildFileContext, FileBadges } from './components/FileUpload';
import UsageDashboard, { loadStats, recordMessage } from './components/UsageDashboard';

// ── Theme context ──
const ThemeContext = createContext('dark');

const API = import.meta.env.VITE_API_URL || '';

const MODELS = [
  { id: 'deepseek-ai/DeepSeek-V4-Pro', label: 'DEEPSEEK V4 PRO', description: 'Elite 1.6T MoE coding & reasoning engine (High Concurrency)' },
  { id: 'deepseek-ai/DeepSeek-V4-Flash', label: 'DEEPSEEK V4 FLASH', description: 'Fast, responsive 284B MoE coding engine' },
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', description: 'OpenAI-compatible 120B general purpose engine' },
  { id: 'google/gemma-4-31B-it', label: 'GEMMA 4 31B', description: 'Google\'s state-of-the-art open coding assistant' },
  { id: 'Qwen/Qwen3.6-35B-A3B', label: 'QWEN 3.6 35B', description: 'Alibaba\'s latest high-capacity code intelligence engine' },
  { id: 'meta-llama/Llama-3.1-8B-Instruct', label: 'LLAMA 3.1 8B', description: 'Ultra-fast, lightweight development assistant' }
];


function summarizeResponse(aiResponse) {
  if (!aiResponse) return 'software design';
  let cleanText = aiResponse.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/[#*`_\[\]()\-+]/g, ' ');
  cleanText = cleanText.replace(/<[^>]*>/g, '');
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  if (!cleanText) return 'software engineering system';
  const sentences = cleanText.split(/[.!?]\s+/);
  let summary = sentences.slice(0, 2).join('. ').trim();
  if (summary.length > 200) summary = summary.substring(0, 197) + '...';
  return summary;
}

let idCounter = 0;


// QUICK PROMPT SUGGESTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUGGESTIONS = [
  { icon: FileText, label: 'SRS Document', desc: 'Requirements specifications', prompt: 'Generate a complete Software Requirements Specification (SRS) document for a healthcare appointment booking app. Include functional requirements, non-functional requirements, use cases, and constraints.' },
  { icon: Database, label: 'Database Design', desc: 'Schema & index optimization', prompt: 'Design a highly optimized database schema for a multi-vendor e-commerce platform. Provide the SQL DDL, explain the index optimizations, and list sample queries for order checkout.' },
  { icon: TestTube2, label: 'Test Cases', desc: 'Jest unit tests & scripts', prompt: 'Generate a comprehensive test plan for a user authentication module. Include unit tests, integration tests, security tests, and boundary value analysis. Provide actual test case code in Jest.' },
  { icon: GitBranch, label: 'Code Review', desc: 'Security & SOLID checklists', prompt: 'Create a comprehensive code review checklist covering security vulnerabilities, performance issues, code smells, SOLID principle violations, and best practices.' },
  { icon: PenTool, label: 'UML Diagram', desc: 'Online banking system', prompt: 'Generate a UML diagram for an online banking system. Include Use Case diagrams showing actors (Customer, Bank Teller, Admin) and their interactions like View Balance, Transfer Funds, Pay Bills, Manage Beneficiaries, Process Deposits, Process Withdrawals, Manage Users, Configure System, Generate Reports, and Audit Logs. Also include Class diagrams, Sequence diagrams for key flows like fund transfer and bill payment, and a State diagram for transaction lifecycle.' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Logo({ size = 28 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.35, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 700, color: '#ffffff', fontFamily: 'Space Grotesk', letterSpacing: '-0.04em', boxShadow: '0 0 16px rgba(168,85,247,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}>Z</div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CODE BLOCK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CodeBlock({ children, className }) {
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const lang = (className || '').replace('language-', '') || 'text';
  const code = String(children).replace(/\n$/, '');
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="mono-label" style={{ color: 'var(--white-30)' }}>{lang}</span>
        <motion.button whileTap={{ scale: 0.9 }} onClick={copy} className="btn-ghost" style={{ padding: '4px 10px', fontSize: 10, gap: 4, color: copied ? 'var(--lime)' : 'var(--white-30)' }}>
          {copied ? <Check size={10} /> : <Copy size={10} />}{copied ? 'COPIED' : 'COPY'}
        </motion.button>
      </div>
      <SyntaxHighlighter language={lang} style={isDark ? oneDark : oneLight} customStyle={{ margin: 0, borderRadius: 0, fontSize: 12.5, background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(26,26,46,0.04)', padding: '18px', fontFamily: 'JetBrains Mono, monospace' }} showLineNumbers={code.split('\n').length > 3} lineNumberStyle={{ color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,26,46,0.2)', fontSize: 11 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// MESSAGE CONTENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MessageContent({ content, streaming }) {
  let processedContent = content || '';
  
  const components = useMemo(() => ({
    code({ node, inline, className, children }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');
      const isInline = inline !== undefined ? inline : (!match && !codeText.includes('\n'));
      if (!isInline) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return <code style={{ background: 'rgba(159,134,255,0.08)', padding: '2px 7px', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: '0.85em', color: 'var(--lime)', border: '1px solid rgba(159,134,255,0.12)' }}>{children}</code>;
    },
    h1: ({ children }) => <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, marginTop: 20, marginBottom: 10, color: '#ebebeb', letterSpacing: '-0.04em' }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, marginTop: 18, marginBottom: 8, color: '#ebebeb', letterSpacing: '-0.03em' }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, marginTop: 14, marginBottom: 6, color: 'rgba(235,235,235,0.8)' }}>{children}</h3>,
    p: ({ children }) => <p style={{ marginBottom: 12, color: 'rgba(235,235,235,0.6)', lineHeight: 1.85 }}>{children}</p>,
    ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol>,
    li: ({ children }) => <li style={{ color: 'rgba(235,235,235,0.55)', marginBottom: 5, lineHeight: 1.75 }}>{children}</li>,
    strong: ({ children }) => <strong style={{ color: '#ebebeb', fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em style={{ color: 'var(--lime)', fontStyle: 'italic' }}>{children}</em>,
    blockquote: ({ children }) => <blockquote style={{ borderLeft: '2px solid var(--lime)', paddingLeft: 16, margin: '12px 0', color: 'rgba(235,235,235,0.5)' }}>{children}</blockquote>,
    hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />,
    table: ({ children }) => <div style={{ overflowX: 'auto', margin: '14px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}><table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>{children}</table></div>,
    th: ({ children }) => <th style={{ background: 'rgba(159,134,255,0.04)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--lime)', fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</th>,
    td: ({ children }) => <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(235,235,235,0.55)', fontSize: 13 }}>{children}</td>,
  }), [streaming]);

  return <ReactMarkdown components={components}>{processedContent}</ReactMarkdown>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE MESSAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Message({ msg, userMessageContent, onUpdateMessage }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, gap: 10 }}>
        <div style={{ maxWidth: '72%' }}>
          {msg.fileNames && msg.fileNames.length > 0 && <FileBadges fileNames={msg.fileNames} />}
          <div className="message-user">{msg.displayContent || msg.content}</div>
          <div className="mono-label" style={{ marginTop: 6, textAlign: 'right', color: 'var(--white-30)', fontSize: 9 }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Zap size={16} color="#000" strokeWidth={2.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>ZENITH AI</span>
          <span className="mono-label" style={{ color: 'var(--white-30)', fontSize: 9 }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {msg.streaming && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <Loader size={9} style={{ animation: 'spin 1s linear infinite' }} /> streaming
            </span>
          )}
        </div>
        <div className="message-ai">
          <MessageContent content={msg.content || ''} streaming={msg.streaming} />
          {msg.streaming && msg.content && (
            <span style={{ display: 'inline-block', width: 2, height: 16, background: 'var(--lime)', animation: 'cursor-blink 0.8s infinite', marginLeft: 2, borderRadius: 1, verticalAlign: 'middle', boxShadow: '0 0 6px rgba(159,134,255,0.5)' }} />
          )}
        </div>
        {!msg.streaming && msg.content && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={copy} className="btn-ghost" style={{ padding: '4px 10px', fontSize: 10, color: copied ? 'var(--lime)' : 'var(--white-30)' }}>
              {copied ? <Check size={10} /> : <Copy size={10} />}
              <span className="mono-label" style={{ fontSize: 9 }}>{copied ? 'Copied' : 'Copy'}</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPARE PANEL (single model response)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ComparePanel({ model, messages, isLoading, streaming, onUseThis, onCopy }) {
  const modelInfo = MODELS.find(m => m.id === model);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, border: '1px solid rgba(0,255,213,0.12)', borderRadius: 16, overflow: 'hidden', background: 'rgba(4,10,16,0.6)' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(0,255,213,0.1)', background: 'rgba(0,255,213,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block', boxShadow: '0 0 6px rgba(0,255,213,0.5)' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: 'var(--lime)', letterSpacing: '0.1em' }}>
            {modelInfo?.label || model.split('/').pop().toUpperCase()}
          </span>
          {isLoading && <Loader size={10} style={{ color: 'var(--lime)', animation: 'spin 1s linear infinite' }} />}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {!isLoading && messages.length > 0 && (
            <>
              <button onClick={onCopy} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(225,247,252,0.5)', fontFamily: 'JetBrains Mono', fontSize: 9, cursor: 'pointer', letterSpacing: '0.08em' }}>COPY</button>
              <button onClick={onUseThis} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(0,255,213,0.1)', border: '1px solid rgba(0,255,213,0.25)', color: '#76fff0', fontFamily: 'JetBrains Mono', fontSize: 9, cursor: 'pointer', letterSpacing: '0.08em' }}>USE THIS</button>
            </>
          )}
        </div>
      </div>
      <div className="scroll-area" style={{ flex: 1, padding: '16px', fontSize: 13 }}>
        {messages.length === 0 && isLoading && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 0' }}>
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            {msg.role === 'user' ? (
              <div className="message-user" style={{ maxWidth: '85%', marginLeft: 'auto', fontSize: 12 }}>{msg.displayContent || msg.content}</div>
            ) : (
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(235,235,235,0.7)' }}>
                <MessageContent content={msg.content || ''} streaming={msg.streaming} />
                {msg.streaming && msg.content && <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--lime)', animation: 'cursor-blink 0.8s infinite', marginLeft: 2, borderRadius: 1, verticalAlign: 'middle' }} />}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPING INDICATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '4px 0', marginBottom: 20 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Zap size={16} color="#000" strokeWidth={2.5} /></div>
      <div className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WELCOME SCREEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function WelcomeScreen({ serverStatus }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', minHeight: 'calc(100vh - 120px)', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-sphere glow-lime" style={{ width: 400, height: 400, top: '20%', left: '15%', filter: 'blur(120px)', opacity: 0.15 }} />
      <div className="glow-sphere glow-emerald" style={{ width: 300, height: 300, bottom: '20%', right: '20%', filter: 'blur(120px)', opacity: 0.1 }} />
      {serverStatus === 'offline' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: 20, zIndex: 10, padding: '10px 18px', borderRadius: 12, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={14} color="#f87171" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#f87171' }}>
            Backend Offline — run: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 4 }}>cd server && npm run dev</code>
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN CHAT APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function ChatApp() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [serverStatus, setServerStatus] = useState('unknown');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selectedModel') || 'deepseek-ai/DeepSeek-V4-Flash');
  const [modelManuallySelected, setModelManuallySelected] = useState(!!localStorage.getItem('selectedModel'));
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const inputContainerRef = useRef(null);

  // ── Feature States ──
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showUsageDashboard, setShowUsageDashboard] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [secondaryModel, setSecondaryModel] = useState('deepseek-ai/DeepSeek-V4-Flash');
  const [secondModelDropdownOpen, setSecondModelDropdownOpen] = useState(false);
  const [primaryMessages, setPrimaryMessages] = useState([]);
  const [secondaryMessages, setSecondaryMessages] = useState([]);
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const primaryAbortRef = useRef(null);
  const secondaryAbortRef = useRef(null);
  const [interimVoice, setInterimVoice] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(e.target)) setInputFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 180) + 'px';
    }
  }, [input]);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/health`);
      if (res.ok) { const info = await res.json(); setServerStatus('online'); setServerInfo(info); }
      else setServerStatus('offline');
    } catch { setServerStatus('offline'); }
  }, [modelManuallySelected]);

  useEffect(() => { checkHealth(); const i = setInterval(checkHealth, 15000); return () => clearInterval(i); }, [checkHealth]);

  const newChat = useCallback((shouldFocus = true) => {
    setCurrentSessionId(null);
    setMessages([]);
    setPrimaryMessages([]);
    setSecondaryMessages([]);
    setError(null);
    setAttachedFiles([]);
    if (shouldFocus === true) inputRef.current?.focus();
  }, []);

  const loadSessions = useCallback(async () => {
    try { const r = await fetch(`${API}/api/sessions`); if (r.ok) setSessions((await r.json()).sessions || []); } catch {}
  }, []);

  useEffect(() => {
    const initFreshSession = async () => {
      try { await fetch(`${API}/api/sessions`, { method: 'DELETE' }); } catch {}
      loadSessions();
      newChat(false);
    };
    initFreshSession();
  }, [loadSessions, newChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadSession = useCallback(async (id) => {
    try {
      const r = await fetch(`${API}/api/sessions/${id}`);
      if (r.ok) {
        const d = await r.json();
        setCurrentSessionId(id);
        setMessages(d.session.messages || []);
        setError(null);
        if (d.session.model) { setSelectedModel(d.session.model); localStorage.setItem('selectedModel', d.session.model); }
      }
    } catch {}
  }, []);

  const deleteSession = useCallback(async (id, e) => {
    e.stopPropagation();
    await fetch(`${API}/api/sessions/${id}`, { method: 'DELETE' });
    if (id === currentSessionId) newChat();
    loadSessions();
  }, [currentSessionId, newChat, loadSessions]);

  const stopGeneration = () => {
    abortRef.current?.abort();
    primaryAbortRef.current?.abort();
    secondaryAbortRef.current?.abort();
    setIsLoading(false);
    setPrimaryLoading(false);
    setSecondaryLoading(false);
    setMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false } : m));
    setPrimaryMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false } : m));
    setSecondaryMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false } : m));
  };

  // ── Stream a single model response ──
  const streamModel = useCallback(async (model, content, sessionId, abortSignal, onDelta, onDone, onError) => {
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, sessionId, stream: true, model }),
        signal: abortSignal,
      });
      if (!res.ok) {
        let errData = {};
        try { errData = await res.json(); } catch {}
        throw new Error(errData.error || 'Server error');
      }

      const newSessionId = res.headers.get('X-Session-Id');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.delta) onDelta(data.delta);
            if (data.done) onDone(data.sessionId || newSessionId);
          } catch (pe) { if (pe.message !== 'Unexpected end of JSON') throw pe; }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') onError(err);
    }
  }, []);

  // ── Compare mode send ──
  const sendCompare = useCallback(async (content) => {
    if (!content || primaryLoading || secondaryLoading) return;
    const displayContent = content;

    // Build context with files
    const contextContent = buildFileContext(attachedFiles, content);
    const fileNames = attachedFiles.map(f => f.name);

    const userMsg = { id: `u_${Date.now()}`, role: 'user', content: contextContent, displayContent, fileNames, timestamp: new Date().toISOString() };
    setPrimaryMessages(prev => [...prev, userMsg]);
    setSecondaryMessages(prev => [...prev, userMsg]);

    const pAiId = `pa_${Date.now()}`;
    const sAiId = `sa_${Date.now()}`;
    setPrimaryMessages(prev => [...prev, { id: pAiId, role: 'assistant', content: '', timestamp: new Date().toISOString(), streaming: true }]);
    setSecondaryMessages(prev => [...prev, { id: sAiId, role: 'assistant', content: '', timestamp: new Date().toISOString(), streaming: true }]);

    setPrimaryLoading(true);
    setSecondaryLoading(true);
    setAttachedFiles([]);

    const pAbort = new AbortController();
    const sAbort = new AbortController();
    primaryAbortRef.current = pAbort;
    secondaryAbortRef.current = sAbort;

    // Stream primary
    streamModel(selectedModel, contextContent, null, pAbort.signal,
      (delta) => setPrimaryMessages(prev => prev.map(m => m.id === pAiId ? { ...m, content: m.content + delta } : m)),
      (sid) => { setPrimaryMessages(prev => prev.map(m => m.id === pAiId ? { ...m, streaming: false } : m)); setPrimaryLoading(false); recordMessage(selectedModel, contextContent.length); },
      (err) => { setPrimaryMessages(prev => prev.map(m => m.id === pAiId ? { ...m, streaming: false, content: `**Error**: ${err.message}` } : m)); setPrimaryLoading(false); }
    );

    // Stream secondary
    streamModel(secondaryModel, contextContent, null, sAbort.signal,
      (delta) => setSecondaryMessages(prev => prev.map(m => m.id === sAiId ? { ...m, content: m.content + delta } : m)),
      (sid) => { setSecondaryMessages(prev => prev.map(m => m.id === sAiId ? { ...m, streaming: false } : m)); setSecondaryLoading(false); recordMessage(secondaryModel, contextContent.length); },
      (err) => { setSecondaryMessages(prev => prev.map(m => m.id === sAiId ? { ...m, streaming: false, content: `**Error**: ${err.message}` } : m)); setSecondaryLoading(false); }
    );
  }, [attachedFiles, primaryLoading, secondaryLoading, selectedModel, secondaryModel, streamModel]);

  // ── Normal send ──
  const sendMessage = useCallback(async (text = input) => {
    const content = text.trim();
    if (!content || isLoading) return;

    if (compareMode) { setInput(''); setInterimVoice(''); sendCompare(content); return; }

    const displayContent = content;
    const contextContent = buildFileContext(attachedFiles, content);
    const fileNames = attachedFiles.map(f => f.name);

    setInput(''); setError(null); setInputFocused(false); setInterimVoice('');
    setAttachedFiles([]);

    const userMsg = { id: `u_${Date.now()}`, role: 'user', content: contextContent, displayContent, fileNames, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    setIsLoading(true);

    const aiMsgId = `a_${Date.now()}`;
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date().toISOString(), streaming: true }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextContent, sessionId: currentSessionId, stream: true, model: selectedModel }),
        signal: controller.signal,
      });
      if (!res.ok) {
        let errData = {};
        try { errData = await res.json(); } catch {}
        if (errData.sessionId && !currentSessionId) { setCurrentSessionId(errData.sessionId); loadSessions(); }
        throw new Error(errData.error || 'Server error');
      }

      const sessionId = res.headers.get('X-Session-Id');
      if (sessionId && !currentSessionId) { setCurrentSessionId(sessionId); loadSessions(); }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.delta) setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + data.delta } : m));
            if (data.done) {
              setMessages(prev => {
                const updated = prev.map(m => m.id === aiMsgId ? { ...m, streaming: false } : m);
                const aiMsg = updated.find(m => m.id === aiMsgId);
                if (aiMsg) recordMessage(selectedModel, (contextContent + aiMsg.content).length);
                return updated;
              });
              if (data.sessionId) setCurrentSessionId(data.sessionId);
              loadSessions();
            }
          } catch (pe) { if (pe.message !== 'Unexpected end of JSON') throw pe; }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + '\n\n_[Generation stopped]_', streaming: false } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, streaming: false, content: `**Error**: ${err.message}\n\nMake sure your \`FEATHERLESS_API_KEY\` is set in the \`.env\` file and the backend server is running.` } : m));
        setError(err.message);
      }
    } finally { setIsLoading(false); }
  }, [input, isLoading, currentSessionId, loadSessions, selectedModel, compareMode, sendCompare, attachedFiles]);

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const hasMessages = messages.length > 0;
  const isAnythingLoading = isLoading || primaryLoading || secondaryLoading;

  return (
    <div className="grid-bg noise-overlay" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--black)', position: 'relative' }}>
      <video className="bg-video" src="/alien.mp4" autoPlay loop muted playsInline style={{ left: (!isMobile && sidebarOpen) ? '260px' : '0px', width: (!isMobile && sidebarOpen) ? 'calc(100% - 260px)' : '100%', transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1), width 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.45s cubic-bezier(0.4,0,0.2,1)' }} />

      {/* ── BACKDROP OVERLAY FOR MOBILE ── */}
      {isMobile && sidebarOpen && (
        <div 
          className="mobile-sidebar-overlay open" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <motion.aside animate={{ width: sidebarOpen ? 260 : 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ height: '100%', background: 'var(--sidebar-bg)', backdropFilter: 'blur(var(--glass-blur))', borderRight: '1px solid var(--sidebar-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, position: isMobile ? 'fixed' : 'relative', left: 0, top: 0, bottom: 0, zIndex: isMobile ? 100 : 10 }}>
        <div style={{ padding: '18px 14px', borderBottom: '1px solid var(--sidebar-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingLeft: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Logo size={30} />
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>ZENITH</div>
                <div className="mono-label" style={{ fontSize: 8, color: 'var(--lime)', letterSpacing: '0.12em' }}>ENGINEERING COPILOT</div>
              </div>
            </div>
            {isMobile && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSidebarOpen(false)} className="btn-icon" style={{ width: 28, height: 28, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} color="var(--text-secondary)" />
              </motion.button>
            )}
          </div>
          <motion.button whileHover={{ borderColor: 'var(--lime-bright)', boxShadow: '0 0 16px var(--lime-glow)', backgroundColor: 'var(--lime-subtle)' }} whileTap={{ scale: 0.97 }} onClick={newChat} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 12, border: '1px solid var(--lime-border)', background: 'var(--lime-subtle)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, fontFamily: 'Space Grotesk', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            <Plus size={15} color="var(--lime)" />New Chat
          </motion.button>
        </div>

        <div className="scroll-area" style={{ flex: 1, padding: '10px 8px' }}>
          {sessions.length === 0 ? (
            <div style={{ padding: '48px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--lime-subtle)', border: '1px solid var(--lime-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={15} color="var(--lime)" style={{ opacity: 0.6 }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, color: 'var(--white-30)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>No Conversations</div>
                <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'Space Grotesk' }}>Active chats will appear here</div>
              </div>
            </div>
          ) : sessions.map(s => (
            <motion.button key={s.id} whileHover={{ x: 2 }} onClick={() => loadSession(s.id)} className={`sidebar-item ${s.id === currentSessionId ? 'active' : ''}`} style={{ marginBottom: 3, flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 6 }}>
                <MessageSquare size={11} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{s.title}</span>
                <motion.span whileHover={{ color: '#f87171' }} onClick={(e) => deleteSession(s.id, e)} style={{ flexShrink: 0, opacity: 0.3, display: 'flex', alignItems: 'center', cursor: 'pointer' }}><Trash2 size={10} /></motion.span>
              </div>
              <span className="mono-label" style={{ fontSize: 8, marginLeft: 17, color: 'var(--white-30)' }}>{s.messageCount} MSG{s.messageCount !== 1 ? 'S' : ''}</span>
            </motion.button>
          ))}
        </div>

        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(168,85,247,0.1)', flexShrink: 0 }}>
          <div className="status-tag" style={{ marginBottom: serverInfo ? 6 : 0 }}>
            <span className={serverStatus === 'online' ? 'status-dot' : 'status-dot-off'} />
            {serverStatus === 'online' ? 'SYSTEM ONLINE' : serverStatus === 'offline' ? 'OFFLINE' : 'CHECKING'}
          </div>
          {serverInfo && (
            <div className="mono-label" style={{ fontSize: 8, color: 'var(--text-tertiary)', lineHeight: 1.8, marginTop: 4 }}>
              <div>MODEL: <span style={{ color: serverInfo.apiKeyConfigured ? 'var(--lime-bright)' : '#f87171' }}>{serverInfo.model?.split('/').pop()}</span></div>
              <div style={{ color: serverInfo.apiKeyConfigured ? '#34d399' : '#f87171' }}>API: {serverInfo.apiKeyConfigured ? '● CONFIGURED' : '○ NOT SET'}</div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>

        {/* Top Nav */}
        <div style={{ height: 56, borderBottom: '1px solid var(--nav-border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, background: 'var(--nav-bg)', backdropFilter: 'blur(var(--glass-blur))', flexShrink: 0, zIndex: 5, boxShadow: '0 1px 20px rgba(0,0,0,0.1)' }}>

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-icon" style={{ width: 34, height: 34 }}>
            <Menu size={15} />
          </motion.button>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            {currentSession && (
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{currentSession.title}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Usage Dashboard Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowUsageDashboard(true)}
              title="Usage Dashboard"
              style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(225,247,252,0.45)', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,213,0.3)'; e.currentTarget.style.color = '#00ffd5'; e.currentTarget.style.background = 'rgba(0,255,213,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(225,247,252,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <BarChart2 size={15} />
            </motion.button>

            {/* Compare Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) { setPrimaryMessages([]); setSecondaryMessages([]); }
              }}
              style={{
                padding: '5px 12px',
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                border: compareMode ? '1px solid rgba(0,255,213,0.5)' : '1px solid rgba(255,255,255,0.1)',
                background: compareMode ? 'rgba(0,255,213,0.1)' : 'rgba(255,255,255,0.04)',
                color: compareMode ? '#00ffd5' : 'rgba(225,247,252,0.45)',
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                transition: 'all 0.2s ease',
                boxShadow: compareMode ? '0 0 16px rgba(0,255,213,0.2)' : 'none',
              }}
            >
              <ZapIcon size={12} />
              COMPARE
            </motion.button>

            {/* Secondary model picker (only in compare mode) */}
            <AnimatePresence>
              {compareMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ position: 'relative' }}
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSecondModelDropdownOpen(!secondModelDropdownOpen)}
                    className="glass"
                    style={{ padding: '5px 12px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.08)', outline: 'none' }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc', display: 'inline-block' }} />
                    <span className="mono-label" style={{ fontSize: 9, color: '#c084fc' }}>
                      {MODELS.find(m => m.id === secondaryModel)?.label || secondaryModel.split('/').pop().toUpperCase()}
                    </span>
                    <ChevronDown size={12} color="#c084fc" />
                  </motion.button>

                  <AnimatePresence>
                    {secondModelDropdownOpen && (
                      <>
                        <div onClick={() => setSecondModelDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
                        <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="glass" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 280, borderRadius: 16, border: '1px solid rgba(168,85,247,0.25)', background: 'var(--dropdown-bg)', backdropFilter: 'blur(24px)', padding: 8, zIndex: 1000, boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
                          <div style={{ padding: '6px 12px 4px', fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--text-tertiary)', letterSpacing: '0.12em', borderBottom: '1px solid rgba(168,85,247,0.1)', marginBottom: 6 }}>SECONDARY MODEL</div>
                          {MODELS.map(m => (
                            <button key={m.id} onClick={() => { setSecondaryModel(m.id); setSecondModelDropdownOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 10, background: secondaryModel === m.id ? 'rgba(168,85,247,0.1)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
                              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 11, color: secondaryModel === m.id ? '#c084fc' : 'var(--text-primary)' }}>{m.label}</span>
                              <span style={{ fontSize: 9, color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono' }}>{m.description}</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Model Dropdown */}
            <div style={{ position: 'relative' }}>
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ backgroundColor: 'var(--lime-subtle)' }} onClick={() => { setModelDropdownOpen(!modelDropdownOpen); setShowAllModels(false); }} className="glass" style={{ padding: '5px 12px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: '1px solid var(--lime-border)', background: 'var(--lime-subtle)', outline: 'none' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block', boxShadow: '0 0 8px var(--lime-glow)' }} />
                <span className="mono-label" style={{ fontSize: 9, color: 'var(--lime-bright)' }}>{MODELS.find(m => m.id === selectedModel)?.label || selectedModel.split('/').pop().toUpperCase()}</span>
                <ChevronDown size={12} color="var(--lime)" style={{ marginLeft: 2 }} />
              </motion.button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <>
                    <div onClick={() => setModelDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="glass" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 320, maxHeight: 380, overflowY: 'auto', borderRadius: 16, border: '1px solid var(--lime-border)', background: 'var(--dropdown-bg)', backdropFilter: 'blur(24px)', padding: 8, zIndex: 1000, boxShadow: '0 16px 48px var(--dropdown-shadow)' }}>
                      <div style={{ padding: '8px 12px 4px', fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--text-tertiary)', letterSpacing: '0.12em', borderBottom: '1px solid var(--lime-subtle)', marginBottom: 6 }}>SELECT ACTIVE ENGINE</div>
                      {(showAllModels ? MODELS : MODELS.slice(0, 4)).map((model) => (
                        <button key={model.id} onClick={() => { setSelectedModel(model.id); setModelManuallySelected(true); localStorage.setItem('selectedModel', model.id); setModelDropdownOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, background: selectedModel === model.id ? 'var(--lime-subtle)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 2, transition: 'background 0.15s ease' }} onMouseEnter={e => { if (selectedModel !== model.id) e.currentTarget.style.background = 'var(--lime-subtle)'; }} onMouseLeave={e => { if (selectedModel !== model.id) e.currentTarget.style.background = 'transparent'; }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 11.5, color: selectedModel === model.id ? 'var(--lime-bright)' : 'var(--text-primary)' }}>{model.label}</span>
                            {selectedModel === model.id && <span style={{ fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--lime)', fontWeight: 700 }}>ACTIVE</span>}
                          </div>
                          <span style={{ fontSize: 9, color: 'var(--text-tertiary)', lineHeight: 1.35, fontFamily: 'JetBrains Mono' }}>{model.description}</span>
                        </button>
                      ))}
                      {!showAllModels && MODELS.length > 4 && (
                        <button onClick={(e) => { e.stopPropagation(); setShowAllModels(true); }} style={{ width: '100%', textAlign: 'center', padding: '8px', marginTop: 4, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--white-60)', fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.05em', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#ebebeb'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'var(--white-60)'; }}>
                          SHOW ALL MODELS ({MODELS.length})
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="glass" style={{ padding: '5px 12px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(168,85,247,0.18)', background: 'rgba(168,85,247,0.05)' }}>
              <span className="mono-label" style={{ fontSize: 9, color: '#34d399' }}>FEATHERLESS</span>
            </div>
          </div>
        </div>

        {/* ── COMPARE MODE PANELS ── */}
        {compareMode ? (
          <div style={{ flex: 1, display: 'flex', gap: 12, padding: '16px', overflow: 'hidden', minHeight: 0 }}>
            <ComparePanel
              model={selectedModel}
              messages={primaryMessages}
              isLoading={primaryLoading}
              onUseThis={() => { setCompareMode(false); setPrimaryMessages([]); setSecondaryMessages([]); }}
              onCopy={() => { const last = primaryMessages.filter(m => m.role === 'assistant').at(-1); if (last) navigator.clipboard.writeText(last.content); }}
            />
            <ComparePanel
              model={secondaryModel}
              messages={secondaryMessages}
              isLoading={secondaryLoading}
              onUseThis={() => { setSelectedModel(secondaryModel); localStorage.setItem('selectedModel', secondaryModel); setCompareMode(false); setPrimaryMessages([]); setSecondaryMessages([]); }}
              onCopy={() => { const last = secondaryMessages.filter(m => m.role === 'assistant').at(-1); if (last) navigator.clipboard.writeText(last.content); }}
            />
          </div>
        ) : (
          /* ── NORMAL MESSAGES ── */
          <div className="scroll-area" style={{ flex: 1, position: 'relative' }}>
            <div style={{ maxWidth: 840, margin: '0 auto', padding: '32px 28px' }}>
              {!hasMessages ? (
                <WelcomeScreen serverStatus={serverStatus} />
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                      const prevMsg = idx > 0 ? messages[idx - 1] : null;
                      const userMsgContent = prevMsg && prevMsg.role === 'user' ? (prevMsg.displayContent || prevMsg.content) : '';
                      return (
                        <Message
                          key={msg.id}
                          msg={msg}
                          userMessageContent={userMsgContent}
                          onUpdateMessage={(updatedMsg) => {
                            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, ...updatedMsg } : m));
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>
                  {isLoading && messages[messages.length - 1]?.role !== 'assistant' && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ margin: '0 auto 8px', padding: '10px 18px', borderRadius: 14, maxWidth: 840, width: '100%', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 28, paddingRight: 28 }}>
              <AlertCircle size={13} color="#f87171" />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#f87171', flex: 1 }}>{error}</span>
              <X size={13} color="#f87171" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setError(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INPUT AREA ── */}
        <div style={{ padding: '14px 24px 22px', flexShrink: 0, position: 'relative' }}>
          <div ref={inputContainerRef} style={{ maxWidth: 840, margin: '0 auto', position: 'relative' }}>

            {/* Floating Suggestions Panel */}
            <AnimatePresence>
              {inputFocused && !input.trim() && !isAnythingLoading && !compareMode && (
                <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 12, zIndex: 50, display: 'flex', justifyContent: 'center' }}>
                  <div className="glass bento-grid-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, padding: 12, borderRadius: 20, background: 'var(--dropdown-bg)', border: '1px solid var(--lime-border)', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px var(--lime-glow)', backdropFilter: 'blur(20px)' }}>
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button key={i} whileHover={{ translateY: -3, borderColor: 'var(--lime-bright)', backgroundColor: 'var(--lime-subtle)' }} whileTap={{ scale: 0.97 }} onClick={() => { setInput(s.prompt); inputRef.current?.focus(); }} className="glass-bento" style={{ padding: '12px 10px', borderRadius: 14, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', transition: 'all 0.2s ease' }}>
                        <div className="bento-icon-wrapper" style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--lime-subtle)', border: '1px solid var(--lime-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><s.icon size={14} color="var(--lime)" /></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, pointerEvents: 'none' }}>
                          <span className="bento-title" style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                          <span className="bento-desc" style={{ fontSize: 9, color: 'var(--text-tertiary)', fontFamily: 'Space Grotesk', lineHeight: 1.2 }}>{s.desc}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File chips above the input */}
            <AnimatePresence>
              {attachedFiles.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 8 }}>
                  <FileChips files={attachedFiles} onRemove={(idx) => setAttachedFiles(f => f.filter((_, i) => i !== idx))} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interim voice transcript display */}
            <AnimatePresence>
              {interimVoice && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 6, padding: '6px 14px', background: 'rgba(0,255,213,0.06)', border: '1px solid rgba(0,255,213,0.15)', borderRadius: 10, fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(0,255,213,0.7)', fontStyle: 'italic' }}>
                  🎙 {interimVoice}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="floating-command-bar">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', paddingLeft: 4, flexShrink: 0 }}>
                  <Bot size={18} color="var(--lime)" style={{ opacity: 0.8 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onClick={() => setInputFocused(true)}
                    placeholder={compareMode ? 'Send to both models simultaneously...' : 'Ask me anything about software engineering...'}
                    rows={1}
                    style={{ minHeight: 38, maxHeight: 180, border: 'none', background: 'transparent', padding: '8px 0', boxShadow: 'none', fontSize: '13.5px', resize: 'none', outline: 'none', width: '100%', color: 'var(--input-text)', fontFamily: 'var(--font-heading)', lineHeight: '1.5' }}
                    disabled={isAnythingLoading && !messages.some(m => m.streaming)}
                  />
                </div>

                {/* File upload button */}
                <FileUpload
                  files={attachedFiles}
                  onFilesChange={setAttachedFiles}
                  disabled={isAnythingLoading}
                />

                {/* Voice input button */}
                <VoiceInput
                  disabled={isAnythingLoading}
                  onTranscript={(text) => {
                    setInput(prev => (prev ? prev + ' ' : '') + text);
                    setInterimVoice('');
                  }}
                  onInterim={(text) => setInterimVoice(text)}
                />

                {/* Send / Stop */}
                {isAnythingLoading ? (
                  <motion.button whileTap={{ scale: 0.9 }} onClick={stopGeneration} style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Square size={14} color="#f87171" fill="#f87171" />
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.9 }} className="send-btn" style={{ width: 38, height: 38, borderRadius: 12 }} onClick={() => sendMessage()} disabled={!input.trim() && attachedFiles.length === 0}>
                    <Send size={15} color="#fff" strokeWidth={2.5} />
                  </motion.button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, padding: '0 4px' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['SRS', 'Architecture', 'Database', 'API', 'Testing', 'DevOps'].map(tag => (
                  <motion.button key={tag} whileTap={{ scale: 0.93 }} onClick={() => setInput(`Help me with ${tag} — `)} className="pill-btn">{tag}</motion.button>
                ))}
              </div>
              <span className="mono-label" style={{ fontSize: 9, color: 'var(--white-30)' }}>
                {compareMode ? '⚡ COMPARE MODE' : '↵ SEND · ⇧↵ NEWLINE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Dashboard Drawer */}
      <UsageDashboard open={showUsageDashboard} onClose={() => setShowUsageDashboard(false)} />
    </div>
  );
}
