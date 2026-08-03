'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getThoughts, updateThoughtVote, Thought } from '../../lib/firestore-service';
import { ThumbsUp, ThumbsDown, ArrowLeft, Search, Tag, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import DragonBackgroundLayer from '../../components/dragonpit/DragonBackgroundLayer';

const CATEGORIES = ['All', 'Tech', 'Academic', 'Life', 'Ideas', 'General'];
const VOTES_KEY = 'thoughts_votes';

function loadVotes(): Record<string, 'like' | 'dislike'> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveVotes(votes: Record<string, 'like' | 'dislike'>) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [votes, setVotes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVotes(loadVotes());
    async function load() {
      const data = await getThoughts();
      if (data) setThoughts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = thoughts.filter((t) => {
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchSearch =
      (t.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleVote = useCallback(
    async (id: string, type: 'like' | 'dislike') => {
      const currentVote = votes[id];
      const isSame = currentVote === type;
      const isSwitch = currentVote && currentVote !== type;

      const prevThoughts = thoughts;
      const prevVotes = { ...votes };

      const newVotes = { ...votes };
      const thoughtUpdates: Record<string, number> = {};

      if (isSame) {
        delete newVotes[id];
        thoughtUpdates[type === 'like' ? 'likes' : 'dislikes'] = -1;
      } else if (isSwitch) {
        newVotes[id] = type;
        thoughtUpdates[type === 'like' ? 'likes' : 'dislikes'] = 1;
        thoughtUpdates[type === 'like' ? 'dislikes' : 'likes'] = -1;
      } else {
        newVotes[id] = type;
        thoughtUpdates[type === 'like' ? 'likes' : 'dislikes'] = 1;
      }

      setVotes(newVotes);
      saveVotes(newVotes);
      setThoughts((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                likes: Math.max(0, (t.likes || 0) + (thoughtUpdates.likes || 0)),
                dislikes: Math.max(0, (t.dislikes || 0) + (thoughtUpdates.dislikes || 0)),
              }
            : t
        )
      );

      try {
        await updateThoughtVote(id, thoughtUpdates);
      } catch {
        setThoughts(prevThoughts);
        setVotes(prevVotes);
        saveVotes(prevVotes);
      }
    },
    [votes, thoughts]
  );

  useGSAP(() => {
    if (loading || filtered.length === 0) return;
    gsap.fromTo(
      '.thought-item',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [filtered, loading] });

  return (
    <div ref={containerRef} style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative' }}>
      <DragonBackgroundLayer imageSrc="/dragonpit/meleys_1.jpg" opacity={0.08} position="top-right" />
      {/* Back Link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '28px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dragonpit
      </Link>

      {/* Header Banner */}
      <div className="dp-panel mb-10" style={{ padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src="/dragonpit/meleys_1.jpg"
            alt="Meleys The Red Queen Dragon Guardian"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dragonpit/caraxes-hero.png'; }}
          />
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase' }}>
              MELEYS · MURMURS FROM THE PIT
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
              Thoughts & Murmurs
            </h1>
            <p style={{ color: 'var(--dp-smoke)', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.6 }}>
              Quick thoughts, architectural notes, code snippets, and reflections from daily engineering.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--dp-border)' }}>
        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--dp-muted)' }} size={18} />
          <input
            type="text"
            placeholder="Search thoughts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dp-input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid var(--dp-border)',
                background: selectedCategory === cat ? 'var(--dp-blood)' : 'rgba(22, 18, 15, 0.9)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--dp-gold-soft)',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--dp-muted)' }}>Loading thoughts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="dp-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--dp-muted)' }}>
          <MessageSquare size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>No thoughts recorded yet</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--dp-muted)' }}>No thoughts match your query or category selection.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filtered.map((thought) => {
            const userVote = votes[thought.id];
            return (
              <article key={thought.id} className="thought-item dp-panel dp-ember-hover" style={{ padding: '28px 34px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                <p style={{ color: '#ffffff', fontSize: '0.96rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {thought.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '14px', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
                  <button
                    onClick={() => handleVote(thought.id, 'like')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: userVote === 'like' ? '1px solid var(--dp-gold-bright)' : '1px solid rgba(212, 175, 55, 0.3)',
                      background: userVote === 'like' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(15, 12, 9, 0.9)',
                      color: userVote === 'like' ? 'var(--dp-gold-bright)' : 'var(--dp-smoke)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ThumbsUp size={14} /> {thought.likes || 0}
                  </button>
                  <button
                    onClick={() => handleVote(thought.id, 'dislike')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: userVote === 'dislike' ? '1px solid var(--dp-red-bright)' : '1px solid rgba(212, 175, 55, 0.3)',
                      background: userVote === 'dislike' ? 'rgba(138, 13, 13, 0.3)' : 'rgba(15, 12, 9, 0.9)',
                      color: userVote === 'dislike' ? 'var(--dp-red-bright)' : 'var(--dp-smoke)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ThumbsDown size={14} /> {thought.dislikes || 0}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
