'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAboutConfig, getProjects, getBlogs, addMessage } from '../lib/firestore-service';
import { ArrowRight, Mail, Linkedin, Github, ExternalLink, Terminal, Cpu, Layers, BookOpen, Send, CheckCircle, Facebook, Instagram } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // 1. Fetch Profile
      const aboutData = await getAboutConfig();
      if (aboutData) setAbout(aboutData);

      // 2. Fetch Featured Projects
      const projectsData = await getProjects(true);
      if (projectsData) setProjects(projectsData);

      // 3. Fetch Blogs
      const blogsData = await getBlogs(true);
      if (blogsData) setBlogs(blogsData.slice(0, 3));
      
      setLoading(false);
    }
    fetchData();
  }, []);

  useGSAP(() => {
    if (!about || loading) return;

    // --- Hero Animations ---
    const heroTl = gsap.timeline();
    heroTl.from('.hero-badge', { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.7)' })
          .from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.3')
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .from('.hero-btn', { opacity: 0, y: 15, scale: 0.95, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.3');

    // --- Scroll Reveal Animations ---
    // About Section
    gsap.from('#about .section-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '#about',
        start: 'top 85%',
      }
    });
    gsap.from('#about .about-card', {
      opacity: 0,
      y: 30,
      scale: 0.98,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#about .about-card',
        start: 'top 85%',
      }
    });

    // Tech Stack Section
    gsap.from('#skills .section-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 85%',
      }
    });
    gsap.from('.skill-chip', {
      opacity: 0,
      scale: 0.8,
      y: 15,
      duration: 0.5,
      stagger: {
        each: 0.04,
        grid: 'auto'
      },
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.skill-chip',
        start: 'top 85%',
      }
    });

    // Featured Projects Section
    gsap.from('#projects .section-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 85%',
      }
    });
    gsap.from('.project-card', {
      opacity: 0,
      y: 30,
      scale: 0.97,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.project-card',
        start: 'top 85%',
      }
    });

    // Blogs Section
    gsap.from('#blog .section-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 85%',
      }
    });
    gsap.from('.blog-card', {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.blog-card',
        start: 'top 85%',
      }
    });

    // Contact Section
    gsap.from('#contact .section-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
      }
    });
    gsap.from('#contact .contact-card', {
      opacity: 0,
      y: 40,
      scale: 0.98,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#contact .contact-card',
        start: 'top 80%',
      }
    });

  }, { scope: containerRef, dependencies: [about, projects, blogs, loading] });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ loading: false, success: false, error: 'Please fill in all required fields.' });
      return;
    }
    setFormStatus({ loading: true, success: false, error: null });
    try {
      await addMessage(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormStatus({ loading: false, success: true, error: null });
      setTimeout(() => setFormStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      console.error(err);
      setFormStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2"></div>
          <p className="text-sm font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-450">
        <p className="text-sm">Profile configuration not found. Please log into the admin panel to set it up.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center z-10">
          <div className="hero-badge inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium tracking-wide text-slate-300">Available for Opportunities</span>
          </div>

          <h1 className="hero-title font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
            Hi there, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {about.name}! 👋
            </span>
          </h1>

          <h3 className="hero-subtitle text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            {about.title} <br className="hidden md:block" />
            <span className="text-indigo-400 font-normal">{about.subtitle}</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="hero-btn w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-950 font-semibold hover:bg-slate-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 text-center"
            >
              Connect with me
            </Link>
            <a
              href="#about"
              className="hero-btn w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800/80 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Explore my world
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative bg-slate-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title font-heading text-3xl md:text-5xl font-black mb-4 relative inline-block text-white">
              About Me
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full opacity-60"></div>
            </h2>
          </div>

          <div className="about-card glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Terminal size={144} className="text-white" />
            </div>
            <div className="relative z-10">
              <MarkdownRenderer content={about.bio} />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="skills" className="py-24 px-6 relative border-y border-slate-900 bg-slate-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title font-heading text-3xl md:text-5xl font-black mb-4 relative inline-block text-white">
              🛠️ Tech Stack & Arsenal
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full opacity-60"></div>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {Array.isArray(about.skills) ? (
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
                <div className="flex flex-wrap justify-center gap-3">
                  {about.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-chip px-4 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-sm text-slate-200 font-medium hover:border-indigo-500 hover:text-white transition-all duration-305"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(about.skills || {}).map(([category, items], idx) => {
                  const Icon = idx === 0 ? Cpu : idx === 1 ? Layers : BookOpen;
                  return (
                    <div key={category} className="glass-card rounded-2xl p-6 hover:-translate-y-1.5 transition-transform duration-300">
                      <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-indigo-300 border-b border-slate-800 pb-3">
                        <Icon size={20} />
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(items) && items.map((skill) => (
                          <span
                            key={skill}
                            className="skill-chip px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-medium hover:border-slate-700 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="section-title font-heading text-3xl md:text-5xl font-black mb-4 relative inline-block text-white">
              Featured Projects
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60"></div>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl">
              A curated selection of things I've built, ranging from low-level systems tinkering to full-stack web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {projects.map((project) => (
              <div key={project.id} className="project-card glass-card rounded-2xl p-8 hover:scale-[1.01] transition-all flex flex-col justify-between group">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack?.map((tech) => (
                      <span key={tech} className="text-xs px-2.5 py-1 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-900/60">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              See All Projects
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      {blogs.length > 0 && (
        <section id="blog" className="py-24 px-6 bg-slate-950/30 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title font-heading text-3xl md:text-5xl font-black mb-4 relative inline-block text-white">
                Latest Blog Posts
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-60"></div>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all flex flex-col justify-between group">
                  <div>
                    {blog.imageUrl && (
                      <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-4">
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {blog.summary}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 group-hover:underline flex items-center gap-1 mt-4">
                    Read Post <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                Browse All Posts
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title font-heading text-3xl md:text-5xl font-black mb-4 relative inline-block text-white">
              Get In Touch
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full opacity-60"></div>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Want to collaborate, discuss philosophy, or just talk OS kernels? Send a message and let's start the vibe.
            </p>
          </div>

          <div className="contact-card grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info */}
            <div className="md:col-span-1 space-y-4">
              <div className="glass-card p-4 rounded-xl flex items-start gap-3">
                <Mail className="text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-white text-xs mb-0.5">Email (Work)</h4>
                  <a href={`mailto:${about.email}`} className="text-slate-400 hover:text-white text-xs break-all">
                    {about.email}
                  </a>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-start gap-3">
                <Mail className="text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-white text-xs mb-0.5">Email (Personal)</h4>
                  <a href={`mailto:${about.emailPersonal || 'shashikatheekshana67@gmail.com'}`} className="text-slate-400 hover:text-white text-xs break-all">
                    {about.emailPersonal || 'shashikatheekshana67@gmail.com'}
                  </a>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-start gap-3">
                <Linkedin className="text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-white text-xs mb-0.5">LinkedIn</h4>
                  <a href={about.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs truncate block">
                    shashika-dayarathna-420875359
                  </a>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-start gap-3">
                <Github className="text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-white text-xs mb-0.5">GitHub</h4>
                  <a href={about.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs truncate block">
                    shashika-mora
                  </a>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-start gap-3">
                <Facebook className="text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-white text-xs mb-0.5">Facebook</h4>
                  <a href={about.facebookUrl || 'https://web.facebook.com/shashika.dayarathna.2025/'} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs truncate block">
                    shashika.dayarathna.2025
                  </a>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-start gap-3">
                <Instagram className="text-indigo-400 shrink-0" size={20} />
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-white text-xs mb-0.5">Instagram</h4>
                  <a href={about.instaUrl || 'https://www.instagram.com/shashika_daya/'} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs truncate block">
                    shashika_daya
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleContactSubmit} className="glass-card p-8 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  ></textarea>
                </div>

                {formStatus.error && (
                  <p className="text-xs text-pink-400 mt-2">{formStatus.error}</p>
                )}

                {formStatus.success && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <CheckCircle size={16} />
                    Message sent successfully! I will get back to you soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50"
                >
                  {formStatus.loading ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
