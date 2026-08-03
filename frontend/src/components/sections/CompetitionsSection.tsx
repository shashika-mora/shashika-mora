'use client';

import Link from 'next/link';
import { ExternalLink, ArrowRight, Trophy } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

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
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Competitions"
          themed="TRIALS BY FIRE"
          description="Competitive programming milestones, hackathons, and software engineering challenges."
        />

        {loading ? (
          <CompetitionsSkeleton />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '28px', marginBottom: '40px' }}>
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
  return (
    <article
      className="competition-card dp-ember-hover"
      style={{
        background: 'var(--dp-panel)',
        border: '1px solid var(--dp-border)',
        borderRadius: '6px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        position: 'relative',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          {comp.title}
        </h3>
        <span style={{ fontSize: '0.72rem', color: 'var(--dp-gold-bright)', fontFamily: 'monospace', whiteSpace: 'nowrap', fontWeight: 600 }}>
          {comp.date}
        </span>
      </div>

      {/* Award badge */}
      {comp.award && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              background: 'linear-gradient(135deg, rgba(138, 13, 13, 0.4) 0%, rgba(212, 175, 55, 0.2) 100%)',
              border: '1px solid var(--dp-gold-bright)',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.04em',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.25)',
            }}
          >
            <Trophy size={14} aria-hidden="true" className="text-[var(--dp-gold-bright)]" />
            {comp.award}
          </span>
        </div>
      )}

      {/* Description */}
      <p style={{ color: 'var(--dp-smoke)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        {comp.description}
      </p>

      {/* Dual images */}
      {(comp.imageUrl || comp.imageUrl2) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderRadius: '4px', overflow: 'hidden' }}>
          {comp.imageUrl && (
            <div style={{ height: '130px', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--dp-border)' }}>
              <img
                src={comp.imageUrl}
                alt={`${comp.title} — photo 1`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          )}
          {comp.imageUrl2 && (
            <div style={{ height: '130px', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--dp-border)' }}>
              <img
                src={comp.imageUrl2}
                alt={`${comp.title} — photo 2`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          )}
        </div>
      )}

      {/* Link */}
      {comp.link && (
        <div style={{ borderTop: '1px solid var(--dp-border)', paddingTop: '16px' }}>
          <a
            href={comp.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dp-gold-soft)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-soft)'; }}
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '28px', marginBottom: '40px' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '6px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ height: '22px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '28px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '40%' }} />
          <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '90%' }} />
        </div>
      ))}
    </div>
  );
}
