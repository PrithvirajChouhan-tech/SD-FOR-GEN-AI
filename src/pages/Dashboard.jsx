import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, FileText, PenTool, Cpu, TestTube2, BookMarked,
  ChevronDown, ChevronRight, Sparkles, ArrowRight, Zap, BarChart3,
  TrendingUp, Clock, CheckCircle2, Circle, Loader2, Play
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import {
  AnimatedCounter, ProgressBar, CircularProgress, Badge, AIGenerationFlow
} from '../components/ui/index.jsx';

// =====================
// METRIC CARDS DATA
// =====================
const metrics = [
  { label: 'Active Projects', value: 12, icon: FolderKanban, color: '#2563EB', bg: 'rgba(37,99,235,0.08)', change: '+3 this month' },
  { label: 'Requirements', value: 847, icon: FileText, color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', change: '+124 this week' },
  { label: 'UML Diagrams', value: 156, icon: PenTool, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', change: '+18 today' },
  { label: 'Architecture Docs', value: 34, icon: Cpu, color: '#22C55E', bg: 'rgba(34,197,94,0.08)', change: '6 in review' },
  { label: 'Test Cases', value: 2403, icon: TestTube2, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', change: '87% passing' },
  { label: 'Doc Score', value: 94, icon: BookMarked, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', change: '+2 pts avg', suffix: '%' },
];

// =====================
// PROJECT HEALTH DATA
// =====================
const healthData = [
  { label: 'Requirements Coverage', value: 91, color: '#2563EB' },
  { label: 'Design Completion', value: 78, color: '#06B6D4' },
  { label: 'Development Progress', value: 65, color: '#8B5CF6' },
  { label: 'Testing Progress', value: 82, color: '#22C55E' },
  { label: 'Deployment Readiness', value: 54, color: '#F59E0B' },
  { label: 'Documentation Quality', value: 88, color: '#EF4444' },
];

// =====================
// PIPELINE STAGES
// =====================
const pipelineStages = [
  { id: 1, label: 'Idea Capture', status: 'done', pct: 100, updated: '2 days ago', suggestion: 'Stakeholder interviews documented' },
  { id: 2, label: 'Requirement Analysis', status: 'done', pct: 100, updated: '1 day ago', suggestion: 'All 42 requirements validated' },
  { id: 3, label: 'SRS Document', status: 'done', pct: 100, updated: '22 hours ago', suggestion: 'SRS v2.1 ready for sign-off' },
  { id: 4, label: 'User Stories', status: 'done', pct: 95, updated: '18 hours ago', suggestion: '3 edge cases need review' },
  { id: 5, label: 'Architecture Design', status: 'active', pct: 72, updated: '4 hours ago', suggestion: 'Microservices pattern recommended' },
  { id: 6, label: 'UML Diagrams', status: 'active', pct: 60, updated: '2 hours ago', suggestion: 'Sequence diagrams pending' },
  { id: 7, label: 'Database Design', status: 'active', pct: 45, updated: '1 hour ago', suggestion: 'ER diagram needs review' },
  { id: 8, label: 'API Design', status: 'pending', pct: 15, updated: 'Just started', suggestion: 'Start with auth endpoints' },
  { id: 9, label: 'Development', status: 'pending', pct: 0, updated: 'Not started', suggestion: 'Sprint planning ready' },
  { id: 10, label: 'Testing', status: 'pending', pct: 0, updated: 'Not started', suggestion: 'Test plan drafted' },
  { id: 11, label: 'DevOps & CI/CD', status: 'pending', pct: 0, updated: 'Not started', suggestion: 'Docker config ready' },
  { id: 12, label: 'Deployment', status: 'pending', pct: 0, updated: 'Not started', suggestion: 'AWS recommended' },
  { id: 13, label: 'Maintenance', status: 'pending', pct: 0, updated: 'Not started', suggestion: 'Monitoring plan staged' },
];

// =====================
// AI GENERATION STEPS
// =====================
const aiSteps = [
  { label: 'Understanding Project Context', duration: 800 },
  { label: 'Analyzing Requirements', duration: 1000 },
  { label: 'Creating User Stories', duration: 900 },
  { label: 'Designing Architecture', duration: 1100 },
  { label: 'Generating UML Diagrams', duration: 1200 },
  { label: 'Generating Test Cases', duration: 900 },
  { label: 'Preparing Documentation', duration: 700 },
];

const quickActions = [
  { label: 'Generate Requirements', color: '#2563EB' },
  { label: 'Generate SRS', color: '#06B6D4' },
  { label: 'Generate User Stories', color: '#8B5CF6' },
  { label: 'Generate Architecture', color: '#22C55E' },
  { label: 'Generate UML', color: '#F59E0B' },
  { label: 'Generate Database Schema', color: '#EF4444' },
  { label: 'Generate APIs', color: '#EC4899' },
  { label: 'Generate Test Cases', color: '#14B8A6' },
  { label: 'Generate Documentation', color: '#6366F1' },
  { label: 'Generate DevOps Plan', color: '#0EA5E9' },
];

// =====================
// LIFECYCLE SVG
// =====================
function LifecycleSVG() {
  const phases = [
    { label: 'Plan', x: 60, color: '#2563EB' },
    { label: 'Design', x: 160, color: '#06B6D4' },
    { label: 'Build', x: 260, color: '#8B5CF6' },
    { label: 'Test', x: 360, color: '#22C55E' },
    { label: 'Deploy', x: 460, color: '#F59E0B' },
    { label: 'Monitor', x: 560, color: '#EF4444' },
  ];

  return (
    <svg viewBox="0 0 640 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 620 }}>
      {/* Connecting lines */}
      {phases.slice(0, -1).map((p, i) => (
        <line key={i} x1={p.x + 30} y1={40} x2={phases[i + 1].x - 30} y2={40}
          stroke="#E2E8F0" strokeWidth={2} strokeDasharray="4 4" />
      ))}
      {/* Arrow heads */}
      {phases.slice(0, -1).map((p, i) => (
        <polygon key={`a${i}`}
          points={`${phases[i + 1].x - 32},36 ${phases[i + 1].x - 24},40 ${phases[i + 1].x - 32},44`}
          fill="#CBD5E1" />
      ))}
      {/* Phase circles */}
      {phases.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={40} r={28} fill={`${p.color}15`} stroke={p.color} strokeWidth={2} />
          <text x={p.x} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={p.color}
            fontFamily="Space Grotesk">{p.label}</text>
          <text x={p.x} y={82} textAnchor="middle" fontSize={9} fill="#94A3B8" fontFamily="Inter">
            Phase {i + 1}
          </text>
        </g>
      ))}
      {/* Outer ring for first active */}
      <circle cx={260} cy={40} r={32} fill="none" stroke="#8B5CF6" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
    </svg>
  );
}

// =====================
// PIPELINE STAGE ITEM
// =====================
function PipelineStage({ stage, index }) {
  const [expanded, setExpanded] = useState(false);
  const statusColors = { done: '#22C55E', active: '#2563EB', pending: '#94A3B8' };
  const statusLabels = { done: 'Complete', active: 'In Progress', pending: 'Pending' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="pipeline-stage"
      style={{ marginBottom: 4, background: stage.status === 'active' ? 'rgba(37,99,235,0.02)' : 'white' }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
      >
        {/* Stage number & status */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: stage.status === 'done' ? '#22C55E' : stage.status === 'active' ? '#EFF6FF' : '#F8FAFC',
          border: `2px solid ${statusColors[stage.status]}20`,
          flexShrink: 0,
        }}>
          {stage.status === 'done' ? (
            <CheckCircle2 size={16} color="#22C55E" />
          ) : stage.status === 'active' ? (
            <Loader2 size={14} color="#2563EB" style={{ animation: 'spin-slow 1.5s linear infinite' }} />
          ) : (
            <Circle size={12} color="#94A3B8" />
          )}
        </div>

        {/* Label */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{stage.label}</span>
            <Badge variant={stage.status === 'done' ? 'green' : stage.status === 'active' ? 'blue' : 'gray'} size="sm">
              {statusLabels[stage.status]}
            </Badge>
          </div>
          <ProgressBar value={stage.pct} color={statusColors[stage.status]} height={4} />
        </div>

        {/* Meta */}
        <div style={{ textAlign: 'right', marginLeft: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>{stage.pct}%</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{stage.updated}</div>
        </div>

        {/* Expand */}
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} color="#94A3B8" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '8px 16px 14px 60px',
              borderTop: '1px solid #F1F5F9',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Sparkles size={13} color="#2563EB" />
              <span style={{ fontSize: 12, color: '#475569' }}>
                <strong style={{ color: '#2563EB' }}>AI Insight:</strong> {stage.suggestion}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =====================
// MAIN DASHBOARD
// =====================
export default function Dashboard() {
  const [projectDesc, setProjectDesc] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);

  const handleGenerate = () => {
    if (!projectDesc.trim()) return;
    setGenerating(true);
    setGenerationDone(false);
  };

  return (
    <div className="page-content">
      {/* ===== HERO ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background: 'white',
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          padding: '32px 36px',
          marginBottom: 24,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative gradient blob */}
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(37,99,235,0.1)', fontSize: 12, fontWeight: 600, color: '#2563EB' }}>
                ✦ AI-Powered Workspace
              </div>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 700, color: '#0F172A', lineHeight: 1.2, marginBottom: 8 }}>
              Welcome back, Zenith 👋
            </h1>
            <p style={{ fontSize: 15, color: '#475569', maxWidth: 480 }}>
              Your engineering copilot is ready. Continue where you left off on <strong>E-Commerce Platform</strong> — 3 stages in progress.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn-primary" style={{ fontSize: 13 }}>
                <Play size={14} /> Continue Project
              </button>
              <button className="btn-secondary" style={{ fontSize: 13 }}>
                <BarChart3 size={14} /> View Reports
              </button>
            </div>
          </div>
          <div>
            <LifecycleSVG />
          </div>
        </div>
      </motion.div>

      {/* ===== METRIC CARDS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="metric-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={17} color={m.color} />
              </div>
              <TrendingUp size={14} color="#22C55E" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk', marginBottom: 2 }}>
              <AnimatedCounter value={m.value} suffix={m.suffix || ''} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{m.change}</div>
          </motion.div>
        ))}
      </div>

      {/* ===== MIDDLE SECTION: HEALTH + PIPELINE ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 24 }}>

        {/* PROJECT HEALTH */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          style={{ padding: '24px', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Project Health</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>E-Commerce Platform</p>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', fontSize: 12, fontWeight: 600, color: '#22C55E' }}>
              76% Overall
            </div>
          </div>

          {/* Circular indicators row */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            {healthData.slice(0, 3).map(h => (
              <div key={h.label} style={{ textAlign: 'center' }}>
                <CircularProgress value={h.value} size={72} color={h.color} />
                <div style={{ fontSize: 10, color: '#475569', marginTop: 6, fontWeight: 500, maxWidth: 70, lineHeight: 1.3 }}>{h.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {healthData.slice(3).map(h => (
              <div key={h.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{h.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{h.value}%</span>
                </div>
                <ProgressBar value={h.value} color={h.color} height={5} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ENGINEERING PIPELINE */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Engineering Pipeline</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Software Development Lifecycle</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} /> Done
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} /> Active
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E2E8F0', display: 'inline-block' }} /> Pending
              </span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 480 }}>
            {pipelineStages.map((stage, i) => (
              <PipelineStage key={stage.id} stage={stage} index={i} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ===== AI WORKSPACE ===== */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35 }}
        style={{ padding: '28px 32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 1 }}>AI Workspace</h2>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>Describe your project and generate everything instantly</p>
          </div>
        </div>

        <div className="divider" />

        <textarea
          className="textarea"
          rows={5}
          value={projectDesc}
          onChange={e => setProjectDesc(e.target.value)}
          placeholder="Describe the software project you want to build...&#10;&#10;Example: Build a multi-tenant SaaS platform for project management with real-time collaboration, role-based access control, Kanban boards, and Gantt charts. The system should support 10,000+ concurrent users with sub-100ms response times..."
          style={{ marginBottom: 16 }}
        />

        {generating && !generationDone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginBottom: 16 }}
          >
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>AI is working on your project...</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Generating all engineering artifacts simultaneously</div>
            </div>
            <AIGenerationFlow
              steps={aiSteps}
              onComplete={() => setGenerationDone(true)}
            />
          </motion.div>
        )}

        {generationDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '14px 18px', borderRadius: 12,
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <CheckCircle2 size={18} color="#22C55E" />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#22C55E' }}>All engineering artifacts generated successfully!</span>
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
          {quickActions.map(qa => (
            <motion.button
              key={qa.label}
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setGenerating(true);
                setGenerationDone(false);
              }}
              style={{
                padding: '8px 12px', borderRadius: 10,
                border: `1px solid ${qa.color}25`,
                background: `${qa.color}08`,
                cursor: 'pointer', fontSize: 11, fontWeight: 600,
                color: qa.color, fontFamily: 'Inter',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              {qa.label}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '12px 24px', fontSize: 14 }}
          >
            <Sparkles size={16} /> Generate Complete Engineering Suite
            <ArrowRight size={15} />
          </motion.button>
          <button className="btn-secondary" style={{ padding: '12px 20px' }}>
            <Clock size={14} /> Load Template
          </button>
        </div>
      </motion.div>
    </div>
  );
}
