'use client';

import Link from 'next/link';
import { ExternalLink, ArrowRight, Trophy } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

interface CompetitionsSectionProps {
  competitions: any[];
  loading: boolean;
}

export default function CompetitionsSection({ competitions, loading }: CompetitionsSectionProps) {
  return (
    <section
      id="competitions"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(10,8,7,0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Dragon Parallax Layer */}
      <DragonBackgroundLayer imageSrc="/dragonpit/sunfyre_2.jpg" opacity={0.09} position="top-right" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Competitions"
          themed="SUNFYRE THE GOLDEN · TRIALS BY FIRE & TRIUMPHS"
          description="Competitive programming milestones, hackathons, and software engineering achievements."
        />

        {loading ? (
          <CompetitionsSkeleton />
        ) : competitions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px',
              background: '#14100d',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '8px',
              color: 'var(--dp-muted)',
              marginBottom: '32px',
            }}
          >
            <Trophy size={36} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No competition records have been published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '32px', marginBottom: '40px' }}>
            {competitions.map(comp => (
              <CompetitionCard key={comp.id} comp={comp} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/competitions" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            View All Achievements 🏆
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CompetitionCard({ comp }: { comp: any }) {
  const compTitle = comp.title || comp.name || '';
  const compAward = comp.award || comp.rank || comp.achievement || '';
  const compDate = comp.date || comp.year || comp.period || '';
  const compDesc = comp.description || comp.summary || '';
  const compLink = comp.link || comp.url || '';

  return (
    <article
      className="competition-card dp-ember-hover"
      style={{
        background: 'linear-gradient(180deg, #16120e 0%, #0f0c09 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '8px',
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          {compTitle}
        </h3>
        {compDate && (
          <span style={{ fontSize: '0.74rem', color: 'var(--dp-gold-bright)', fontFamily: 'monospace', whiteSpace: 'nowrap', fontWeight: 700 }}>
            {compDate}
          </span>
        )}
      </div>

      {/* Award badge */}
      {compAward && (
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
              letterSpacing: '0.04em',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.25)',
            }}
          >
            <Trophy size={14} aria-hidden="true" className="text-[var(--dp-gold-bright)]" />
            {compAward}
          </span>
        </div>
      )}

      {/* Description */}
      {compDesc && (
        <p style={{ color: 'var(--dp-smoke)', fontSize: '0.92rem', lineHeight: 1.75 }}>
          {compDesc}
        </p>
      )}

      {/* Dual images */}
      {(comp.imageUrl || comp.imageUrl2) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '14px', borderRadius: '4px', overflow: 'hidden' }}>
          {comp.imageUrl && (
            <div style={{ height: '140px', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
              <img
                src={comp.imageUrl}
                alt={`${compTitle} — photo 1`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          )}
          {comp.imageUrl2 && (
            <div style={{ height: '140px', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
              <img
                src={comp.imageUrl2}
                alt={`${compTitle} — photo 2`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          )}
        </div>
      )}

      {/* Link */}
      {compLink && (
        <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.25)', paddingTop: '18px' }}>
          <a
            href={compLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-bright)'; }}
          >
            <ExternalLink size={14} aria-hidden="true" />
            View Event Details
          </a>
        </div>
      )}
    </article>
  );
}

function CompetitionsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '32px', marginBottom: '40px' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ background: '#14100d', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ height: '22px', background: '#1c1713', borderRadius: '3px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '28px', background: '#1c1713', borderRadius: '3px', width: '40%' }} />
          <div style={{ height: '14px', background: '#1c1713', borderRadius: '3px', width: '90%' }} />
        </div>
      ))}
    </div>
  );
}
