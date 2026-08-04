'use client';

import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import { Shield, Sparkles } from 'lucide-react';

export default function DragonPassionNote() {
  return (
    <section
      id="dragon-note"
      style={{
        padding: '110px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'linear-gradient(180deg, rgba(10, 8, 7, 0.95) 0%, rgba(18, 14, 11, 0.98) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Dragon Parallax Layer */}
      <DragonBackgroundLayer imageSrc="/dragonpit/vhagar_1.jpg" opacity={0.12} position="bottom-right" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Valyrian Decree 📜"
          themed="WHY THE DRAGONPIT? 🐉🔥 — MY PASSION FOR DRAGONS"
          description="A personal note on my deep fascination with dragons, ASOIAF lore, House of the Dragon, and the engineering spirit."
        />

        <div
          className="dp-panel dp-ember-hover"
          style={{
            position: 'relative',
            padding: '40px 48px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            background: 'linear-gradient(135deg, rgba(22, 18, 15, 0.95) 0%, rgba(13, 10, 8, 0.98) 100%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.85), inset 0 0 20px rgba(255, 90, 19, 0.1)',
          }}
        >
          {/* Top Decorative Emblem Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.8rem' }}>🐉</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
                Unyielding Power, Architecture & Art ⚔️
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--dp-gold-soft)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>
                House Targaryen · Westeros & Essos Lore · Engineering Spirit 👑
              </p>
            </div>
          </div>

          {/* Letter Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: 'var(--dp-smoke)', fontSize: '0.98rem', lineHeight: '1.85' }}>
            <p>
              To me, dragons are far more than mythical beasts—they represent the ultimate symbol of raw creative energy, fierce independence, and majestic architecture. Whether turning the pages of George R.R. Martin’s <em style={{ color: 'var(--dp-gold-bright)', fontStyle: 'normal' }}>A Song of Ice and Fire</em> books or watching legendary sagas like <em style={{ color: 'var(--dp-gold-bright)', fontStyle: 'normal' }}>Game of Thrones</em>, <em style={{ color: 'var(--dp-gold-bright)', fontStyle: 'normal' }}>House of the Dragon</em>, and <em style={{ color: 'var(--dp-gold-bright)', fontStyle: 'normal' }}>A Knight of the Seven Kingdoms</em>, dragons embody the thrill of conquering immense challenges against all odds. 🛡️
            </p>

            <p>
              In software engineering and hardware design, building resilient systems demands that exact same dragon-rider spirit: bold ambition, uncompromising craftsmanship, and the courage to tame intricate complexity beneath the surface. 💻🔥
            </p>

            <p>
              I built <strong style={{ color: '#ffffff' }}>The Dragonpit</strong> as a tribute to these magnificent creatures and as a sanctuary for my work—where ideas hatch, systems take flight, and passion meets fire-forged code. 🐦‍⬛📜
            </p>
          </div>

          {/* Signature Footer */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(212, 175, 55, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--dp-gold-bright)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--dp-gold-bright)', letterSpacing: '0.06em' }}>
                FORGED IN VALYRIAN FIRE & CODE 🗡️
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🐉</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--dp-smoke)', fontWeight: 700 }}>
                — Shashika Dayarathna
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
