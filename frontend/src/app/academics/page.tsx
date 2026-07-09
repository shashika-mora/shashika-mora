'use client';

import { useState, useEffect, useRef } from 'react';
import { getAcademics } from '../../lib/firestore-service';
import { GraduationCap, Calendar, Award, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Academics() {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const data = await getAcademics();
      if (data) {
        setAcademics(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useGSAP(() => {
    if (loading || academics.length === 0) return;

    gsap.from('.timeline-item', {
      opacity: 0,
      x: -15,
      y: 15,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [academics, loading] });

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-12 md:py-20">
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
      ) : academics.length === 0 ? (
        <div className="glass-card text-center py-20 text-slate-500 rounded-2xl">
          <p className="text-lg">No academic records found.</p>
          <p className="text-xs text-slate-650 mt-1">Please populate academics timeline from the admin panel.</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
          {academics.map((item) => (
            <div key={item.id} className="timeline-item relative pl-8 md:pl-10">
              {/* Timeline marker */}
              <div className="absolute -left-3.5 top-1.5 bg-slate-950 border-2 border-indigo-500 p-1.5 rounded-full z-10 text-indigo-400">
                <GraduationCap size={16} />
              </div>

              {/* Item Card */}
              <div className="glass-card p-6 md:p-8 rounded-2xl hover:border-slate-800 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img src={item.imageUrl} alt={item.institution} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                        {item.degree}
                      </h3>
                      <p className="text-indigo-400 font-medium text-sm mt-1">
                        {item.institution}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end text-xs text-slate-450 shrink-0">
                    <span className="flex items-center gap-1.5 font-medium text-slate-350">
                      <Calendar size={12} className="text-slate-500" />
                      {item.period}
                    </span>
                    {item.gpa && (
                      <span className="flex items-center gap-1.5 mt-1 font-semibold text-pink-400/90">
                        <Award size={12} />
                        {item.gpa}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 space-y-4 border-t border-slate-900/60">
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Achievements</h4>
                      <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                        {item.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.courses && item.courses.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Key Courses</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.courses.map((course, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.skills && item.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Skills Gained</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-900/30 font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
