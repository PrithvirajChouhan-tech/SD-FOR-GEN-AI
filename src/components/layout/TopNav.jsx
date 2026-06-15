import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, Command, Plus, Zap,
  User, LogOut, CreditCard, HelpCircle, Settings
} from 'lucide-react';

const projects = [
  { id: 1, name: 'E-Commerce Platform', color: '#a855f7' },
  { id: 2, name: 'Healthcare App', color: '#22d3ee' },
  { id: 3, name: 'FinTech Dashboard', color: '#f472b6' },
];

const notifications = [
  { id: 1, title: 'SRS Document Generated', time: '2m ago', type: 'success' },
  { id: 2, title: 'Architecture Review Ready', time: '15m ago', type: 'info' },
  { id: 3, title: 'Test Coverage at 87%', time: '1h ago', type: 'warning' },
];

// Video-matched palette (Alien teal/cyber theme)
const SURFACE_NAV = 'rgba(4,12,17,0.88)';
const BORDER = 'rgba(0,255,213,0.14)';
const ACCENT = '#00ffd5';
const ACCENT_BRIGHT = '#76fff0';
const TEXT_PRIMARY = '#e1f7fc';
const TEXT_SECONDARY = 'rgba(200,235,245,0.65)';
const TEXT_MUTED = 'rgba(160,205,220,0.45)';
const DROPDOWN_BG = 'rgba(6,16,22,0.97)';

export default function TopNav({ sidebarWidth }) {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: 64,
        background: SURFACE_NAV,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${BORDER}`,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 30px rgba(80,0,180,0.12)',
      }}
    >
      {/* Project Selector */}
      <div className="relative">
        <motion.button
          whileHover={{ backgroundColor: 'rgba(168,85,247,0.12)' }}
          onClick={() => {
            setShowProjectDropdown(!showProjectDropdown);
            setShowNotifications(false);
            setShowProfile(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            background: 'rgba(168,85,247,0.06)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: TEXT_PRIMARY,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: activeProject.color,
            display: 'inline-block', flexShrink: 0,
            boxShadow: `0 0 8px ${activeProject.color}`,
          }} />
          {activeProject.name}
          <ChevronDown size={14} color={TEXT_MUTED} />
        </motion.button>

        <AnimatePresence>
          {showProjectDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                background: DROPDOWN_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                boxShadow: '0 16px 40px rgba(80,0,200,0.25)',
                minWidth: 220,
                zIndex: 100,
                padding: 6,
                backdropFilter: 'blur(20px)',
              }}
            >
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setActiveProject(p); setShowProjectDropdown(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 8, border: 'none',
                    background: p.id === activeProject.id ? 'rgba(168,85,247,0.14)' : 'transparent',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    color: p.id === activeProject.id ? TEXT_PRIMARY : TEXT_SECONDARY,
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: p.color,
                    boxShadow: `0 0 6px ${p.color}`,
                  }} />
                  {p.name}
                </button>
              ))}
              <div style={{ height: 1, background: BORDER, margin: '6px 0' }} />
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 8, border: 'none',
                  background: 'transparent', cursor: 'pointer', fontSize: 13,
                  fontWeight: 600, color: ACCENT_BRIGHT, fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                <Plus size={14} /> New Project
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 400 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} color={TEXT_MUTED} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search projects, documents, diagrams..."
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 60,
              fontSize: 13,
              height: 38,
              borderRadius: 10,
              background: 'rgba(168,85,247,0.05)',
              border: `1px solid ${BORDER}`,
              color: TEXT_PRIMARY,
              fontFamily: 'Space Grotesk, sans-serif',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(168,85,247,0.4)';
              e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.08)';
            }}
            onBlur={e => {
              e.target.style.borderColor = BORDER;
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', gap: 2, padding: '2px 6px',
            background: 'rgba(168,85,247,0.08)', border: `1px solid ${BORDER}`, borderRadius: 6,
          }}>
            <Command size={11} color={TEXT_MUTED} />
            <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>K</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Quick Actions */}
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(168,85,247,0.5)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', fontSize: 13,
          fontWeight: 700,
          fontFamily: 'Space Grotesk, sans-serif',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          cursor: 'pointer',
          boxShadow: '0 0 16px rgba(168,85,247,0.35)',
          letterSpacing: '-0.01em',
        }}
      >
        <Zap size={14} /> Generate
      </motion.button>

      {/* Notifications */}
      <div className="relative">
        <motion.button
          whileHover={{ backgroundColor: 'rgba(168,85,247,0.1)' }}
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProjectDropdown(false);
            setShowProfile(false);
          }}
          style={{
            width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 10, border: `1px solid ${BORDER}`, background: 'rgba(168,85,247,0.05)',
            cursor: 'pointer', position: 'relative',
          }}
        >
          <Bell size={16} color={TEXT_SECONDARY} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: ACCENT, border: '2px solid rgba(8,4,22,0.9)',
            boxShadow: `0 0 8px ${ACCENT}`,
          }} />
        </motion.button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: DROPDOWN_BG, border: `1px solid ${BORDER}`,
                borderRadius: 14, boxShadow: '0 16px 40px rgba(80,0,200,0.25)',
                width: 300, zIndex: 100, overflow: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', color: TEXT_PRIMARY }}>Notifications</span>
                <span style={{ fontSize: 12, color: ACCENT_BRIGHT, cursor: 'pointer', fontWeight: 600 }}>Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '12px 16px', borderBottom: `1px solid rgba(168,85,247,0.06)`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5,
                    background: n.type === 'success' ? '#4ade80' : n.type === 'warning' ? '#fb923c' : ACCENT,
                    boxShadow: `0 0 6px ${n.type === 'success' ? '#4ade80' : n.type === 'warning' ? '#fb923c' : ACCENT}`,
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: 'Space Grotesk, sans-serif' }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            setShowProfile(!showProfile);
            setShowProjectDropdown(false);
            setShowNotifications(false);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px', borderRadius: 10,
            border: `1px solid ${BORDER}`, background: 'rgba(168,85,247,0.06)',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 700,
            boxShadow: '0 0 12px rgba(168,85,247,0.5)',
          }}>Z</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: 'Space Grotesk, sans-serif' }}>Zenith</div>
            <div style={{ fontSize: 10, color: ACCENT, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.06em' }}>PRO PLAN</div>
          </div>
          <ChevronDown size={13} color={TEXT_MUTED} />
        </motion.button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: DROPDOWN_BG, border: `1px solid ${BORDER}`,
                borderRadius: 14, boxShadow: '0 16px 40px rgba(80,0,200,0.25)',
                width: 200, zIndex: 100, padding: 6,
                backdropFilter: 'blur(20px)',
              }}
            >
              {[
                { icon: User, label: 'Profile' },
                { icon: CreditCard, label: 'Billing' },
                { icon: Settings, label: 'Settings' },
                { icon: HelpCircle, label: 'Help' },
              ].map(item => (
                <button key={item.label} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 8, border: 'none',
                  background: 'transparent', cursor: 'pointer', fontSize: 13,
                  fontWeight: 500, color: TEXT_SECONDARY, fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  <item.icon size={14} color={TEXT_MUTED} /> {item.label}
                </button>
              ))}
              <div style={{ height: 1, background: BORDER, margin: '4px 0' }} />
              <button style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 8, border: 'none',
                background: 'transparent', cursor: 'pointer', fontSize: 13,
                fontWeight: 600, color: '#f87171', fontFamily: 'Space Grotesk, sans-serif',
              }}>
                <LogOut size={14} /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
