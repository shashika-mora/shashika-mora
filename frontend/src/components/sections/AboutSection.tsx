'use client';

import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import MarkdownRenderer from '../MarkdownRenderer';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

interface AboutSectionProps {
  about: any;
}

export default function AboutSection({ about }: AboutSectionProps) {
  const bioText = about?.bio || about?.description || '';
  const secondaryBioText = about?.secondaryBio || '';

  return (
    <section
      id="about"
      style={{
        padding: '120px 24px',
        borderTop: '1px solid var(--dp-border)',
        position: 'relative',
        background: 'rgba(10,8,7,0.6)',
        overflow: 'hidden',
      }}
    >
      {/* Dual Background Dragon Parallax Layers */}
      <DragonBackgroundLayer imageSrc="/dragonpit/syrax_1.jpg" opacity={0.14} position="top-left" />
      <DragonBackgroundLayer imageSrc="/dragonpit/Syrax_Caraxes_Vhagar.jpg" opacity={0.14} position="bottom-right" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="About"
          themed="SYRAX THE GOLDEN QUEEN · THE RIDER'S CHRONICLE"
          align="center"
        />

        <div
          className="about-card dp-ember-hover"
          style={{
            background: 'var(--dp-panel)',
            border: '1px solid var(--dp-border)',
            borderRadius: '8px',
            padding: '44px 52px',
            position: 'relative',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          }}
        >
          {/* Gold top bar */}
          <div
            aria-hidden="true"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, var(--dp-gold-bright), var(--dp-ember), transparent)',
              marginBottom: '28px',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {bioText && <MarkdownRenderer content={bioText} />}
            {secondaryBioText && <MarkdownRenderer content={secondaryBioText} />}
          </div>

          {/* Bottom accent */}
          <div
            aria-hidden="true"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--dp-ember), var(--dp-gold-bright))',
              marginTop: '32px',
            }}
          />
        </div>
      </div>
    </section>
  );
}
