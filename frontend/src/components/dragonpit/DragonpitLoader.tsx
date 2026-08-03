'use client';

import { useEffect, useState, useRef } from 'react';

const SESSION_KEY = 'dragonpit-intro-seen';
const MIN_DISPLAY_TIME = 2600; // Guaranteed minimum display time to showcase loader artwork

const SUBTITLES = [
  'Kindling the dragon flame…',
  'Opening the Valyrian archives…',
  'Summoning dragons of the pit…',
  'The Dragonpit is ready.',
];

/** Ember particle data */
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 100 + Math.sin((i / 16) * Math.PI * 2) * 90,
  y: 100 + Math.cos((i / 16) * Math.PI * 2) * 90,
  delay: (i / 16) * 1.4,
  tx: `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5)}px`,
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Rotate subtitle text
    let idx = 0;
    const subtitleTimer = setInterval(() => {
      idx = (idx + 1) % SUBTITLES.length;
      setSubtitleIdx(idx);
    }, 650);

    // Guaranteed minimum display duration so viewers get to see the artwork
    timerRef.current = setTimeout(() => {
      handleExit();
    }, MIN_DISPLAY_TIME);

    return () => {
      clearInterval(subtitleTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExit = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('exit');
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
        background: '#040303',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: phase === 'exit' ? 'loaderExit 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
      }}
    >
      {/* Ambient background fire glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
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
          background: 'rgba(20, 17, 15, 0.8)',
          border: '1px solid var(--dp-border)',
          color: 'var(--dp-gold-soft)',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dp-gold-bright)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(138, 13, 13, 0.4)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--dp-gold-soft)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dp-border)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20, 17, 15, 0.8)';
        }}
      >
        Skip Intro ⚔️
      </button>

      {/* Main Banner Artwork Stage */}
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        {/* SVG Fire Ring & Embers */}
        <svg
          width="260"
          height="260"
          viewBox="0 0 260 260"
          fill="none"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Travelling fire ring stroke */}
          <circle
            cx="130" cy="130" r="115"
            stroke="url(#fireGrad)"
            strokeWidth="3.5"
            strokeDasharray="722"
            strokeDashoffset="722"
            strokeLinecap="round"
            style={{
              animation: 'fireRingTravel 2.2s ease-in-out 0.2s forwards',
              transformOrigin: 'center',
            }}
          />

          {/* Outer gold accent circle */}
          <circle
            cx="130" cy="130" r="124"
            stroke="#ffd700" strokeWidth="0.8" opacity="0.4"
          />

          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a0d0d"/>
              <stop offset="35%" stopColor="#b81414"/>
              <stop offset="65%" stopColor="#ff5a13"/>
              <stop offset="85%" stopColor="#ff7b00"/>
              <stop offset="100%" stopColor="#ffd700"/>
            </linearGradient>
          </defs>

          {/* Ember particles */}
          {EMBERS.map(e => (
            <circle
              key={e.id}
              cx={e.x}
              cy={e.y}
              r={e.size}
              fill={e.id % 3 === 0 ? '#ff5a13' : e.id % 3 === 1 ? '#ff7b00' : '#ffd700'}
              style={{
                opacity: 0,
                // @ts-ignore
                '--tx': e.tx,
                animation: `emberRise 1.4s ease-out ${0.4 + e.delay}s forwards`,
              } as React.CSSProperties}
            />
          ))}
        </svg>

        {/* Dragonpit Banner Image (my_banner.png) Centered in Fire Ring */}
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
            src="/dragonpit/my_banner.png"
            alt="The Dragonpit Emblem Banner"
            style={{
              width: 190,
              height: 190,
              objectFit: 'contain',
              animation: 'sigilGlow 1.8s ease forwards 0.2s',
              opacity: 0,
            }}
          />
        </div>
      </div>

      {/* Subtitles & Title */}
      <div style={{ marginTop: '36px', textAlign: 'center', userSelect: 'none', zIndex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontWeight: 900,
            fontSize: '0.85rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--dp-gold-bright)',
            opacity: 0,
            animation: 'textReveal 0.8s ease forwards 0.6s',
            textShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
          }}
        >
          AWAKENING THE DRAGONPIT
        </p>
        <p
          aria-live="polite"
          style={{
            marginTop: '12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--dp-smoke)',
            minHeight: '1.4em',
            transition: 'opacity 0.3s',
            opacity: 0.85,
          }}
        >
          {SUBTITLES[subtitleIdx]}
        </p>
      </div>

      <style>{`
        @keyframes sigilGlow {
          0%   { opacity: 0; filter: drop-shadow(0 0 0px #8a0d0d) brightness(0.4); transform: scale(0.92); }
          50%  { opacity: 0.8; filter: drop-shadow(0 0 25px #ff5a13) brightness(0.9); transform: scale(1.02); }
          100% { opacity: 1; filter: drop-shadow(0 0 35px #ff5a13) drop-shadow(0 0 65px #8a0d0d) brightness(1.08); transform: scale(1); }
        }
        @keyframes fireRingTravel {
          0%   { stroke-dashoffset: 722; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { stroke-dashoffset: -722; opacity: 0; }
        }
        @keyframes emberRise {
          0%   { opacity: 0.9; transform: translateY(0) translateX(0) scale(1); }
          70%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-80px) translateX(var(--tx)) scale(0.2); }
        }
        @keyframes textReveal {
          0%   { opacity: 0; letter-spacing: 0.35em; }
          100% { opacity: 1; letter-spacing: 0.22em; }
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
