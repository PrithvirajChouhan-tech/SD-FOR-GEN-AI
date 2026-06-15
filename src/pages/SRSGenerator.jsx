import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { AIGenerationFlow } from '../components/ui/index.jsx';

const srsSteps = [
  { label: 'Analyzing project requirements', duration: 900 },
  { label: 'Structuring document sections', duration: 700 },
  { label: 'Writing Introduction & Scope', duration: 1100 },
  { label: 'Generating Functional Requirements', duration: 1300 },
  { label: 'Generating Non-Functional Requirements', duration: 1000 },
  { label: 'Creating Use Case Descriptions', duration: 1200 },
  { label: 'Adding Interface Requirements', duration: 800 },
  { label: 'Finalizing & formatting document', duration: 600 },
];

const srsStructure = [
  { section: '1. Introduction', subsections: ['1.1 Purpose', '1.2 Scope', '1.3 Definitions', '1.4 Overview'], status: 'done' },
  { section: '2. Overall Description', subsections: ['2.1 Product Perspective', '2.2 Product Functions', '2.3 User Classes'], status: 'done' },
  { section: '3. Functional Requirements', subsections: ['3.1 User Authentication', '3.2 Product Management', '3.3 Order Processing', '3.4 Payment System'], status: 'done' },
  { section: '4. Non-Functional Requirements', subsections: ['4.1 Performance', '4.2 Security', '4.3 Scalability', '4.4 Usability'], status: 'done' },
  { section: '5. Interface Requirements', subsections: ['5.1 UI Requirements', '5.2 API Interfaces', '5.3 Hardware Interfaces'], status: 'generating' },
  { section: '6. Appendices', subsections: ['6.1 Glossary', '6.2 References', '6.3 Data Dictionary'], status: 'pending' },
];

export default function SRSGenerator() {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [projectDesc, setProjectDesc] = useState('');
  const [previewSection, setPreviewSection] = useState(0);

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>SRS Generator</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>Generate IEEE-compliant Software Requirements Specifications</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Eye size={14} /> Preview</button>
            <button className="btn-secondary"><Download size={14} /> Export PDF</button>
            <button className="btn-secondary"><Download size={14} /> Export DOCX</button>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        {/* Left: Generator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Input */}
          <motion.div className="card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Sparkles size={18} color="#2563EB" />
              <span style={{ fontSize: 15, fontWeight: 700 }}>AI SRS Generator</span>
            </div>
            <textarea className="textarea" rows={6}
              value={projectDesc}
              onChange={e => setProjectDesc(e.target.value)}
              placeholder="Describe your project for SRS generation...&#10;&#10;Include: Project goals, target users, key features, technical constraints, compliance requirements..."
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { setGenerating(true); setDone(false); }}>
                <Sparkles size={14} /> Generate SRS
              </button>
            </div>
          </motion.div>

          {/* Generation Flow */}
          {generating && (
            <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Generating SRS Document...</div>
              <AIGenerationFlow steps={srsSteps} onComplete={() => setDone(true)} />
              {done && (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#22C55E" />
                  <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 500 }}>SRS v1.0 generated — 42 pages</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Document Structure */}
          <motion.div className="card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Document Structure</div>
            {srsStructure.map((section, i) => (
              <div key={i} onClick={() => setPreviewSection(i)} style={{
                padding: '10px 12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
                background: previewSection === i ? 'rgba(37,99,235,0.06)' : '#F8FAFC',
                border: `1px solid ${previewSection === i ? 'rgba(37,99,235,0.2)' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{section.section}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: section.status === 'done' ? 'rgba(34,197,94,0.1)' : section.status === 'generating' ? 'rgba(37,99,235,0.1)' : '#F1F5F9',
                    color: section.status === 'done' ? '#22C55E' : section.status === 'generating' ? '#2563EB' : '#94A3B8',
                  }}>{section.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                  {section.subsections.join(' · ')}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Document Preview */}
        <motion.div className="card" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', items: 'center', gap: 8 }}>
              <FileText size={16} color="#2563EB" />
              <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8 }}>SRS Document Preview</span>
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>v2.1 · 42 pages · Last updated 4h ago</div>
          </div>
          <div style={{ padding: 32, maxHeight: 700, overflowY: 'auto', background: 'white' }}>
            {/* Simulated Document */}
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
                  Software Requirements Specification
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>E-Commerce Platform</h2>
                <p style={{ fontSize: 12, color: '#94A3B8' }}>Version 2.1 | June 2025 | Confidential</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                  <span className="badge badge-blue">IEEE 830 Compliant</span>
                  <span className="badge badge-green">Approved</span>
                </div>
              </div>

              {/* TOC */}
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 10 }}>
                  Table of Contents
                </div>
                {srsStructure.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dotted #E2E8F0', fontSize: 12, color: '#475569' }}>
                    <span>{s.section}</span>
                    <span style={{ color: '#94A3B8' }}>{i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Section 1 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8, fontFamily: 'Space Grotesk' }}>
                  1. Introduction
                </h3>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', marginBottom: 6 }}>1.1 Purpose</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>
                  This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the E-Commerce Platform. The document is intended for use by the project stakeholders, development team, and quality assurance team.
                </p>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', marginBottom: 6 }}>1.2 Scope</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                  The E-Commerce Platform is a comprehensive online retail solution that enables businesses to manage products, process orders, handle payments, and provide personalized customer experiences at scale, supporting up to 10,000 concurrent users.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8, fontFamily: 'Space Grotesk' }}>
                  3. Functional Requirements
                </h3>
                {[
                  { id: 'FR-001', title: 'User Authentication', desc: 'The system shall provide secure user authentication using JWT tokens with a maximum token lifetime of 24 hours and automatic refresh mechanism.' },
                  { id: 'FR-002', title: 'Multi-Factor Authentication', desc: 'The system shall support TOTP-based two-factor authentication with backup codes for account recovery.' },
                  { id: 'FR-003', title: 'Product Catalog', desc: 'The system shall support a product catalog with up to 1,000,000 SKUs with real-time inventory management.' },
                ].map(fr => (
                  <div key={fr.id} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '3px solid #2563EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#2563EB', fontWeight: 700 }}>{fr.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{fr.title}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{fr.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
