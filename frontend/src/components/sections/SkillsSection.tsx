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
        background: 'rgba(8,7,6,0.6)',
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
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Skills"
          themed="THE ARSENAL"
          description="Tools and technologies forged through projects, experimentation, and continuous learning."
        />

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {Object.entries(groups).map(([category, items], idx) => {
        const Icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
        return (
          <div
            key={category}
            className="dp-ember-hover"
            style={{
              background: 'var(--dp-panel)',
              border: '1px solid var(--dp-border)',
              borderRadius: '4px',
              padding: '24px',
            }}
          >
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dp-gold)',
                borderBottom: '1px solid var(--dp-border)',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}
            >
              <Icon size={14} aria-hidden="true" />
              {category}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {items.map((skill, i) => (
                <span key={i} className="dp-skill-chip skill-chip">
                  {skill.iconUrl && (
                    <img
                      src={skill.iconUrl}
                      alt=""
                      width={14}
                      height={14}
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
        borderRadius: '4px',
        padding: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
      }}
    >
      {skills.map((skill, i) => {
        const { name, iconUrl } = parseSkill(skill);
        return (
          <span key={i} className="dp-skill-chip skill-chip">
            {iconUrl && (
              <img src={iconUrl} alt="" width={14} height={14} style={{ objectFit: 'contain' }} />
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '4px', padding: '24px', animation: 'pulse 1.5s ease-in-out infinite' }}
        >
          <div style={{ height: '16px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '40%', marginBottom: '16px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} style={{ height: '28px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: `${50 + j * 12}px` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
