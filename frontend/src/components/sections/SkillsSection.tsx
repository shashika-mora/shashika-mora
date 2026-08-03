'use client';

import { Cpu, Layers, BookOpen } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

const CATEGORY_ICONS = [Cpu, Layers, BookOpen];

const parseSkill = (skill: any) => {
  if (!skill) return { name: '', iconUrl: '' };
  if (typeof skill === 'string') {
    if (skill.includes('|')) {
      const [name, iconUrl] = skill.split('|');
      return { name: name.trim(), iconUrl: iconUrl.trim() };
    }
    return { name: skill, iconUrl: '' };
  }
  return { name: skill.name || '', iconUrl: skill.iconUrl || '' };
};

interface SkillsSectionProps {
  skills: any[];
  about: any;
  loading: boolean;
}

export default function SkillsSection({ skills, about, loading }: SkillsSectionProps) {
  const hasStructuredSkills = skills && skills.length > 0;
  const fallbackSkills = hasStructuredSkills ? [] : (Array.isArray(about?.skills) ? about.skills : []);

  return (
    <section
      id="skills"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(10,8,7,0.7)',
        position: 'relative',
      }}
    >
      {/* Scale pattern overlay */}
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
            src="/dragonpit/vermithor-skills.png"
            alt="Vermithor The Bronze Fury — System Architecture Dragon Guardian"
            style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--dp-gold-bright)' }}
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
          <GroupedSkills skills={skills} />
        ) : (
          <FlatSkills skills={fallbackSkills} />
        )}
      </div>
    </section>
  );
}

function GroupedSkills({ skills }: { skills: any[] }) {
  const groups: Record<string, any[]> = {};
  skills.forEach(skill => {
    if (skill.visible === false) return;
    const cat = skill.category || 'General';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(skill);
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
      {Object.entries(groups).map(([category, items], idx) => {
        const Icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
        return (
          <div
            key={category}
            className="dp-ember-hover"
            style={{
              background: 'var(--dp-panel)',
              border: '1px solid var(--dp-border)',
              borderRadius: '6px',
              padding: '26px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--dp-gold-bright)',
                borderBottom: '1px solid var(--dp-border)',
                paddingBottom: '14px',
                marginBottom: '18px',
              }}
            >
              <Icon size={16} aria-hidden="true" className="text-[var(--dp-ember)]" />
              {category}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {items.map((skill, i) => (
                <span key={i} className="dp-skill-chip skill-chip">
                  {skill.iconUrl && (
                    <img
                      src={skill.iconUrl}
                      alt=""
                      width={16}
                      height={16}
                      style={{ objectFit: 'contain', flexShrink: 0 }}
                    />
                  )}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FlatSkills({ skills }: { skills: any[] }) {
  return (
    <div
      style={{
        background: 'var(--dp-panel)',
        border: '1px solid var(--dp-border)',
        borderRadius: '6px',
        padding: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
      }}
    >
      {skills.map((skill, i) => {
        const { name, iconUrl } = parseSkill(skill);
        return (
          <span key={i} className="dp-skill-chip skill-chip">
            {iconUrl && (
              <img src={iconUrl} alt="" width={16} height={16} style={{ objectFit: 'contain' }} />
            )}
            {name}
          </span>
        );
      })}
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '6px', padding: '26px', animation: 'pulse 1.5s ease-in-out infinite' }}
        >
          <div style={{ height: '18px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '45%', marginBottom: '18px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} style={{ height: '32px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: `${60 + j * 14}px` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
