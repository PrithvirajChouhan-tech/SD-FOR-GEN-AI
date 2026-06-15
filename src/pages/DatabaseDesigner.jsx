import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Sparkles, Download, Code2 } from 'lucide-react';
import { Badge } from '../components/ui/index.jsx';

// ER Diagram SVG
function ERDiagram() {
  const entities = [
    { name: 'users', x: 40, y: 100, color: '#2563EB', attrs: ['id PK', 'email', 'name', 'role', 'created_at'] },
    { name: 'products', x: 240, y: 30, color: '#8B5CF6', attrs: ['id PK', 'name', 'price', 'stock', 'category_id FK'] },
    { name: 'orders', x: 440, y: 100, color: '#22C55E', attrs: ['id PK', 'user_id FK', 'total', 'status', 'created_at'] },
    { name: 'categories', x: 240, y: 220, color: '#F59E0B', attrs: ['id PK', 'name', 'parent_id FK'] },
    { name: 'order_items', x: 440, y: 230, color: '#06B6D4', attrs: ['id PK', 'order_id FK', 'product_id FK', 'qty', 'price'] },
    { name: 'payments', x: 640, y: 100, color: '#EF4444', attrs: ['id PK', 'order_id FK', 'amount', 'method', 'status'] },
  ];

  const relationships = [
    { x1: 160, y1: 140, x2: 240, y2: 90, label: '1:N' },
    { x1: 360, y1: 90, x2: 440, y2: 130, label: 'N:M' },
    { x1: 360, y1: 260, x2: 440, y2: 250, label: '1:N' },
    { x1: 560, y1: 150, x2: 640, y2: 130, label: '1:1' },
    { x1: 160, y1: 180, x2: 240, y2: 240, label: '1:N' },
  ];

  return (
    <svg viewBox="0 0 800 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="0" y="0" width="800" height="340" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {relationships.map((rel, i) => (
        <g key={i}>
          <line x1={rel.x1} y1={rel.y1} x2={rel.x2} y2={rel.y2} stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x={(rel.x1 + rel.x2) / 2 - 12} y={(rel.y1 + rel.y2) / 2 - 9} width={24} height={16} rx="4" fill="white" stroke="#E2E8F0" strokeWidth="1" />
          <text x={(rel.x1 + rel.x2) / 2} y={(rel.y1 + rel.y2) / 2 + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill="#94A3B8" fontFamily="Space Grotesk">{rel.label}</text>
        </g>
      ))}
      {entities.map(ent => (
        <g key={ent.name}>
          {/* Header */}
          <rect x={ent.x} y={ent.y} width={150} height={22} rx="6" fill={ent.color} />
          <rect x={ent.x} y={ent.y + 16} width={150} height={6} fill={ent.color} />
          <text x={ent.x + 75} y={ent.y + 15} textAnchor="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="Space Grotesk">{ent.name}</text>
          {/* Body */}
          <rect x={ent.x} y={ent.y + 22} width={150} height={ent.attrs.length * 20 + 6} rx="0" fill="white" stroke={`${ent.color}40`} strokeWidth="1.5" />
          <rect x={ent.x} y={ent.y + 22 + ent.attrs.length * 20 + 6 - 6} width={150} height={6} rx="6" fill="white" stroke={`${ent.color}40`} strokeWidth="1.5" />
          {ent.attrs.map((attr, i) => (
            <g key={attr}>
              {i > 0 && <line x1={ent.x} y1={ent.y + 22 + i * 20} x2={ent.x + 150} y2={ent.y + 22 + i * 20} stroke="#F1F5F9" strokeWidth="1" />}
              {attr.includes('PK') && <text x={ent.x + 8} y={ent.y + 36 + i * 20} fontSize="8" fill="#F59E0B" fontFamily="JetBrains Mono">🔑</text>}
              {attr.includes('FK') && <text x={ent.x + 8} y={ent.y + 36 + i * 20} fontSize="8" fill="#06B6D4" fontFamily="JetBrains Mono">🔗</text>}
              <text x={ent.x + (attr.includes('PK') || attr.includes('FK') ? 22 : 10)} y={ent.y + 36 + i * 20}
                fontSize="9" fill={attr.includes('PK') ? '#0F172A' : '#475569'}
                fontWeight={attr.includes('PK') ? 700 : 400} fontFamily="JetBrains Mono">{attr.replace(' PK', '').replace(' FK', '')}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

const sqlCode = `-- Generated SQL Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('customer','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','processing','shipped','delivered','cancelled'),
  created_at TIMESTAMP DEFAULT NOW()
);`;

export default function DatabaseDesigner() {
  const [activeTab, setActiveTab] = useState('er');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Database Designer</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>ER diagrams, schema design, and SQL generation</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Download size={14} /> Export SQL</button>
            <button className="btn-primary"><Sparkles size={14} /> Generate Schema</button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Tables', value: '18', color: '#2563EB' },
          { label: 'Relationships', value: '24', color: '#8B5CF6' },
          { label: 'Indexes', value: '36', color: '#22C55E' },
          { label: 'Stored Procedures', value: '12', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {[
            { id: 'er', label: 'ER Diagram' },
            { id: 'schema', label: 'Schema Tables' },
            { id: 'sql', label: 'SQL Output' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'er' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Entity-Relationship Diagram</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Auto-generated from project requirements</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge variant="green">AI Generated</Badge>
              <Badge variant="blue">PostgreSQL</Badge>
            </div>
          </div>
          <ERDiagram />
          <div style={{ display: 'flex', gap: 20, marginTop: 14, fontSize: 11, color: '#94A3B8' }}>
            <span>🔑 Primary Key</span>
            <span>🔗 Foreign Key</span>
            <span style={{ borderBottom: '1px solid #CBD5E1', paddingBottom: 2 }}>1:N — One to Many</span>
            <span style={{ borderBottom: '2px dashed #CBD5E1', paddingBottom: 2 }}>N:M — Many to Many</span>
          </div>
        </motion.div>
      )}

      {activeTab === 'schema' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {['users', 'products', 'orders', 'categories', 'order_items', 'payments'].map((table, i) => (
              <div key={table} className="card" style={{ padding: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Database size={15} color="#2563EB" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'JetBrains Mono' }}>{table}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{[5, 5, 5, 3, 5, 5][i]} columns · {[12400, 8900, 34200, 48, 89200, 34100][i].toLocaleString()} rows est.</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Badge variant="yellow" size="sm">PK: id</Badge>
                  <Badge variant="blue" size="sm">indexed</Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'sql' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            </div>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>schema.sql</span>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}><Code2 size={11} /> Copy</button>
          </div>
          <div className="code-block" style={{ borderRadius: 0, padding: 28 }}>
            <pre style={{ fontSize: 12, lineHeight: 1.8, color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
              {sqlCode.split('\n').map((line, i) => {
                const keyword = line.match(/^(CREATE TABLE|CREATE INDEX|INSERT|ALTER TABLE|PRIMARY KEY|REFERENCES|DEFAULT|NOT NULL|UNIQUE|TIMESTAMP|UUID|VARCHAR|INTEGER|DECIMAL|BOOLEAN|ENUM)/);
                if (keyword) {
                  return <span key={i}><span style={{ color: '#7C3AED' }}>{keyword[1]}</span>{line.slice(keyword[1].length)}{'\n'}</span>;
                }
                if (line.includes('--')) return <span key={i} style={{ color: '#64748B' }}>{line}{'\n'}</span>;
                return <span key={i}>{line}{'\n'}</span>;
              })}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
