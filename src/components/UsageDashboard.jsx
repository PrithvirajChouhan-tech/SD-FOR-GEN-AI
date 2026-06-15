import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, RotateCw } from 'lucide-react';

const STORAGE_KEY = 'zenith_usage_stats';
const MODEL_PRICING = {
  'deepseek-ai/DeepSeek-V4-Pro': { label: 'DeepSeek V4 Pro', price: 0.0014 },
  'deepseek-ai/DeepSeek-V4-Flash': { label: 'DeepSeek V4 Flash', price: 0.0007 },
  'openai/gpt-oss-120b': { label: 'GPT-OSS 120B', price: 0.0010 },
  'google/gemma-4-31B-it': { label: 'Gemma 4 31B', price: 0.0008 },
  'Qwen/Qwen3.6-35B-A3B': { label: 'Qwen 3.6 35B', price: 0.0009 },
  'meta-llama/Llama-3.1-8B-Instruct': { label: 'Llama 3.1 8B', price: 0.0005 },
};

export function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initStats();
  } catch {
    return initStats();
  }
}

function initStats() {
  return {
    totalMessages: 0,
    sessionMessages: 0,
    byModel: {},
    daily: {},
  };
}

export function recordMessage(model, charCount) {
  const stats = loadStats();
  const tokens = Math.ceil(charCount / 4);
  const today = new Date().toISOString().slice(0, 10);

  stats.totalMessages = (stats.totalMessages || 0) + 1;
  stats.sessionMessages = (stats.sessionMessages || 0) + 1;

  if (!stats.byModel[model]) {
    stats.byModel[model] = { tokens: 0, messages: 0 };
  }
  stats.byModel[model].tokens += tokens;
  stats.byModel[model].messages += 1;

  if (!stats.daily[today]) stats.daily[today] = 0;
  stats.daily[today] += 1;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}

  return stats;
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatCost(n) {
  return n < 0.001 ? '<$0.001' : `$${n.toFixed(4)}`;
}

export default function UsageDashboard({ open, onClose }) {
  const [stats, setStats] = React.useState(loadStats());

  useEffect(() => {
    if (open) setStats(loadStats());
  }, [open]);

  const resetStats = () => {
    const fresh = initStats();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setStats(fresh);
  };

  const last7 = getLast7Days();
  const dailyCounts = last7.map(d => stats.daily?.[d] || 0);
  const maxDaily = Math.max(...dailyCounts, 1);

  const modelEntries = Object.entries(stats.byModel || {});
  const totalTokens = modelEntries.reduce((sum, [, v]) => sum + (v.tokens || 0), 0);
  const maxModelTokens = Math.max(...modelEntries.map(([, v]) => v.tokens || 0), 1);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 990,
              background: 'rgba(4,9,13,0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            style={{
              position: 'fixed',
              top: 0, right: 0, bottom: 0,
              width: 380,
              zIndex: 1000,
              background: 'rgba(4,10,16,0.97)',
              backdropFilter: 'blur(28px)',
              borderLeft: '1px solid rgba(0,255,213,0.14)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 22px 14px',
              borderBottom: '1px solid rgba(0,255,213,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(0,255,213,0.1)',
                  border: '1px solid rgba(0,255,213,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BarChart2 size={15} color="#00ffd5" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, color: '#e1f7fc' }}>
                    Usage Dashboard
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(0,255,213,0.6)', letterSpacing: '0.15em' }}>
                    ZENITH AI METRICS
                  </div>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(225,247,252,0.4)', display: 'flex', padding: 4,
              }}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Message counts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'THIS SESSION', value: stats.sessionMessages || 0 },
                  { label: 'ALL TIME', value: stats.totalMessages || 0 },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'rgba(0,255,213,0.05)',
                    border: '1px solid rgba(0,255,213,0.12)',
                    borderRadius: 14,
                    padding: '16px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: '#00ffd5', lineHeight: 1 }}>
                      {value.toLocaleString()}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(0,255,213,0.5)', letterSpacing: '0.14em', marginTop: 6 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Model usage bars */}
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(0,255,213,0.5)', letterSpacing: '0.14em', marginBottom: 12 }}>
                  USAGE BY MODEL
                </div>
                {modelEntries.length === 0 ? (
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(225,247,252,0.3)', textAlign: 'center', padding: '20px 0' }}>
                    No data yet — start chatting!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {modelEntries.sort((a, b) => b[1].tokens - a[1].tokens).map(([id, data]) => {
                      const info = MODEL_PRICING[id];
                      const cost = (data.tokens / 1000) * (info?.price || 0.001);
                      const pct = (data.tokens / maxModelTokens) * 100;
                      return (
                        <div key={id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#e1f7fc' }}>
                              {info?.label || id.split('/').pop()}
                            </span>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(0,255,213,0.7)' }}>
                                {(data.tokens || 0).toLocaleString()} tok
                              </span>
                              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#c084fc' }}>
                                {formatCost(cost)}
                              </span>
                            </div>
                          </div>
                          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              style={{
                                height: '100%',
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #00ffd5, #00b4d8)',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Total cost */}
              {totalTokens > 0 && (
                <div style={{
                  background: 'rgba(168,85,247,0.07)',
                  border: '1px solid rgba(168,85,247,0.18)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(168,85,247,0.7)', letterSpacing: '0.12em', marginBottom: 4 }}>
                      ESTIMATED TOTAL COST
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700, color: '#c084fc' }}>
                      {formatCost(
                        modelEntries.reduce((sum, [id, data]) => {
                          const info = MODEL_PRICING[id];
                          return sum + (data.tokens / 1000) * (info?.price || 0.001);
                        }, 0)
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(225,247,252,0.3)', letterSpacing: '0.1em', marginBottom: 4 }}>
                      TOTAL TOKENS
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, color: 'rgba(225,247,252,0.7)' }}>
                      {totalTokens.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Daily sparkline */}
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(0,255,213,0.5)', letterSpacing: '0.14em', marginBottom: 12 }}>
                  LAST 7 DAYS
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                  {last7.map((d, i) => {
                    const val = dailyCounts[i];
                    const pct = val / maxDaily;
                    const isToday = d === new Date().toISOString().slice(0, 10);
                    return (
                      <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div
                          title={`${d}: ${val} messages`}
                          style={{
                            width: '100%',
                            height: Math.max(4, pct * 48),
                            background: isToday
                              ? 'linear-gradient(180deg, #00ffd5, rgba(0,255,213,0.4))'
                              : 'rgba(0,255,213,0.25)',
                            borderRadius: '3px 3px 0 0',
                            transition: 'height 0.4s ease',
                            boxShadow: isToday ? '0 0 8px rgba(0,255,213,0.4)' : 'none',
                          }}
                        />
                        <span style={{
                          fontFamily: 'JetBrains Mono',
                          fontSize: 8,
                          color: isToday ? '#00ffd5' : 'rgba(225,247,252,0.3)',
                          letterSpacing: '0.05em',
                        }}>
                          {new Date(d + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(0,255,213,0.08)', flexShrink: 0 }}>
              <button
                onClick={resetStats}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 12,
                  background: 'rgba(248,113,113,0.06)',
                  border: '1px solid rgba(248,113,113,0.18)',
                  color: '#f87171',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.06)'}
              >
                <RotateCw size={12} />
                RESET STATS
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
