import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Link, CheckCircle2, AlertCircle, Shield, Users, Sparkles } from 'lucide-react';
import { Badge, ProgressBar } from '../components/ui/index.jsx';

const functionalReqs = [
  { id: 'FR-001', title: 'User Authentication', priority: 'critical', status: 'approved', category: 'Security', stakeholder: 'Product', linked: 3 },
  { id: 'FR-002', title: 'Multi-factor Authentication', priority: 'high', status: 'approved', category: 'Security', stakeholder: 'Security Team', linked: 2 },
  { id: 'FR-003', title: 'Dashboard Analytics', priority: 'high', status: 'review', category: 'Analytics', stakeholder: 'Business', linked: 5 },
  { id: 'FR-004', title: 'Real-time Notifications', priority: 'medium', status: 'approved', category: 'Communication', stakeholder: 'Product', linked: 1 },
  { id: 'FR-005', title: 'Payment Processing Integration', priority: 'critical', status: 'review', category: 'Finance', stakeholder: 'Finance', linked: 4 },
  { id: 'FR-006', title: 'Product Catalog Management', priority: 'high', status: 'draft', category: 'Inventory', stakeholder: 'Ops', linked: 2 },
  { id: 'FR-007', title: 'Order Management System', priority: 'critical', status: 'approved', category: 'Commerce', stakeholder: 'Business', linked: 6 },
  { id: 'FR-008', title: 'Search & Filtering', priority: 'medium', status: 'approved', category: 'UX', stakeholder: 'UX Team', linked: 2 },
];

const nfReqs = [
  { id: 'NFR-001', title: 'Response Time < 100ms', priority: 'critical', category: 'Performance', status: 'approved' },
  { id: 'NFR-002', title: '99.9% Uptime SLA', priority: 'critical', category: 'Reliability', status: 'approved' },
  { id: 'NFR-003', title: 'Support 10k Concurrent Users', priority: 'high', category: 'Scalability', status: 'review' },
  { id: 'NFR-004', title: 'GDPR Compliance', priority: 'critical', category: 'Compliance', status: 'approved' },
  { id: 'NFR-005', title: 'Mobile Responsive Design', priority: 'high', category: 'Usability', status: 'approved' },
];

const stakeholders = [
  { name: 'Product Manager', role: 'Product', count: 24, color: '#2563EB' },
  { name: 'Tech Lead', role: 'Engineering', count: 18, color: '#8B5CF6' },
  { name: 'Business Analyst', role: 'Business', count: 31, color: '#22C55E' },
  { name: 'Security Team', role: 'Security', count: 12, color: '#EF4444' },
  { name: 'UX Designer', role: 'Design', count: 15, color: '#F59E0B' },
  { name: 'Finance', role: 'Finance', count: 8, color: '#06B6D4' },
];

// Requirement Relationship Map SVG
function RequirementMap() {
  return (
    <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      {/* Center node */}
      <circle cx="250" cy="140" r="40" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
      <text x="250" y="136" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563EB" fontFamily="Space Grotesk">System</text>
      <text x="250" y="150" textAnchor="middle" fontSize="9" fill="#2563EB" fontFamily="Inter">Requirements</text>

      {/* Surrounding nodes */}
      {[
        { x: 80, y: 60, label: 'Security', color: '#EF4444', bg: '#FEF2F2' },
        { x: 420, y: 60, label: 'Performance', color: '#F59E0B', bg: '#FFFBEB' },
        { x: 80, y: 220, label: 'Usability', color: '#22C55E', bg: '#F0FDF4' },
        { x: 420, y: 220, label: 'Scalability', color: '#8B5CF6', bg: '#F5F3FF' },
        { x: 250, y: 30, label: 'Compliance', color: '#06B6D4', bg: '#ECFEFF' },
        { x: 250, y: 250, label: 'Business', color: '#EC4899', bg: '#FDF2F8' },
      ].map((n, i) => (
        <g key={i}>
          <line x1="250" y1="140" x2={n.x} y2={n.y} stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx={n.x} cy={n.y} r={28} fill={n.bg} stroke={n.color} strokeWidth="1.5" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={n.color} fontFamily="Space Grotesk">{n.label}</text>
        </g>
      ))}

      {/* Count labels on edges */}
      <text x="163" y="94" fontSize="9" fill="#94A3B8" fontFamily="Inter">12 reqs</text>
      <text x="320" y="85" fontSize="9" fill="#94A3B8" fontFamily="Inter">8 reqs</text>
      <text x="155" y="200" fontSize="9" fill="#94A3B8" fontFamily="Inter">15 reqs</text>
      <text x="315" y="200" fontSize="9" fill="#94A3B8" fontFamily="Inter">9 reqs</text>
    </svg>
  );
}

