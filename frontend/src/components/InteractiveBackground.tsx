'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface GlowBlob {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  intensity: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize particles (drifting dust motes)
    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const colors = ['rgba(99, 102, 241, ', 'rgba(236, 72, 153, ', 'rgba(168, 85, 247, '];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.4, // Floating upwards
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Initialize glowing background blobs
    const blobs: GlowBlob[] = [
      {
        x: width * 0.2,
        y: height * 0.2,
        targetX: width * 0.2,
        targetY: height * 0.2,
        radius: Math.min(width, height) * 0.45,
        vx: 0.3,
        vy: 0.2,
        color: '99, 102, 241', // Indigo
        intensity: 0.08,
      },
      {
        x: width * 0.8,
        y: height * 0.8,
        targetX: width * 0.8,
        targetY: height * 0.8,
        radius: Math.min(width, height) * 0.45,
        vx: -0.25,
        vy: -0.3,
        color: '236, 72, 153', // Pink
        intensity: 0.08,
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        targetX: width * 0.5,
        targetY: height * 0.5,
        radius: Math.min(width, height) * 0.5,
        vx: 0.15,
        vy: -0.2,
        color: '168, 85, 247', // Purple
        intensity: 0.08,
      },
    ];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Adjust blob sizes on resize
      blobs.forEach((blob) => {
        blob.radius = Math.min(width, height) * 0.45;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020617'; // Base dark deep color slate-950
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse coordinates (smooth lag/inertia)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw Glowing Blobs (Mesh gradient look)
      blobs.forEach((blob, idx) => {
        // Natural floating motion
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off walls
        if (blob.x - blob.radius < 0 || blob.x + blob.radius > width) blob.vx *= -1;
        if (blob.y - blob.radius < 0 || blob.y + blob.radius > height) blob.vy *= -1;

        // Mouse attraction for the primary blob
        if (idx === 0 && mouse.active) {
          blob.x += (mouse.x - blob.x) * 0.015;
          blob.y += (mouse.y - blob.y) * 0.015;
        }

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.intensity})`);
        gradient.addColorStop(0.5, `rgba(${blob.color}, ${blob.intensity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Interactive Cursor Highlight Blob (Torchlight effect)
      if (mouse.active) {
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
        mouseGlow.addColorStop(0, 'rgba(99, 102, 241, 0.05)'); // subtle indigo
        mouseGlow.addColorStop(0.6, 'rgba(168, 85, 247, 0.01)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and Update Particles
      particles.forEach((p) => {
        // Drift movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        // Mouse interaction (repulsion field)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const forceRadius = 150;

          if (dist < forceRadius) {
            const force = (forceRadius - dist) / forceRadius;
            const angle = Math.atan2(dy, dx);
            // Push particle away gently
            p.x += Math.cos(angle) * force * 1.5;
            p.y += Math.sin(angle) * force * 1.5;
          }
        }

        // Draw particle
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect near particles with faint links for a digital mesh network vibe (under 100px)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.08;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />;
}
