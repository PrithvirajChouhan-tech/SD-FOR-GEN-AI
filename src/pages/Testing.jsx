import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube2, Sparkles, CheckCircle2, XCircle, Clock, BarChart3 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Badge, ProgressBar } from '../components/ui/index.jsx';

const testTypes = [
  { id: 'unit', label: 'Unit Tests', count: 847, pass: 821, fail: 26, coverage: 87 },
  { id: 'integration', label: 'Integration Tests', count: 234, pass: 220, fail: 14, coverage: 79 },
  { id: 'system', label: 'System Tests', count: 89, pass: 82, fail: 7, coverage: 92 },
  { id: 'acceptance', label: 'Acceptance Tests', count: 67, pass: 61, fail: 6, coverage: 91 },
  { id: 'boundary', label: 'Boundary Value', count: 156, pass: 148, fail: 8, coverage: 85 },
];

const radarData = [
  { subject: 'Unit Tests', value: 87 },
  { subject: 'Integration', value: 79 },
  { subject: 'System', value: 92 },
  { subject: 'Acceptance', value: 91 },
  { subject: 'Performance', value: 76 },
  { subject: 'Security', value: 88 },
];

const moduleData = [
  { module: 'Auth', covered: 95, uncovered: 5 },
  { module: 'Products', covered: 82, uncovered: 18 },
  { module: 'Orders', covered: 78, uncovered: 22 },
  { module: 'Payments', covered: 91, uncovered: 9 },
  { module: 'Users', covered: 87, uncovered: 13 },
];

const testCases = [
  { id: 'TC-001', name: 'User Login with valid credentials', type: 'Unit', status: 'pass', duration: '12ms' },
  { id: 'TC-002', name: 'User Login with invalid password', type: 'Unit', status: 'pass', duration: '8ms' },
  { id: 'TC-003', name: 'Product search with empty query', type: 'Unit', status: 'fail', duration: '45ms' },
  { id: 'TC-004', name: 'Order creation end-to-end flow', type: 'Integration', status: 'pass', duration: '234ms' },
  { id: 'TC-005', name: 'Payment processing - Stripe webhook', type: 'Integration', status: 'pass', duration: '189ms' },
  { id: 'TC-006', name: 'Load test - 1000 concurrent users', type: 'System', status: 'pass', duration: '2.4s' },
  { id: 'TC-007', name: 'XSS injection in product name', type: 'Security', status: 'pass', duration: '23ms' },
  { id: 'TC-008', name: 'SQL injection in search field', type: 'Security', status: 'fail', duration: '18ms' },
];

export default function Testing() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalTests = testTypes.reduce((a, b) => a + b.count, 0);
  const totalPass = testTypes.reduce((a, b) => a + b.pass, 0);
  const overallCoverage = Math.round(testTypes.reduce((a, b) => a + b.coverage, 0) / testTypes.length);

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Testing</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Comprehensive test suite management and coverage analytics</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Sparkles size={14} /> Generate Tests</button>
            <button className="btn-primary"><TestTube2 size={14} /> Run All Tests</button>
          </div>
        </div>
      </motion.div>

      {/* Coverage Hero Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 20, textAlign: 'center', borderTop: '3px solid #22C55E' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#22C55E', fontFamily: 'Space Grotesk' }}>{overallCoverage}%</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Overall Coverage</div>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ padding: 20, textAlign: 'center', borderTop: '3px solid #2563EB' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#2563EB', fontFamily: 'Space Grotesk' }}>{totalTests.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Total Tests</div>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: 20, textAlign: 'center', borderTop: '3px solid #22C55E' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#22C55E', fontFamily: 'Space Grotesk' }}>{totalPass}</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Passing</div>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ padding: 20, textAlign: 'center', borderTop: '3px solid #EF4444' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#EF4444', fontFamily: 'Space Grotesk' }}>{totalTests - totalPass}</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Failing</div>
        </motion.div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20, marginBottom: 24 }}>
        <motion.div className="card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Coverage Radar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter' }} />
              <Radar dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Module Coverage</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={moduleData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="module" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="covered" fill="#22C55E" radius={[6, 6, 0, 0]} name="Covered %" />
              <Bar dataKey="uncovered" fill="#FEE2E2" radius={[6, 6, 0, 0]} name="Uncovered %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Test Type Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {testTypes.map((t, i) => (
          <motion.div key={t.id} className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{t.label}</div>
            <ProgressBar value={t.coverage} color="#22C55E" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: '#22C55E' }}>✓ {t.pass}</span>
              <span style={{ fontSize: 11, color: '#EF4444' }}>✗ {t.fail}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Test Cases Table */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Recent Test Runs</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Test Case</th><th>Type</th><th>Status</th><th>Duration</th></tr>
          </thead>
          <tbody>
            {testCases.map(tc => (
              <tr key={tc.id}>
                <td><code style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94A3B8' }}>{tc.id}</code></td>
                <td><span style={{ fontSize: 13, color: '#0F172A' }}>{tc.name}</span></td>
                <td><Badge variant="blue" size="sm">{tc.type}</Badge></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {tc.status === 'pass'
                      ? <CheckCircle2 size={14} color="#22C55E" />
                      : <XCircle size={14} color="#EF4444" />}
                    <Badge variant={tc.status === 'pass' ? 'green' : 'red'} size="sm">{tc.status}</Badge>
                  </div>
                </td>
                <td><code style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#475569' }}>{tc.duration}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
