'use client';

import Link from 'next/link';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

interface ProjectsSectionProps {
  projects: any[];
  loading: boolean;
}

export default function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  return (
    <section id="projects" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Projects"
          themed="FROM THE FORGE"
          description="A curated selection of things I've built — from systems experiments to full-stack applications."
        />

        {loading ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center', padding: '48px',
              border: '1px solid var(--dp-border)', borderRadius: '4px',
              color: 'var(--dp-muted)',
            }}
          >
            No featured projects found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link href="/projects" className="dp-btn-secondary" style={{ display: 'inline-flex' }}>
            See All Projects
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <article
      className="project-card dp-ember-hover"
      style={{
        background: 'var(--dp-panel)',
        border: '1px solid var(--dp-border)',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {/* Cover image */}
      {project.imageUrl && (
        <Link href={`/projects/${project.id}`} tabIndex={-1} aria-hidden="true">
          <div style={{ height: '200px', overflow: 'hidden', borderBottom: '1px solid var(--dp-border)' }}>
            <img
              src={project.imageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
            />
          </div>
        </Link>
      )}

      {/* Body */}
      <Link href={`/projects/${project.id}`} style={{ display: 'block', padding: '24px 28px', flexGrow: 1, textDecoration: 'none' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading, Georgia, serif)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--dp-text)',
            marginBottom: '10px',
            transition: 'color 0.2s',
          }}
          className="group-hover:text-[var(--dp-gold)]"
        >
          {project.title}
        </h3>
        <p style={{ color: 'var(--dp-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '16px' }}>
          {project.description}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
          padding: '14px 28px',
          borderTop: '1px solid var(--dp-border)',
          background: 'rgba(8,7,6,0.4)',
        }}
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--dp-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-muted)'; }}
              onClick={e => e.stopPropagation()}
            >
              <Github size={14} aria-hidden="true" /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title} live demo`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--dp-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-muted)'; }}
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={14} aria-hidden="true" /> Live
            </a>
          )}
        </div>
        {project.longDescription && (
          <Link
            href={`/projects/${project.id}`}
            style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--dp-gold)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-ember)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold)'; }}
          >
            Read Case Study →
          </Link>
        )}
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px', marginBottom: '40px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: 'var(--dp-panel)', border: '1px solid var(--dp-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '200px', background: 'var(--dp-charcoal)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ height: '20px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '55%' }} />
            <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '90%' }} />
            <div style={{ height: '14px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '75%' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {[1,2,3].map(j => (
                <div key={j} style={{ height: '22px', background: 'var(--dp-charcoal)', borderRadius: '2px', width: '50px' }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
