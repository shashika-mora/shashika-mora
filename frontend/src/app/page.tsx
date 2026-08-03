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

      <div ref={containerRef} style={{ background: '#0a0807', color: '#f3e8d7', minHeight: '100vh', overflowX: 'hidden' }}>

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
          {/* Subtle Ambient Background Gradients */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 30%, rgba(138, 13, 13, 0.15) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 80%)',
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
              zIndex: 1,
            }}
          >
            {/* Left Column: Hero Content */}
            <div style={{ flex: '1 1 60%', maxWidth: '720px' }}>

              {/* Status Badge */}
              <div className="dp-hero-badge" style={{ marginBottom: '20px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 16px',
                    background: 'rgba(20, 16, 13, 0.85)',
                    border: '1px solid var(--dp-border)',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--dp-gold-bright)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
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
              <div className="dp-hero-sub-text" style={{ minHeight: '38px', marginBottom: '32px' }}>
                <TypewriterEffect />
              </div>

              {/* Action Buttons */}
              <div
                className="dp-hero-btn"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <Link href="#projects" className="dp-btn-primary">
                  Explore The Pit 🐉
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <Link href="#contact" className="dp-btn-secondary">
                  Send a Raven 🗡️
                </Link>

                {about?.resumeUrl && (
                  <a
                    href={about.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dp-btn-secondary"
                  >
                    View Scroll (CV) 📜
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Emblem / Sigil Medallion */}
            <div
              className="dp-hero-avatar"
              style={{
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '260px',
                  height: '260px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Glowing ring backdrop */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '-10px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 90, 19, 0.25) 0%, rgba(212, 175, 55, 0.1) 60%, transparent 70%)',
                    filter: 'blur(15px)',
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '1px solid var(--dp-gold-bright)',
                    background: 'linear-gradient(145deg, #181310 0%, #0a0807 100%)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,215,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                  }}
                >
                  <img
                    src="/dragonpit/my_icon.png"
                    alt="Shashika Mora Emblem"
                    style={{
                      width: '140px',
                      height: '140px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 12px rgba(255, 90, 19, 0.4))',
                    }}
                  />
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--dp-gold-bright)' }}>
                      The Dragonpit
                    </span>
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
