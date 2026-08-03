'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  getAboutConfig, getProjects, getBlogs, getCompetitions,
  getThoughts, updateThoughtVote, getSkills
} from '../lib/firestore-service';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Section components
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import CompetitionsSection from '../components/sections/CompetitionsSection';
import BlogSection from '../components/sections/BlogSection';
import ThoughtsSection from '../components/sections/ThoughtsSection';
import ContactSection from '../components/sections/ContactSection';
import DragonSigil from '../components/dragonpit/DragonSigil';
import DragonpitLoader from '../components/dragonpit/DragonpitLoader';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════
   TYPEWRITER — HERO PHRASES
   ═══════════════════════════════════════════════════════ */
const HERO_PHRASES = [
  'Building software and hardware solutions',
  'Solving real-world problems',
  'Exploring intelligent systems',
  'Learning through projects and experimentation',
  'Turning ideas into practical systems',
];

function TypewriterEffect() {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activePhrase = HERO_PHRASES[currentPhraseIdx] || '';

    if (isDeleting) {
      timer = setTimeout(() => { setCurrentText(prev => prev.slice(0, -1)); setTypingSpeed(40); }, typingSpeed);
    } else {
      timer = setTimeout(() => { setCurrentText(activePhrase.slice(0, currentText.length + 1)); setTypingSpeed(80); }, typingSpeed);
    }
    if (!isDeleting && currentText === activePhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    }
    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentPhraseIdx(prev => (prev + 1) % HERO_PHRASES.length);
      setTypingSpeed(150);
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, typingSpeed]);

  return (
    <span style={{ color: 'var(--dp-gold-bright)', fontWeight: 700, fontSize: '1.25rem', textShadow: '0 0 14px rgba(255, 215, 0, 0.4)' }}>
      {currentText}
      <span aria-hidden="true" style={{ borderRight: '2px solid var(--dp-gold-bright)', marginLeft: '4px', animation: 'pulse 1s step-end infinite' }} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   DEFAULTS
   ═══════════════════════════════════════════════════════ */
const DEFAULT_ABOUT = {
  name: 'Shashika',
  role: 'Software Engineer · UI/UX Designer · AI & Agentic Dev',
  title: 'CSE Undergraduate @ University of Moratuwa',
  subtitle: 'Building software and hardware solutions, Solving real-world problems, Exploring intelligent systems, Learning through projects and experimentation, Turning ideas into practical systems.',
  bio: "I'm a Computer Science and Engineering undergraduate who enjoys building practical solutions, exploring intelligent systems, and learning how software and hardware work beneath the surface.",
  secondaryBio: '',
  githubUrl: 'https://github.com/shashika-mora',
  linkedinUrl: 'https://linkedin.com/in/shashika-dayarathna',
  email: 'dayarathnaamst.24@uom.lk',
  emailPersonal: 'shashikatheekshana67@gmail.com',
  contactEmail: 'dayarathnaamst.24@uom.lk',
  resumeUrl: '',
  avatarUrl: '/hero.jpg',
  availabilityStatus: 'Available for Opportunities',
  isAvailable: true,
  skills: [],
};

export default function Home() {
  const [about, setAbout]               = useState<any>(DEFAULT_ABOUT);
  const [projects, setProjects]         = useState<any[]>([]);
  const [blogs, setBlogs]               = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [thoughts, setThoughts]         = useState<any[]>([]);
  const [skills, setSkills]             = useState<any[]>([]);

  const [loading, setLoading]           = useState(true);
  const [votes, setVotes]               = useState<Record<string, 'like' | 'dislike'>>({});
  const [loaderDone, setLoaderDone]     = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Unified single-pass data fetching
  useEffect(() => {
    Promise.all([
      getAboutConfig(),
      getProjects('featured').then(async data => (data && data.length > 0 ? data : (await getProjects('published')).slice(0, 4))),
      getBlogs(true).then(data => data?.slice(0, 3) || []),
      getCompetitions(),
      getThoughts(),
      getSkills(),
    ]).then(([aboutData, projectsData, blogsData, compsData, thoughtsData, skillsData]) => {
      if (aboutData) setAbout((prev: any) => ({ ...prev, ...aboutData }));
      setProjects(projectsData || []);
      setBlogs(blogsData || []);
      setCompetitions(compsData || []);
      setThoughts(thoughtsData || []);
      setSkills(skillsData || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thoughts_votes');
        if (stored) setVotes(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  // Hero entrance animation after intro completes
  useGSAP(() => {
    if (!loaderDone) return;
    gsap.timeline()
      .fromTo('.dp-hero-badge',    { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' })
      .fromTo('.dp-hero-title',    { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-sub-text', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }, '-=0.4')
      .fromTo('.dp-hero-btn',      { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-avatar',   { opacity: 0 },         { opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }, '-=0.5');

    setTimeout(() => ScrollTrigger.refresh(), 300);
  }, { scope: containerRef, dependencies: [loaderDone] });

  const handleVote = async (id: string, type: 'like' | 'dislike') => {
    const currentVote = votes[id];
    let updates: Record<string, number> = {};

    if (currentVote === type) {
      updates = { [type === 'like' ? 'likes' : 'dislikes']: -1 };
    } else if (currentVote) {
      updates = {
        [currentVote === 'like' ? 'likes' : 'dislikes']: -1,
        [type === 'like' ? 'likes' : 'dislikes']: 1,
      };
    } else {
      updates = { [type === 'like' ? 'likes' : 'dislikes']: 1 };
    }

    setThoughts(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, likes: (t.likes || 0) + (updates.likes || 0), dislikes: (t.dislikes || 0) + (updates.dislikes || 0) };
    }));

    const nextVoteState = currentVote === type ? null : type;
    const newVotes = { ...votes };
    if (nextVoteState) newVotes[id] = nextVoteState; else delete newVotes[id];
    setVotes(newVotes);
    try { localStorage.setItem('thoughts_votes', JSON.stringify(newVotes)); } catch { /* ignore */ }

    try {
      await updateThoughtVote(id, updates);
    } catch {
      setThoughts(prev => prev.map(t => {
        if (t.id !== id) return t;
        return { ...t, likes: (t.likes || 0) - (updates.likes || 0), dislikes: (t.dislikes || 0) - (updates.dislikes || 0) };
      }));
      const revert = { ...newVotes };
      if (currentVote) revert[id] = currentVote; else delete revert[id];
      setVotes(revert);
      try { localStorage.setItem('thoughts_votes', JSON.stringify(revert)); } catch { /* ignore */ }
    }
  };

  return (
    <>
      <DragonpitLoader onComplete={() => setLoaderDone(true)} />

      <div ref={containerRef} style={{ background: 'transparent', color: '#f3e8d7', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ════════════════════════════════════════
            HERO SECTION
            ════════════════════════════════════════ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '140px 24px 80px',
            borderBottom: '1px solid var(--dp-border)',
            overflow: 'hidden',
          }}
        >
          {/* Hero Background Image with subtle blur & dark overlay gradient */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/dragonpit/hero_bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              filter: 'blur(4px) brightness(0.65) contrast(1.1)',
              transform: 'scale(1.05)',
              zIndex: 0,
            }}
          />

          {/* Dark Vignette Gradient Overlay for Crisp Text Contrast */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(10, 8, 7, 0.45) 0%, rgba(10, 8, 7, 0.85) 75%, #0a0807 100%), linear-gradient(to bottom, rgba(10, 8, 7, 0.5) 0%, transparent 40%, rgba(10, 8, 7, 0.95) 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '48px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Left Column: Hero Content */}
            <div style={{ flex: '1 1 60%', maxWidth: '720px' }}>

              {/* Tagline Subtitle */}
              <p
                className="dp-hero-sub-text"
                style={{
                  fontFamily: 'var(--font-heading, Georgia, serif)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--dp-gold-soft)',
                  marginBottom: '12px',
                }}
              >
                IDEAS HATCH HERE. SYSTEMS TAKE FLIGHT.
              </p>

              {/* Main Heading */}
              <h1
                className="dp-hero-title"
                style={{
                  fontFamily: 'var(--font-heading, Georgia, serif)',
                  fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '20px',
                }}
              >
                Hi, I’m{' '}
                <span className="dp-gradient-text" style={{ textShadow: '0 0 35px rgba(255, 90, 19, 0.3)' }}>
                  {about?.name || 'Shashika'}
                </span>.
              </h1>

              {/* Title / Affiliation */}
              <h2
                className="dp-hero-sub-text"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--dp-smoke)',
                  marginBottom: '20px',
                  lineHeight: 1.4,
                }}
              >
                {about?.title || 'CSE Undergraduate @ University of Moratuwa'}
              </h2>

              {/* Dynamic Typewriter */}
              <div className="dp-hero-sub-text" style={{ minHeight: '38px', marginBottom: '36px' }}>
                <TypewriterEffect />
              </div>

              {/* Action Buttons with expanded spacing & unified hover effect */}
              <div
                className="dp-hero-btn"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <Link href="#projects" className="dp-btn-hero">
                  Explore The Pit
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <Link href="#contact" className="dp-btn-hero">
                  Send a Raven
                </Link>

                {about?.resumeUrl && (
                  <a
                    href={about.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dp-btn-hero"
                  >
                    View Scroll (CV)
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Status Badge & Burnt Paper Portrait Frame */}
            <div
              className="dp-hero-avatar"
              style={{
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Status Badge Positioned Ahead of Photo */}
              <div className="dp-hero-badge">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 20px',
                    background: 'rgba(20, 16, 13, 0.92)',
                    border: '1px solid var(--dp-border)',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--dp-gold-bright)',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: about?.isAvailable !== false ? '#4ade80' : 'var(--dp-ember)',
                      boxShadow: about?.isAvailable !== false ? '0 0 10px #4ade80' : '0 0 10px var(--dp-ember)',
                    }}
                  />
                  {about?.availabilityStatus || 'Available for Opportunities'}
                </span>
              </div>

              {/* Photo Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '280px',
                  height: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Ambient Ember Glow behind the Burnt Parchment */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '-15px',
                    borderRadius: '24px',
                    background: 'radial-gradient(ellipse at center, rgba(255, 90, 19, 0.35) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 75%)',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Burnt Paper / Scorched Parchment Frame Outer Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px 28px 18px 24px',
                    padding: '5px',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.8) 0%, rgba(138, 13, 13, 0.9) 40%, rgba(30, 20, 12, 0.95) 70%, rgba(212, 175, 55, 0.6) 100%)',
                    boxShadow: '0 15px 45px rgba(0,0,0,0.95), 0 0 25px rgba(255, 90, 19, 0.35), inset 0 0 15px rgba(0,0,0,0.8)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Photo Wrapper with Inner Scorched Vignette */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px 24px 14px 20px',
                      overflow: 'hidden',
                      background: '#0a0807',
                    }}
                  >
                    <img
                      src="/hero.jpg"
                      alt={about?.name || 'Shashika Dayarathna'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        filter: 'contrast(1.1) saturate(1.05) brightness(0.95)',
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = about?.avatarUrl || '/hero.jpg';
                      }}
                    />

                    {/* Charred / Burnt Paper Edges Vignette Overlay */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `
                          radial-gradient(ellipse at center, transparent 48%, rgba(25, 12, 6, 0.75) 78%, rgba(10, 8, 7, 0.98) 100%),
                          linear-gradient(to right, rgba(15, 8, 4, 0.85) 0%, transparent 6%, transparent 94%, rgba(15, 8, 4, 0.85) 100%),
                          linear-gradient(to bottom, rgba(15, 8, 4, 0.9) 0%, transparent 6%, transparent 94%, rgba(15, 8, 4, 0.95) 100%)
                        `,
                        boxShadow: 'inset 0 0 28px rgba(0, 0, 0, 0.95), inset 0 0 10px rgba(255, 90, 19, 0.4)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Ember Glow Accent Line on Burnt Edge */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 90, 19, 0.95) 40%, rgba(212, 175, 55, 0.95) 70%, transparent 100%)',
                        filter: 'blur(1px)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              opacity: 0.5,
            }}
          >
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--dp-gold-soft)' }}>Scroll</span>
            <div style={{ width: '2px', height: '32px', background: 'linear-gradient(var(--dp-gold-bright), var(--dp-ember), transparent)', borderRadius: '1px' }} />
          </div>
        </section>

        {/* ════════════════════════════════════════
            PAGE SECTIONS
            ════════════════════════════════════════ */}

        {/* 1. Skills */}
        <SkillsSection skills={skills} about={about} loading={loading} />

        {/* 2. Featured Projects */}
        <ProjectsSection projects={projects} loading={loading} />

        {/* 3. Competitions */}
        <CompetitionsSection competitions={competitions} loading={loading} />

        {/* 4. Blog */}
        <BlogSection blogs={blogs} loading={loading} />

        {/* 5. Thoughts */}
        <ThoughtsSection
          thoughts={thoughts}
          loading={loading}
          userVotes={votes}
          onVote={handleVote}
        />

        {/* 6. About */}
        <AboutSection about={about} />

        {/* 7. Contact */}
        <ContactSection about={about} />

      </div>

      <style>{`
        @keyframes emberPing {
          0%   { transform: scale(1); opacity: 0.85; }
          75%  { transform: scale(2.2); opacity: 0; }
          100% { opacity: 0; }
        }
        @media (max-width: 960px) {
          section:first-of-type > div {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .dp-hero-avatar { display: none !important; }
        }
        @media (max-width: 640px) {
          section:first-of-type {
            padding: 110px 16px 60px !important;
          }
          h1.dp-hero-title {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
