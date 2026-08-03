'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const SESSION_KEY = 'dragonpit-intro-seen';
const INTRO_DURATION = 2000;

/** Ember particle data */
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 100 + Math.sin((i / 14) * Math.PI * 2) * 90,
  y: 100 + Math.cos((i / 14) * Math.PI * 2) * 90,
  delay: (i / 14) * 1.2,
  tx: `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5)}px`,
  size: 2 + (i % 3),
}));

interface DragonpitLoaderProps {
  onComplete: () => void;
}

export default function DragonpitLoader({ onComplete }: DragonpitLoaderProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch (_) {
      return true;
    }
  });

  const [phase, setPhase] = useState<'intro' | 'exit'>('intro');
  const exitingRef = useRef(false);
  const completedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const safeComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch (_) { /* private browsing */ }
      onComplete();
    }
  }, [onComplete]);

  const handleExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    setPhase('exit');
    setTimeout(() => {
      setVisible(false);
      safeComplete();
    }, 400);
  }, [safeComplete]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!visible) {
      safeComplete();
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Keypress handler for Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    timerRef.current = setTimeout(() => {
      handleExit();
    }, INTRO_DURATION);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleExit, safeComplete]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="The Dragonpit loading intro"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#040303',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: phase === 'exit' ? 'loaderExit 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(184, 20, 20, 0.25) 0%, rgba(255, 90, 19, 0.12) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Skip button */}
      <button
        onClick={handleExit}
        aria-label="Skip intro"
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(20, 17, 15, 0.85)',
          border: '1px solid var(--dp-border)',
          color: 'var(--dp-gold-soft)',
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '8px 18px',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s',
        }}
      >
        Skip Intro ⚔️
      </button>

      {/* Main Sigil Stage */}
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        <svg
          width="240"
          height="240"
          viewBox="0 0 260 260"
          fill="none"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0 }}
        >
          <circle
            cx="130" cy="130" r="115"
            stroke="url(#fireGrad)"
            strokeWidth="3.5"
            strokeDasharray="722"
            strokeDashoffset="722"
            strokeLinecap="round"
            style={{
              animation: 'fireRingTravel 1.8s ease-in-out forwards',
              transformOrigin: 'center',
            }}
          />
          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a0d0d"/>
              <stop offset="50%" stopColor="#ff5a13"/>
              <stop offset="100%" stopColor="#ffd700"/>
            </linearGradient>
          </defs>

          {EMBERS.map(e => (
            <circle
              key={e.id}
              cx={e.x}
              cy={e.y}
              r={e.size}
              fill={e.id % 2 === 0 ? '#ff5a13' : '#ffd700'}
              style={{
                opacity: 0,
                // @ts-ignore
                '--tx': e.tx,
                animation: `emberRise 1.2s ease-out ${0.2 + e.delay}s forwards`,
              } as React.CSSProperties}
            />
          ))}
        </svg>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/dragonpit/my_icon.png"
            alt="The Dragonpit Emblem"
            style={{
              width: 150,
              height: 150,
              objectFit: 'contain',
              animation: 'sigilGlow 1.5s ease forwards',
              opacity: 0,
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '28px', textAlign: 'center', userSelect: 'none', zIndex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontWeight: 900,
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--dp-gold-bright)',
          }}
        >
          THE DRAGONPIT
        </p>
        <p style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--dp-smoke)', letterSpacing: '0.1em' }}>
          Opening Valyrian Archives…
        </p>
      </div>

      <style>{`
        @keyframes sigilGlow {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 30px #ff5a13); }
        }
        @keyframes fireRingTravel {
          0%   { stroke-dashoffset: 722; opacity: 0; }
          20%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes emberRise {
          0%   { opacity: 0.9; transform: translateY(0) translateX(0); }
          100% { opacity: 0; transform: translateY(-70px) translateX(var(--tx)); }
        }
        @keyframes loaderExit {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          circle[stroke="url(#fireGrad)"] { display: none !important; }
          img[alt*="Dragonpit"] { opacity: 1 !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
