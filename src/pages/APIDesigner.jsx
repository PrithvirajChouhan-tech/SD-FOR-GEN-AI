import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Plus, Sparkles, ChevronRight, Lock, Zap } from 'lucide-react';
import { Badge } from '../components/ui/index.jsx';

const endpoints = [
  { method: 'POST', path: '/api/v1/auth/login', desc: 'User authentication', auth: false, status: 'stable' },
  { method: 'POST', path: '/api/v1/auth/register', desc: 'User registration', auth: false, status: 'stable' },
  { method: 'GET', path: '/api/v1/products', desc: 'List all products with filtering', auth: false, status: 'stable' },
  { method: 'GET', path: '/api/v1/products/:id', desc: 'Get product by ID', auth: false, status: 'stable' },
  { method: 'POST', path: '/api/v1/products', desc: 'Create new product (Admin)', auth: true, status: 'stable' },
  { method: 'PUT', path: '/api/v1/products/:id', desc: 'Update product details', auth: true, status: 'stable' },
  { method: 'DELETE', path: '/api/v1/products/:id', desc: 'Delete product', auth: true, status: 'stable' },
  { method: 'GET', path: '/api/v1/orders', desc: 'List user orders', auth: true, status: 'stable' },
  { method: 'POST', path: '/api/v1/orders', desc: 'Create new order', auth: true, status: 'beta' },
  { method: 'POST', path: '/api/v1/payments/charge', desc: 'Process payment via Stripe', auth: true, status: 'beta' },
  { method: 'GET', path: '/api/v1/analytics/dashboard', desc: 'Get analytics data', auth: true, status: 'beta' },
];

const methodColors = {
  GET: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
  POST: { bg: 'rgba(37,99,235,0.1)', color: '#2563EB' },
  PUT: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  DELETE: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  PATCH: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
};

// API Flow Diagram SVG
function APIFlowDiagram() {
  return (
    <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="0" y="0" width="600" height="200" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Steps */}
      {[
        { label: 'Client', sub: 'Web / Mobile', x: 50, color: '#2563EB' },
        { label: 'API Gateway', sub: 'Rate Limit + Auth', x: 170, color: '#8B5CF6' },
        { label: 'Load Balancer', sub: 'Round Robin', x: 290, color: '#22C55E' },
        { label: 'Services', sub: 'Microservices', x: 410, color: '#F59E0B' },
        { label: 'Database', sub: 'PostgreSQL', x: 520, color: '#06B6D4' },
      ].map((node, i, arr) => (
        <g key={node.label}>
          <rect x={node.x - 45} y={70} width={90} height={56} rx="10"
            fill="white" stroke={node.color} strokeWidth="1.5" />
          <text x={node.x} y={96} textAnchor="middle" fontSize="10" fontWeight="700" fill={node.color} fontFamily="Space Grotesk">{node.label}</text>
          <text x={node.x} y={112} textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="Inter">{node.sub}</text>
          {i < arr.length - 1 && (
            <>
              <line x1={node.x + 45} y1={98} x2={arr[i + 1].x - 45} y2={98} stroke="#CBD5E1" strokeWidth="1.5" />
              <polygon points={`${arr[i + 1].x - 47},94 ${arr[i + 1].x - 39},98 ${arr[i + 1].x - 47},102`} fill="#CBD5E1" />
              {/* Return arrow */}
              <line x1={arr[i + 1].x - 45} y1={108} x2={node.x + 45} y2={108} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 2" />
            </>
          )}
        </g>
      ))}
      {/* Labels */}
      <text x="110" y={90} textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="JetBrains Mono">JWT</text>
      <text x="230" y={90} textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="JetBrains Mono">HTTP</text>
      <text x="350" y={90} textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="JetBrains Mono">gRPC</text>
      <text x="465" y={90} textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="JetBrains Mono">SQL</text>
    </svg>
  );
}

export default function APIDesigner() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('rest');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>API Designer</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Design, document, and visualize REST APIs and GraphQL schemas</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Sparkles size={14} /> Generate APIs</button>
            <button className="btn-primary"><Plus size={14} /> Add Endpoint</button>
          </div>
        </div>
      </motion.div>

      {/* API Flow */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>API Request Flow</h2>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>End-to-end API request lifecycle</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Badge variant="green">REST v1.0</Badge>
            <Badge variant="cyan">OpenAPI 3.0</Badge>
          </div>
        </div>
        <APIFlowDiagram />
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Endpoints', value: '47', color: '#2563EB' },
          { label: 'Secured (JWT)', value: '38', color: '#22C55E' },
          { label: 'Avg Response', value: '48ms', color: '#8B5CF6' },
          { label: 'Uptime SLA', value: '99.9%', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={16} color={s.color} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Endpoint List */}
      <div style={{ marginBottom: 14 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {[{ id: 'rest', label: 'REST Endpoints' }, { id: 'graphql', label: 'GraphQL Schema' }, { id: 'swagger', label: 'Swagger Docs' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {activeTab === 'rest' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>REST API Endpoints</span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>{endpoints.length} endpoints · Base: /api/v1</span>
          </div>
          {endpoints.map((ep, i) => {
            const mc = methodColors[ep.method] || methodColors.GET;
            return (
              <motion.div key={i} whileHover={{ backgroundColor: '#F8FAFC' }} onClick={() => setSelected(selected === i ? null : i)} style={{
                padding: '13px 20px', borderBottom: '1px solid #F1F5F9',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: mc.bg, color: mc.color, fontFamily: 'JetBrains Mono', minWidth: 55, textAlign: 'center' }}>
                  {ep.method}
                </span>
                <code style={{ fontSize: 12, color: '#0F172A', flex: 1, fontFamily: 'JetBrains Mono' }}>{ep.path}</code>
                <span style={{ fontSize: 12, color: '#94A3B8', flex: 1 }}>{ep.desc}</span>
                {ep.auth && <Lock size={13} color="#94A3B8" />}
                <Badge variant={ep.status === 'stable' ? 'green' : 'yellow'} size="sm">{ep.status}</Badge>
                <ChevronRight size={14} color="#94A3B8" />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {activeTab === 'graphql' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ overflow: 'hidden' }}>
          <div className="code-block" style={{ borderRadius: 0 }}>
            <pre style={{ fontSize: 12, lineHeight: 1.8, color: '#E2E8F0' }}>{`type Query {
  products(
    category: String
    minPrice: Float
    maxPrice: Float
    search: String
    limit: Int = 20
    offset: Int = 0
  ): ProductConnection!
  
  product(id: ID!): Product
  
  orders(
    userId: ID!
    status: OrderStatus
  ): [Order!]!
  
  user(id: ID!): User
}

type Mutation {
  createOrder(input: OrderInput!): Order!
  processPayment(orderId: ID!, method: PaymentMethod!): Payment!
  updateProduct(id: ID!, input: ProductInput!): Product!
}

type Product {
  id: ID!
  name: String!
  price: Float!
  stock: Int!
  category: Category!
  images: [String!]!
}`}</pre>
          </div>
        </motion.div>
      )}

      {activeTab === 'swagger' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 24, textAlign: 'center' }}>
          <Globe size={48} color="#2563EB" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Swagger Documentation</h3>
          <p style={{ color: '#94A3B8', marginBottom: 20 }}>Interactive API documentation with try-it-out functionality</p>
          <button className="btn-primary"><Globe size={14} /> Open Swagger UI</button>
        </motion.div>
      )}
    </div>
  );
}
