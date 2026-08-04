'use client';

import Link from 'next/link';
import { ThumbsUp, ThumbsDown, ArrowRight, MessageSquare } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

interface ThoughtsSectionProps {
  thoughts: any[];
  loading: boolean;
  onVote: (id: string, type: 'like' | 'dislike') => void;
  userVotes: Record<string, 'like' | 'dislike'>;
}

export default function ThoughtsSection({ thoughts, loading, onVote, userVotes }: ThoughtsSectionProps) {
  return (
    <section
      id="thoughts"
      style={{
        padding: '120px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(10,8,7,0.7)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dual Background Dragon Parallax Layers */}
      <DragonBackgroundLayer imageSrc="/dragonpit/meleys_1.jpg" opacity={0.14} position="top-left" />
      <DragonBackgroundLayer imageSrc="/dragonpit/meleys_3.jpg" opacity={0.14} position="bottom-right" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Thoughts"
          themed="MELEYS THE RED QUEEN · MURMURS FROM THE PIT"
          description="Quick technical thoughts, architectural notes, code snippets, and daily logs."
        />

        {loading ? (
          <ThoughtsSkeleton />
        ) : thoughts.length === 0 ? (
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
            <MessageSquare size={36} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No thoughts recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {thoughts.slice(0, 4).map(thought => (
              <article
                key={thought.id}
                className="thought-card dp-ember-hover"
                style={{
                  background: 'linear-gradient(180deg, #16120e 0%, #0f0c09 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '8px',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  {thought.category && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        background: 'rgba(138, 13, 13, 0.35)',
                        border: '1px solid var(--dp-border)',
                        borderRadius: '3px',
                        color: 'var(--dp-gold-bright)',
                      }}
                    >
                      {thought.category}
                    </span>
                  )}
                  {thought.date && (
                    <span style={{ fontSize: '0.76rem', color: 'var(--dp-smoke)', fontFamily: 'monospace' }}>
                      {thought.date}
                    </span>
                  )}
                </div>

                <p style={{ color: '#ffffff', fontSize: '0.94rem', lineHeight: 1.7, flexGrow: 1, whiteSpace: 'pre-wrap' }}>
                  {thought.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '14px', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
                  <button
                    onClick={() => onVote(thought.id, 'like')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: userVotes[thought.id] === 'like' ? '1px solid var(--dp-gold-bright)' : '1px solid rgba(212, 175, 55, 0.3)',
                      background: userVotes[thought.id] === 'like' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(15, 12, 9, 0.9)',
                      color: userVotes[thought.id] === 'like' ? 'var(--dp-gold-bright)' : 'var(--dp-smoke)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ThumbsUp size={14} /> {thought.likes || 0}
                  </button>
                  <button
                    onClick={() => onVote(thought.id, 'dislike')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: userVotes[thought.id] === 'dislike' ? '1px solid var(--dp-red-bright)' : '1px solid rgba(212, 175, 55, 0.3)',
                      background: userVotes[thought.id] === 'dislike' ? 'rgba(138, 13, 13, 0.3)' : 'rgba(15, 12, 9, 0.9)',
                      color: userVotes[thought.id] === 'dislike' ? 'var(--dp-red-bright)' : 'var(--dp-smoke)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ThumbsDown size={14} /> {thought.dislikes || 0}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/thoughts" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            Read All Thoughts 💬
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ThoughtsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: '#14100d', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ height: '18px', background: '#1c1713', borderRadius: '3px', width: '40%' }} />
          <div style={{ height: '48px', background: '#1c1713', borderRadius: '3px', width: '90%' }} />
        </div>
      ))}
    </div>
  );
}
