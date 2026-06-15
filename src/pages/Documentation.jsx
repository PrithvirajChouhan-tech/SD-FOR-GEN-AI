import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Download, Sparkles, FileText, Book, TestTube2, BookOpen, Users, PenTool } from 'lucide-react';
import { Badge, AIGenerationFlow } from '../components/ui/index.jsx';

const docTypes = [
  { id: 'srs', label: 'SRS Document', icon: FileText, pages: 42, color: '#2563EB', status: 'complete' },
  { id: 'design', label: 'Design Document', icon: PenTool, pages: 28, color: '#8B5CF6', status: 'complete' },
  { id: 'test', label: 'Test Document', icon: TestTube2, pages: 35, color: '#22C55E', status: 'complete' },
  { id: 'user', label: 'User Manual', icon: Book, pages: 54, color: '#F59E0B', status: 'review' },
  { id: 'api', label: 'API Reference', icon: BookOpen, pages: 67, color: '#06B6D4', status: 'complete' },
  { id: 'report', label: 'Project Report', icon: Users, pages: 19, color: '#EF4444', status: 'draft' },
];

const docSteps = [
  { label: 'Gathering project information', duration: 700 },
  { label: 'Structuring document outline', duration: 600 },
  { label: 'Generating content sections', duration: 1200 },
  { label: 'Adding diagrams & visuals', duration: 900 },
  { label: 'Formatting & styling', duration: 500 },
  { label: 'Quality review', duration: 600 },
];

export default function Documentation() {
  const [selected, setSelected] = useState('srs');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const selectedDoc = docTypes.find(d => d.id === selected);

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Documentation</h1>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>AI-generated technical and user documentation</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary"><Download size={14} /> Export PDF</button>
            <button className="btn-secondary"><Download size={14} /> Export DOCX</button>
            <button className="btn-primary" onClick={() => { setGenerating(true); setDone(false); }}>
              <Sparkles size={14} /> Generate All Docs
            </button>
          </div>
        </div>
      </motion.div>

      {/* Doc Type Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        {docTypes.map(doc => (
          <motion.div key={doc.id} whileHover={{ translateY: -3 }} onClick={() => setSelected(doc.id)} style={{
            padding: 16, borderRadius: 14, border: `2px solid ${selected === doc.id ? doc.color : '#E2E8F0'}`,
            background: selected === doc.id ? `${doc.color}06` : 'white',
            cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${doc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <doc.icon size={17} color={doc.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{doc.label}</div>
            <div style={{ fontSize: 10, color: '#94A3B8' }}>{doc.pages} pages</div>
            <div style={{ marginTop: 6 }}>
              <Badge variant={doc.status === 'complete' ? 'green' : doc.status === 'review' ? 'yellow' : 'gray'} size="sm">
                {doc.status}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generation flow */}
      {generating && (
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Generating All Documentation...</div>
          <AIGenerationFlow steps={docSteps} onComplete={() => setDone(true)} />
        </motion.div>
      )}

      {/* Document Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
        {/* TOC */}
        <motion.div className="card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 16, height: 'fit-content' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Table of Contents</div>
          {[
            '1. Executive Summary',
            '2. System Overview',
            '3. Functional Requirements',
            '4. Non-Functional Requirements',
            '5. Architecture Design',
            '6. Database Design',
            '7. API Specifications',
            '8. Security Requirements',
            '9. Testing Strategy',
            '10. Deployment Plan',
            '11. Glossary',
            '12. Appendix',
          ].map((item, i) => (
            <div key={i} style={{
              padding: '7px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12,
              color: i === 2 ? '#2563EB' : '#475569', fontWeight: i === 2 ? 700 : 400,
              background: i === 2 ? 'rgba(37,99,235,0.06)' : 'transparent',
              marginBottom: 2,
            }}>{item}</div>
          ))}
        </motion.div>

        {/* Document Content Preview */}
        <motion.div className="card" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <BookMarked size={16} color="#2563EB" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedDoc?.label}</span>
              <Badge variant="green">v2.1</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}><Download size={12} /> PDF</button>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}><Download size={12} /> DOCX</button>
            </div>
          </div>
          <div style={{ padding: '32px 40px', maxHeight: 600, overflowY: 'auto' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              {/* Title page simulation */}
              <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 10 }}>E-Commerce Platform · June 2025</div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'Space Grotesk' }}>Software Requirements Specification</h1>
                <p style={{ fontSize: 13, color: '#475569' }}>Version 2.1 | Prepared by Zenith AI</p>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>3. Functional Requirements</h2>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2563EB', marginBottom: 8 }}>3.1 User Authentication</h3>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.9, marginBottom: 16 }}>
                The system shall provide a secure authentication mechanism supporting email/password credentials, OAuth 2.0 via Google and GitHub, and multi-factor authentication using TOTP-compatible applications. Authentication tokens shall follow the JWT standard with RS256 signing and a maximum lifetime of 24 hours, with automatic refresh capabilities.
              </p>
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px 18px', border: '1px solid #E2E8F0', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', marginBottom: 8 }}>Acceptance Criteria</div>
                {['User can register with valid email and password', 'Password must contain min. 8 characters with complexity rules', 'JWT token expires after 24 hours', 'Refresh token valid for 30 days', 'MFA setup wizard available in account settings'].map((ac, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: '#22C55E', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>{ac}</span>
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2563EB', marginBottom: 8 }}>3.2 Product Management</h3>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.9 }}>
                The system shall support a comprehensive product catalog management system enabling administrators to create, update, and manage up to 1,000,000 product SKUs with real-time inventory tracking, multi-image support, variant management, and category hierarchies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
