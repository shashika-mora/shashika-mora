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
import DragonPassionNote from '../components/sections/DragonPassionNote';
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
  linkedinUrl: 'https://www.linkedin.com/in/shashika-dayarathna-420875359',
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
  const [about, setAbout] = useState<any>(DEFAULT_ABOUT);
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loaderDone, setLoaderDone] = useState(false);

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
      .fromTo('.dp-hero-badge', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' })
      .fromTo('.dp-hero-title', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-sub-text', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }, '-=0.4')
      .fromTo('.dp-hero-btn', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-avatar', { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }, '-=0.5');

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
      <DragonpitLoader isDataLoaded={!loading} onComplete={() => setLoaderDone(true)} />

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
              filter: 'blur(3px) brightness(0.55) contrast(1.15)',
              transform: 'scale(1.04)',
              zIndex: 0,
            }}
          />

          {/* Dark Scorched Burning Vignette Gradient Overlay for Seamless Edge Blending & Crisp Contrast */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at center, rgba(10, 8, 7, 0.35) 0%, rgba(10, 8, 7, 0.75) 65%, #0a0807 100%),
                linear-gradient(to bottom, #0a0807 0%, transparent 18%, transparent 80%, #0a0807 100%),
                linear-gradient(to right, #0a0807 0%, transparent 12%, transparent 88%, #0a0807 100%)
              `,
              boxShadow: 'inset 0 -30px 50px -10px rgba(255, 90, 19, 0.22), inset 0 0 90px #0a0807',
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
                  opacity: loaderDone ? undefined : 0,
                }}
              >
                IDEAS HATCH HERE. SYSTEMS TAKE FLIGHT.
              </p>

              {/* Main Heading */}
              <h1
                className="dp-hero-title"
                style={{
                  fontFamily: 'var(--font-heading, Georgia, serif)',
                  fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '20px',
                  opacity: loaderDone ? undefined : 0,
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
                  opacity: loaderDone ? undefined : 0,
                }}
              >
                {about?.title || 'CSE Undergraduate @ University of Moratuwa'}
              </h2>

              {/* Locked Height Dynamic Typewriter (Prevents layout shift or vertical shrinking) */}
              <div
                className="dp-hero-sub-text"
                style={{
                  height: '68px',
                  minHeight: '68px',
                  maxHeight: '68px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '36px',
                  overflow: 'hidden',
                  opacity: loaderDone ? undefined : 0,
                }}
              >
                <TypewriterEffect />
              </div>

              {/* Action Buttons — Send a Raven & View Scroll */}
              <div
                className="dp-hero-btn"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '20px 24px',
                  opacity: loaderDone ? undefined : 0,
                }}
              >
                <Link href="#contact" className="dp-btn-hero">
                  Send a Raven 🐦‍⬛
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <a
                  href={about?.resumeUrl || '#contact'}
                  target={about?.resumeUrl ? '_blank' : undefined}
                  rel={about?.resumeUrl ? 'noopener noreferrer' : undefined}
                  className="dp-btn-hero"
                >
                  View Scroll (CV) 📜
                </a>
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
                opacity: loaderDone ? undefined : 0,
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

              {/* Photo — Burned Paper Edge Effect */}
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
                {/* Outer ember fire ambient glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '-16px',
                    background: 'radial-gradient(ellipse at center, rgba(255,90,19,0.45) 0%, rgba(180,60,0,0.2) 45%, transparent 72%)',
                    filter: 'blur(22px)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Burned paper frame — irregular clip-path simulates jagged charred torn edges */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    clipPath: `polygon(
                      0% 3%, 2% 0%, 5% 1.5%, 8% 0%,
                      12% 1%, 16% 0%, 20% 1.5%, 24% 0%,
                      28% 1%, 33% 0%, 38% 1.5%, 43% 0%,
                      48% 1%, 53% 0%, 58% 1.5%, 63% 0%,
                      68% 1%, 73% 0%, 78% 1.5%, 83% 0%,
                      88% 1%, 92% 0%, 95% 1.5%, 98% 0%,
                      100% 3%, 99% 7%, 100% 11%, 99% 15%,
                      100% 20%, 99% 25%, 100% 30%, 99% 35%,
                      100% 40%, 99% 45%, 100% 50%, 99% 55%,
                      100% 60%, 99% 65%, 100% 70%, 99% 75%,
                      100% 80%, 99% 85%, 100% 90%, 99% 94%,
                      100% 97%, 98% 100%, 94% 98.5%, 90% 100%,
                      86% 98.5%, 82% 100%, 77% 98.5%, 72% 100%,
                      67% 98.5%, 62% 100%, 57% 98.5%, 52% 100%,
                      47% 98.5%, 42% 100%, 37% 98.5%, 32% 100%,
                      27% 98.5%, 22% 100%, 17% 98.5%, 12% 100%,
                      8% 98.5%, 4% 100%, 2% 98%,
                      0% 97%, 1% 92%, 0% 87%, 1% 82%,
                      0% 77%, 1% 72%, 0% 67%, 1% 62%,
                      0% 57%, 1% 52%, 0% 47%, 1% 42%,
                      0% 37%, 1% 32%, 0% 27%, 1% 22%,
                      0% 17%, 1% 12%, 0% 7%
                    )`,
                  }}
                >
                  {/* Charred dark paper background visible at jagged torn edges */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(ellipse at center, #1c0900 0%, #0b0300 55%, #020100 100%)',
                      zIndex: 0,
                    }}
                  />

                  {/* Photo */}
                  <img
                    src="/hero.jpg"
                    alt={about?.name || 'Shashika Dayarathna'}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      filter: 'contrast(1.1) saturate(1.02) brightness(0.96)',
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = about?.avatarUrl || '/hero.jpg';
                    }}
                  />

                  {/* Charred edge vignette — dark smoky inward burn + ember inner rim glow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 2,
                      background: `
                        radial-gradient(ellipse at center, transparent 52%, rgba(8,2,0,0.78) 75%, rgba(2,1,0,0.97) 100%),
                        linear-gradient(to right, rgba(4,1,0,0.9) 0%, transparent 9%, transparent 91%, rgba(4,1,0,0.9) 100%),
                        linear-gradient(to bottom, rgba(4,1,0,0.9) 0%, transparent 7%, transparent 92%, rgba(4,1,0,0.96) 100%)
                      `,
                      boxShadow: `
                        inset 0 0 50px rgba(0,0,0,0.99),
                        inset 0 0 22px rgba(18,6,0,0.95),
                        inset 0 0 10px rgba(255,65,0,0.18)
                      `,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Burning ember rim — the glowing fire edge */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: '5px',
                      zIndex: 3,
                      boxShadow: `
                        inset 0 0 0 1.5px rgba(255,80,0,0.55),
                        inset 0 0 9px rgba(255,110,0,0.32),
                        inset 0 0 18px rgba(200,55,0,0.15)
                      `,
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Deep scorched drop shadow beneath the frame */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: '0 22px 65px rgba(0,0,0,0.97), 0 0 28px rgba(170,55,0,0.28)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Ember Spark Particles floating up from bottom of hero */}
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: `${8 + (i % 5) * 6}%`,
                left: `${10 + (i * 17 + i * i * 3) % 80}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                borderRadius: '50%',
                background: i % 3 === 0 ? 'var(--dp-gold-bright)' : i % 3 === 1 ? 'var(--dp-ember)' : '#ff9a44',
                boxShadow: i % 3 === 0
                  ? '0 0 6px 2px rgba(255,215,0,0.7)'
                  : '0 0 6px 2px rgba(255,90,19,0.7)',
                animation: `heroEmberRise ${2.5 + (i % 4) * 0.8}s ease-out ${(i * 0.35) % 2.5}s infinite`,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          ))}

          {/* "Explore the Pit" CTA — bottom center of hero */}
          <Link
            href="#projects"
            className="dp-btn-hero"
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 3,
              opacity: loaderDone ? 1 : 0,
              transition: 'opacity 0.5s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Explore the Pit 🐉
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
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

        {/* 7. Dragon Passion & Lore Note */}
        <DragonPassionNote />

        {/* 8. Contact */}
        <ContactSection about={about} />

      </div>

      <style>{`
        @keyframes emberPing {
          0%   { transform: scale(1); opacity: 0.85; }
          75%  { transform: scale(2.2); opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes heroEmberRise {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          15%  { opacity: 0.95; }
          85%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-90px) scale(0.4) translateX(12px); }
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
