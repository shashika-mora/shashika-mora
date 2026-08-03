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
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        position: 'relative',
        background: 'rgba(10,8,7,0.6)',
        overflow: 'hidden',
      }}
    >
      {/* Background Dragon Parallax Layer */}
      <DragonBackgroundLayer imageSrc="/dragonpit/syrax_and_silverwing.jpg" opacity={0.09} position="top-right" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="About"
          themed="SYRAX THE GOLDEN QUEEN · THE RIDER'S CHRONICLE"
          align="center"
        />

        {/* Syrax Dragon Guardian Header Card */}
        <div
          className="mb-10 dp-ember-hover"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '24px',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #16120e 0%, #0f0c09 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '8px',
            padding: '24px 32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)',
          }}
        >
          <img
            src="/dragonpit/syrax_1.jpg"
            alt="Syrax The Golden Queen — Dragon Guardian of Inspiration"
            style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dragonpit/caraxes-hero.png'; }}
          />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase', marginBottom: '6px' }}>
              SYRAX THE GOLDEN QUEEN · GUARDIAN OF INSPIRATION
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--dp-smoke)', lineHeight: 1.6 }}>
              Symbolizing elegance, high craftsmanship, creative software vision, systems experimentation, and architectural curiosity.
            </p>
          </div>
        </div>

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
