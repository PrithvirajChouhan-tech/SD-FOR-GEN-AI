import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Grid, List, MoreHorizontal, Users, Calendar,
  TrendingUp, Star, Folder, CheckCircle2, Clock, Activity
} from 'lucide-react';
import { Badge, ProgressBar, StatusDot } from '../components/ui/index.jsx';

const templates = [
  { id: 1, name: 'SaaS Platform', desc: 'Multi-tenant cloud application', icon: '☁️', color: '#2563EB' },
  { id: 2, name: 'Mobile App', desc: 'iOS & Android application', icon: '📱', color: '#8B5CF6' },
  { id: 3, name: 'E-Commerce', desc: 'Online retail platform', icon: '🛒', color: '#22C55E' },
  { id: 4, name: 'API Platform', desc: 'RESTful & GraphQL services', icon: '🔌', color: '#F59E0B' },
  { id: 5, name: 'Healthcare App', desc: 'Medical management system', icon: '🏥', color: '#06B6D4' },
  { id: 6, name: 'FinTech App', desc: 'Financial technology platform', icon: '💳', color: '#EF4444' },
];

const projects = [
  {
    id: 1, name: 'E-Commerce Platform', status: 'active', progress: 67,
    team: ['A', 'B', 'C'], lastUpdated: '2 hours ago', stage: 'Architecture Design',
    requirements: 124, diagrams: 18, color: '#2563EB', starred: true,
  },
  {
    id: 2, name: 'Healthcare Management App', status: 'active', progress: 42,
    team: ['D', 'E'], lastUpdated: '5 hours ago', stage: 'SRS Document',
    requirements: 87, diagrams: 9, color: '#22C55E', starred: false,
  },
  {
    id: 3, name: 'FinTech Dashboard', status: 'review', progress: 89,
    team: ['F', 'G', 'H', 'I'], lastUpdated: '1 day ago', stage: 'Testing',
    requirements: 156, diagrams: 31, color: '#F59E0B', starred: true,
  },
  {
    id: 4, name: 'Logistics Tracking System', status: 'pending', progress: 15,
    team: ['J'], lastUpdated: '3 days ago', stage: 'Requirements',
    requirements: 34, diagrams: 4, color: '#8B5CF6', starred: false,
  },
  {
    id: 5, name: 'AI Content Platform', status: 'active', progress: 55,
    team: ['K', 'L', 'M'], lastUpdated: '12 hours ago', stage: 'API Design',
    requirements: 98, diagrams: 22, color: '#06B6D4', starred: false,
  },
  {
    id: 6, name: 'EdTech Learning Suite', status: 'pending', progress: 8,
    team: ['N', 'O'], lastUpdated: '1 week ago', stage: 'Ideation',
    requirements: 12, diagrams: 1, color: '#EF4444', starred: false,
  },
];

const avatarColors = ['#2563EB','#8B5CF6','#22C55E','#F59E0B','#06B6D4','#EF4444','#EC4899','#14B8A6','#6366F1','#0EA5E9','#84CC16','#A78BFA','#FB923C','#34D399'];

function ProjectCard({ project }) {
  const [starred, setStarred] = useState(project.starred);
  const statusMap = { active: 'green', review: 'yellow', pending: 'gray' };

  return (
    <motion.div
      className="card"
      whileHover={{ translateY: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
      style={{ padding: 24, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: project.color, borderRadius: '16px 16px 0 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${project.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Folder size={18} color={project.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>{project.name}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{project.lastUpdated}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setStarred(!starred)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Star size={15} color={starred ? '#F59E0B' : '#94A3B8'} fill={starred ? '#F59E0B' : 'none'} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <MoreHorizontal size={15} color="#94A3B8" />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <Badge variant={statusMap[project.status]}>
          <StatusDot status={project.status === 'active' ? 'active' : project.status === 'review' ? 'pending' : 'inactive'} />
          {project.status}
        </Badge>
        <Badge variant="gray">{project.stage}</Badge>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>Overall Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} color={project.color} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>📋 {project.requirements} reqs</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>📊 {project.diagrams} diagrams</span>
        </div>
        <div style={{ display: 'flex' }}>
          {project.team.map((t, i) => (
            <div key={i} style={{
              width: 24, height: 24, borderRadius: '50%',
              background: avatarColors[t.charCodeAt(0) % avatarColors.length],
              border: '2px solid white', marginLeft: i === 0 ? 0 : -6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: 'white',
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [view, setView] = useState('grid');
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="page-content">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Projects</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Manage your software engineering projects</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={() => setShowTemplates(!showTemplates)}>
              <Folder size={14} /> Templates
            </button>
            <button className="btn-primary">
              <Plus size={14} /> New Project
            </button>
          </div>
        </div>
      </motion.div>

      {/* Templates */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 24, overflow: 'hidden' }}
          >
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 14 }}>Project Templates</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                {templates.map(t => (
                  <motion.div key={t.id} whileHover={{ scale: 1.04 }} style={{
                    padding: '14px 12px', borderRadius: 12, border: `1px solid ${t.color}20`,
                    background: `${t.color}06`, cursor: 'pointer', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{t.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Projects', value: '12', icon: Folder, color: '#2563EB' },
          { label: 'Active', value: '8', icon: Activity, color: '#22C55E' },
          { label: 'In Review', value: '2', icon: Clock, color: '#F59E0B' },
          { label: 'Team Members', value: '24', icon: Users, color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={17} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk', color: '#0F172A' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" placeholder="Search projects..." style={{ paddingLeft: 34, fontSize: 13, height: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10 }}>
          {[{ id: 'grid', Icon: Grid }, { id: 'list', Icon: List }].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: view === v.id ? 'white' : 'transparent',
              boxShadow: view === v.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
              <v.Icon size={15} color={view === v.id ? '#0F172A' : '#94A3B8'} />
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {projects.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
