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
        background: 'rgba(10,8,7,0.6)',
      }}
    >
      {/* Background scale texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/dragonpit/scale-pattern.svg')",
          backgroundSize: '80px 80px',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            borderRadius: '6px',
            padding: '44px 52px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          }}
        >
          {/* Dragon watermark image silhouette on right side */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '5%',
              right: '-5%',
              width: '320px',
              height: '320px',
              backgroundImage: "url('/dragonpit/sigil-three-headed-red.svg')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              opacity: 0.06,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 20px rgba(184,20,20,0.6))',
            }}
          />

          {/* Gold engraved top accent */}
          <div
            aria-hidden="true"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, var(--dp-gold-bright), var(--dp-ember), transparent)',
              marginBottom: '32px',
              boxShadow: '0 0 8px var(--dp-glow-gold)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <MarkdownRenderer content={about.secondaryBio || about.bio || ''} />
          </div>

          {/* Bottom accent */}
          <div
            aria-hidden="true"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--dp-ember), var(--dp-gold-bright))',
              marginTop: '32px',
              boxShadow: '0 0 8px var(--dp-glow-gold)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
