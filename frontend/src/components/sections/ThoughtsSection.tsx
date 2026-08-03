'use client';

import Link from 'next/link';
import { ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

interface ThoughtsSectionProps {
  thoughts: any[];
  loading: boolean;
  votes: Record<string, 'like' | 'dislike'>;
  onVote: (id: string, type: 'like' | 'dislike') => void;
}

export default function ThoughtsSection({ thoughts, loading, votes, onVote }: ThoughtsSectionProps) {
  return (
    <section
      id="thoughts"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(8,7,6,0.6)',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Thoughts"
          themed="MURMURS FROM THE PIT"
          description="Random thoughts, academic notes, and daily updates from the forge floor."
        />

        {loading ? (
          <ThoughtsSkeleton />
        ) : thoughts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', border: '1px solid var(--dp-border)', borderRadius: '4px', color: 'var(--dp-muted)' }}>
            No thoughts posted yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {thoughts.map(thought => (
              <ThoughtCard
                key={thought.id}
                thought={thought}
                vote={votes[thought.id]}
                onVote={onVote}
              />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/thoughts" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            See All Thoughts
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ThoughtCard({ thought, vote, onVote }: { thought: any; vote?: string; onVote: (id: string, type: 'like' | 'dislike') => void }) {
  return (
    <article
      className="thought-card dp-ember-hover"
      style={{
        background: 'var(--dp-panel)',
        border: '1px solid var(--dp-border)',
        borderRadius: '4px',
        padding: '22px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {thought.category && (
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              background: 'rgba(111, 9, 9, 0.2)',
              border: '1px solid rgba(111, 9, 9, 0.35)',
              borderRadius: '2px',
              color: 'var(--dp-gold-soft)',
            }}
          >
            {thought.category}
          </span>
        )}
        {thought.date && (
          <span style={{ fontSize: '0.72rem', color: 'var(--dp-muted)', fontFamily: 'monospace' }}>
            {thought.date}
          </span>
        )}
      </div>

      {/* Content */}
      <p style={{ color: 'var(--dp-text)', fontSize: '0.9rem', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontWeight: 300 }}>
        {thought.content}
      </p>

      {/* Vote row */}
      <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--dp-border)', paddingTop: '14px' }}>
        <button
          onClick={() => onVote(thought.id, 'like')}
          aria-pressed={vote === 'like'}
          aria-label={`Like — ${thought.likes || 0} likes`}
          className={`dp-vote-btn ${vote === 'like' ? 'active-like' : ''}`}
        >
          <ThumbsUp size={13} aria-hidden="true" />
          <span>{thought.likes || 0}</span>
        </button>
        <button
          onClick={() => onVote(thought.id, 'dislike')}
          aria-pressed={vote === 'dislike'}
          aria-label={`Dislike — ${thought.dislikes || 0} dislikes`}
          className={`dp-vote-btn ${vote === 'dislike' ? 'active-dislike' : ''}`}
        >
          <ThumbsDown size={13} aria-hidden="true" />
          <span>{thought.dislikes || 0}</span>
        </button>
      </div>
    </article>
  );
}

function ThoughtsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '4px', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ height: '20px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '60px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '80px' }} />
          </div>
          <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '100%' }} />
          <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '85%' }} />
        </div>
      ))}
    </div>
  );
}
