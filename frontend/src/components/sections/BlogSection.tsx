'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

interface BlogSectionProps {
  blogs: any[];
  loading: boolean;
}

export default function BlogSection({ blogs, loading }: BlogSectionProps) {
  return (
    <section
      id="blog"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Dragon Parallax Layer */}
      <DragonBackgroundLayer imageSrc="/dragonpit/dreamfyre.jpg" opacity={0.14} position="bottom-left" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Blog"
          themed="DREAMFYRE · THE WRITTEN ARCHIVES & RESEARCH"
          description="Technical write-ups, learning notes, AI explorations, and architectural breakdowns."
        />

        {loading ? (
          <BlogSkeleton />
        ) : blogs.length === 0 ? (
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
            <BookOpen size={36} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No articles have been published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '32px', marginBottom: '40px' }}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/blog" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            Explore All Archives 📜
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ blog }: { blog: any }) {
  const blogTitle = blog.title || '';
  const blogExcerpt = blog.excerpt || blog.summary || '';
  const blogCategory = blog.category || blog.tag || '';
  const blogDate = blog.publishedAt || blog.createdAt || '';

  return (
    <article
      className="blog-card dp-ember-hover"
      style={{
        background: 'linear-gradient(180deg, #16120e 0%, #0f0c09 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)',
      }}
    >
      {blog.coverImage && (
        <Link href={`/blog/${blog.slug}`} tabIndex={-1} aria-hidden="true">
          <div style={{ height: '200px', overflow: 'hidden', borderBottom: '1px solid rgba(212, 175, 55, 0.25)' }}>
            <img
              src={blog.coverImage}
              alt={blogTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
            />
          </div>
        </Link>
      )}

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {blogCategory && (
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
              {blogCategory}
            </span>
          )}
          {blogDate && (
            <span style={{ fontSize: '0.76rem', color: 'var(--dp-smoke)', fontFamily: 'monospace', fontWeight: 600 }}>
              {new Date(blogDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading, Georgia, serif)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.35,
              transition: 'color 0.2s',
            }}
            className="hover:text-[var(--dp-gold-bright)]"
          >
            {blogTitle}
          </h3>
        </Link>

        {blogExcerpt && (
          <p style={{ color: 'var(--dp-smoke)', fontSize: '0.88rem', lineHeight: 1.7 }}>
            {blogExcerpt}
          </p>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <Link
            href={`/blog/${blog.slug}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-bright)'; }}
          >
            Read Archive Entry
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function BlogSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '32px', marginBottom: '40px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: '#14100d', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ height: '20px', background: '#1c1713', borderRadius: '3px', width: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '24px', background: '#1c1713', borderRadius: '3px', width: '85%' }} />
          <div style={{ height: '14px', background: '#1c1713', borderRadius: '3px', width: '95%' }} />
        </div>
      ))}
    </div>
  );
}
