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
  alt = 'Background Dragon Silhouette',
  opacity = 0.08,
  position = 'top-right',
}: DragonBackgroundLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!layerRef.current) return;
      const scrolled = window.scrollY;
      layerRef.current.style.transform = `translate3d(0, ${scrolled * 0.04}px, 0)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: '5%', left: '-4%' };
      case 'bottom-right':
        return { bottom: '5%', right: '-4%' };
      case 'bottom-left':
        return { bottom: '5%', left: '-4%' };
      case 'center-right':
        return { top: '35%', right: '-5%' };
      case 'center-left':
        return { top: '35%', left: '-5%' };
      case 'top-right':
      default:
        return { top: '5%', right: '-4%' };
    }
  };

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '440px',
        height: '440px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        filter: 'grayscale(0.2) contrast(1.1) blur(0.5px)',
        transition: 'transform 0.1s ease-out',
        ...getPositionStyles(),
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
