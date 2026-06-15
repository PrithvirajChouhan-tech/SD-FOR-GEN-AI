import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, User, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '../components/ui/index.jsx';

const stories = [
  { id: 'US-001', title: 'User Login & Authentication', persona: 'Customer', priority: 'critical', points: 5, status: 'done', acceptance: ['User can log in with email/password', 'JWT token issued on success', 'Failed login shows error message'] },
  { id: 'US-002', title: 'Browse Product Catalog', persona: 'Customer', priority: 'high', points: 8, status: 'done', acceptance: ['Products displayed in grid', 'Filter by category & price', 'Search returns results < 200ms'] },
  { id: 'US-003', title: 'Add Items to Cart', persona: 'Customer', priority: 'high', points: 5, status: 'active', acceptance: ['Cart persists across sessions', 'Quantity adjustment works', 'Out-of-stock items blocked'] },
  { id: 'US-004', title: 'Checkout & Payment', persona: 'Customer', priority: 'critical', points: 13, status: 'active', acceptance: ['Stripe integration complete', 'Order confirmation email sent', 'Payment failure handled gracefully'] },
  { id: 'US-005', title: 'Manage Product Inventory', persona: 'Admin', priority: 'high', points: 8, status: 'pending', acceptance: ['Bulk import via CSV', 'Real-time stock updates', 'Low stock alerts triggered'] },
  { id: 'US-006', title: 'View Order Analytics', persona: 'Admin', priority: 'medium', points: 5, status: 'pending', acceptance: ['Revenue charts displayed', 'Export to CSV/PDF', 'Date range filtering'] },
];

const columns = [
  { id: 'done', label: 'Done', color: '#22C55E' },
  { id: 'active', label: 'In Progress', color: '#2563EB' },
  { id: 'pending', label: 'Backlog', color: '#94A3B8' },
];

// User Journey Flow SVG
function JourneyFlow() {
  const steps = [
    { label: 'Discovery', sub: 'Browse & Search', x: 50 },
    { label: 'Selection', sub: 'Product Detail', x: 165 },
    { label: 'Cart', sub: 'Add & Review', x: 280 },
    { label: 'Checkout', sub: 'Payment', x: 395 },
    { label: 'Confirmation', sub: 'Order Success', x: 510 },
  ];
  return (
    <svg viewBox="0 0 580 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      {steps.slice(0, -1).map((_, i) => (
        <line key={i} x1={steps[i].x + 42} y1={40} x2={steps[i + 1].x - 2} y2={40}
          stroke="#E2E8F0" strokeWidth={2} />
      ))}
      {steps.slice(0, -1).map((_, i) => (
        <polygon key={`a${i}`}
          points={`${steps[i + 1].x - 4},36 ${steps[i + 1].x + 4},40 ${steps[i + 1].x - 4},44`}
          fill="#CBD5E1" />
      ))}
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 2} y={16} width={80} height={48} rx={10}
            fill={i === 3 ? '#EFF6FF' : '#F8FAFC'} stroke={i === 3 ? '#2563EB' : '#E2E8F0'} strokeWidth={1.5} />
          <text x={s.x + 38} y={37} textAnchor="middle" fontSize={10} fontWeight={700}
            fill={i === 3 ? '#2563EB' : '#0F172A'} fontFamily="Space Grotesk">{s.label}</text>
          <text x={s.x + 38} y={53} textAnchor="middle" fontSize={9} fill="#94A3B8" fontFamily="Inter">{s.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  const priorityVariant = { critical: 'red', high: 'yellow', medium: 'blue', low: 'gray' };
  const personaColor = story.persona === 'Customer' ? '#2563EB' : '#8B5CF6';

  return (
    <motion.div whileHover={{ translateY: -2 }} style={{
      background: 'white', border: '1px solid #E2E8F0', borderRadius: 12,
      marginBottom: 10, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '14px 16px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{story.id}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <Badge variant={priorityVariant[story.priority]} size="sm">{story.priority}</Badge>
            <span style={{ padding: '2px 7px', borderRadius: 20, background: `${personaColor}12`, fontSize: 11, fontWeight: 600, color: personaColor }}>
              <User size={9} style={{ display: 'inline', marginRight: 3 }} />{story.persona}
            </span>
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
          As a {story.persona.toLowerCase()}, I want to {story.title.toLowerCase()}.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>Story Points: <strong style={{ color: '#0F172A' }}>{story.points}</strong></span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{story.acceptance.length} criteria</span>
        </div>
      </div>
      {expanded && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} style={{ borderTop: '1px solid #F1F5F9', padding: '10px 16px 14px', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Acceptance Criteria</div>
          {story.acceptance.map((ac, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
              <CheckCircle2 size={13} color="#22C55E" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#475569' }}>{ac}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function UserStories() {
  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>User Stories</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Agile user story board with acceptance criteria</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Sparkles size={14} /> Generate Stories</button>
            <button className="btn-primary"><Plus size={14} /> Add Story</button>
          </div>
        </div>
      </motion.div>

      {/* Journey Flow */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#0F172A' }}>Customer Journey Flow</div>
        <JourneyFlow />
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>6</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Total Epics</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>24</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>User Stories</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>89</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Story Points</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#22C55E', fontFamily: 'Space Grotesk' }}>72%</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Done</div>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {columns.map((col, ci) => (
          <motion.div key={col.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{col.label}</span>
              <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 'auto' }}>
                {stories.filter(s => s.status === col.id).length}
              </span>
            </div>
            <div>
              {stories.filter(s => s.status === col.id).map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
