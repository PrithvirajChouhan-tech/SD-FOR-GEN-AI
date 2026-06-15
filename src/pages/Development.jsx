import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Sparkles, GitBranch, FileText, Zap } from 'lucide-react';
import { Badge, ProgressBar } from '../components/ui/index.jsx';

const sprintTasks = [
  { id: 'DEV-001', title: 'Implement JWT authentication middleware', status: 'done', priority: 'critical', points: 5 },
  { id: 'DEV-002', title: 'Build product catalog API endpoints', status: 'done', priority: 'high', points: 8 },
  { id: 'DEV-003', title: 'Create order state machine', status: 'active', priority: 'high', points: 13 },
  { id: 'DEV-004', title: 'Integrate Stripe payment gateway', status: 'active', priority: 'critical', points: 13 },
  { id: 'DEV-005', title: 'Implement search with Elasticsearch', status: 'pending', priority: 'medium', points: 8 },
  { id: 'DEV-006', title: 'Build notification service', status: 'pending', priority: 'medium', points: 5 },
  { id: 'DEV-007', title: 'Set up Redis caching layer', status: 'pending', priority: 'high', points: 5 },
];

const columns = ['done', 'active', 'pending'];
const colMeta = { done: { label: 'Done', color: '#22C55E' }, active: { label: 'In Progress', color: '#2563EB' }, pending: { label: 'Backlog', color: '#94A3B8' } };

export default function Development() {
  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Development</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Sprint board, task tracking, and development progress</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Sparkles size={14} /> Generate Tasks</button>
            <button className="btn-primary"><Code2 size={14} /> New Task</button>
          </div>
        </div>
      </motion.div>

      {/* Sprint summary */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '18px 24px', marginBottom: 24, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Current Sprint</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk' }}>Sprint 4 — Core Features</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>June 9 – June 22, 2025</div>
        </div>
        <div style={{ flex: 1, maxWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#475569' }}>Sprint Progress</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>43%</span>
          </div>
          <ProgressBar value={43} color="#2563EB" />
        </div>
        {[
          { label: 'Story Points', value: '65/89' },
          { label: 'Tasks Done', value: '2/7' },
          { label: 'Days Left', value: '13' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Kanban board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {columns.map((col, ci) => {
          const meta = colMeta[col];
          const colTasks = sprintTasks.filter(t => t.status === col);
          return (
            <motion.div key={col} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{meta.label}</span>
                <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 'auto' }}>{colTasks.length}</span>
              </div>
              {colTasks.map(task => (
                <motion.div key={task.id} whileHover={{ translateY: -2 }} style={{
                  background: 'white', border: '1px solid #E2E8F0', borderRadius: 12,
                  padding: '14px 16px', marginBottom: 10, cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <code style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'JetBrains Mono' }}>{task.id}</code>
                    <Badge variant={task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'yellow' : 'blue'} size="sm">
                      {task.priority}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 10 }}>{task.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="gray" size="sm">⚡ {task.points} pts</Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
