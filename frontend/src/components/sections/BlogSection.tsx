'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
          themed="INSCRIBED IN FLAME"
          description="Technical write-ups, learning notes, and explorations from the forge."
        />

        {loading ? (
          <BlogSkeleton />
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', border: '1px solid var(--dp-border)', borderRadius: '4px', color: 'var(--dp-muted)' }}>
            No blog posts found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link href="/blog" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            Browse All Posts
            <ArrowRight size={14} aria-hidden="true" />
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

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="blog-card dp-ember-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--dp-panel)',
        border: '1px solid var(--dp-border)',
        borderRadius: '4px',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
    >
      {/* Cover image */}
      {blog.imageUrl && (
        <div style={{ height: '180px', overflow: 'hidden', borderBottom: '1px solid var(--dp-border)', flexShrink: 0 }}>
          <img
            src={blog.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
        </div>
      )}

      <div style={{ padding: '20px 22px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Date */}
        <time
          dateTime={publishDate}
          style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dp-gold)', opacity: 0.7 }}
        >
          {formattedDate}
        </time>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--dp-text)',
            lineHeight: 1.5,
            transition: 'color 0.2s',
          }}
        >
          {blog.title}
        </h3>

        {/* Summary */}
        <p style={{ fontSize: '0.85rem', color: 'var(--dp-muted)', lineHeight: 1.7, flexGrow: 1 }}>
          {blog.summary}
        </p>

        {/* Read link */}
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--dp-gold)',
            marginTop: '8px',
          }}
        >
          Read Post <ArrowRight size={12} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function BlogSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '180px', background: 'var(--dp-charcoal)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ height: '12px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '30%' }} />
            <div style={{ height: '18px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '85%' }} />
            <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '100%' }} />
            <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '70%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
