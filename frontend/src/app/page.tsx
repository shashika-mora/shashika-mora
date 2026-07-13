'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAboutConfig, getProjects, getBlogs, getCompetitions, addMessage, getThoughts, updateThoughtVote } from '../lib/firestore-service';
import { ArrowRight, Mail, Linkedin, Github, ExternalLink, Terminal, Cpu, Layers, BookOpen, Send, CheckCircle, Facebook, Instagram, Trophy, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const parseSkill = (skill: any) => {
  if (!skill) return { name: '', iconUrl: '' };
  if (typeof skill === 'string') {
    if (skill.includes('|')) {
      const [name, iconUrl] = skill.split('|');
      return { name: name.trim(), iconUrl: iconUrl.trim() };
    }
    return { name: skill, iconUrl: '' };
  }
  return { name: skill.name || '', iconUrl: skill.iconUrl || '' };
};

const parsePhrases = (subtitle: string) => {
  if (!subtitle) return ["Building SW/HW solutions", "Exploring intelligent systems", "Solving real-world problems"];
  return subtitle.split(',').map(phrase => {
    let cleaned = phrase.trim();
    if (cleaned.toLowerCase().startsWith('and ')) {
      cleaned = cleaned.substring(4).trim();
    }
    if (cleaned.endsWith('.')) {
      cleaned = cleaned.substring(0, cleaned.length - 1).trim();
    }
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  });
};

function TypewriterEffect({ subtitle }: { subtitle: string }) {
  const phrases = parsePhrases(subtitle);
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activePhrase = phrases[currentPhraseIdx];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activePhrase.slice(0, currentText.length + 1));
        setTypingSpeed(80);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activePhrase) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentPhraseIdx(prev => (prev + 1) % phrases.length);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, phrases, typingSpeed]);

  return (
    <span className="text-indigo-400 font-normal">
      {currentText}
      <span className="animate-pulse border-r-2 border-indigo-400 ml-1"></span>
    </span>
  );
}

const DEFAULT_ABOUT = {
  name: 'Shashika Dayarathna',
  role: 'Software Engineer · UI/UX Designer · AI & Agentic Dev',
  title: 'Computer Science & Engineering Undergraduate @ University of Moratuwa',
  subtitle: 'Building SW/HW solutions, Exploring intelligent systems, Solving real-world problems.',
  bio: "I'm a CSE undergraduate who builds across the full spectrum — from low-level Linux kernel patches to production-grade cloud-backed web and Android apps. I design premium UI/UX, integrate LLMs and agentic workflows, and architect scalable backends on the Firebase ecosystem. My style is *Pure / Vibe Coding*: dive in, break things, iterate fast.",
  secondaryBio: "Whether it's crafting agentic AI pipelines with Gemini and MCP servers, designing sleek cross-platform mobile UIs in Flutter and Android, or building real-time Firestore backends with Cloud Functions — I thrive at the intersection of hardware, software, and intelligent systems. Student at the University of Moratuwa, competitive programmer, and lifelong learner.",
  githubUrl: 'https://github.com/shashika-mora',
  linkedinUrl: 'https://linkedin.com/in/shashika-dayarathna',
  email: 'dayarathnaamst.24@uom.lk',
  emailPersonal: 'shashikatheekshana67@gmail.com',
  contactEmail: 'dayarathnaamst.24@uom.lk',
  resumeUrl: '',
  avatarUrl: '/hero.jpg',
  availabilityStatus: 'Available for Opportunities',
  skills: [
    'React', 'Next.js', 'Node.js', 'TypeScript',
    'Flutter', 'Android', 'Dart', 'Java',
    'C++', 'C', 'Python',
    'Firebase', 'Firestore', 'Cloud Functions', 'Firebase Auth',
    'Gemini API', 'LLM Integration', 'Agentic Dev', 'MCP Servers',
    'Docker', 'Linux', 'GSAP', 'Figma', 'UI/UX Design'
  ]
};

