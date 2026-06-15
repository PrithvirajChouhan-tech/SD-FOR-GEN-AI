import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, Layers, GitBranch, Server, Database, Globe } from 'lucide-react';
import { Badge } from '../components/ui/index.jsx';

// Architecture Blueprint SVG
function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      {/* Background zones */}
      <rect x="10" y="10" width="580" height="300" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Client Layer */}
      <rect x="20" y="20" width="560" height="50" rx="8" fill="rgba(37,99,235,0.05)" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="30" y="36" fontSize="9" fontWeight="700" fill="#2563EB" fontFamily="Space Grotesk" letterSpacing="1">CLIENT LAYER</text>
      <rect x="60" y="40" width="80" height="24" rx="6" fill="white" stroke="#2563EB" strokeWidth="1.5" />
      <text x="100" y="56" textAnchor="middle" fontSize="9" fontWeight="600" fill="#2563EB" fontFamily="Inter">Web App</text>
      <rect x="160" y="40" width="80" height="24" rx="6" fill="white" stroke="#2563EB" strokeWidth="1.5" />
      <text x="200" y="56" textAnchor="middle" fontSize="9" fontWeight="600" fill="#2563EB" fontFamily="Inter">Mobile App</text>
      <rect x="260" y="40" width="80" height="24" rx="6" fill="white" stroke="#2563EB" strokeWidth="1.5" />
      <text x="300" y="56" textAnchor="middle" fontSize="9" fontWeight="600" fill="#2563EB" fontFamily="Inter">Admin Panel</text>

      {/* CDN */}
      <rect x="460" y="35" width="100" height="34" rx="8" fill="rgba(6,182,212,0.1)" stroke="#06B6D4" strokeWidth="1.5" />
      <text x="510" y="52" textAnchor="middle" fontSize="9" fontWeight="600" fill="#06B6D4" fontFamily="Inter">CDN / Edge</text>
      <text x="510" y="63" textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="Inter">CloudFront</text>

      {/* Arrows from client to API */}
      {[100, 200, 300].map(x => (
        <line key={x} x1={x} y1={72} x2={x} y2={110} stroke="#CBD5E1" strokeWidth="1.5" markerEnd="url(#arr)" />
      ))}

      {/* API Gateway Layer */}
      <rect x="20" y="100" width="560" height="50" rx="8" fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="30" y="116" fontSize="9" fontWeight="700" fill="#8B5CF6" fontFamily="Space Grotesk" letterSpacing="1">API GATEWAY</text>
      <rect x="100" y="115" width="120" height="28" rx="6" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="160" y="133" textAnchor="middle" fontSize="9" fontWeight="600" fill="#8B5CF6" fontFamily="Inter">Load Balancer</text>
      <rect x="240" y="115" width="120" height="28" rx="6" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="300" y="133" textAnchor="middle" fontSize="9" fontWeight="600" fill="#8B5CF6" fontFamily="Inter">Auth Middleware</text>
      <rect x="380" y="115" width="120" height="28" rx="6" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="440" y="133" textAnchor="middle" fontSize="9" fontWeight="600" fill="#8B5CF6" fontFamily="Inter">Rate Limiter</text>

      {/* Arrows to services */}
      {[160, 280, 400, 500].map(x => (
        <line key={x} x1={x > 450 ? 440 : x} y1={148} x2={x} y2={185} stroke="#CBD5E1" strokeWidth="1.5" />
      ))}

      {/* Microservices Layer */}
      <rect x="20" y="180" width="560" height="70" rx="8" fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="30" y="196" fontSize="9" fontWeight="700" fill="#22C55E" fontFamily="Space Grotesk" letterSpacing="1">MICROSERVICES</text>
      {[
        { label: 'Auth Service', x: 50 },
        { label: 'Product Service', x: 165 },
        { label: 'Order Service', x: 280 },
        { label: 'Payment Service', x: 395 },
        { label: 'Notification', x: 490 },
      ].map(s => (
        <g key={s.label}>
          <rect x={s.x} y={200} width={100} height={38} rx="8" fill="white" stroke="#22C55E" strokeWidth="1.5" />
          <text x={s.x + 50} y={222} textAnchor="middle" fontSize="9" fontWeight="600" fill="#22C55E" fontFamily="Inter">{s.label}</text>
        </g>
      ))}

      {/* Data Layer */}
      <rect x="20" y="270" width="560" height="30" rx="8" fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="30" y="288" fontSize="9" fontWeight="700" fill="#F59E0B" fontFamily="Space Grotesk" letterSpacing="1">DATA LAYER</text>
      {['PostgreSQL', 'Redis Cache', 'Elasticsearch', 'S3 Storage', 'Kafka'].map((db, i) => (
        <g key={db}>
          <text x={80 + i * 110} y={288} textAnchor="middle" fontSize="9" fontWeight="600" fill="#F59E0B" fontFamily="Inter">{db}</text>
        </g>
      ))}

      {/* Arrow marker */}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#CBD5E1" />
        </marker>
      </defs>
    </svg>
  );
}

