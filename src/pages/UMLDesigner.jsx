import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Sparkles, Download } from 'lucide-react';
import { Badge } from '../components/ui/index.jsx';
import UseCaseDiagram from './diagrams/UseCaseDiagram.jsx';
import ClassDiagram from './diagrams/ClassDiagram.jsx';
import SequenceDiagram from './diagrams/SequenceDiagram.jsx';

const diagrams = {
  usecase: UseCaseDiagram,
  class: ClassDiagram,
  sequence: SequenceDiagram,
};

const diagramTypes = [
  { id: 'usecase', label: 'Use Case', color: '#2563EB' },
  { id: 'class', label: 'Class', color: '#8B5CF6' },
  { id: 'sequence', label: 'Sequence', color: '#22C55E' },
  { id: 'activity', label: 'Activity', color: '#F59E0B' },
  { id: 'state', label: 'State', color: '#06B6D4' },
];

export default function UMLDesigner() {
  const [active, setActive] = useState('usecase');
  const DiagramComponent = diagrams[active];

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>UML Designer</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>AI-powered UML diagram generation and visualization</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Download size={14} /> Export SVG</button>
            <button className="btn-primary"><Sparkles size={14} /> Generate All</button>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Diagram Type Selector */}
        <motion.div className="card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 16, height: 'fit-content' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Diagram Types</div>
          {diagramTypes.map(d => (
            <motion.button key={d.id} whileHover={{ x: 2 }} onClick={() => setActive(d.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 4,
              background: active === d.id ? `${d.color}10` : 'transparent',
              color: active === d.id ? d.color : '#475569',
              fontSize: 13, fontWeight: active === d.id ? 600 : 500, fontFamily: 'Inter',
            }}>
              <PenTool size={14} strokeWidth={active === d.id ? 2.2 : 1.7} />
              {d.label} Diagram
              {active === d.id && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: d.color }} />}
            </motion.button>
          ))}
        </motion.div>

        {/* Diagram Canvas */}
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <PenTool size={16} color="#2563EB" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{diagramTypes.find(d => d.id === active)?.label} Diagram</span>
              <Badge variant="green">AI Generated</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}><Sparkles size={12} /> Regenerate</button>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}><Download size={12} /> Export</button>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            {DiagramComponent ? <DiagramComponent /> : (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#94A3B8' }}>
                <Sparkles size={40} color="#2563EB" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
                  Generate {diagramTypes.find(d => d.id === active)?.label} Diagram
                </div>
                <p style={{ fontSize: 13, marginBottom: 20 }}>Click Generate to create this diagram with AI</p>
                <button className="btn-primary"><Sparkles size={14} /> Generate Diagram</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
