'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './DragonpitLoader.module.css';

const SESSION_KEY = 'dragonpit-intro-seen';
const MAX_DURATION = 3000; // never block longer than 3 s

const SUBTITLES = [
  'Kindling the flame\u2026',
  'Opening the chronicles\u2026',
  'Summoning the archives\u2026',
  'The Dragonpit is ready.',
];

/** Ember particle data */
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 90 + Math.sin((i / 14) * Math.PI * 2) * 82,
  y: 90 + Math.cos((i / 14) * Math.PI * 2) * 82,
  delay: (i / 14) * 1.4,
  tx: `${(i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 4)}px`,
  size: 2 + (i % 3),
}));

interface DragonpitLoaderProps {
  onComplete: () => void;
}

export default function DragonpitLoader({ onComplete }: DragonpitLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [subtitleIdx, setSubtitleIdx] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'exit'>('intro');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check session storage — skip if already seen this session
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      // Already seen — exit immediately
      setVisible(false);
      onComplete();
      return;
    }

    // Rotate subtitle text every 600 ms
    let idx = 0;
    const subtitleTimer = setInterval(() => {
      idx = (idx + 1) % SUBTITLES.length;
      setSubtitleIdx(idx);
    }, 600);

    // Auto-exit after MAX_DURATION
    timerRef.current = setTimeout(() => {
      handleExit();
    }, MAX_DURATION);

    return () => {
      clearInterval(subtitleTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExit = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('exit');
    // Prevent body scroll restoration
    setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch (_) { /* private browsing */ }
      onComplete();
    }, 600);
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="The Dragonpit is loading"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--dp-black)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: phase === 'exit' ? 'loaderExit 0.6s ease forwards' : 'none',
      }}
    >
      {/* Skip button */}
      <button
        onClick={handleExit}
        aria-label="Skip intro"
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'transparent',
          border: '1px solid var(--dp-border)',
          color: 'var(--dp-muted)',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: '2px',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--dp-gold)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dp-gold)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--dp-muted)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dp-border)';
        }}
      >
        Skip Intro
      </button>

      {/* SVG stage — medallion + fire ring + embers */}
      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Dark medallion background */}
          <circle
            cx="110" cy="110" r="90"
            fill="#060504"
            style={{
              animation: 'medallionAppear 0.5s ease forwards',
            }}
          />

          {/* Fire ring — travelling dashed stroke */}
          <circle
            cx="110" cy="110" r="90"
            stroke="url(#fireGrad)"
            strokeWidth="3"
            strokeDasharray="565"
            strokeDashoffset="565"
            strokeLinecap="round"
            style={{
              animation: 'fireRingTravel 2s ease-in-out 0.4s forwards',
              transformOrigin: 'center',
            }}
          />

          {/* Outer gold ring */}
          <circle
            cx="110" cy="110" r="96"
            stroke="#c79a45" strokeWidth="0.5" opacity="0.3"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6f0909"/>
              <stop offset="30%" stopColor="#a31313"/>
              <stop offset="60%" stopColor="#ff5a13"/>
              <stop offset="80%" stopColor="#f28b1d"/>
              <stop offset="100%" stopColor="#c79a45"/>
            </linearGradient>
          </defs>

          {/* Ember particles — decorative, aria-hidden on parent SVG */}
          {EMBERS.map(e => (
            <circle
              key={e.id}
              cx={e.x}
              cy={e.y}
              r={e.size}
              fill={e.id % 3 === 0 ? '#ff5a13' : e.id % 3 === 1 ? '#f28b1d' : '#c79a45'}
              style={{
                opacity: 0,
                // @ts-ignore
                '--tx': e.tx,
                animation: `emberRise 1.2s ease-out ${0.6 + e.delay}s forwards`,
              } as React.CSSProperties}
            />
          ))}
        </svg>

        {/* Sigil image centered in medallion */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/dragonpit/sigil-three-headed-red.svg"
            alt="The Dragonpit — three-headed dragon sigil"
            width={130}
            height={130}
            style={{
              width: 130,
              height: 130,
              objectFit: 'contain',
              animation: 'sigilGlow 1.8s ease forwards 0.3s',
              opacity: 0,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Title text */}
      <div style={{ marginTop: '32px', textAlign: 'center', userSelect: 'none' }}>
        <p
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontWeight: 900,
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--dp-gold)',
            opacity: 0,
            animation: 'textReveal 0.8s ease forwards 1.4s',
          }}
        >
          AWAKENING THE DRAGONPIT
        </p>
        <p
          aria-live="polite"
          style={{
            marginTop: '10px',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'var(--dp-muted)',
            minHeight: '1.2em',
            transition: 'opacity 0.3s',
            opacity: 0.6,
          }}
        >
          {SUBTITLES[subtitleIdx]}
        </p>
      </div>

      {/* Inline keyframe styles — loader exit needs to be inline since it references state */}
      <style>{`
        @keyframes medallionAppear {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes sigilGlow {
          0%   { opacity: 0; filter: drop-shadow(0 0 0px #a31313) brightness(0.3); }
          40%  { opacity: 0.6; filter: drop-shadow(0 0 16px #a31313) brightness(0.7); }
          100% { opacity: 1; filter: drop-shadow(0 0 32px #d32323) drop-shadow(0 0 60px #6f0909) brightness(1); }
        }
        @keyframes fireRingTravel {
          0%   { stroke-dashoffset: 565; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { stroke-dashoffset: -565; opacity: 0; }
        }
        @keyframes emberRise {
          0%   { opacity: 0.9; transform: translateY(0) translateX(0) scale(1); }
          70%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-70px) translateX(var(--tx)) scale(0.2); }
        }
        @keyframes textReveal {
          0%   { opacity: 0; letter-spacing: 0.3em; }
          100% { opacity: 1; letter-spacing: 0.18em; }
        }
        @keyframes loaderExit {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* Skip fire animation, just show sigil */
          circle[stroke="url(#fireGrad)"] { display: none !important; }
          img[alt*="dragon"] { opacity: 1 !important; animation: none !important; filter: drop-shadow(0 0 20px #a31313) !important; }
        }
      `}</style>
    </div>
  );
}
