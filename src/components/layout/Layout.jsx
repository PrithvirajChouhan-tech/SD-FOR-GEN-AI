import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="grid-bg noise-overlay" style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
      <video
        className="bg-video"
        src="/alien.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ flex: 1, minHeight: '100vh', paddingTop: 64, position: 'relative', zIndex: 1 }}
      >
        <TopNav sidebarWidth={sidebarWidth} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', zIndex: 2 }}
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  );
}
