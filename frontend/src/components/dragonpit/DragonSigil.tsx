'use client';

import Image from 'next/image';

interface DragonSigilProps {
  size?: number;
  className?: string;
  glowing?: boolean;
}

/**
 * Three-headed dragon sigil — used in loader, navbar, footer.
 * Falls back gracefully if the SVG asset is missing.
 */
export default function DragonSigil({ size = 48, className = '', glowing = false }: DragonSigilProps) {
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src="/dragonpit/sigil-three-headed-red.svg"
        alt=""
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: glowing
            ? 'drop-shadow(0 0 8px rgba(163, 19, 19, 0.8)) drop-shadow(0 0 20px rgba(163, 19, 19, 0.4))'
            : 'none',
          transition: 'filter 0.4s ease',
        }}
        onError={(e) => {
          // Graceful fallback: hide broken image icon
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
