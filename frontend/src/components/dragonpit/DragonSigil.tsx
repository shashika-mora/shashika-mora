'use client';

interface DragonSigilProps {
  size?: number;
  className?: string;
  glowing?: boolean;
}

/**
 * Dragon head sigil — using /dragonpit/my_icon.png across navbar, footer, loader, and badges.
 */
export default function DragonSigil({ size = 48, className = '', glowing = false }: DragonSigilProps) {
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      aria-hidden="true"
    >
      <img
        src="/dragonpit/my_icon.png"
        alt="Dragon Icon"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: glowing
            ? 'drop-shadow(0 0 10px rgba(255, 90, 19, 0.85)) drop-shadow(0 0 20px rgba(184, 20, 20, 0.6))'
            : 'none',
          transition: 'filter 0.4s ease',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
