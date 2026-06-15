import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Key, Bell, Palette, Shield, Globe, Save } from 'lucide-react';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'workspace', label: 'Workspace', icon: Globe },
];

export default function Settings() {
  const [active, setActive] = useState('profile');

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#94A3B8' }}>Manage your account, API keys, and workspace preferences</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar nav */}
        <motion.div className="card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 12, height: 'fit-content' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2,
              background: active === s.id ? 'rgba(37,99,235,0.08)' : 'transparent',
              color: active === s.id ? '#2563EB' : '#475569',
              fontSize: 13, fontWeight: active === s.id ? 600 : 500, fontFamily: 'Inter',
              textAlign: 'left',
            }}>
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div className="card" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: 32 }}>
          {active === 'profile' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Profile Settings</h2>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 32, padding: '20px 24px', borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk' }}>Z</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk' }}>Zenith</div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>zenith@zenithai.dev · Pro Plan</div>
                </div>
                <button className="btn-secondary" style={{ marginLeft: 'auto' }}>Change Avatar</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Full Name', value: 'Zenith AI' },
                  { label: 'Username', value: 'zenith' },
                  { label: 'Email', value: 'zenith@zenithai.dev' },
                  { label: 'Job Title', value: 'Software Architect' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{f.label}</label>
                    <input className="input" defaultValue={f.value} />
                  </div>
                ))}
              </div>
              <button className="btn-primary"><Save size={14} /> Save Changes</button>
            </div>
          )}

          {active === 'api' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>API Keys</h2>
              {[
                { name: 'OpenAI GPT-4', key: 'sk-...8f3a', status: 'active' },
                { name: 'Anthropic Claude', key: 'ant-...9k2c', status: 'active' },
                { name: 'GitHub Token', key: 'ghp-...7b1d', status: 'active' },
              ].map(k => (
                <div key={k.name} style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{k.name}</div>
                    <code style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'JetBrains Mono' }}>{k.key}</code>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Rotate</button>
                    <button style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}>Revoke</button>
                  </div>
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop: 8 }}><Key size={14} /> Add API Key</button>
            </div>
          )}

          {active !== 'profile' && active !== 'api' && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <SettingsIcon size={48} color="#E2E8F0" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, textTransform: 'capitalize' }}>{active} Settings</h3>
              <p style={{ color: '#94A3B8' }}>Configure your {active} preferences here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
