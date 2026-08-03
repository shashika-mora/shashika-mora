'use client';

import { useEffect, useRef } from 'react';

/** Lightweight ember field background — canvas-based, performance-conscious.
 *  - Fewer particles on mobile
 *  - Pauses when document.hidden
 *  - Respects prefers-reduced-motion
 *  - No external dependencies
 */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduced motion check
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let animId: number;
    let paused = false;

    const MOBILE = window.innerWidth < 768;
    const COUNT  = MOBILE ? 18 : 40;

    // Resize canvas
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Ember particle type
    type Ember = {
      x: number; y: number;
      vx: number; vy: number;
      alpha: number; size: number;
      color: string; life: number; maxLife: number;
    };

    const COLORS = ['#6f0909', '#a31313', '#d32323', '#ff5a13', '#f28b1d', '#c79a45'];

    const makeEmber = (): Ember => {
      const maxLife = 80 + Math.random() * 120;
      return {
        x:      Math.random() * canvas.width,
        y:      canvas.height + 10,
        vx:     (Math.random() - 0.5) * 0.6,
        vy:     -(0.3 + Math.random() * 0.7),
        alpha:  0,
        size:   1 + Math.random() * 2.5,
        color:  COLORS[Math.floor(Math.random() * COLORS.length)],
        life:   0,
        maxLife,
      };
    };

    const embers: Ember[] = Array.from({ length: COUNT }, makeEmber);

    // Draw the deep-red radial glow background (static, drawn once per frame)
    const drawBg = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Deep base — already set via CSS, canvas is transparent
      // Subtle red radial in the lower-centre
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.75, 0,
        canvas.width / 2, canvas.height * 0.75, canvas.height * 0.6,
      );
      grad.addColorStop(0,   'rgba(111, 9, 9, 0.06)');
      grad.addColorStop(0.5, 'rgba(111, 9, 9, 0.02)');
      grad.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const tick = () => {
      if (paused) { animId = requestAnimationFrame(tick); return; }

      drawBg();

      embers.forEach(e => {
        e.life++;
        e.x  += e.vx;
        e.y  += e.vy;
        // Fade in then out
        const progress = e.life / e.maxLife;
        e.alpha = progress < 0.2
          ? progress / 0.2 * 0.7
          : progress > 0.7
            ? (1 - progress) / 0.3 * 0.7
            : 0.7;

        ctx.save();
        ctx.globalAlpha = e.alpha * 0.55;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur  = 6;
        ctx.fill();
        ctx.restore();

        // Respawn
        if (e.life >= e.maxLife || e.y < -20) {
          Object.assign(e, makeEmber());
        }
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // Pause when tab hidden to save CPU
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
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
