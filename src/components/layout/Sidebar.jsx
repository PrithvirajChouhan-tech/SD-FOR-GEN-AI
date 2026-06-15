import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, FileText, BookOpen, Users,
  Cpu, PenTool, Database, Globe, Code2, TestTube2, Container,
  BookMarked, GitBranch, Bot, Settings, ChevronLeft,
  Sparkles
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/projects' },
  { id: 'divider1', divider: true },
  { id: 'requirements', label: 'Requirements', icon: FileText, path: '/requirements' },
  { id: 'srs', label: 'SRS Generator', icon: BookOpen, path: '/srs' },
  { id: 'userstories', label: 'User Stories', icon: Users, path: '/user-stories' },
  { id: 'architecture', label: 'Architecture', icon: Cpu, path: '/architecture' },
  { id: 'uml', label: 'UML Designer', icon: PenTool, path: '/uml' },
  { id: 'database', label: 'Database Designer', icon: Database, path: '/database' },
  { id: 'api', label: 'API Designer', icon: Globe, path: '/api' },
  { id: 'divider2', divider: true },
  { id: 'development', label: 'Development', icon: Code2, path: '/development' },
  { id: 'testing', label: 'Testing', icon: TestTube2, path: '/testing' },
  { id: 'devops', label: 'DevOps', icon: Container, path: '/devops' },
  { id: 'documentation', label: 'Documentation', icon: BookMarked, path: '/documentation' },
  { id: 'divider3', divider: true },
  { id: 'repository', label: 'Repository Analyzer', icon: GitBranch, path: '/repository' },
  { id: 'ai', label: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
  { id: 'divider4', divider: true },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

// Video-matched palette (Alien teal/cyber theme)
const ACCENT = '#00ffd5';       // electric cyan-green
const ACCENT_DIM = 'rgba(0,255,213,0.18)';
const ACCENT_GLOW = 'rgba(0,255,213,0.08)';
const ACCENT_BORDER = 'rgba(0,255,213,0.25)';
const SURFACE = 'rgba(5,13,18,0.85)';
const BORDER = 'rgba(0,255,213,0.12)';
const TEXT_PRIMARY = '#e1f7fc';   // bright cyan-white
const TEXT_SECONDARY = 'rgba(200,235,245,0.65)';
const TEXT_MUTED = 'rgba(160,205,220,0.4)';

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-30 flex flex-col"
      style={{
        background: SURFACE,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: `1px solid ${BORDER}`,
        overflow: 'hidden',
        boxShadow: '4px 0 40px rgba(100,20,200,0.15)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 h-16 flex-shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            boxShadow: '0 0 20px rgba(168,85,247,0.5)',
          }}
        >
          <Sparkles size={20} color="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 flex flex-col"
              style={{ minWidth: 0 }}
            >
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: TEXT_PRIMARY,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                ZENITH AI
              </span>
              <span style={{
                fontSize: 10,
                color: ACCENT,
                fontWeight: 600,
                lineHeight: 1.3,
                marginTop: 2,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                Engineering Copilot
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' }}>
        {navItems.map((item) => {
          if (item.divider) {
            return collapsed ? null : (
              <div key={item.id} style={{ height: 1, background: BORDER, margin: '8px 12px' }} />
            );
          }
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 relative"
              style={{
                padding: collapsed ? '10px 16px' : '9px 12px',
                borderRadius: 10,
                marginBottom: 2,
                border: isActive ? `1px solid ${ACCENT_BORDER}` : '1px solid transparent',
                cursor: 'pointer',
                background: isActive ? ACCENT_DIM : 'transparent',
                color: isActive ? TEXT_PRIMARY : TEXT_SECONDARY,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                boxShadow: isActive ? `0 0 12px rgba(168,85,247,0.15)` : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = ACCENT_GLOW;
                  e.currentTarget.style.color = TEXT_PRIMARY;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = TEXT_SECONDARY;
                }
              }}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    background: ACCENT,
                    borderRadius: '0 4px 4px 0',
                    boxShadow: `0 0 8px ${ACCENT}`,
                  }}
                />
              )}
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                color={isActive ? ACCENT : 'currentColor'}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${BORDER}` }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center"
          style={{
            padding: '8px',
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            background: 'rgba(168,85,247,0.05)',
            cursor: 'pointer',
            color: TEXT_MUTED,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = ACCENT_BORDER;
            e.currentTarget.style.color = TEXT_PRIMARY;
            e.currentTarget.style.background = ACCENT_GLOW;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.color = TEXT_MUTED;
            e.currentTarget.style.background = 'rgba(168,85,247,0.05)';
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft size={16} />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{
                  fontSize: 12,
                  color: 'inherit',
                  fontWeight: 500,
                  marginLeft: 6,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