const patterns = [
  { name: 'Microservices', desc: 'Independent deployable services', icon: GitBranch, recommended: true, color: '#22C55E' },
  { name: 'API Gateway', desc: 'Single entry point for clients', icon: Globe, recommended: true, color: '#2563EB' },
  { name: 'CQRS', desc: 'Separate read/write operations', icon: Layers, recommended: false, color: '#8B5CF6' },
  { name: 'Event Sourcing', desc: 'Immutable event log store', icon: Database, recommended: false, color: '#F59E0B' },
];

const techStack = [
  { layer: 'Frontend', techs: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS'] },
  { layer: 'Backend', techs: ['Node.js', 'Express.js', 'GraphQL', 'REST APIs'] },
  { layer: 'Database', techs: ['PostgreSQL', 'Redis', 'Elasticsearch', 'MongoDB'] },
  { layer: 'Infrastructure', techs: ['AWS', 'Docker', 'Kubernetes', 'Terraform'] },
  { layer: 'DevOps', techs: ['GitHub Actions', 'Prometheus', 'Grafana', 'ELK Stack'] },
];

const allTechColors = ['#2563EB', '#8B5CF6', '#22C55E', '#F59E0B', '#06B6D4', '#EF4444', '#EC4899'];

export default function Architecture() {
  const [activePattern, setActivePattern] = useState('Microservices');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Architecture</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>System architecture design and technology recommendations</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Sparkles size={14} /> Recommend Architecture</button>
            <button className="btn-primary"><Cpu size={14} /> Generate Diagram</button>
          </div>
        </div>
      </motion.div>

      {/* Architecture Diagram */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>System Architecture Blueprint</h2>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>Microservices architecture with API gateway pattern</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Badge variant="green">Recommended</Badge>
            <Badge variant="blue">v2.1</Badge>
          </div>
        </div>
        <ArchitectureDiagram />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, marginBottom: 20 }}>
        {/* Design Patterns */}
        <motion.div className="card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Design Patterns</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patterns.map(p => (
              <motion.div key={p.name} whileHover={{ x: 3 }} onClick={() => setActivePattern(p.name)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10,
                border: `1px solid ${activePattern === p.name ? `${p.color}30` : '#E2E8F0'}`,
                background: activePattern === p.name ? `${p.color}06` : '#F8FAFC',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p.icon size={17} color={p.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.desc}</div>
                </div>
                {p.recommended && <Badge variant="green" size="sm">Recommended</Badge>}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div className="card" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recommended Tech Stack</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {techStack.map((layer, li) => (
              <div key={layer.layer}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{layer.layer}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {layer.techs.map((tech, ti) => (
                    <span key={tech} style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: `${allTechColors[(li * 4 + ti) % allTechColors.length]}12`,
                      color: allTechColors[(li * 4 + ti) % allTechColors.length],
                      border: `1px solid ${allTechColors[(li * 4 + ti) % allTechColors.length]}25`,
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