function ReqRow({ req }) {
  const priorityVariant = { critical: 'red', high: 'yellow', medium: 'blue', low: 'gray' };
  const statusVariant = { approved: 'green', review: 'yellow', draft: 'gray' };
  return (
    <tr>
      <td><span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#2563EB', fontWeight: 600 }}>{req.id}</span></td>
      <td><span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{req.title}</span></td>
      <td><Badge variant={priorityVariant[req.priority]}>{req.priority}</Badge></td>
      <td><Badge variant={statusVariant[req.status]}>{req.status}</Badge></td>
      <td><span style={{ fontSize: 12, color: '#94A3B8' }}>{req.category}</span></td>
      {req.stakeholder && <td><span style={{ fontSize: 12, color: '#475569' }}>{req.stakeholder}</span></td>}
      {req.linked !== undefined && (
        <td>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94A3B8' }}>
            <Link size={11} /> {req.linked} linked
          </span>
        </td>
      )}
    </tr>
  );
}

export default function Requirements() {
  const [activeTab, setActiveTab] = useState('functional');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Requirements</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Manage functional & non-functional requirements</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Filter size={14} /> Filter</button>
            <button className="btn-primary"><Plus size={14} /> Add Requirement</button>
          </div>
        </div>
      </motion.div>

      {/* Hero: Requirement Map */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ padding: 24, marginBottom: 24 }}
      >
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <RequirementMap />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Requirement Coverage</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>Stakeholder requirement map for E-Commerce Platform</p>
            {[
              { label: 'Functional Requirements', value: 91, color: '#2563EB' },
              { label: 'Non-Functional Requirements', value: 78, color: '#8B5CF6' },
              { label: 'Traceability Coverage', value: 84, color: '#22C55E' },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{m.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{m.value}%</span>
                </div>
                <ProgressBar value={m.value} color={m.color} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>124</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Total Reqs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#22C55E', fontFamily: 'Space Grotesk' }}>98</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Approved</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#F59E0B', fontFamily: 'Space Grotesk' }}>18</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>In Review</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#94A3B8', fontFamily: 'Space Grotesk' }}>8</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Drafts</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ marginBottom: 20 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {[
            { id: 'functional', label: 'Functional Requirements', count: 8 },
            { id: 'nonfunctional', label: 'Non-Functional', count: 5 },
            { id: 'stakeholders', label: 'Stakeholder Analysis', count: 6 },
            { id: 'traceability', label: 'Traceability Matrix', count: null },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}>
              {tab.label} {tab.count && <span style={{ background: '#E2E8F0', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Functional Requirements */}
      {activeTab === 'functional' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Functional Requirements</span>
            <div style={{ position: 'relative' }}>
              <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input" placeholder="Search..." style={{ paddingLeft: 30, height: 32, fontSize: 12, width: 200 }} />
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Requirement</th><th>Priority</th><th>Status</th><th>Category</th><th>Stakeholder</th><th>Links</th>
              </tr>
            </thead>
            <tbody>{functionalReqs.map(r => <ReqRow key={r.id} req={r} />)}</tbody>
          </table>
        </motion.div>
      )}

      {/* Non-Functional Requirements */}
      {activeTab === 'nonfunctional' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Non-Functional Requirements</span>
          </div>
          <table className="table">
            <thead><tr><th>ID</th><th>Requirement</th><th>Priority</th><th>Status</th><th>Category</th></tr></thead>
            <tbody>{nfReqs.map(r => <ReqRow key={r.id} req={r} />)}</tbody>
          </table>
        </motion.div>
      )}

      {/* Stakeholders */}
      {activeTab === 'stakeholders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {stakeholders.map(s => (
              <div key={s.name} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{s.name}</div>
                    <Badge variant="gray">{s.role}</Badge>
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.count}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>requirements contributed</div>
                <ProgressBar value={Math.round(s.count / 40 * 100)} color={s.color} style={{ marginTop: 10 }} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Traceability */}
      {activeTab === 'traceability' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 24, textAlign: 'center' }}>
          <Sparkles size={40} color="#2563EB" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Traceability Matrix</h3>
          <p style={{ color: '#94A3B8', marginBottom: 20 }}>Generate a complete requirement traceability matrix</p>
          <button className="btn-primary"><Sparkles size={14} /> Generate Traceability Matrix</button>
        </motion.div>
      )}
    </div>
  );
}
