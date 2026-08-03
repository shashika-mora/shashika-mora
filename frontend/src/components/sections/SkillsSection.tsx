'use client';

import { Cpu, Layers, BookOpen } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

const parseSkill = (skill: any) => {
  if (!skill) return { name: '', iconUrl: '' };
  if (typeof skill === 'string') {
    if (skill.includes('|')) {
      const [name, iconUrl] = skill.split('|');
      return { name: name.trim(), iconUrl: iconUrl.trim() };
    }
    return { name: skill, iconUrl: '' };
  }
  return { name: skill.name || '', iconUrl: skill.iconUrl || skill.icon || '' };
};

interface SkillsSectionProps {
  skills: any[];
  about: any;
  loading: boolean;
}

export default function SkillsSection({ skills, about, loading }: SkillsSectionProps) {
  const hasStructuredSkills = skills && skills.length > 0;

  return (
    <section
      id="skills"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(10,8,7,0.7)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Dragon Parallax Layer */}
      <DragonBackgroundLayer imageSrc="/dragonpit/vermithor_and_silverwing.jpg" opacity={0.08} position="bottom-left" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Skills"
          themed="VERMITHOR · THE BRONZE FURY (SYSTEMS ARCHITECTURE)"
          description="Backend architecture, system design, hardware, and engineering technologies forged through experience."
        />

        {/* Vermithor Dragon Feature Header Card */}
        <div
          className="mb-10 dp-ember-hover"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '24px',
            alignItems: 'center',
            background: 'var(--dp-panel)',
            border: '1px solid var(--dp-border)',
            borderRadius: '6px',
            padding: '20px 28px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <img
            src="/dragonpit/vermithor_1.jpg"
            alt="Vermithor The Bronze Fury — System Architecture Dragon Guardian"
            style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/dragonpit/vermithor-skills.png';
            }}
          />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase', marginBottom: '4px' }}>
              VERMITHOR · THE BRONZE FURY GUARDIAN
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--dp-smoke)', lineHeight: 1.5 }}>
              Symbolizing heavy technical foundations, operating systems, database architecture, low-level power, and robust software engineering capabilities.
            </p>
          </div>
        </div>

        {loading ? (
          <SkillsSkeleton />
        ) : hasStructuredSkills ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '28px' }}>
            {skills.map((categoryGroup, i) => {
              const IconComp = [Cpu, Layers, BookOpen][i % 3];
              return (
                <div
                  key={categoryGroup.id || i}
                  className="skills-card dp-ember-hover"
                  style={{
                    background: 'var(--dp-panel)',
                    border: '1px solid var(--dp-border)',
                    borderRadius: '6px',
                    padding: '28px 32px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <IconComp size={20} style={{ color: 'var(--dp-gold-bright)' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                      {categoryGroup.category || categoryGroup.title || 'Engineering Domain'}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(categoryGroup.items || categoryGroup.skills || []).map((skillItem: any, idx: number) => {
                      const { name, iconUrl } = parseSkill(skillItem);
                      return (
                        <span key={idx} className="dp-tech-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {iconUrl && (
                            <img
                              src={iconUrl}
                              alt=""
                              style={{ width: '14px', height: '14px', objectFit: 'contain' }}
                              onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                          )}
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="dp-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--dp-muted)' }}>
            <p>No structured skill categories found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '28px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: '#14100d', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ height: '20px', background: '#1c1713', borderRadius: '3px', width: '50%' }} />
          <div style={{ height: '36px', background: '#1c1713', borderRadius: '3px', width: '90%' }} />
        </div>
      ))}
    </div>
  );
}
