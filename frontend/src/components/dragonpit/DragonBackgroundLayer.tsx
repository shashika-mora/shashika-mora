'use client';

import { useEffect, useRef } from 'react';

interface DragonBackgroundLayerProps {
  imageSrc: string;
  alt?: string;
  opacity?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left';
  size?: number;
}

export default function DragonBackgroundLayer({
  imageSrc,
  alt = '',
  opacity = 0.16,
  position = 'top-right',
  size = 520,
}: DragonBackgroundLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!layerRef.current) return;
        const scrolled = window.scrollY;
        const translateY = scrolled * 0.025;
        const baseTransform = position.includes('center') ? 'translateY(-50%)' : '';
        layerRef.current.style.transform = `${baseTransform} translate3d(0, ${translateY}px, 0)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [position]);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top-left':
        return { top: '60px', left: '-40px' };
      case 'bottom-right':
        return { bottom: '60px', right: '-40px' };
      case 'bottom-left':
        return { bottom: '60px', left: '-40px' };
      case 'center-right':
        return { top: '50%', right: '-40px', transform: 'translateY(-50%)' };
      case 'center-left':
        return { top: '50%', left: '-40px', transform: 'translateY(-50%)' };
      case 'top-right':
      default:
        return { top: '60px', right: '-40px' };
    }
  };

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        overflow: 'hidden',
        filter: 'contrast(1.25) sepia(0.25) saturate(1.15)',
        mixBlendMode: 'lighten',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        WebkitMaskComposite: 'destination-in',
        maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        maskComposite: 'intersect',
        willChange: 'transform',
        ...getPositionStyles(),
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(1.2)',
        }}
      />

      {/* Inner Radial Edge Fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 35%, #0a0807 92%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
