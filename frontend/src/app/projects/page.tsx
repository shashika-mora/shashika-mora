'use client';

import { useState, useEffect, useRef } from 'react';
import { getProjects, Project } from '../../lib/firestore-service';
import { Github, ExternalLink, Search, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import DragonBackgroundLayer from '../../components/dragonpit/DragonBackgroundLayer';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getProjects('published');
      if (data) setProjects(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.techStack || [])))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || project.techStack?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  useGSAP(() => {
    if (loading || filteredProjects.length === 0) return;
    gsap.fromTo('.project-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [filteredProjects, loading] });

  return (
    <div ref={containerRef} style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 80px', position: 'relative' }}>
      <DragonBackgroundLayer imageSrc="/dragonpit/caraxes_2.jpg" opacity={0.14} position="top-left" />
      <DragonBackgroundLayer imageSrc="/dragonpit/caraxes_1.jpg" opacity={0.14} position="bottom-right" />
      {/* Back Link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-gold-soft)', textDecoration: 'none', marginBottom: '28px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dragonpit
      </Link>

      {/* Header Banner */}
      <div className="dp-panel mb-10" style={{ padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src="/dragonpit/caraxes_1.jpg"
            alt="Caraxes The Blood Wyrm Guardian"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--dp-gold-bright)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dragonpit/caraxes-hero.png'; }}
          />
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--dp-gold-bright)', textTransform: 'uppercase' }}>
              CARAXES · DRAGONS OF THE PIT
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
              Projects Directory
            </h1>
            <p style={{ color: 'var(--dp-smoke)', fontSize: '0.95rem', maxWidth: '700px', lineHeight: 1.6 }}>
              A catalog of software applications, hardware systems, and computational engineering built for production and exploration.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--dp-border)' }}>
        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--dp-muted)' }} size={18} />
          <input
            type="text"
            placeholder="Search projects by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dp-input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
        {allTags.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid var(--dp-border)',
                  background: selectedTag === tag ? 'var(--dp-blood)' : 'rgba(22, 18, 15, 0.9)',
                  color: selectedTag === tag ? '#ffffff' : 'var(--dp-gold-soft)',
                  transition: 'all 0.2s',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--dp-muted)' }}>Loading projects from the pit...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="dp-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--dp-muted)' }}>
          <Shield size={40} className="mx-auto mb-3 text-[var(--dp-gold-bright)] opacity-80" />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>No projects found</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--dp-muted)' }}>No published projects match your search or filter parameters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '32px' }}>
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card dp-panel dp-ember-hover"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {project.imageUrl && (
                <Link href={`/projects/${project.id}`} tabIndex={-1} aria-hidden="true">
                  <div style={{ height: '210px', overflow: 'hidden', borderBottom: '1px solid rgba(212, 175, 55, 0.25)' }}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                    />
                  </div>
                </Link>
              )}
              <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
                <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, Georgia, serif)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-[var(--dp-gold-bright)]"
                  >
                    {project.title}
                  </h3>
                </Link>
                <p style={{ color: 'var(--dp-smoke)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {project.description}
                </p>
                {project.techStack && project.techStack.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto', paddingTop: '12px' }}>
                    {project.techStack.map((tech) => (
                      <span key={tech} className="dp-tech-badge">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 30px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.25)',
                  background: 'rgba(10, 8, 7, 0.85)',
                }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none' }}
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-gold-bright)', textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
                {project.longDescription && (
                  <Link href={`/projects/${project.id}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dp-ember)', textDecoration: 'none' }}>
                    Case Study →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
