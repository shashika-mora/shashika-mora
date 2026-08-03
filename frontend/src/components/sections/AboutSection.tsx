'use client';

import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import MarkdownRenderer from '../MarkdownRenderer';

interface AboutSectionProps {
  about: any;
}

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section
      id="about"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="About"
          themed="THE RIDER'S CHRONICLE"
          align="center"
        />

        <div
          className="about-card dp-ember-hover"
          style={{
            background: 'var(--dp-panel)',
            border: '1px solid var(--dp-border)',
            borderRadius: '4px',
            padding: '40px 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative large initial letter */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-10px',
              right: '32px',
              fontFamily: 'Georgia, serif',
              fontSize: '10rem',
              fontWeight: 900,
              color: 'var(--dp-blood)',
              opacity: 0.04,
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            D
          </span>

          {/* Gold engraved top accent */}
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, var(--dp-gold), transparent)',
              marginBottom: '32px',
              opacity: 0.3,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <MarkdownRenderer content={about.secondaryBio || about.bio || ''} />
          </div>

          {/* Bottom accent */}
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--dp-gold))',
              marginTop: '32px',
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    </section>
  );
}
