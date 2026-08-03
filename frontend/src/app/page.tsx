'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  getAboutConfig, getProjects, getBlogs, getCompetitions,
  addMessage, getThoughts, updateThoughtVote, getSkills
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
    <span style={{ color: 'var(--dp-ember)', fontWeight: 400 }}>
      {currentText}
      <span aria-hidden="true" style={{ borderRight: '2px solid var(--dp-ember)', marginLeft: '2px', animation: 'pulse 1s step-end infinite' }} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   DEFAULTS (same values as before — shown until Firestore loads)
   ═══════════════════════════════════════════════════════ */
const DEFAULT_ABOUT = {
  name: 'Shashika Dayarathna',
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
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  // ── Data state ──
  const [about, setAbout]           = useState<any>(DEFAULT_ABOUT);
  const [projects, setProjects]     = useState<any[]>([]);
  const [blogs, setBlogs]           = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>(DEFAULT_COMPETITIONS);
  const [thoughts, setThoughts]     = useState<any[]>([]);
  const [skills, setSkills]         = useState<any[]>([]);

  // ── Loading state ──
  const [aboutLoading, setAboutLoading]           = useState(true);
  const [projectsLoading, setProjectsLoading]     = useState(true);
  const [blogsLoading, setBlogsLoading]           = useState(true);
  const [competitionsLoading, setCompetitionsLoading] = useState(true);
  const [thoughtsLoading, setThoughtsLoading]     = useState(true);
  const [skillsLoading, setSkillsLoading]         = useState(true);

  // ── Vote state ──
  const [votes, setVotes] = useState<Record<string, 'like' | 'dislike'>>({});

  // ── Loader visibility ──
  const [loaderDone, setLoaderDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Data fetching (ALL PRESERVED from original) ──
  useEffect(() => {
    // 1. Profile
    getAboutConfig().then(data => {
      if (data) setAbout(data);
      setAboutLoading(false);
    }).catch(() => setAboutLoading(false));

    // 2. Featured projects (fallback: first 4 published)
    getProjects('featured').then(async data => {
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        const all = await getProjects('published');
        setProjects(all.slice(0, 4));
      }
      setProjectsLoading(false);
    }).catch(() => setProjectsLoading(false));

    // 3. Blogs (latest 3 published)
    getBlogs(true).then(data => {
      if (data) setBlogs(data.slice(0, 3));
      setBlogsLoading(false);
    }).catch(() => setBlogsLoading(false));

    // 4. Competitions
    getCompetitions().then(data => {
      if (data && data.length > 0) setCompetitions(data);
      setCompetitionsLoading(false);
    }).catch(() => setCompetitionsLoading(false));

    // 5. Thoughts
    getThoughts().then(data => {
      if (data) setThoughts(data);
      setThoughtsLoading(false);
    }).catch(() => setThoughtsLoading(false));

    // 6. Skills
    getSkills().then(data => {
      if (data && data.length > 0) setSkills(data);
      setSkillsLoading(false);
    }).catch(() => setSkillsLoading(false));

    // 7. Vote persistence
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thoughts_votes');
        if (stored) setVotes(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  // ── ScrollTrigger refresh ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Hero animation ──
  useGSAP(() => {
    if (!loaderDone) return;
    gsap.timeline()
      .fromTo('.dp-hero-badge',  { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1,  duration: 0.5, ease: 'back.out(1.7)', clearProps: 'all' })
      .fromTo('.dp-hero-title',  { opacity: 0, y: 30 },       { opacity: 1, y: 0,     duration: 0.8, ease: 'power3.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-sub',    { opacity: 0, y: 20 },       { opacity: 1, y: 0,     duration: 0.6, ease: 'power3.out', clearProps: 'all' }, '-=0.4')
      .fromTo('.dp-hero-btn',    { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', clearProps: 'all' }, '-=0.3')
      .fromTo('.dp-hero-avatar', { opacity: 0, scale: 0.9 },  { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out', clearProps: 'all' }, '-=0.6');
  }, { scope: containerRef, dependencies: [loaderDone] });

  // ── Scroll reveal animations ──
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

  // ── Vote handler (PRESERVED from original) ──
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

    // Optimistic update
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
      // Revert
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
      {/* ── Loading screen ── */}
      <DragonpitLoader onComplete={() => setLoaderDone(true)} />

      <div ref={containerRef} style={{ opacity: loaderDone ? 1 : 0, transition: 'opacity 0.4s ease' }}>

        {/* ════════════════════════════════════════
            HERO SECTION
            ════════════════════════════════════════ */}
        <section
          style={{
            minHeight: '92vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px 80px',
            position: 'relative',
          }}
        >
          {/* Radial ember glow behind hero */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 55% at 50% 60%, rgba(111,9,9,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '64px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Text */}
            <div style={{ maxWidth: '680px' }}>
              {/* Availability badge */}
              <div
                className="dp-hero-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px 5px 10px',
                  background: 'var(--dp-panel)',
                  border: '1px solid var(--dp-border)',
                  borderRadius: '2px',
                  marginBottom: '24px',
                }}
              >
                <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                  {about.isAvailable !== false && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#4ade80',
                        borderRadius: '50%',
                        animation: 'emberPing 1.5s cubic-bezier(0,0,0.2,1) infinite',
                      }}
                    />
                  )}
                  <span
                    style={{
                      width: '8px', height: '8px',
                      background: about.isAvailable !== false ? '#22c55e' : 'var(--dp-muted)',
                      borderRadius: '50%',
                      position: 'relative',
                    }}
                  />
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--dp-muted)' }}>
                  {about.availabilityStatus || 'Available for Opportunities'}
                </span>
              </div>

              {/* Main heading */}
              <h1
                className="dp-hero-title"
                style={{
                  fontFamily: 'var(--font-heading, Georgia, serif)',
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: 'var(--dp-text)',
                  marginBottom: '14px',
                }}
              >
                {"Hi, I'm"}{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--dp-gold) 0%, var(--dp-ember) 40%, var(--dp-red-bright) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {about.name}.
                </span>
              </h1>

              {/* Role/subtitle */}
              <p
                className="dp-hero-sub"
                style={{
                  fontSize: '1rem',
                  color: 'var(--dp-muted)',
                  lineHeight: 1.7,
                  marginBottom: '10px',
                  fontWeight: 300,
                }}
              >
                {about.title}
              </p>

              {/* Typewriter */}
              <p
                className="dp-hero-sub"
                style={{ fontSize: '0.95rem', color: 'var(--dp-muted)', marginBottom: '36px', minHeight: '1.5em' }}
              >
                <TypewriterEffect subtitle={about.subtitle} phrases={about.heroPhrases} />
              </p>

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {about.resumeUrl ? (
                  <a
                    href={about.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dp-hero-btn dp-btn-primary"
                  >
                    Download CV
                  </a>
                ) : (
                  <span className="dp-hero-btn dp-btn-disabled" title="CV not yet available">
                    Download CV
                  </span>
                )}
                <a
                  href="#contact"
                  className="dp-hero-btn dp-btn-secondary"
                >
                  Contact Me <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Avatar */}
            <div
              className="dp-hero-avatar"
              style={{ position: 'relative', flexShrink: 0 }}
            >
              {/* Outer glow ring */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  background: 'linear-gradient(135deg, var(--dp-blood), transparent, var(--dp-gold))',
                  borderRadius: '8px',
                  opacity: 0.4,
                  filter: 'blur(6px)',
                }}
              />

              {/* Image frame */}
              <div
                style={{
                  position: 'relative',
                  width: '300px',
                  height: '360px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--dp-border)',
                  background: 'var(--dp-charcoal)',
                }}
              >
                <img
                  src={about.avatarUrl || '/hero.jpg'}
                  alt={about.name ? `Portrait of ${about.name}` : 'Profile picture'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Corner accent marks */}
                {[
                  { top: '12px',  left: '12px',  borderTop: '2px solid var(--dp-gold)', borderLeft: '2px solid var(--dp-gold)' },
                  { top: '12px',  right: '12px', borderTop: '2px solid var(--dp-gold)', borderRight: '2px solid var(--dp-gold)' },
                  { bottom: '12px', left: '12px',  borderBottom: '2px solid var(--dp-red)', borderLeft: '2px solid var(--dp-red)' },
                  { bottom: '12px', right: '12px', borderBottom: '2px solid var(--dp-red)', borderRight: '2px solid var(--dp-red)' },
                ].map((s, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    style={{ position: 'absolute', width: '14px', height: '14px', opacity: 0.8, ...s }}
                  />
                ))}

                {/* University tag */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(6,4,3,0.92))',
                    padding: '32px 16px 12px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--dp-gold)',
                      opacity: 0.85,
                    }}
                  >
                    Moratuwa CSE
                  </span>
                </div>
              </div>

              {/* Dragonpit sigil badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  right: '-18px',
                  background: 'var(--dp-obsidian)',
                  border: '1px solid var(--dp-border)',
                  borderRadius: '4px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <DragonSigil size={22} glowing />
                <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dp-gold)' }}>
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
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              opacity: 0.35,
            }}
          >
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--dp-muted)' }}>Scroll</span>
            <div style={{ width: '1px', height: '32px', background: 'linear-gradient(var(--dp-gold), transparent)' }} />
          </div>
        </section>

        {/* ════════════════════════════════════════
            PAGE SECTIONS (order matters)
            ════════════════════════════════════════ */}

        {/* 1. Skills */}
        <SkillsSection skills={skills} about={about} loading={skillsLoading} />

        {/* 2. Featured Projects */}
        <ProjectsSection projects={projects} loading={projectsLoading} />

        {/* 3. Competitions */}
        <CompetitionsSection competitions={competitions} loading={competitionsLoading} />

        {/* 4. Blog */}
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

      {/* ── Responsive overrides ── */}
      <style>{`
        @keyframes emberPing {
          0%   { transform: scale(1); opacity: 0.75; }
          75%  { transform: scale(2.2); opacity: 0; }
          100% { opacity: 0; }
        }
        @media (max-width: 900px) {
          section > div > div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
          .dp-hero-avatar { display: none !important; }
        }
        @media (max-width: 640px) {
          section:first-of-type {
            padding: 100px 16px 60px !important;
          }
        }
      `}</style>
    </>
  );
}
