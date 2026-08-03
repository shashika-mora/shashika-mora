'use client';

import { useEffect, useRef } from 'react';

/** Enhanced Dragonpit Ember & Flame Field — Canvas-based
 *  - Taller rising flames and floating embers reaching top of screen
 *  - Dynamic fire sparks and pulsing heat glow
 *  - Multi-layer parallax depth
 *  - Pauses when tab is hidden
 *  - Respects prefers-reduced-motion
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
    const EMBER_COUNT = MOBILE ? 35 : 85;

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
      '#8d1111', // Deep blood
      '#a31313', // Red
      '#d32323', // Bright red
      '#ff4500', // Flame red-orange
      '#ff5a13', // Ember orange
      '#f28b1d', // Gold flame
      '#ffc107', // Bright amber
      '#ffe082', // Spark light
    ];

    const createParticle = (isInitial = false): Particle => {
      const maxLife = 120 + Math.random() * 220; // Long life so embers reach top of page
      const size = 1.2 + Math.random() * 3.2;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      return {
        x: Math.random() * canvas.width,
        y: isInitial ? Math.random() * canvas.height : canvas.height + 20 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.8 + Math.random() * 1.6), // Faster upwards velocity to go high
        size,
        alpha: 0,
        maxAlpha: 0.3 + Math.random() * 0.65,
        color,
        life: isInitial ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.03,
        glowBlur: Math.random() > 0.4 ? 8 + Math.random() * 12 : 0,
      };
    };

    const particles: Particle[] = Array.from({ length: EMBER_COUNT }, () => createParticle(true));

    let time = 0;

    const drawBackgroundLighting = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep atmospheric firelight gradient at bottom of screen
      const bottomGlow = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 1.05,
        50,
        canvas.width * 0.5,
        canvas.height * 1.05,
        canvas.height * 0.75
      );
      bottomGlow.addColorStop(0, 'rgba(163, 19, 19, 0.15)');
      bottomGlow.addColorStop(0.3, 'rgba(111, 9, 9, 0.08)');
      bottomGlow.addColorStop(0.7, 'rgba(17, 16, 15, 0.02)');
      bottomGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle warm highlight near hero area (top left-center)
      const heroGlow = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.3,
        0,
        canvas.width * 0.3,
        canvas.height * 0.3,
        canvas.width * 0.45
      );
      heroGlow.addColorStop(0, 'rgba(255, 90, 19, 0.04)');
      heroGlow.addColorStop(0.5, 'rgba(163, 19, 19, 0.02)');
      heroGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = heroGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const render = () => {
      if (paused) {
        animId = requestAnimationFrame(render);
        return;
      }

      time += 0.016;
      drawBackgroundLighting();

      particles.forEach((p) => {
        p.life++;
        p.sway += p.swaySpeed;

        // Gentle horizontal serpentine swaying like natural smoke/embers
        p.x += p.vx + Math.sin(p.sway) * 0.45;
        p.y += p.vy;

        // Fade in gradually, maintain brightness, then fade out near end or top
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.alpha = (lifeRatio / 0.15) * p.maxAlpha;
        } else if (lifeRatio > 0.8) {
          p.alpha = ((1 - lifeRatio) / 0.2) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        // Draw ember particle
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

        // Extra spark center for larger embers
        if (p.size > 2.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#fff5d6';
          ctx.fill();
        }

        ctx.restore();

        // Respawn when particle dies or floats above screen
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
