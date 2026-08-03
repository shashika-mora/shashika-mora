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
  opacity = 0.12,
  position = 'top-right',
  size = 540,
}: DragonBackgroundLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!layerRef.current) return;
        const scrolled = window.scrollY;
        layerRef.current.style.transform = `translate3d(0, ${scrolled * 0.035}px, 0)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top-left':
        return { top: '0%', left: '-4%' };
      case 'bottom-right':
        return { bottom: '0%', right: '-4%' };
      case 'bottom-left':
        return { bottom: '0%', left: '-4%' };
      case 'center-right':
        return { top: '20%', right: '-4%' };
      case 'center-left':
        return { top: '20%', left: '-4%' };
      case 'top-right':
      default:
        return { top: '0%', right: '-4%' };
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
        filter: 'contrast(1.25) sepia(0.2) saturate(1.1)',
        mixBlendMode: 'lighten',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 78%)',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 78%)',
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
          filter: 'brightness(1.15)',
        }}
      />
    </div>
  );
}
