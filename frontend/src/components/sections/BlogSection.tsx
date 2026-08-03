'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

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
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Blog"
          themed="DREAMFYRE · THE WRITTEN ARCHIVES & RESEARCH"
          description="Technical write-ups, learning notes, AI explorations, and architectural breakdowns."
        />

        {/* Dreamfyre Dragon Feature Header Card */}
        <div
          className="mb-10 dp-ember-hover"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '24px',
            alignItems: 'center',
            background: 'var(--dp-panel)',
            border: '1px solid var(--dp-border)',
            borderRadius: '6px',
            padding: '20px 28px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <img
            src="/dragonpit/dreamfyre-blog.png"
            alt="Dreamfyre Pale Blue Dragon — Research & Wisdom Guardian"
            style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--dp-gold-bright)' }}
          />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase', marginBottom: '4px' }}>
              DREAMFYRE · RESEARCH & WISDOM GUARDIAN
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--dp-smoke)', lineHeight: 1.5 }}>
              Symbolizing imagination, artificial intelligence, technical writing, lore, reading, and deep reflective thinking.
            </p>
          </div>
        </div>

        {loading ? (
          <BlogSkeleton />
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', border: '1px solid var(--dp-border)', borderRadius: '6px', color: 'var(--dp-muted)', background: 'var(--dp-panel)' }}>
            <BookOpen size={36} className="mx-auto mb-3 text-[var(--dp-gold)] opacity-70" />
            <p>No chronicles written yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/blog" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            Browse All Chronicles 📜
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ blog }: { blog: any }) {
  const publishDate = blog.publishedAt || blog.createdAt;
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  const displayImage = blog.imageUrl || '/dragonpit/dreamfyre-blog.png';

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="blog-card dp-ember-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--dp-panel)',
        border: '1px solid var(--dp-border)',
        borderRadius: '6px',
        overflow: 'hidden',
        textDecoration: 'none',
      }}
    >
      {/* Cover image */}
      <div style={{ height: '190px', overflow: 'hidden', borderBottom: '1px solid var(--dp-border)', flexShrink: 0, position: 'relative' }}>
        <img
          src={displayImage}
          alt={blog.title || 'Blog cover image'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
      </div>

      <div style={{ padding: '22px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Date */}
        <time
          dateTime={publishDate}
          style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dp-gold-bright)' }}
        >
          {formattedDate}
        </time>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.5,
          }}
        >
          {blog.title}
        </h3>

        {/* Summary */}
        <p style={{ fontSize: '0.86rem', color: 'var(--dp-smoke)', lineHeight: 1.7, flexGrow: 1 }}>
          {blog.summary}
        </p>

        {/* Read link */}
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.78rem', fontWeight: 700,
            color: 'var(--dp-gold-bright)',
            marginTop: '10px',
          }}
        >
          Read Chronicle <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function BlogSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ height: '190px', background: 'var(--dp-charcoal)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '12px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '35%' }} />
            <div style={{ height: '18px', background: 'var(--dp-charcoal)', borderRadius: '3px', width: '85%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
