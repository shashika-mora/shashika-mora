'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  getAboutConfig, getProjects, getBlogs, getCompetitions,
  getThoughts, updateThoughtVote, getSkills
} from '../lib/firestore-service';
import { ArrowRight, Sparkles } from 'lucide-react';
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
const parsePhrases = (subtitle: string) => {
  if (!subtitle) return [];
  return subtitle.split(',').map(phrase => {
    let cleaned = phrase.trim();
    if (cleaned.toLowerCase().startsWith('and ')) cleaned = cleaned.substring(4).trim();
    if (cleaned.endsWith('.')) cleaned = cleaned.substring(0, cleaned.length - 1).trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  });
};

function TypewriterEffect({ subtitle, phrases: passedPhrases }: { subtitle?: string; phrases?: any[] }) {
  const phrases = useMemo(() => {
    if (passedPhrases && passedPhrases.length > 0) {
      return passedPhrases
        .filter(p => p && (p.visible !== false && p.enabled !== false))
        .map(p => typeof p === 'string' ? p : p.text);
    }
    if (subtitle) return parsePhrases(subtitle);
    return [
      'Building software and hardware solutions',
      'Solving real-world problems',
      'Exploring intelligent systems',
      'Learning through projects and experimentation',
      'Turning ideas into practical systems',
    ];
  }, [subtitle, passedPhrases]);

  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    if (phrases.length === 0) return;
    let timer: NodeJS.Timeout;
    const activePhrase = phrases[currentPhraseIdx] || '';

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
      setCurrentPhraseIdx(prev => (prev + 1) % phrases.length);
      setTypingSpeed(150);
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, phrases, typingSpeed]);

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

const DEFAULT_COMPETITIONS = [
  {
    id: 'comp-1',
    title: 'IEEEXtreme 19.0',
    award: 'Global Rank 45 | Country Rank 1',
    date: 'Oct 2025',
    description: 'Led a team of three to secure Global Rank 45 out of 8000+ teams in a 24-hour programming hackathon organized by IEEE.',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500&auto=format&fit=crop&q=60',
    imageUrl2: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
    link: 'https://ieeextreme.org',
    order: 0,
  },
  {
    id: 'comp-2',
    title: 'Mora Hack 2025',
    award: 'Winner (1st Place)',
    date: 'July 2025',
    description: 'Designed and developed an AI-driven disaster response system within 36 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60',
    imageUrl2: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60',
    link: 'https://morahack.lk',
    order: 1,
  },
];

