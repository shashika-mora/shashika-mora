'use client';

import Link from 'next/link';
import { ThumbsUp, ThumbsDown, ArrowRight, MessageSquare } from 'lucide-react';
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
        background: 'rgba(10,8,7,0.6)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Thoughts"
          themed="MURMURS FROM THE PIT"
          description="Daily notes, academic insights, and real-time updates direct from the forge."
        />

        {loading ? (
          <ThoughtsSkeleton />
        ) : thoughts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', border: '1px solid var(--dp-border)', borderRadius: '6px', color: 'var(--dp-muted)', background: 'var(--dp-panel)' }}>
            <MessageSquare size={36} className="mx-auto mb-3 text-[var(--dp-gold)] opacity-70" />
            <p>No thoughts posted yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link href="/thoughts" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            See All Murmurs 🐉
            <ArrowRight size={16} aria-hidden="true" />
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
        borderRadius: '6px',
        padding: '26px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {thought.category && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              background: 'rgba(138, 13, 13, 0.3)',
              border: '1px solid var(--dp-red-bright)',
              borderRadius: '3px',
              color: 'var(--dp-gold-bright)',
            }}
          >
            {thought.category}
          </span>
        )}
        {thought.date && (
          <span style={{ fontSize: '0.76rem', color: 'var(--dp-smoke)', fontFamily: 'monospace', fontWeight: 600 }}>
            {thought.date}
          </span>
        )}
      </div>

      {/* Content */}
      <p style={{ color: '#ffffff', fontSize: '0.96rem', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontWeight: 400 }}>
        {thought.content}
      </p>

      {/* Vote row */}
      <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--dp-border)', paddingTop: '16px' }}>
        <button
          onClick={() => onVote(thought.id, 'like')}
          aria-pressed={vote === 'like'}
          aria-label={`Like — ${thought.likes || 0} likes`}
          className={`dp-vote-btn ${vote === 'like' ? 'active-like' : ''}`}
        >
          <ThumbsUp size={15} aria-hidden="true" />
          <span>{thought.likes || 0}</span>
        </button>
        <button
          onClick={() => onVote(thought.id, 'dislike')}
          aria-pressed={vote === 'dislike'}
          aria-label={`Dislike — ${thought.dislikes || 0} dislikes`}
          className={`dp-vote-btn ${vote === 'dislike' ? 'active-dislike' : ''}`}
        >
          <ThumbsDown size={15} aria-hidden="true" />
          <span>{thought.dislikes || 0}</span>
        </button>
      </div>
    </article>
  );
}

function ThoughtsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '6px', padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ height: '22px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '70px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          <div style={{ height: '16px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '100%' }} />
        </div>
      ))}
    </div>
  );
}