const DEFAULT_COMPETITIONS = [
  {
    id: 'comp-1',
    title: 'IEEEXtreme 19.0',
    award: 'Global Rank 45 | Country Rank 1',
    date: 'Oct 2025',
    description: 'Led a team of three to secure Global Rank 45 out of 8000+ teams in a 24-hour programming hackathon organized by IEEE. Solved complex algorithmic problems under time constraints.',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500&auto=format&fit=crop&q=60',
    imageUrl2: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
    link: 'https://ieeextreme.org',
    order: 0
  },
  {
    id: 'comp-2',
    title: 'Mora Hack 2025',
    award: 'Winner (1st Place)',
    date: 'July 2025',
    description: 'Designed and developed an AI-driven disaster response system within 36 hours. Focused on real-time routing algorithms for emergency vehicles and offline mobile communication protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60',
    imageUrl2: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60',
    link: 'https://morahack.lk',
    order: 1
  }
];

function CompetitionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {[1, 2].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-8 border border-slate-900/40 animate-pulse space-y-6">
          <div className="flex justify-between items-start">
            <div className="h-6 bg-slate-800 rounded-lg w-1/3"></div>
            <div className="h-4 bg-slate-800 rounded-lg w-16"></div>
          </div>
          <div className="h-5 bg-slate-800 rounded-lg w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded-lg w-full"></div>
            <div className="h-4 bg-slate-800 rounded-lg w-5/6"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-slate-800 rounded-lg"></div>
            <div className="h-32 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-6 bg-slate-800 rounded-lg w-1/4 pt-4 border-t border-slate-900"></div>
        </div>
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-8 border border-slate-900/40 animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-6 bg-slate-800 rounded-lg w-1/2"></div>
            <div className="h-4 bg-slate-800 rounded-lg w-full"></div>
            <div className="h-4 bg-slate-800 rounded-lg w-5/6"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-5 bg-slate-800 rounded w-12"></div>
            <div className="h-5 bg-slate-800 rounded w-16"></div>
            <div className="h-5 bg-slate-800 rounded w-14"></div>
          </div>
          <div className="h-8 bg-slate-800 rounded-lg w-1/4 pt-4 border-t border-slate-900"></div>
        </div>
      ))}
    </div>
  );
}

function BlogsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6 border border-slate-900/40 animate-pulse space-y-4">
          <div className="w-full h-48 rounded-xl bg-slate-800 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-800 rounded-lg w-5/6"></div>
            <div className="h-3 bg-slate-800 rounded-lg w-1/4"></div>
            <div className="h-3 bg-slate-800 rounded-lg w-full"></div>
            <div className="h-3 bg-slate-800 rounded-lg w-4/5"></div>
          </div>
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

function ThoughtsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 mb-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6 border border-slate-900/40 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-5 bg-slate-800 rounded w-12"></div>
            <div className="h-3 bg-slate-800 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-900">
            <div className="h-6 bg-slate-800 rounded w-16"></div>
            <div className="h-6 bg-slate-800 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [competitions, setCompetitions] = useState(DEFAULT_COMPETITIONS);
  const [thoughts, setThoughts] = useState([]);
  
  const [aboutLoading, setAboutLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [competitionsLoading, setCompetitionsLoading] = useState(true);
  const [thoughtsLoading, setThoughtsLoading] = useState(true);

  // local storage votes state: { [thoughtId]: 'like' | 'dislike' }
  const [votes, setVotes] = useState({});

  const containerRef = useRef(null);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    // 1. Fetch Profile
    getAboutConfig().then(data => {
      if (data) setAbout(data);
      setAboutLoading(false);
    }).catch(err => {
      console.error(err);
      setAboutLoading(false);
    });

    // 2. Fetch Featured Projects (fallback to all if none are marked featured)
    getProjects('featured').then(async data => {
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // No featured projects set — show first 4 visible ones
        const all = await getProjects('published');
        setProjects(all.slice(0, 4));
      }
      setProjectsLoading(false);
    }).catch(err => {
      console.error(err);
      setProjectsLoading(false);
    });

    // 3. Fetch Blogs
    getBlogs(true).then(data => {
      if (data) setBlogs(data.slice(0, 3));
      setBlogsLoading(false);
    }).catch(err => {
      console.error(err);
      setBlogsLoading(false);
    });

    // 4. Fetch Competitions
    getCompetitions().then(data => {
      if (data && data.length > 0) setCompetitions(data);
      setCompetitionsLoading(false);
    }).catch(err => {
      console.error(err);
      setCompetitionsLoading(false);
    });

    // 5. Fetch Daily Thoughts
    getThoughts().then(data => {
      if (data) setThoughts(data);
      setThoughtsLoading(false);
    }).catch(err => {
      console.error(err);
      setThoughtsLoading(false);
    });

    // 6. Load votes from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('thoughts_votes');
      if (stored) {
        try {
          setVotes(JSON.parse(stored));
        } catch (e) {
          console.error('Error loading stored votes:', e);
        }
      }
    }
  }, []);

  // Recalculate ScrollTrigger on content load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, [about, projects, blogs, competitions, thoughts]);

  // 1. Hero Animations (Runs exactly once on mount, preventing double-animation flash)
  useGSAP(() => {
    const heroTl = gsap.timeline();
    heroTl.fromTo('.hero-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', clearProps: 'all' })
      .fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' }, '-=0.3')
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' }, '-=0.4')
      .fromTo('.hero-btn', { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', clearProps: 'all' }, '-=0.3');
  }, { scope: containerRef, dependencies: [] });

  // 2. Scroll Reveal Animations (Runs after the corresponding data modules are loaded)
  useGSAP(() => {
    if (aboutLoading && projectsLoading && blogsLoading && competitionsLoading && thoughtsLoading) return;

    // About Section
    gsap.fromTo('#about .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 85%',
      }
    });
    gsap.fromTo('#about .about-card', { opacity: 0, y: 30, scale: 0.98 }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#about .about-card',
        start: 'top 85%',
      }
    });

    // Tech Stack Section
    gsap.fromTo('#skills .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 85%',
      }
    });
    if (!aboutLoading) {
      gsap.fromTo('.skill-chip', { opacity: 0, scale: 0.8, y: 15 }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        stagger: {
          each: 0.04,
          grid: 'auto'
        },
        ease: 'back.out(1.5)',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.skill-chip',
          start: 'top 85%',
        }
      });
    }

    // Featured Projects Section
    gsap.fromTo('#projects .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 85%',
      }
    });
    if (!projectsLoading) {
      gsap.fromTo('.project-card', { opacity: 0, y: 30, scale: 0.97 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.project-card',
          start: 'top 85%',
        }
      });
    }

    // Competitions Section
    gsap.fromTo('#competitions .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#competitions',
        start: 'top 85%',
      }
    });
    if (!competitionsLoading) {
      gsap.fromTo('.competition-card', { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.competition-card',
          start: 'top 85%',
        }
      });
    }

    // Thoughts Section
    gsap.fromTo('#thoughts .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#thoughts',
        start: 'top 85%',
      }
    });
    if (!thoughtsLoading) {
      gsap.fromTo('.thought-card', { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.thought-card',
          start: 'top 85%',
        }
      });
    }

    // Blogs Section
    gsap.fromTo('#blog .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 85%',
      }
    });
    if (!blogsLoading) {
      gsap.fromTo('.blog-card', { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.blog-card',
          start: 'top 85%',
        }
      });
    }

    // Contact Section
    gsap.fromTo('#contact .section-title', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
      }
    });
    gsap.fromTo('#contact .contact-card', { opacity: 0, y: 40, scale: 0.98 }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#contact .contact-card',
        start: 'top 80%',
      }
    });
  }, { scope: containerRef, dependencies: [aboutLoading, projectsLoading, blogsLoading, competitionsLoading, thoughtsLoading] });

  const handleVote = async (id, type) => {
    const currentVote = votes[id];
    let updates = {};

    if (currentVote === type) {
      // Toggle off current vote
      updates = { [type === 'like' ? 'likes' : 'dislikes']: -1 };
    } else if (currentVote) {
      // Toggle off previous vote, toggle on new vote
      updates = {
        [currentVote === 'like' ? 'likes' : 'dislikes']: -1,
        [type === 'like' ? 'likes' : 'dislikes']: 1
      };
    } else {
      // Toggle on new vote
      updates = { [type === 'like' ? 'likes' : 'dislikes']: 1 };
    }

    // Optimistic UI update
    setThoughts(prevThoughts =>
      prevThoughts.map(t => {
        if (t.id !== id) return t;
        const newLikes = (t.likes || 0) + (updates.likes || 0);
        const newDislikes = (t.dislikes || 0) + (updates.dislikes || 0);
        return { ...t, likes: newLikes, dislikes: newDislikes };
      })
    );

    const nextVoteState = currentVote === type ? null : type;
    const newVotes = { ...votes };
    if (nextVoteState) {
      newVotes[id] = nextVoteState;
    } else {
      delete newVotes[id];
    }
    setVotes(newVotes);

    if (typeof window !== 'undefined') {
      localStorage.setItem('thoughts_votes', JSON.stringify(newVotes));
    }

    try {
      await updateThoughtVote(id, updates);
    } catch (err) {
      console.error('Error updating vote:', err);
      // Revert optimistic UI on failure
      setThoughts(prevThoughts =>
        prevThoughts.map(t => {
          if (t.id !== id) return t;
          const revertedLikes = (t.likes || 0) - (updates.likes || 0);
          const revertedDislikes = (t.dislikes || 0) - (updates.dislikes || 0);
          return { ...t, likes: revertedLikes, dislikes: revertedDislikes };
        })
      );
      if (currentVote) {
        newVotes[id] = currentVote;
      } else {
        delete newVotes[id];
      }
      setVotes(newVotes);
      if (typeof window !== 'undefined') {
        localStorage.setItem('thoughts_votes', JSON.stringify(newVotes));
      }
    }
  };

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



  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6">

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="hero-badge inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-slate-300">
                {about.availabilityStatus || 'Available for Opportunities'}
              </span>
            </div>

            <h1 className="hero-title font-heading text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
              Hi there, I'm <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                {about.name}! 👋
              </span>
            </h1>

            <h3 className="hero-subtitle text-sm md:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              {about.title} <br className="hidden md:block" />
              <TypewriterEffect subtitle={about.subtitle} />
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {about.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-950 font-semibold hover:bg-slate-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 text-center"
                >
                  Download CV
                </a>
              )}
              <a
                href="#contact"
                className={`hero-btn w-full sm:w-auto px-8 py-3.5 rounded-full ${about.resumeUrl ? 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white' : 'bg-white text-slate-950 hover:bg-slate-200'} font-semibold hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group`}
              >
                Contact Me
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Framed Image */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative group">
              {/* Decorative background blur and shapes */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

              {/* The main card frame */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl bg-slate-900 border border-slate-800 p-2.5 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-pink-500/20 pointer-events-none"></div>

                {/* Profile Image itself */}
                <img
                  src={about.avatarUrl || '/hero.jpg'}
                  alt={about.name || 'Profile'}
                  className="w-full h-full object-cover rounded-2xl grayscale-[10%] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Corner accent decorations */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-400/85"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-400/85"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-pink-400/85"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-pink-400/85"></div>
              </div>

              {/* Technical tag overlay */}
              <div className="absolute -bottom-3 -right-3 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl px-4 py-2 text-[10px] font-semibold text-indigo-300 shadow-xl flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                MORATUWA CSE
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative bg-slate-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
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
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
              🛠️ Tech Stack & Arsenal
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full opacity-60"></div>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {Array.isArray(about.skills) ? (
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
                <div className="flex flex-wrap justify-center gap-3">
                  {about.skills.map((skill, index) => {
                    const { name, iconUrl } = parseSkill(skill);
                    return (
                      <span
                        key={index}
                        className="skill-chip px-4 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-sm text-slate-200 font-medium hover:border-indigo-500 hover:text-white transition-all duration-300 flex items-center gap-2"
                      >
                        {iconUrl && (
                          <img src={iconUrl} alt={name} className="w-4 h-4 object-contain" />
                        )}
                        {name}
                      </span>
                    );
                  })}
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
                        {Array.isArray(items) && items.map((skill, index) => {
                          const { name, iconUrl } = parseSkill(skill);
                          return (
                            <span
                              key={index}
                              className="skill-chip px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-medium hover:border-slate-700 transition-colors flex items-center gap-1.5"
                            >
                              {iconUrl && (
                                <img src={iconUrl} alt={name} className="w-3.5 h-3.5 object-contain" />
                              )}
                              {name}
                            </span>
                          );
                        })}
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
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
              Featured Projects
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60"></div>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl">
              A curated selection of things I've built, ranging from low-level systems tinkering to full-stack web applications.
            </p>
          </div>

          {projectsLoading ? (
            <ProjectsSkeleton />
          ) : projects.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/10 border border-slate-900/40 rounded-2xl mb-12">
              <p className="text-slate-400">No featured projects found.</p>
            </div>
          ) : (
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
          )}

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

      {/* Competitions Section */}
      <section id="competitions" className="py-24 px-6 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
              Competitions & Achievements
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full opacity-60"></div>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl">
              Competitive coding milestones, hackathons, and software creation challenges I've participated in.
            </p>
          </div>

          {competitionsLoading ? (
            <CompetitionsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {competitions.map((comp) => (
                <div key={comp.id} className="competition-card glass-card rounded-2xl p-8 hover:scale-[1.01] transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-heading text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {comp.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono shrink-0">{comp.date}</span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-950/30 text-indigo-300 border border-indigo-900/30 text-xs font-medium">
                        🏆 {comp.award}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {comp.description}
                    </p>
                    
                    {/* 2 Images side by side */}
                    {(comp.imageUrl || comp.imageUrl2) && (
                      <div className="grid grid-cols-2 gap-4 mt-4 mb-2 rounded-xl overflow-hidden">
                        {comp.imageUrl && (
                          <div className="h-32 sm:h-40 overflow-hidden relative rounded-lg border border-slate-900">
                            <img src={comp.imageUrl} alt={`${comp.title} visual 1`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        {comp.imageUrl2 && (
                          <div className="h-32 sm:h-40 overflow-hidden relative rounded-lg border border-slate-900">
                            <img src={comp.imageUrl2} alt={`${comp.title} visual 2`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {comp.link && (
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-900/60 mt-6">
                      <a
                        href={comp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                        View Event Details
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link
              href="/competitions"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              See All Competitions
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Thoughts Section */}
      <section id="thoughts" className="py-24 px-6 border-t border-slate-900 bg-slate-950/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
              Daily Thoughts & Updates
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full opacity-60"></div>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl">
              Random thoughts, academic notes, code findings, and daily updates published directly from the admin dashboard.
            </p>
          </div>

          {thoughtsLoading ? (
            <ThoughtsSkeleton />
          ) : thoughts.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/10 border border-slate-900/40 rounded-2xl">
              <p className="text-slate-400">No thoughts posted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {thoughts.map((thought) => {
                const userVote = votes[thought.id];
                return (
                  <div key={thought.id} className="thought-card glass-card p-6 md:p-8 rounded-2xl border border-slate-900 hover:border-slate-850 transition-all flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded bg-indigo-950 text-indigo-400 border border-indigo-900/40">
                          {thought.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{thought.date}</span>
                      </div>
                      
                      <p className="text-slate-300 text-sm md:text-base whitespace-pre-wrap font-light leading-relaxed">
                        {thought.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-900/60 text-xs font-semibold">
                      <button
                        onClick={() => handleVote(thought.id, 'like')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                          userVote === 'like'
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                        }`}
                      >
                        <ThumbsUp size={14} />
                        <span>{thought.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => handleVote(thought.id, 'dislike')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                          userVote === 'dislike'
                            ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                        }`}
                      >
                        <ThumbsDown size={14} />
                        <span>{thought.dislikes || 0}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              href="/thoughts"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              See All Thoughts
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section id="blog" className="py-24 px-6 bg-slate-950/30 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
              Latest Blog Posts
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-60"></div>
            </h2>
          </div>

          {blogsLoading ? (
            <BlogsSkeleton />
          ) : blogs.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/10 border border-slate-900/40 rounded-2xl mb-12">
              <p className="text-slate-400">No blog posts found.</p>
            </div>
          ) : (
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
          )}

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

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title font-heading text-2xl md:text-4xl font-black mb-4 relative inline-block text-white">
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
                  <a href={`mailto:${about.email || about.contactEmail}`} className="text-slate-400 hover:text-white text-xs break-all">
                    {about.email || about.contactEmail}
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
