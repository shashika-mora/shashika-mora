'use client';

import Link from 'next/link';
import { Github, ExternalLink, ArrowRight, Shield } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

interface ProjectsSectionProps {
  projects: any[];
  loading: boolean;
}

export default function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  return (
    <section id="projects" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Projects"
          themed="CARAXES THE BLOOD WYRM · DRAGONS OF THE PIT"
          description="A curated selection of software and hardware systems forged through experimentation, design, and code."
        />

        {loading ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center', padding: '48px',
              border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px',
              color: 'var(--dp-muted)',
              background: '#14100d',
            }}
          >
            <Shield size={36} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
            <p>No records have entered the Dragonpit yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px', marginBottom: '40px' }}>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/projects" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            Explore All Projects ⚔️
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  const displayImage = project.imageUrl || '/dragonpit/project-placeholder.png';

  return (
    <article
      className="project-card dp-ember-hover"
      style={{
        background: 'linear-gradient(180deg, #16120e 0%, #0f0c09 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)',
      }}
    >
      {/* Cover image */}
      <Link href={`/projects/${project.id}`} tabIndex={-1} aria-hidden="true">
        <div style={{ height: '220px', overflow: 'hidden', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', position: 'relative' }}>
          <img
            src={displayImage}
            alt={project.title || 'Project image'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
          {project.featured && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(138, 13, 13, 0.9)',
                border: '1px solid var(--dp-gold-bright)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '3px',
                boxShadow: '0 0 10px rgba(0,0,0,0.8)',
              }}
            >
              🐉 Featured
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <Link href={`/projects/${project.id}`} style={{ display: 'block', padding: '28px 30px', flexGrow: 1, textDecoration: 'none' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '12px',
            transition: 'color 0.2s',
          }}
          className="hover:text-[var(--dp-gold-bright)]"
        >
          {project.title}
        </h3>
        <p style={{ color: 'var(--dp-smoke)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
          {project.description}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.techStack.map((tech: string) => (
              <span key={tech} className="dp-tech-badge">{tech}</span>
            ))}
          </div>
        )}
      </Link>

      {/* Footer actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 30px',
          borderTop: '1px solid rgba(212, 175, 55, 0.25)',
          background: 'rgba(10, 8, 7, 0.85)',
        }}
      >
        <div style={{ display: 'flex', gap: '18px' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-bright)'; }}
              onClick={e => e.stopPropagation()}
            >
              <Github size={15} aria-hidden="true" /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title} live demo`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-bright)'; }}
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={15} aria-hidden="true" /> Live
            </a>
          )}
        </div>
        {project.longDescription && (
          <Link
            href={`/projects/${project.id}`}
            style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-ember)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-bright)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-ember)'; }}
          >
            Case Study →
          </Link>
        )}
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px', marginBottom: '40px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: '#14100d', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ height: '220px', background: '#1c1713', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '20px', background: '#1c1713', borderRadius: '3px', width: '55%' }} />
            <div style={{ height: '14px', background: '#1c1713', borderRadius: '3px', width: '90%' }} />
            <div style={{ height: '14px', background: '#1c1713', borderRadius: '3px', width: '75%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
