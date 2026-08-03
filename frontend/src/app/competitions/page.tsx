'use client';

import { useState, useEffect, useRef } from 'react';
import { getCompetitions, Competition } from '../../lib/firestore-service';
import { Trophy, ExternalLink, ArrowLeft, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import DragonBackgroundLayer from '../../components/dragonpit/DragonBackgroundLayer';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCompetitions();
      if (data) setCompetitions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = competitions.filter((c) =>
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.award || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useGSAP(() => {
    if (loading || filtered.length === 0) return;
    gsap.fromTo(
      '.comp-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [filtered, loading] });

  return (
    <div ref={containerRef} style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative' }}>
      <DragonBackgroundLayer imageSrc="/dragonpit/sunfyre_2.jpg" opacity={0.08} position="top-right" />
      {/* Back Link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '28px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dragonpit
      </Link>

      {/* Header Banner */}
      <div className="dp-panel mb-10" style={{ padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src="/dragonpit/sunfyre_1.jpg"
            alt="Sunfyre The Golden Dragon Guardian"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dragonpit/sunfyre-competitions.png'; }}
          />
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase' }}>
              SUNFYRE · TRIALS BY FIRE
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
              Competitions & Achievements
            </h1>
            <p style={{ color: 'var(--dp-smoke)', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.6 }}>
              Competitive programming milestones, hackathons, engineering trials, and contest resilience.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: '400px', width: '100%', marginBottom: '40px' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--dp-muted)' }} size={18} />
        <input
          type="text"
          placeholder="Search achievements by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="dp-input"
          style={{ paddingLeft: '48px' }}
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--dp-muted)' }}>Loading competition records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="dp-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--dp-muted)' }}>
          <Trophy size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>No competition records published yet</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--dp-muted)' }}>No competition records match your search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '32px' }}>
          {filtered.map((comp) => (
            <article key={comp.id} className="comp-card dp-panel dp-ember-hover" style={{ display: 'flex', flexDirection: 'column', padding: '32px 36px', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  {comp.title}
                </h3>
                {comp.date && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--dp-gold-bright)', fontFamily: 'monospace', fontWeight: 700 }}>
                    <Calendar size={11} className="inline mr-1" />
                    {comp.date}
                  </span>
                )}
              </div>

              {comp.award && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, rgba(138, 13, 13, 0.45) 0%, rgba(212, 175, 55, 0.25) 100%)',
                      border: '1px solid var(--dp-gold-bright)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#ffffff',
                    }}
                  >
                    <Trophy size={14} className="text-[var(--dp-gold-bright)]" />
                    {comp.award}
                  </span>
                </div>
              )}

              {comp.description && (
                <p style={{ color: 'var(--dp-smoke)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  {comp.description}
                </p>
              )}

              {(comp.imageUrl || comp.imageUrl2) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '12px', marginTop: 'auto' }}>
                  {comp.imageUrl && (
                    <div style={{ height: '140px', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
                      <img src={comp.imageUrl} alt={comp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  {comp.imageUrl2 && (
                    <div style={{ height: '140px', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
                      <img src={comp.imageUrl2} alt={comp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              )}

              {comp.link && (
                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
                  <a
                    href={comp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none' }}
                  >
                    <ExternalLink size={14} /> View Event Details
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
