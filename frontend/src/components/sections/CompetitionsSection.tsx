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
        background: 'rgba(8,7,6,0.5)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Competitions"
          themed="TRIALS BY FIRE"
          description="Competitive programming, hackathons, and engineering challenges I've participated in."
        />

        {loading ? (
          <CompetitionsSkeleton />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {competitions.map(comp => (
              <CompetitionCard key={comp.id} comp={comp} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link href="/competitions" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            See All Competitions
            <ArrowRight size={14} aria-hidden="true" />
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
        borderRadius: '4px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'var(--dp-text)',
          }}
        >
          {comp.title}
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--dp-muted)', fontFamily: 'monospace', whiteSpace: 'nowrap', paddingTop: '2px' }}>
          {comp.date}
        </span>
      </div>

      {/* Award badge */}
      {comp.award && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px',
              background: 'rgba(111, 9, 9, 0.18)',
              border: '1px solid rgba(111, 9, 9, 0.4)',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--dp-gold-soft)',
              letterSpacing: '0.04em',
            }}
          >
            <Trophy size={12} aria-hidden="true" />
            {comp.award}
          </span>
        </div>
      )}

      {/* Description */}
      <p style={{ color: 'var(--dp-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
        {comp.description}
      </p>

      {/* Dual images */}
      {(comp.imageUrl || comp.imageUrl2) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderRadius: '3px', overflow: 'hidden' }}>
          {comp.imageUrl && (
            <div style={{ height: '120px', overflow: 'hidden', borderRadius: '3px', border: '1px solid var(--dp-border)' }}>
              <img
                src={comp.imageUrl}
                alt={`${comp.title} — photo 1`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          )}
          {comp.imageUrl2 && (
            <div style={{ height: '120px', overflow: 'hidden', borderRadius: '3px', border: '1px solid var(--dp-border)' }}>
              <img
                src={comp.imageUrl2}
                alt={`${comp.title} — photo 2`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          )}
        </div>
      )}

      {/* Link */}
      {comp.link && (
        <div style={{ borderTop: '1px solid var(--dp-border)', paddingTop: '14px' }}>
          <a
            href={comp.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--dp-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-muted)'; }}
          >
            <ExternalLink size={13} aria-hidden="true" />
            View Event Details
          </a>
        </div>
      )}
    </article>
  );
}

function CompetitionsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px', marginBottom: '40px' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '4px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '20px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '24px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '40%' }} />
          <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '90%' }} />
          <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '75%' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ height: '120px', background: 'var(--dp-charcoal)', borderRadius: '3px' }} />
            <div style={{ height: '120px', background: 'var(--dp-charcoal)', borderRadius: '3px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
