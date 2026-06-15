import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Upload, Sparkles, Code2, FileText, AlertTriangle, TrendingUp, GitCommit } from 'lucide-react';
import { Badge, ProgressBar } from '../components/ui/index.jsx';

// Dependency Graph SVG
function DependencyGraph() {
  const nodes = [
    { label: 'App', x: 250, y: 30, color: '#2563EB', size: 32 },
    { label: 'Auth', x: 100, y: 110, color: '#8B5CF6', size: 26 },
    { label: 'API', x: 250, y: 110, color: '#22C55E', size: 26 },
    { label: 'DB', x: 400, y: 110, color: '#F59E0B', size: 26 },
    { label: 'Utils', x: 50, y: 200, color: '#06B6D4', size: 22 },
    { label: 'Middleware', x: 170, y: 200, color: '#EF4444', size: 22 },
    { label: 'Models', x: 320, y: 200, color: '#EC4899', size: 22 },
    { label: 'Routes', x: 450, y: 200, color: '#6366F1', size: 22 },
    { label: 'Config', x: 250, y: 280, color: '#14B8A6', size: 20 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 5], [2, 7], [3, 6], [3, 7], [5, 8], [6, 8],
  ];
  return (
    <svg viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="0" y="0" width="500" height="320" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#CBD5E1" strokeWidth="1.5" />
      ))}
      {nodes.map(n => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={n.size} fill={`${n.color}15`} stroke={n.color} strokeWidth="2" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={n.color} fontFamily="Space Grotesk">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

const analysisResults = [
  { category: 'Code Quality', score: 87, color: '#22C55E', issues: 12 },
  { category: 'Security', score: 79, color: '#F59E0B', issues: 8 },
  { category: 'Performance', score: 91, color: '#2563EB', issues: 4 },
  { category: 'Maintainability', score: 82, color: '#8B5CF6', issues: 15 },
  { category: 'Documentation', score: 65, color: '#EF4444', issues: 23 },
];

const codeIssues = [
  { file: 'src/auth/authController.js', line: 47, severity: 'error', message: 'Unchecked promise rejection in login handler', type: 'Bug' },
  { file: 'src/products/productService.js', line: 123, severity: 'warning', message: 'N+1 query detected in getProducts()', type: 'Performance' },
  { file: 'src/utils/encryption.js', line: 18, severity: 'error', message: 'MD5 hashing detected — use bcrypt instead', type: 'Security' },
  { file: 'src/middleware/auth.js', line: 34, severity: 'warning', message: 'JWT verification missing expiry check', type: 'Security' },
  { file: 'src/config/database.js', line: 8, severity: 'info', message: 'Connection pool size should be configured', type: 'Config' },
];

const recentCommits = [
  { hash: 'a3f8c2d', message: 'feat: Add multi-factor authentication', author: 'Zenith', time: '2h ago' },
  { hash: 'b7e4a19', message: 'fix: Resolve N+1 query in products', author: 'Dev Team', time: '5h ago' },
  { hash: 'c1d5f82', message: 'docs: Update API documentation', author: 'AI Assistant', time: '1d ago' },
];

export default function RepositoryAnalyzer() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/company/ecommerce-platform');
  const [analyzed, setAnalyzed] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Repository Analyzer</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Deep code intelligence and architecture analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>GitHub Repository URL</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <GitBranch size={14} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} style={{ paddingLeft: 34, fontSize: 13, height: 40 }} />
              </div>
              <button className="btn-primary" onClick={() => setAnalyzing(true)} style={{ padding: '8px 16px', fontSize: 13 }}>
                <Sparkles size={14} /> Analyze
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 500 }}>or</div>
          <div style={{
            border: '2px dashed #E2E8F0', borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
            background: '#F8FAFC', transition: 'all 0.15s ease',
          }}>
            <Upload size={20} color="#94A3B8" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Drop ZIP file here</div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>or click to browse</div>
          </div>
        </div>
      </motion.div>

      {analyzed && (
        <>
          {/* Summary Banner */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              padding: '16px 24px', borderRadius: 14, background: 'rgba(37,99,235,0.05)',
              border: '1px solid rgba(37,99,235,0.15)', marginBottom: 20,
              display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap',
            }}>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Repository</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: 'JetBrains Mono' }}>ecommerce-platform</div>
            </div>
            {[
              { label: 'Files', value: '284' },
              { label: 'Lines of Code', value: '47,821' },
              { label: 'Languages', value: 'JS, TS, CSS' },
              { label: 'Dependencies', value: '89' },
              { label: 'Last Commit', value: '2h ago' },
              { label: 'Issues Found', value: '62', highlight: true },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.highlight ? '#EF4444' : '#0F172A', fontFamily: s.value.includes(',') ? 'Inter' : 'Space Grotesk' }}>{s.value}</div>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div style={{ marginBottom: 16 }}>
            <div className="tab-list" style={{ display: 'inline-flex' }}>
              {[{ id: 'overview', label: 'Overview' }, { id: 'deps', label: 'Dependencies' }, { id: 'issues', label: 'Issues (62)' }, { id: 'commits', label: 'Commits' }].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}>{t.label}</button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Quality Scores */}
                <div className="card" style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Code Quality Analysis</h2>
                  {analysisResults.map(r => (
                    <div key={r.category} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{r.category}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>{r.issues} issues</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.score}%</span>
                        </div>
                      </div>
                      <ProgressBar value={r.score} color={r.color} />
                    </div>
                  ))}
                </div>
                {/* Dependency Graph */}
                <div className="card" style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Dependency Graph</h2>
                  <DependencyGraph />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'issues' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Code Issues & Recommendations</span>
              </div>
              {codeIssues.map((issue, i) => (
                <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: issue.severity === 'error' ? '#EF4444' : issue.severity === 'warning' ? '#F59E0B' : '#06B6D4',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>{issue.message}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <code style={{ fontSize: 11, color: '#8B5CF6', fontFamily: 'JetBrains Mono' }}>{issue.file}:{issue.line}</code>
                      <Badge variant={issue.severity === 'error' ? 'red' : issue.severity === 'warning' ? 'yellow' : 'cyan'} size="sm">{issue.severity}</Badge>
                      <Badge variant="gray" size="sm">{issue.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'commits' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
              {recentCommits.map((commit, i) => (
                <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <GitCommit size={16} color="#94A3B8" />
                  <code style={{ fontSize: 11, color: '#8B5CF6', fontFamily: 'JetBrains Mono', minWidth: 60 }}>{commit.hash}</code>
                  <span style={{ fontSize: 13, color: '#0F172A', flex: 1 }}>{commit.message}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{commit.author}</span>
                  <span style={{ fontSize: 11, color: '#CBD5E1' }}>{commit.time}</span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'deps' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 24 }}>
              <DependencyGraph />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 20 }}>
                {['react@18.2', 'express@4.18', 'prisma@5.0', 'stripe@12.0', 'jest@29.0', 'tailwindcss@3.3', 'zod@3.22', 'jwt@9.0'].map(dep => (
                  <div key={dep} style={{ padding: '8px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'JetBrains Mono', color: '#475569' }}>
                    {dep}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
