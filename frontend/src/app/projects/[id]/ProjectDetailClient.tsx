'use client';

import { useState, useEffect, use } from 'react';
import { getProjectById } from '../../../lib/firestore-service';
import { Calendar, Tag, ArrowLeft, ExternalLink, Github, Info } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

export default function ProjectDetailClient({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const data = await getProjectById(id);
      if (data) {
        setProject(data);
      }
      setLoading(false);
    }
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
        <p className="text-slate-400">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Project Not Found</h2>
        <p className="text-slate-400 mb-8">The project you are looking for does not exist or has been removed.</p>
        <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
      {/* Back button */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      {/* Meta Info */}
      <div className="flex items-center flex-wrap gap-4 text-xs text-slate-400 mb-6">
        {project.createdAt && (
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-slate-500" />
            Created: {new Date(project.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long'
            })}
          </span>
        )}
        {project.techStack && project.techStack.length > 0 && (
          <span className="flex items-center gap-1">
            <Tag size={10} className="text-slate-500" />
            {project.techStack.join(', ')}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
        {project.title}
      </h1>

      {/* Short Description teaser */}
      <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed border-l-4 border-indigo-500/50 pl-4 py-1 mb-10 italic">
        {project.description}
      </p>

      {/* External Action Links */}
      <div className="flex flex-wrap gap-4 mb-10 pb-6 border-b border-slate-900">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-350 hover:text-white transition-all"
          >
            <Github size={16} />
            GitHub Repository
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-550 text-xs font-bold text-white shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.01]"
          >
            <ExternalLink size={16} />
            Live Application Demo
          </a>
        )}
      </div>

      {/* Cover Image if available */}
      {project.imageUrl && (
        <div className="w-full h-80 md:h-[480px] rounded-3xl overflow-hidden mb-12 border border-slate-900 shadow-2xl">
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Case Study Detailed Content */}
      <article className="pt-4 mb-16">
        {project.longDescription ? (
          <MarkdownRenderer content={project.longDescription} />
        ) : (
          <div className="flex items-start gap-3 p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 text-slate-400">
            <Info className="shrink-0 text-indigo-400" size={20} />
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-200 text-sm">Detailed Case Study Pending</h4>
              <p className="text-xs text-slate-500">There is no detailed case study write-up loaded for this project yet. Please check back later, or explore the codebase/demo using the links above.</p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
