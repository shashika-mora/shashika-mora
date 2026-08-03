'use client';

import { useState, useEffect, useRef } from 'react';
import { getPublishedBlogs, BlogPost } from '../../lib/firestore-service';
import { Calendar, Tag, ArrowRight, ArrowLeft, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import DragonBackgroundLayer from '../../components/dragonpit/DragonBackgroundLayer';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getPublishedBlogs();
      if (data) setBlogs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.excerpt || blog.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useGSAP(() => {
    if (loading || filteredBlogs.length === 0) return;

    gsap.fromTo('.blog-post-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [filteredBlogs, loading] });

  return (
    <div ref={containerRef} style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative' }}>
      <DragonBackgroundLayer imageSrc="/dragonpit/dreamfyre.jpg" opacity={0.08} position="top-right" />
      {/* Back Link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '28px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dragonpit
      </Link>

      {/* Header Banner */}
      <div className="dp-panel mb-10" style={{ padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src="/dragonpit/dreamfyre.jpg"
            alt="Dreamfyre Pale Blue Dragon Guardian"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dragonpit/dreamfyre-blog.png'; }}
          />
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase' }}>
              DREAMFYRE · THE WRITTEN ARCHIVES
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
              The Written Archives & Blog
            </h1>
            <p style={{ color: 'var(--dp-smoke)', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.6 }}>
              Technical write-ups, architecture breakdowns, research notes, and artificial intelligence explorations.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '40px' }}>
        <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--dp-muted)' }} size={18} />
        <input
          type="text"
          placeholder="Search published articles by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="dp-input"
          style={{ paddingLeft: '52px', padding: '14px 20px 14px 52px', fontSize: '0.9rem' }}
        />
      </div>

      {/* Blog List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--dp-muted)' }}>Loading written archives...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="dp-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--dp-muted)' }}>
          <BookOpen size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>No articles published yet</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--dp-muted)' }}>No articles match your search parameters or have been published to the archives.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="blog-post-card dp-panel dp-ember-hover"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {blog.coverImage && (
                <Link href={`/blog/${blog.slug}`} tabIndex={-1} aria-hidden="true">
                  <div style={{ height: '240px', overflow: 'hidden', borderBottom: '1px solid rgba(212, 175, 55, 0.25)' }}>
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                    />
                  </div>
                </Link>
              )}
              <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--dp-smoke)' }}>
                  {blog.category && (
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
                      {blog.category}
                    </span>
                  )}
                  {blog.publishedAt && (
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      <Calendar size={12} className="inline mr-1 text-[var(--dp-gold-bright)]" />
                      {new Date(blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                </div>

                <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, Georgia, serif)',
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.3,
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-[var(--dp-gold-bright)]"
                  >
                    {blog.title}
                  </h3>
                </Link>

                {blog.excerpt && (
                  <p style={{ color: 'var(--dp-smoke)', fontSize: '0.94rem', lineHeight: 1.7 }}>
                    {blog.excerpt}
                  </p>
                )}

                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.25)', marginTop: '8px' }}>
                  <Link
                    href={`/blog/${blog.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none' }}
                  >
                    Read Archive Entry <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
