import React, { useEffect, useState, useRef } from 'react';

// ---- AnimatedCounter ----
export function AnimatedCounter({ value, duration = 1500, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ---- ProgressBar ----
export function ProgressBar({ value, color = '#2563EB', height = 6, animated = true, showLabel = false }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ position: 'relative' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#475569' }}></span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{value}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div
          className="progress-fill"
          style={{
            width: `${width}%`,
            background: color,
            transition: animated ? 'width 1.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

// ---- CircularProgress ----
export function CircularProgress({ value, size = 80, strokeWidth = 7, color = '#2563EB', label = '', sublabel = '' }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (value / 100) * circ), 100);
    return () => clearTimeout(t);
  }, [value, circ]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: size / 5, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk', lineHeight: 1 }}>{value}%</div>
        {label && <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>{label}</div>}
      </div>
    </div>
  );
}

// ---- Badge ----
export function Badge({ children, variant = 'blue', size = 'md' }) {
  const variants = {
    blue: 'badge-blue',
    green: 'badge-green',
    yellow: 'badge-yellow',
    red: 'badge-red',
    gray: 'badge-gray',
    cyan: 'badge-cyan',
  };
  return (
    <span className={`badge ${variants[variant]}`} style={{ fontSize: size === 'sm' ? 11 : 12 }}>
      {children}
    </span>
  );
}

// ---- SkeletonLoader ----
export function Skeleton({ width = '100%', height = 16, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

// ---- StatusDot ----
export function StatusDot({ status }) {
  const colors = { active: '#22C55E', pending: '#F59E0B', inactive: '#94A3B8', error: '#EF4444' };
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8, height: 8, borderRadius: '50%',
        background: colors[status] || '#94A3B8',
        boxShadow: status === 'active' ? `0 0 6px ${colors.active}60` : 'none',
      }}
    />
  );
}

// ---- EmptyState ----
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      {icon && <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>}
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 340, margin: '0 auto 24px' }}>{description}</p>
      {action && action}
    </div>
  );
}

// ---- AIGenerationFlow ----
const stepStates = { done: 'done', loading: 'loading', pending: 'pending' };

export function AIGenerationFlow({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatesMap, setStepStatesMap] = useState(() =>
    steps.map((_, i) => (i === 0 ? 'loading' : 'pending'))
  );

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => {
      setStepStatesMap(prev => prev.map((s, i) => {
        if (i === currentStep) return 'done';
        if (i === currentStep + 1) return 'loading';
        return s;
      }));
      setCurrentStep(prev => prev + 1);
    }, steps[currentStep]?.duration || 1200);
    return () => clearTimeout(t);
  }, [currentStep]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((step, i) => {
        const state = stepStatesMap[i];
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 10,
            background: state === 'done' ? 'rgba(34,197,94,0.05)' : state === 'loading' ? 'rgba(37,99,235,0.05)' : 'transparent',
            border: `1px solid ${state === 'done' ? 'rgba(34,197,94,0.2)' : state === 'loading' ? 'rgba(37,99,235,0.15)' : '#E2E8F0'}`,
            transition: 'all 0.3s ease',
          }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {state === 'done' ? (
                <span style={{ fontSize: 14 }}>✓</span>
              ) : state === 'loading' ? (
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #2563EB', borderTopColor: 'transparent', animation: 'spin-slow 0.8s linear infinite' }} />
              ) : (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E2E8F0' }} />
              )}
            </div>
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: state === 'done' ? '#22C55E' : state === 'loading' ? '#2563EB' : '#94A3B8',
              transition: 'color 0.3s ease',
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