/* ═══════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [about, setAbout]               = useState<any>(DEFAULT_ABOUT);
  const [projects, setProjects]         = useState<any[]>([]);
  const [blogs, setBlogs]               = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>(DEFAULT_COMPETITIONS);
  const [thoughts, setThoughts]         = useState<any[]>([]);
  const [skills, setSkills]             = useState<any[]>([]);

  const [aboutLoading, setAboutLoading]               = useState(true);
  const [projectsLoading, setProjectsLoading]         = useState(true);
  const [blogsLoading, setBlogsLoading]               = useState(true);
  const [competitionsLoading, setCompetitionsLoading] = useState(true);
  const [thoughtsLoading, setThoughtsLoading]         = useState(true);
  const [skillsLoading, setSkillsLoading]             = useState(true);

  const [votes, setVotes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loaderDone, setLoaderDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAboutConfig().then(data => {
      if (data) {
        setAbout((prev: any) => ({
          ...DEFAULT_ABOUT,
          ...data,
          name: data.name ? (data.name.includes('Shashika') ? 'Shashika' : data.name) : DEFAULT_ABOUT.name,
          title: data.title || DEFAULT_ABOUT.title,
          availabilityStatus: data.availabilityStatus || DEFAULT_ABOUT.availabilityStatus,
        }));
      }
      setAboutLoading(false);
    }).catch(() => setAboutLoading(false));

    getProjects('featured').then(async data => {
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        const all = await getProjects('published');
        setProjects(all.slice(0, 4));
      }
      setProjectsLoading(false);
    }).catch(() => setProjectsLoading(false));

    getBlogs(true).then(data => {
      if (data) setBlogs(data.slice(0, 3));
      setBlogsLoading(false);
    }).catch(() => setBlogsLoading(false));

    getCompetitions().then(data => {
      if (data && data.length > 0) setCompetitions(data);
      setCompetitionsLoading(false);
    }).catch(() => setCompetitionsLoading(false));

    getThoughts().then(data => {
      if (data) setThoughts(data);
      setThoughtsLoading(false);
    }).catch(() => setThoughtsLoading(false));

    getSkills().then(data => {
      if (data && data.length > 0) setSkills(data);
      setSkillsLoading(false);
    }).catch(() => setSkillsLoading(false));

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thoughts_votes');
        if (stored) setVotes(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => clearTimeout(t);
  }, []);

  // Entrance animation — clean opacity reveal without scaling container
  useGSAP(() => {
    if (!loaderDone) return;
    gsap.timeline()
      .fromTo('.dp-hero-badge',    { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' })
      .fromTo('.dp-hero-title',    { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-sub-text', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }, '-=0.4')
      .fromTo('.dp-hero-btn',      { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-avatar',   { opacity: 0 },         { opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }, '-=0.5');
  }, { scope: containerRef, dependencies: [loaderDone] });

  // Scroll reveal for sections below hero
  useGSAP(() => {
    if (aboutLoading && projectsLoading && blogsLoading && competitionsLoading && thoughtsLoading) return;

    const reveal = (selector: string, vars: gsap.TweenVars = {}) =>
      gsap.fromTo(selector, { opacity: 0, y: 24, ...vars }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all',
        scrollTrigger: { trigger: selector, start: 'top 85%' },
        ...vars,
      });

    const revealStagger = (selector: string, delay = 0.15) =>
      gsap.fromTo(selector, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: delay, ease: 'power2.out', clearProps: 'all',
        scrollTrigger: { trigger: selector, start: 'top 85%' },
      });

    reveal('#about .about-card');
    if (!skillsLoading)        revealStagger('.skill-chip', 0.04);
    if (!projectsLoading)      revealStagger('.project-card');
    if (!competitionsLoading)  revealStagger('.competition-card');
    if (!blogsLoading)         revealStagger('.blog-card');
    if (!thoughtsLoading)      revealStagger('.thought-card');
  }, { scope: containerRef, dependencies: [aboutLoading, projectsLoading, blogsLoading, competitionsLoading, thoughtsLoading, skillsLoading] });

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

      <div ref={containerRef} style={{ opacity: loaderDone ? 1 : 0, transition: 'opacity 0.4s ease' }}>

        {/* ════════════════════════════════════════
            HERO SECTION — EXACT MATCH TO DESIGN
            ════════════════════════════════════════ */}
        <section
          style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px 80px',
            position: 'relative',
            background: 'transparent',
          }}
        >
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
            {/* Left text column — pure obsidian background, NO red-orange glow box */}
            <div style={{ flex: '1 1 0%', maxWidth: '720px' }}>

              {/* Availability status badge */}
              <div
                className="dp-hero-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 16px 6px 12px',
                  background: 'rgba(20, 17, 15, 0.9)',
                  border: '1px solid var(--dp-border)',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{ position: 'relative', display: 'flex', width: '9px', height: '9px' }}>
                  {about.isAvailable !== false && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#4ade80',
                        borderRadius: '50%',
                        animation: 'emberPing 1.6s cubic-bezier(0,0,0.2,1) infinite',
                      }}
                    />
                  )}
                  <span
                    style={{
                      width: '9px', height: '9px',
                      background: about.isAvailable !== false ? '#22c55e' : 'var(--dp-muted)',
                      borderRadius: '50%',
                      position: 'relative',
                    }}
                  />
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--dp-gold-soft)' }}>
                  {about.availabilityStatus || 'Available for Opportunities'}
                </span>
              </div>

              {/* Tagline overline */}
              <p
                className="dp-hero-sub-text"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--dp-gold-bright)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={15} className="text-[var(--dp-ember)]" />
                IDEAS HATCH HERE. SYSTEMS TAKE FLIGHT.
              </p>

              {/* Main Heading — HUGE bold text */}
              <h1
                className="dp-hero-title"
                style={{
                  fontFamily: 'var(--font-heading, Georgia, serif)',
                  fontSize: 'clamp(3.5rem, 6.5vw, 5.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '20px',
                }}
              >
                {"Hi, I'm"}{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #ffd700 35%, #ff5a13 70%, #e62e2e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Shashika.
                </span>
              </h1>

              {/* Professional Subtitle */}
              <p
                className="dp-hero-sub-text"
                style={{
                  fontSize: '1.25rem',
                  color: 'var(--dp-smoke)',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                  fontWeight: 500,
                }}
              >
                {about.title || 'CSE Undergraduate @ University of Moratuwa'}
              </p>

              {/* Dynamic Typewriter text */}
              <p
                className="dp-hero-sub-text"
                style={{ fontSize: '1.25rem', color: 'var(--dp-text)', marginBottom: '44px', minHeight: '2.2em' }}
              >
                <TypewriterEffect subtitle={about.subtitle} phrases={about.heroPhrases} />
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center' }}>
                {about.resumeUrl ? (
                  <a
                    href={about.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dp-hero-btn dp-btn-primary"
                    style={{ padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    Download CV 📜
                  </a>
                ) : (
                  <span className="dp-hero-btn dp-btn-disabled" title="CV Coming Soon" style={{ padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}>
                    Download CV 📜
                  </span>
                )}
                <a
                  href="#contact"
                  className="dp-hero-btn dp-btn-secondary"
                  style={{ padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  Send a Raven 🗡️
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Profile Avatar Frame — Right side fixed 340px width */}
            <div
              className="dp-hero-avatar"
              style={{ position: 'relative', flexShrink: 0, width: '340px', height: '400px' }}
            >
              {/* Image frame */}
              <div
                style={{
                  position: 'relative',
                  width: '340px',
                  height: '400px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  background: '#120f0d',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.9), 0 0 25px rgba(212, 175, 55, 0.25)',
                }}
              >
                <img
                  src={about.avatarUrl || '/hero.jpg'}
                  alt={about.name ? `Portrait of ${about.name}` : 'Profile picture'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Corner ornament marks */}
                {[
                  { top: '12px', left: '12px', borderTop: '3px solid var(--dp-gold-bright)', borderLeft: '3px solid var(--dp-gold-bright)' },
                  { top: '12px', right: '12px', borderTop: '3px solid var(--dp-gold-bright)', borderRight: '3px solid var(--dp-gold-bright)' },
                  { bottom: '12px', left: '12px', borderBottom: '3px solid var(--dp-red-bright)', borderLeft: '3px solid var(--dp-red-bright)' },
                  { bottom: '12px', right: '12px', borderBottom: '3px solid var(--dp-red-bright)', borderRight: '3px solid var(--dp-red-bright)' },
                ].map((s, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    style={{ position: 'absolute', width: '16px', height: '16px', opacity: 0.9, ...s }}
                  />
                ))}

                {/* CSE Label */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(10,8,7,0.95))',
                    padding: '36px 16px 14px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--dp-gold-bright)',
                    }}
                  >
                    MORATUWA CSE
                  </span>
                </div>
              </div>

              {/* Dragonpit emblem badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  right: '-18px',
                  background: '#0a0807',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
                }}
              >
                <DragonSigil size={26} glowing />
                <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dp-gold-bright)' }}>
                  The Dragonpit
                </span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '28px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              opacity: 0.45,
            }}
          >
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--dp-gold-soft)' }}>Scroll</span>
            <div style={{ width: '2px', height: '36px', background: 'linear-gradient(var(--dp-gold-bright), var(--dp-ember), transparent)', borderRadius: '1px' }} />
          </div>
        </section>

        {/* ════════════════════════════════════════
            PAGE SECTIONS
            ════════════════════════════════════════ */}

        {/* 1. Skills (Vermithor the Bronze Fury) */}
        <SkillsSection skills={skills} about={about} loading={skillsLoading} />

        {/* 2. Featured Projects (Caraxes dragons of the pit) */}
        <ProjectsSection projects={projects} loading={projectsLoading} />

        {/* 3. Competitions (Sunfyre the Golden) */}
        <CompetitionsSection competitions={competitions} loading={competitionsLoading} />

        {/* 4. Blog (Dreamfyre the Pale Blue) */}
        <BlogSection blogs={blogs} loading={blogsLoading} />

        {/* 5. Thoughts */}
        <ThoughtsSection
          thoughts={thoughts}
          loading={thoughtsLoading}
          votes={votes}
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
            font-size: 2.8rem !important;
          }
        }
      `}</style>
    </>
  );
}
