'use client';

import { useEffect, useRef } from 'react';

interface DragonBackgroundLayerProps {
  imageSrc: string;
  alt?: string;
  opacity?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left';
}

export default function DragonBackgroundLayer({
  imageSrc,
  alt = '',
  opacity = 0.04,
  position = 'top-right',
}: DragonBackgroundLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!layerRef.current) return;
        const scrolled = window.scrollY;
        layerRef.current.style.transform = `translate3d(0, ${scrolled * 0.03}px, 0)`;
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
        return { top: '-5%', left: '-10%' };
      case 'bottom-right':
        return { bottom: '-5%', right: '-10%' };
      case 'bottom-left':
        return { bottom: '-5%', left: '-10%' };
      case 'center-right':
        return { top: '25%', right: '-10%' };
      case 'center-left':
        return { top: '25%', left: '-10%' };
      case 'top-right':
      default:
        return { top: '-5%', right: '-10%' };
    }
  };

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '650px',
        height: '650px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        overflow: 'hidden',
        filter: 'grayscale(0.6) contrast(1.2) sepia(0.3)',
        mixBlendMode: 'screen',
        WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
        maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
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
          filter: 'brightness(0.9)',
        }}
      />
    </div>
  );
}
