'use client';

import { useEffect, useRef } from 'react';

/** Dragonpit Burning Ember Field Background
 *  - High performance canvas rendering rising fire ember particles
 *  - Refined smaller particle sizes (0.8px - 2.2px) for an elegant atmospheric burning effect
 *  - Pure dark obsidian background
 */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let animId: number;
    let paused = false;

    const MOBILE = window.innerWidth < 768;
    const EMBER_COUNT = MOBILE ? 40 : 90;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      maxAlpha: number;
      color: string;
      life: number;
      maxLife: number;
      sway: number;
      swaySpeed: number;
      glowBlur: number;
    };

    const COLORS = [
      '#8a0d0d', // Deep blood
      '#b81414', // Red
      '#e62e2e', // Bright red
      '#ff5a13', // Ember orange
      '#ff7b00', // Gold flame
      '#ffd700', // Bright amber
    ];

    const createParticle = (isInitial = false): Particle => {
      const maxLife = 160 + Math.random() * 240;
      // Refined slightly smaller particle size (0.8px - 2.2px)
      const size = 0.8 + Math.random() * 1.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      return {
        x: Math.random() * canvas.width,
        y: isInitial ? Math.random() * canvas.height : canvas.height + 20 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.7 + Math.random() * 1.4),
        size,
        alpha: 0,
        maxAlpha: 0.35 + Math.random() * 0.6,
        color,
        life: isInitial ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.03,
        glowBlur: Math.random() > 0.4 ? 4 + Math.random() * 8 : 0,
      };
    };

    const particles: Particle[] = Array.from({ length: EMBER_COUNT }, () => createParticle(true));

    const render = () => {
      if (paused) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.life++;
        p.sway += p.swaySpeed;

        p.x += p.vx + Math.sin(p.sway) * 0.4;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.alpha = (lifeRatio / 0.15) * p.maxAlpha;
        } else if (lifeRatio > 0.8) {
          p.alpha = ((1 - lifeRatio) / 0.2) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.glowBlur > 0) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.glowBlur;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.size > 1.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#fff5d6';
          ctx.fill();
        }

        ctx.restore();

        if (p.life >= p.maxLife || p.y < -30) {
          Object.assign(p, createParticle(false));
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
