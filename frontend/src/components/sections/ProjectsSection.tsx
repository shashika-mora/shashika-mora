'use client';

import Link from 'next/link';
import { Github, ExternalLink, ArrowRight, FolderGit2 } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

interface ProjectsSectionProps {
  projects: any[];
  loading: boolean;
}

export default function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      style={{
        padding: '120px 24px',
        borderTop: '1px solid var(--dp-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dual Background Dragon Parallax Layers */}
      <DragonBackgroundLayer imageSrc="/dragonpit/caraxes_1.jpg" opacity={0.14} position="top-left" />
      <DragonBackgroundLayer imageSrc="/dragonpit/caraxes_3.jpg" opacity={0.14} position="bottom-right" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Featured Projects"
          themed="CARAXES THE BLOOD WYRM · THE FORGE OF INTELLECT"
          description="A selection of high-impact software systems, AI platforms, and open-source contributions."
        />

        {loading ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
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
            <FolderGit2 size={36} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No featured projects published yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: '32px',
              marginBottom: '48px',
            }}
          >
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
  const projTitle = project.title || '';
  const projDesc = project.description || project.shortDescription || '';
  const projGithub = project.githubUrl || project.github || '';
  const projDemo = project.liveUrl || project.demoUrl || project.link || '';
  const projTags = project.techStack || project.tags || project.skills || [];

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
        boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.12)',
      }}
    >
      {/* Project Cover Image */}
      {project.imageUrl && (
        <div style={{ position: 'relative', height: '210px', overflow: 'hidden', borderBottom: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <img
            src={project.imageUrl}
            alt={projTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 12, 9, 0.95) 0%, transparent 60%)',
            }}
          />
        </div>
      )}

      {/* Card Content */}
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading, Georgia, serif)',
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            {projTitle}
          </h3>
        </div>

        {projDesc && (
          <p style={{ color: 'var(--dp-smoke)', fontSize: '0.9rem', lineHeight: 1.7, flexGrow: 1 }}>
            {projDesc}
          </p>
        )}

        {/* Tech Stack */}
        {projTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
            {projTags.map((tech: string, i: number) => (
              <span key={i} className="dp-tech-badge">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            marginTop: '12px',
          }}
        >
          {projGithub && (
            <a
              href={projGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="dp-btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              <Github size={14} aria-hidden="true" />
              Source Code
            </a>
          )}

          {projDemo && (
            <a
              href={projDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="dp-btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              <ExternalLink size={14} aria-hidden="true" />
              Live Realm
            </a>
          )}

          <Link
            href={`/projects/${project.id}`}
            style={{
              marginLeft: 'auto',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--dp-gold-bright)',
              textDecoration: 'none',
            }}
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '32px', marginBottom: '48px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: '#14100d', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '8px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ height: '22px', background: '#1c1713', borderRadius: '3px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '14px', background: '#1c1713', borderRadius: '3px', width: '90%' }} />
          <div style={{ height: '14px', background: '#1c1713', borderRadius: '3px', width: '75%' }} />
        </div>
      ))}
    </div>
  );
}
