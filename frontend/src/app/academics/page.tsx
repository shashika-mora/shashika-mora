'use client';

import { useState, useEffect, useRef } from 'react';
import { getAcademics, AcademicRecord } from '../../lib/firestore-service';
import { GraduationCap, Calendar, Award, ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import DragonBackgroundLayer from '../../components/dragonpit/DragonBackgroundLayer';

export default function AcademicsPage() {
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getAcademics();
      if (data) setAcademics(data);
      setLoading(false);
    }
    loadData();
  }, []);

  useGSAP(() => {
    if (loading || academics.length === 0) return;

    gsap.fromTo('.timeline-item',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [academics, loading] });

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      <DragonBackgroundLayer imageSrc="/dragonpit/silverwing_1.jpg" opacity={0.14} position="top-left" />
      <DragonBackgroundLayer imageSrc="/dragonpit/vermithor_and_silverwing.jpg" opacity={0.14} position="bottom-right" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
      {/* Back Link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '28px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dragonpit
      </Link>

      {/* Header Banner */}
      <div className="dp-panel mb-10" style={{ padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src="/dragonpit/silverwing_1.jpg"
            alt="Silverwing Dragon Guardian — Academics & Learning"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dragonpit/vermithor-skills.png'; }}
          />
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase' }}>
              SILVERWING · CHRONICLES OF LEARNING
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
              Academic Timeline
            </h1>
            <p style={{ color: 'var(--dp-smoke)', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.6 }}>
              Educational credentials, computer science degree milestones, academic coursework, and honors at University of Moratuwa.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--dp-muted)' }}>Loading academic records...</p>
        </div>
      ) : academics.length === 0 ? (
        <div className="dp-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--dp-muted)' }}>
          <BookOpen size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>No academic records published yet</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--dp-muted)' }}>Academic timeline records can be updated via the admin dashboard.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', borderLeft: '2px solid rgba(212, 175, 55, 0.3)', marginLeft: '16px', paddingLeft: '28px' }}>
          {academics.map((item) => (
            <div key={item.id} className="timeline-item" style={{ marginBottom: '40px', position: 'relative' }}>
              {/* Timeline icon dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-43px',
                  top: '4px',
                  background: '#0a0807',
                  border: '2px solid var(--dp-gold-bright)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dp-gold-bright)',
                }}
              >
                <GraduationCap size={14} />
              </div>

              <div className="dp-panel dp-ember-hover" style={{ padding: '32px 36px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                      {item.degree}
                    </h3>
                    {item.period && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--dp-gold-bright)', fontFamily: 'monospace', fontWeight: 700 }}>
                        <Calendar size={12} className="inline mr-1" />
                        {item.period}
                      </span>
                    )}
                  </div>
                  {item.institution && (
                    <p style={{ color: 'var(--dp-ember)', fontWeight: 700, fontSize: '0.95rem' }}>
                      {item.institution}
                    </p>
                  )}
                  {item.gpa && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: 'var(--dp-gold-bright)' }}>
                      <Award size={14} /> GPA / Honor: {item.gpa}
                    </div>
                  )}
                </div>

                {item.description && (
                  <p style={{ color: 'var(--dp-smoke)', fontSize: '0.92rem', lineHeight: 1.7, paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
