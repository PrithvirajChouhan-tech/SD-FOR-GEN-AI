import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Sparkles, CheckCircle2, Circle, ArrowRight, Cloud } from 'lucide-react';
import { Badge, ProgressBar } from '../components/ui/index.jsx';

// CI/CD Pipeline SVG
function CICDPipeline() {
  const stages = [
    { label: 'Code Push', icon: '📝', color: '#2563EB', status: 'done' },
    { label: 'Unit Tests', icon: '🧪', color: '#8B5CF6', status: 'done' },
    { label: 'Build', icon: '🔨', color: '#22C55E', status: 'done' },
    { label: 'Docker Build', icon: '🐳', color: '#06B6D4', status: 'done' },
    { label: 'Deploy Staging', icon: '🚀', color: '#F59E0B', status: 'active' },
    { label: 'Integration Tests', icon: '⚡', color: '#EF4444', status: 'pending' },
    { label: 'Deploy Prod', icon: '🌐', color: '#22C55E', status: 'pending' },
  ];
  return (
    <svg viewBox="0 0 720 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="0" y="0" width="720" height="120" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {stages.map((s, i) => {
        const x = 50 + i * 96;
        return (
          <g key={s.label}>
            {i > 0 && (
              <>
                <line x1={x - 50} y1={52} x2={x - 14} y2={52} stroke={stages[i - 1].status === 'done' ? s.color : '#E2E8F0'} strokeWidth="2" />
                <polygon points={`${x - 16},48 ${x - 8},52 ${x - 16},56`} fill={stages[i - 1].status === 'done' ? s.color : '#E2E8F0'} />
              </>
            )}
            <circle cx={x} cy={52} r={s.status === 'active' ? 26 : 22}
              fill={s.status === 'done' ? `${s.color}15` : s.status === 'active' ? `${s.color}20` : '#F8FAFC'}
              stroke={s.status === 'pending' ? '#E2E8F0' : s.color}
              strokeWidth={s.status === 'active' ? 2.5 : 1.5}
              strokeDasharray={s.status === 'active' ? '4 2' : undefined} />
            <text x={x} y={57} textAnchor="middle" fontSize="16">{s.icon}</text>
            <text x={x} y={90} textAnchor="middle" fontSize="9" fontWeight="600"
              fill={s.status === 'pending' ? '#94A3B8' : s.color} fontFamily="Space Grotesk">{s.label}</text>
            {s.status === 'done' && <text x={x} y={105} textAnchor="middle" fontSize="8" fill="#22C55E" fontFamily="Inter">✓ passed</text>}
            {s.status === 'active' && <text x={x} y={105} textAnchor="middle" fontSize="8" fill={s.color} fontFamily="Inter">⟳ running</text>}
          </g>
        );
      })}
    </svg>
  );
}

// Cloud Architecture SVG
function CloudDiagram() {
  return (
    <svg viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="0" y="0" width="500" height="220" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Internet */}
      <ellipse cx="250" cy="30" rx="50" ry="20" fill="rgba(37,99,235,0.1)" stroke="#2563EB" strokeWidth="1.5" />
      <text x="250" y="34" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563EB" fontFamily="Space Grotesk">Internet</text>

      {/* Load Balancer */}
      <line x1="250" y1="50" x2="250" y2="70" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="190" y="70" width="120" height="28" rx="6" fill="rgba(139,92,246,0.1)" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="250" y="88" textAnchor="middle" fontSize="9" fontWeight="700" fill="#8B5CF6" fontFamily="Space Grotesk">Load Balancer</text>

      {/* K8s cluster */}
      <line x1="190" y1="84" x2="100" y2="114" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="250" y1="98" x2="250" y2="114" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="310" y1="84" x2="400" y2="114" stroke="#CBD5E1" strokeWidth="1.5" />

      {[
        { x: 50, y: 114, label: 'Pod 1', color: '#22C55E' },
        { x: 200, y: 114, label: 'Pod 2', color: '#22C55E' },
        { x: 350, y: 114, label: 'Pod 3', color: '#22C55E' },
      ].map(pod => (
        <g key={pod.label}>
          <rect x={pod.x} y={pod.y} width={90} height={28} rx="6" fill="rgba(34,197,94,0.08)" stroke="#22C55E" strokeWidth="1.5" />
          <text x={pod.x + 45} y={pod.y + 18} textAnchor="middle" fontSize="9" fontWeight="700" fill="#22C55E" fontFamily="Space Grotesk">{pod.label}</text>
        </g>
      ))}

      {/* DB + Cache */}
      <line x1="95" y1="142" x2="95" y2="165" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="245" y1="142" x2="245" y2="165" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="395" y1="142" x2="395" y2="165" stroke="#CBD5E1" strokeWidth="1.5" />

      {[
        { x: 50, y: 165, label: 'PostgreSQL', color: '#F59E0B' },
        { x: 200, y: 165, label: 'Redis Cache', color: '#EF4444' },
        { x: 350, y: 165, label: 'S3 Storage', color: '#06B6D4' },
      ].map(db => (
        <g key={db.label}>
          <rect x={db.x} y={db.y} width={90} height={28} rx="6" fill={`${db.color}10`} stroke={db.color} strokeWidth="1.5" />
          <text x={db.x + 45} y={db.y + 18} textAnchor="middle" fontSize="9" fontWeight="700" fill={db.color} fontFamily="Space Grotesk">{db.label}</text>
        </g>
      ))}

      {/* AWS label */}
      <rect x="10" y="105" width="480" height="120" rx="8" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="6 3" />
      <text x="20" y="120" fontSize="8" fontWeight="700" fill="#94A3B8" fontFamily="Space Grotesk" letterSpacing="1">AWS CLOUD</text>
    </svg>
  );
}

