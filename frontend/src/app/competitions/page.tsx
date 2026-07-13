'use client';

import { useState, useEffect, useRef } from 'react';
import { getCompetitions } from '../../lib/firestore-service';
import { Trophy, ExternalLink, ArrowLeft, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCompetitions();
      if (data) setCompetitions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = competitions.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.award?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useGSAP(() => {
    if (loading || filtered.length === 0) return;
    gsap.fromTo(
      '.comp-card',
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      }
    );
  }, { scope: containerRef, dependencies: [filtered, loading] });

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-6 py-12 md:py-20">
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
          Competitions & Achievements
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light">
          Competitive programming milestones, hackathons, and software creation challenges I've participated in.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 pb-6 border-b border-slate-900">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4" />
          <p className="text-slate-400">Loading competitions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900/60 rounded-3xl">
          <Trophy size={32} className="mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400 text-lg mb-1">
            {searchTerm ? 'No results found' : 'No competitions yet'}
          </p>
          <p className="text-slate-500 text-sm">
            {searchTerm ? 'Try adjusting your search term.' : 'Check back soon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="comp-card glass-card rounded-2xl overflow-hidden flex flex-col group hover:scale-[1.01] transition-all"
            >
              {/* Images */}
              {(comp.imageUrl || comp.imageUrl2) && (
                <div
                  className={`grid gap-0 ${
                    comp.imageUrl && comp.imageUrl2 ? 'grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {comp.imageUrl && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={comp.imageUrl}
                        alt={`${comp.title} – photo 1`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {comp.imageUrl2 && (
                    <div className="h-44 overflow-hidden border-l border-slate-900">
                      <img
                        src={comp.imageUrl2}
                        alt={`${comp.title} – photo 2`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h2 className="font-heading text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                    {comp.title}
                  </h2>
                  {comp.date && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-mono shrink-0 mt-0.5">
                      <Calendar size={11} />
                      {comp.date}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/30 text-indigo-300 border border-indigo-900/30 text-xs font-semibold">
                    🏆 {comp.award}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  {comp.description}
                </p>

                {comp.link && (
                  <div className="mt-6 pt-4 border-t border-slate-900/60">
                    <a
                      href={comp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={13} />
                      View Event Details
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
