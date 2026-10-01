'use client';

import DragonSigil from './DragonSigil';

interface DragonpitSectionHeaderProps {
  /** Standard professional label shown prominently */
  label: string;
  /** Themed fantasy subtitle shown in small gold caps */
  themed?: string;
  /** Optional description paragraph */
  description?: string;
  /** Align left or center */
  align?: 'left' | 'center';
  /** Show miniature dragon sigil above header */
  showSigil?: boolean;
}

/**
 * Consistent section header for all Dragonpit sections.
 * Combines standard label with thematic ASOIAF / Dragon lore subtitle and gold divider.
 */
export default function DragonpitSectionHeader({
  label,
  themed,
  description,
  align = 'center',
  showSigil = true,
}: DragonpitSectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 mb-14 ${alignClass}`}>
      {showSigil && (
        <div className="flex items-center gap-3 opacity-90 mb-1" aria-hidden="true">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[var(--dp-gold-bright)]" />
          <DragonSigil size={24} glowing />
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[var(--dp-gold-bright)]" />
        </div>
      )}

      {themed && (
        <span className="dp-section-subtitle" aria-hidden="true">
          ⚔️ {themed} ⚔️
        </span>
      )}

      <h2
        className="font-heading text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
        style={{ color: '#ffffff' }}
      >
        {label}
      </h2>

      {/* Gold engraved underline accent */}
      <div
        className={align === 'center' ? 'dp-divider' : 'dp-divider-left'}
        aria-hidden="true"
      />

      {description && (
        <p
          className="max-w-xl mt-3 leading-relaxed text-sm md:text-base font-light"
          style={{ color: 'var(--dp-smoke)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
