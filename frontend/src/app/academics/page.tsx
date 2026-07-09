'use client';

import { useState, useEffect } from 'react';
import { getAcademics } from '../../lib/firestore-service';
import { GraduationCap, Calendar, Award, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const DEFAULT_ACADEMICS = [
  {
    id: 'acad-1',
    title: 'B.Sc. Engineering (Hons) in Computer Science & Engineering',
    institution: 'University of Moratuwa, Sri Lanka',
    period: '2023 - Present',
    grade: 'GPA: 3.9+ (Expected)',
    details: 'Exploring core areas including Data Structures and Algorithms, Database Systems, Computer Architecture, and Operating Systems. Actively experimenting with kernel modifications and LLM agent custom MCP integrations.',
    order: 1
  },
  {
    id: 'acad-2',
    title: 'G.C.E. Advanced Level Examination',
    institution: 'High School',
    period: 'Completed 2022',
    grade: '3 A\'s (Combined Mathematics, Physics, Chemistry)',
    details: 'Achieved outstanding results in Physical Sciences stream, securing admission to the leading engineering faculty in Sri Lanka.',
    order: 2
  }
];

export default function Academics() {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAcademics();
      if (data && data.length > 0) {
        setAcademics(data);
      } else {
        setAcademics(DEFAULT_ACADEMICS);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
      {/* Header */}
      <div className="mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4">
          Academic Timeline
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light">
          My academic records, key course projects, and educational credentials.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
          <p className="text-slate-400">Loading academic details...</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
          {academics.map((item) => (
            <div key={item.id} className="relative pl-8 md:pl-10">
              {/* Timeline marker */}
              <div className="absolute -left-3.5 top-1.5 bg-slate-950 border-2 border-indigo-500 p-1.5 rounded-full z-10 text-indigo-400">
                <GraduationCap size={16} />
              </div>

              {/* Item Card */}
              <div className="glass-card p-6 md:p-8 rounded-2xl hover:border-slate-800 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-indigo-400 font-medium text-sm mt-1">
                      {item.institution}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1.5 font-medium text-slate-300">
                      <Calendar size={12} className="text-slate-500" />
                      {item.period}
                    </span>
                    {item.grade && (
                      <span className="flex items-center gap-1.5 mt-1 font-semibold text-pink-400/90">
                        <Award size={12} />
                        {item.grade}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-2 text-slate-400 font-light text-sm md:text-base leading-relaxed border-t border-slate-900/60">
                  <MarkdownRenderer content={item.details} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
