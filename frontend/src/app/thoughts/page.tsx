'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getThoughts, updateThoughtVote } from '../../lib/firestore-service';
import { ThumbsUp, ThumbsDown, ArrowLeft, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  const [thoughts, setThoughts] = useState([]);
  const [votes, setVotes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const containerRef = useRef(null);

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
      t.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleVote = useCallback(
    async (id: string, type: 'like' | 'dislike') => {
      const currentVote = votes[id];
      const isSame = currentVote === type;
      const isSwitch = currentVote && currentVote !== type;

      const prevThoughts = thoughts;
      const prevVotes = { ...votes };

      // Optimistic update
      const newVotes = { ...votes };
      const thoughtUpdates: Record<string, number> = {};

      if (isSame) {
        // Toggle off
        delete newVotes[id];
        thoughtUpdates[type === 'like' ? 'likes' : 'dislikes'] = -1;
      } else if (isSwitch) {
        // Switch vote
        newVotes[id] = type;
        thoughtUpdates[type === 'like' ? 'likes' : 'dislikes'] = 1;
        thoughtUpdates[type === 'like' ? 'dislikes' : 'likes'] = -1;
      } else {
        // Fresh vote
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
                likes: (t.likes || 0) + (thoughtUpdates.likes || 0),
                dislikes: (t.dislikes || 0) + (thoughtUpdates.dislikes || 0),
              }
            : t
        )
      );

      try {
        await updateThoughtVote(id, thoughtUpdates);
      } catch {
        // Rollback
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
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out',
        clearProps: 'all',
      }
    );
  }, { scope: containerRef, dependencies: [filtered, loading] });

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="font-heading text-2xl md:text-4xl font-black text-white mb-4">
          Daily Thoughts & Updates
        </h1>
        <p className="text-slate-400 text-lg max-w-xl font-light">
          Random thoughts, academic notes, code findings, and daily updates published directly from the dashboard.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-10 pb-6 border-b border-slate-900">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search thoughts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat !== 'All' && <Tag size={10} />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-slate-500 mb-6">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4" />
          <p className="text-slate-400">Loading thoughts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900/40 rounded-2xl">
          <p className="text-slate-400">No thoughts found.</p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((thought) => {
            const userVote = votes[thought.id];
            return (
              <div
                key={thought.id}
                className="thought-item glass-card p-6 md:p-7 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all flex flex-col gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded bg-indigo-950 text-indigo-400 border border-indigo-900/40">
                      {thought.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{thought.date}</span>
                  </div>

                  <p className="text-slate-300 text-sm md:text-base whitespace-pre-wrap font-light leading-relaxed">
                    {thought.content}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-900/60 text-xs font-semibold">
                  <button
                    onClick={() => handleVote(thought.id, 'like')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                      userVote === 'like'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <ThumbsUp size={13} />
                    <span>{thought.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleVote(thought.id, 'dislike')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                      userVote === 'dislike'
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                        : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <ThumbsDown size={13} />
                    <span>{thought.dislikes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
