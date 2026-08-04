'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const SESSION_KEY = 'dragonpit-intro-seen';
const MIN_LOAD_TIME = 5000; // Definitely run for 5 seconds minimum

/** Ember particle data */
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 100 + Math.sin((i / 16) * Math.PI * 2) * 90,
  y: 100 + Math.cos((i / 16) * Math.PI * 2) * 90,
  delay: (i / 16) * 1.2,
  tx: `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5)}px`,
  size: 2 + (i % 3),
}));

interface DragonpitLoaderProps {
  isDataLoaded?: boolean;
  onComplete: () => void;
}

export default function DragonpitLoader({ isDataLoaded = false, onComplete }: DragonpitLoaderProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch (_) {
      return true;
    }
  });

  const [minTimeReached, setMinTimeReached] = useState(false);
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
    }, 450);
  }, [safeComplete]);

  // 5-second minimum timer
  useEffect(() => {
    if (typeof window === 'undefined' || !visible) return;

    timerRef.current = setTimeout(() => {
      setMinTimeReached(true);
    }, MIN_LOAD_TIME);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  // When BOTH 5 seconds have passed AND Firestore data is ready, trigger smooth exit!
  useEffect(() => {
    if (!visible) {
      safeComplete();
      return;
    }
    if (minTimeReached && isDataLoaded && !exitingRef.current) {
      handleExit();
    }
  }, [minTimeReached, isDataLoaded, visible, handleExit, safeComplete]);

  // Keypress listener for Escape key skip
  useEffect(() => {
    if (typeof window === 'undefined' || !visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleExit]);

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
        animation: phase === 'exit' ? 'loaderExit 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(184, 20, 20, 0.28) 0%, rgba(255, 90, 19, 0.15) 45%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* Skip button */}
      <button
        onClick={handleExit}
        aria-label="Skip intro"
        style={{
          position: 'absolute',
          top: '28px',
          right: '28px',
          background: 'rgba(20, 17, 15, 0.88)',
          border: '1px solid var(--dp-border)',
          color: 'var(--dp-gold-bright)',
          fontSize: '0.76rem',
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '9px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dp-red-bright)';
          (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--dp-blood)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dp-border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--dp-gold-bright)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20, 17, 15, 0.88)';
        }}
      >
        Skip Intro ⚔️
      </button>

      {/* Main Sigil Stage */}
      <div style={{ position: 'relative', width: 250, height: 250 }}>
        <svg
          width="250"
          height="250"
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
              animation: 'fireRingTravel 2.2s ease-in-out forwards',
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
                animation: `emberRise 1.4s ease-out ${0.2 + e.delay}s infinite`,
              } as React.CSSProperties}
            />
          ))}
        </svg>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/dragonpit/my_icon.png"
            alt="The Dragonpit Emblem"
            style={{
              width: 155,
              height: 155,
              objectFit: 'contain',
              animation: 'sigilGlow 1.8s ease forwards',
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
            fontSize: '0.9rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--dp-gold-bright)',
            marginBottom: '6px',
          }}
        >
          THE DRAGONPIT
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--dp-smoke)', letterSpacing: '0.12em' }}>
          {!minTimeReached
            ? 'Initializing Valyrian Vaults…'
            : !isDataLoaded
            ? 'Retrieving Fire-Forged Archives from Pit…'
            : 'Unlocking Dragonpit…'}
        </p>
      </div>

      <style>{`
        @keyframes sigilGlow {
          0%   { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 35px #ff5a13); }
        }
        @keyframes fireRingTravel {
          0%   { stroke-dashoffset: 722; opacity: 0; }
          20%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes emberRise {
          0%   { opacity: 0.9; transform: translateY(0) translateX(0); }
          100% { opacity: 0; transform: translateY(-75px) translateX(var(--tx)); }
        }
        @keyframes loaderExit {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) {
          circle[stroke="url(#fireGrad)"] { display: none !important; }
          img[alt*="Dragonpit"] { opacity: 1 !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
