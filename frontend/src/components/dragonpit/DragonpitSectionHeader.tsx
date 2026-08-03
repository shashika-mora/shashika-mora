'use client';

interface DragonpitSectionHeaderProps {
  /** Standard professional label shown prominently */
  label: string;
  /** Themed fantasy subtitle shown in small gold caps */
  themed?: string;
  /** Optional description paragraph */
  description?: string;
  /** Align left or center */
  align?: 'left' | 'center';
}

/**
 * Consistent section header for all Dragonpit sections.
 * The main label is always prominent; the themed subtitle is small and secondary
 * so navigation never depends on understanding fantasy terms.
 */
export default function DragonpitSectionHeader({
  label,
  themed,
  description,
  align = 'center',
}: DragonpitSectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 mb-14 ${alignClass}`}>
      {themed && (
        <span className="dp-section-subtitle" aria-hidden="true">
          {themed}
        </span>
      )}
      <h2
        className="font-heading text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
        style={{ color: 'var(--dp-text)' }}
      >
        {label}
      </h2>
      {/* Gold underline accent */}
      <div
        className={align === 'center' ? 'dp-divider' : 'dp-divider-left'}
        aria-hidden="true"
      />
      {description && (
        <p
          className="max-w-xl mt-2 leading-relaxed text-sm"
          style={{ color: 'var(--dp-muted)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
