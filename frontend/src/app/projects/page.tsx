'use client';

import { useState, useEffect, useRef } from 'react';
import { getProjects } from '../../lib/firestore-service';
import { Github, ExternalLink, Search, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const data = await getProjects(false);
      if (data) {
        setProjects(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Extract unique tags
  const allTags = ['All', ...new Set(projects.flatMap(p => p.techStack || []))];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || project.techStack?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  useGSAP(() => {
    if (loading || filteredProjects.length === 0) return;

    gsap.from('.project-card', {
      opacity: 0,
      scale: 0.96,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [filteredProjects, loading] });

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4">
          Projects Directory
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light">
          A catalog of applications, systems scripting, and academic creations I've engineered.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-slate-900">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto py-1">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
          <p className="text-slate-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900/60 rounded-3xl">
          <p className="text-slate-400 text-lg mb-2">No projects found</p>
          <p className="text-slate-500 text-sm">Try clearing your filters or adjusting your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card glass-card rounded-2xl p-6 hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
            >
              <div>
                <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-900">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <Github size={14} />
                    Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