const dockerSteps = [
  'FROM node:20-alpine',
  'WORKDIR /app',
  'COPY package*.json ./',
  'RUN npm ci --only=production',
  'COPY . .',
  'RUN npm run build',
  'EXPOSE 3000',
  'CMD ["node", "dist/server.js"]',
];

export default function DevOps() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>DevOps</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>CI/CD pipelines, Docker, Kubernetes, and deployment strategies</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Sparkles size={14} /> Generate Setup</button>
            <button className="btn-primary"><Cloud size={14} /> Deploy Now</button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Deployments Today', value: '8', color: '#22C55E', trend: '↑' },
          { label: 'Pipeline Success Rate', value: '96%', color: '#2563EB', trend: '↑' },
          { label: 'Avg Deploy Time', value: '4.2m', color: '#8B5CF6', trend: '↓' },
          { label: 'Uptime (30d)', value: '99.97%', color: '#F59E0B', trend: '→' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {[
            { id: 'pipeline', label: 'CI/CD Pipeline' },
            { id: 'cloud', label: 'Cloud Architecture' },
            { id: 'docker', label: 'Docker Setup' },
            { id: 'k8s', label: 'Kubernetes' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {activeTab === 'pipeline' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>GitHub Actions Pipeline</div>
            <CICDPipeline />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { stage: 'Build & Test', time: '2m 14s', status: 'passed', color: '#22C55E' },
              { stage: 'Docker Image', time: '1m 47s', status: 'passed', color: '#22C55E' },
              { stage: 'Deploy Staging', time: 'running...', status: 'running', color: '#2563EB' },
            ].map(run => (
              <div key={run.stage} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{run.stage}</span>
                  <Badge variant={run.status === 'passed' ? 'green' : 'blue'}>{run.status}</Badge>
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>Duration: {run.time}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'cloud' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>AWS Cloud Architecture</div>
          <CloudDiagram />
          <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
            {['EC2 Auto-Scaling', 'RDS PostgreSQL', 'ElastiCache Redis', 'S3 + CloudFront', 'Route 53', 'WAF + Shield'].map(svc => (
              <span key={svc} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(37,99,235,0.08)', color: '#2563EB', fontSize: 12, fontWeight: 600 }}>{svc}</span>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'docker' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E293B', background: '#0F172A', display: 'flex', gap: 8 }}>
            {['#EF4444', '#F59E0B', '#22C55E'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>Dockerfile</span>
          </div>
          <div className="code-block" style={{ borderRadius: 0 }}>
            {dockerSteps.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '2px 0' }}>
                <span style={{ color: '#475569', userSelect: 'none', minWidth: 20, fontSize: 11 }}>{i + 1}</span>
                <span style={{ fontSize: 12, color: line.startsWith('FROM') || line.startsWith('RUN') || line.startsWith('COPY') || line.startsWith('WORKDIR') || line.startsWith('EXPOSE') || line.startsWith('CMD') ? '#7C3AED' : '#E2E8F0' }}>
                  {line.split(' ').map((word, wi) => (
                    <span key={wi} style={{ color: wi === 0 ? '#7C3AED' : wi === 1 ? '#06B6D4' : '#E2E8F0' }}>{word}{' '}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'k8s' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div className="code-block" style={{ borderRadius: 0 }}>
            <pre style={{ fontSize: 12, lineHeight: 1.8, color: '#E2E8F0' }}>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecommerce-api
  template:
    metadata:
      labels:
        app: ecommerce-api
    spec:
      containers:
      - name: api
        image: gcr.io/project/ecommerce-api:v2.1
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10`}</pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
