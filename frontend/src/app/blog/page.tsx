'use client';

import { useState, useEffect, useRef } from 'react';
import { getBlogs } from '../../lib/firestore-service';
import { Calendar, Tag, ArrowRight, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const DEFAULT_BLOGS = [
  {
    id: 'blog-1',
    title: 'My Journey into OS Kernel Customization',
    slug: 'my-journey-into-os-kernel-customization',
    summary: 'An engineering undergraduate\'s dive into configuring, patching, and debugging Linux kernels from scratch, exploring the boundary between hardware and software.',
    tags: ['Linux', 'C', 'OS Dev'],
    publishedAt: '2026-07-09T00:00:00.000Z',
    createdAt: '2026-07-09T00:00:00.000Z',
  },
  {
    id: 'blog-2',
    title: 'Embracing the Vibe: The Philosophy of Pure/Vibe Coding',
    slug: 'philosophy-of-vibe-coding',
    summary: 'A deep-dive into coding by instinct, diving straight into code, debugging rapidly, and resolving issues through iterative exploration.',
    tags: ['Coding', 'Philosophy', 'Vibe'],
    publishedAt: '2026-07-08T00:00:00.000Z',
    createdAt: '2026-07-08T00:00:00.000Z',
  }
];

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const data = await getBlogs(true);
      if (data && data.length > 0) {
        setBlogs(data);
      } else {
        setBlogs(DEFAULT_BLOGS);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useGSAP(() => {
    if (loading || filteredBlogs.length === 0) return;

    gsap.from('.blog-post-card', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }, { scope: containerRef, dependencies: [filteredBlogs, loading] });

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      {/* Header */}
      <div className="mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="font-heading text-3xl md:text-5xl font-black text-white mb-4">
          The Developer Blog
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light">
          Deep-dives into systems programming, UI design, philosophy, and learning on the fly.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full mb-12">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Blogs list */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
          <p className="text-slate-400">Loading blog posts...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900/60 rounded-3xl">
          <p className="text-slate-400 text-lg mb-2">No articles found</p>
          <p className="text-slate-500 text-sm">Try search queries with different keywords.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="blog-post-card glass-card rounded-2xl overflow-hidden hover:scale-[1.005] hover:border-slate-800/80 transition-all flex flex-col justify-between group"
            >
              <div>
                {blog.imageUrl && (
                  <div className="h-56 w-full overflow-hidden mb-6">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className={`px-6 md:px-8 ${!blog.imageUrl ? 'pt-6 md:pt-8' : ''}`}>
                  <div className="flex items-center flex-wrap gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-500" />
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {blog.readingTime && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        {blog.readingTime} min read
                      </span>
                    )}
                    {blog.tags && blog.tags.length > 0 && (
                      <span className="flex items-center gap-1 ml-auto">
                        <Tag size={10} className="text-slate-500" />
                        {blog.tags.join(', ')}
                      </span>
                    )}
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 font-light">
                    {blog.summary}
                  </p>
                </div>
              </div>
              <div className="pt-4 px-6 md:px-8 pb-6 md:pb-8 border-t border-slate-900 flex justify-between items-center">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/btn"
                >
                  Read full article
                  <ArrowRight size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
