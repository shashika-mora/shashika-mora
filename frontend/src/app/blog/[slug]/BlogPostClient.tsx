'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getBlogBySlug, BlogPost } from '../../../lib/firestore-service';
import { Calendar, Tag, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

export default function BlogPostClient({ params }: { params?: any }) {
  const pathname = usePathname();
  const slug = pathname?.split('/').filter(Boolean).pop() || '';

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function loadPost() {
      // publicOnly = true: refuses to render unpublished articles
      const data = await getBlogBySlug(slug, true);
      if (data) {
        setBlog(data);
      }
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--dp-muted)' }}>Retrieving archive entry from the pit...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <div className="dp-panel" style={{ padding: '60px 32px' }}>
          <Shield size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <h2 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
            Archive Entry Not Found
          </h2>
          <p style={{ color: 'var(--dp-smoke)', marginBottom: '28px' }}>
            The requested blog post does not exist or has been unpublished.
          </p>
          <Link href="/blog" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to Written Archives
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '120px 24px 80px' }}>
      {/* Back button */}
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '32px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Written Archives
      </Link>

      {/* Meta Bar */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--dp-smoke)', marginBottom: '16px', fontFamily: 'monospace' }}>
        {blog.publishedAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} className="text-[var(--dp-gold-bright)]" />
            Published: {new Date(blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        )}
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
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-heading, Georgia, serif)',
          fontSize: 'clamp(2rem, 4.5vw, 3rem)',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '20px',
          lineHeight: 1.2,
        }}
      >
        {blog.title}
      </h1>

      {/* Summary / Excerpt */}
      {blog.excerpt && (
        <p
          style={{
            color: 'var(--dp-smoke)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            borderLeft: '4px solid var(--dp-red-bright)',
            paddingLeft: '20px',
            marginBottom: '36px',
            fontStyle: 'italic',
            background: 'rgba(22, 18, 15, 0.6)',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderRadius: '0 6px 6px 0',
          }}
        >
          {blog.excerpt}
        </p>
      )}

      {/* Cover Image */}
      {blog.coverImage && (
        <div style={{ width: '100%', height: '380px', borderRadius: '8px', overflow: 'hidden', marginBottom: '40px', border: '1px solid rgba(212, 175, 55, 0.35)', boxShadow: '0 15px 40px rgba(0,0,0,0.8)' }}>
          <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Body Content */}
      <article className="dp-panel" style={{ padding: '40px 48px', marginBottom: '40px' }}>
        <MarkdownRenderer content={blog.content} />
      </article>
    </div>
  );
}
