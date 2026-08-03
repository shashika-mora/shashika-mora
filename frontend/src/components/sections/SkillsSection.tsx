'use client';

import { useMemo } from 'react';
import { Cpu, Layers, BookOpen, Wrench, Code2, Database } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

const CATEGORY_ICONS: Record<string, any> = {
  frontend: Code2,
  backend: Cpu,
  languages: Code2,
  databases: Database,
  database: Database,
  tools: Wrench,
  devops: Layers,
};

const parseSkill = (skill: any) => {
  if (!skill) return { name: '', iconUrl: '' };
  if (typeof skill === 'string') {
    if (skill.includes('|')) {
      const [name, iconUrl] = skill.split('|');
      return { name: name.trim(), iconUrl: iconUrl.trim() };
    }
    return { name: skill, iconUrl: '' };
  }
  return {
    name: skill.name || skill.title || skill.label || '',
    iconUrl: skill.iconUrl || skill.icon || skill.logo || '',
  };
};

interface SkillsSectionProps {
  skills: any[];
  about: any;
  loading: boolean;
}

export default function SkillsSection({ skills, about, loading }: SkillsSectionProps) {
  const categories = useMemo(() => {
    if (!skills || skills.length === 0) {
      const fallback = Array.isArray(about?.skills) ? about.skills : [];
      if (fallback.length > 0) {
        return [{ category: 'Technical Skills', items: fallback }];
      }
      return [];
    }

    // Check if items are already grouped into categories
    const isGrouped = skills.some(s => Array.isArray(s.items) || Array.isArray(s.skills));
    if (isGrouped) {
      return skills
        .map(group => ({
          category: group.category || group.title || 'Engineering Domain',
          items: group.items || group.skills || [],
        }))
        .filter(g => g.items.length > 0);
    }

    // Flat list of skill documents -> group by category
    const map: Record<string, any[]> = {};
    skills.forEach(item => {
      const cat = item.category || item.group || 'General Skills';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });

    return Object.entries(map).map(([category, items]) => ({
      category,
      items,
    }));
  }, [skills, about]);

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
      <DragonBackgroundLayer imageSrc="/dragonpit/vermithor_and_silverwing.jpg" opacity={0.04} position="bottom-left" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Skills"
          themed="VERMITHOR · THE BRONZE FURY (SYSTEMS ARCHITECTURE)"
          description="Backend architecture, system design, hardware, and engineering technologies forged through experience."
        />

        {loading ? (
          <SkillsSkeleton />
        ) : categories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '28px' }}>
            {categories.map((catGroup, i) => {
              const catKey = catGroup.category.toLowerCase().trim();
              const IconComp = CATEGORY_ICONS[catKey] || [Cpu, Layers, BookOpen][i % 3];

              return (
                <div
                  key={catGroup.category || i}
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
                      {catGroup.category}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {catGroup.items.map((skillItem: any, idx: number) => {
                      const { name, iconUrl } = parseSkill(skillItem);
                      if (!name) return null;

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
            <p>No skills have been published yet.</p>
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
