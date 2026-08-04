'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getProjectById, Project } from '../../../lib/firestore-service';
import { Calendar, Tag, ArrowLeft, ExternalLink, Github, Info, Shield } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

import DragonBackgroundLayer from '../../../components/dragonpit/DragonBackgroundLayer';

export default function ProjectDetailClient({ params }: { params?: any }) {
  const pathname = usePathname();
  const id = pathname?.split('/').filter(Boolean).pop() || '';

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadProject() {
      // publicOnly = true: refuses to render unpublished/hidden records
      const data = await getProjectById(id, true);
      if (data) {
        setProject(data);
      }
      setLoading(false);
    }
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--dp-muted)' }}>Loading record from the forge...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <div className="dp-panel" style={{ padding: '60px 32px' }}>
          <Shield size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <h2 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
            Record Not Found
          </h2>
          <p style={{ color: 'var(--dp-smoke)', marginBottom: '28px' }}>
            The requested project record does not exist or has been unpublished.
          </p>
          <Link href="/projects" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to Projects Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      <DragonBackgroundLayer imageSrc="/dragonpit/caraxes_1.jpg" opacity={0.14} position="top-left" />
      <DragonBackgroundLayer imageSrc="/dragonpit/caraxes_3.jpg" opacity={0.14} position="bottom-right" />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
      {/* Back button */}
      <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '32px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Projects Directory
      </Link>

      {/* Meta Bar */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--dp-smoke)', marginBottom: '16px', fontFamily: 'monospace' }}>
        {project.createdAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} className="text-[var(--dp-gold-bright)]" />
            Created: {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
          </span>
        )}
        {project.techStack && project.techStack.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={12} className="text-[var(--dp-ember)]" />
            {project.techStack.join(', ')}
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-heading, Georgia, serif)',
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '20px',
          lineHeight: 1.15,
        }}
      >
        {project.title}
      </h1>

      {/* Teaser Description */}
      <p
        style={{
          color: 'var(--dp-smoke)',
          fontSize: '1.1rem',
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
        {project.description}
      </p>

      {/* External Action Links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px', paddingBottom: '28px', borderBottom: '1px solid var(--dp-border)' }}>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dp-btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.88rem' }}
          >
            <Github size={16} /> Source Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dp-btn-secondary"
            style={{ padding: '12px 28px', fontSize: '0.88rem' }}
          >
            <ExternalLink size={16} /> Live Demo
          </a>
        )}
      </div>

      {/* Cover Image */}
      {project.imageUrl && (
        <div style={{ width: '100%', height: '420px', borderRadius: '8px', overflow: 'hidden', marginBottom: '44px', border: '1px solid rgba(212, 175, 55, 0.35)', boxShadow: '0 15px 40px rgba(0,0,0,0.8)' }}>
          <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Detailed Case Study */}
      <article className="dp-panel" style={{ padding: '40px 48px' }}>
        {project.longDescription ? (
          <MarkdownRenderer content={project.longDescription} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', color: 'var(--dp-smoke)' }}>
            <Info size={22} className="text-[var(--dp-gold-bright)] shrink-0 mt-0.5" />
            <div>
              <h4 style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem', marginBottom: '4px' }}>Detailed Case Study Pending</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--dp-muted)', lineHeight: 1.6 }}>
                The full architectural breakdown for this project has not been published yet. Please explore the source code or live demo above.
              </p>
            </div>
          </div>
        )}
      </article>
      </div>
    </div>
  );
}
