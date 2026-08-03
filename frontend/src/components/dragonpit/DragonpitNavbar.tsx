'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import DragonSigil from './DragonSigil';

const NAV_LINKS = [
  { name: 'About',        path: '/#about' },
  { name: 'Projects',     path: '/projects' },
  { name: 'Academic',     path: '/academics' },
  { name: 'Competitions', path: '/competitions' },
  { name: 'Blog',         path: '/blog' },
  { name: 'Thoughts',     path: '/thoughts' },
  { name: 'Contact',      path: '/#contact' },
];

export default function DragonpitNavbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const isActive = (path: string) =>
    pathname === path ||
    (path !== '/' && !path.startsWith('/#') && pathname.startsWith(path));

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.3s, border-color 0.3s, padding 0.3s',
        background: scrolled
          ? 'rgba(8, 7, 6, 0.92)'
          : 'transparent',
        borderBottom: scrolled
          ? '1px solid var(--dp-border)'
          : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        padding: scrolled ? '10px 0' : '18px 0',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Wordmark */}
        <Link
          href="/"
          aria-label="The Dragonpit — home"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <DragonSigil size={30} glowing={scrolled} />
          <span
            style={{
              fontFamily: 'var(--font-heading, Georgia, serif)',
              fontWeight: 900,
              fontSize: '1rem',
              letterSpacing: '0.08em',
              color: 'var(--dp-gold)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            THE DRAGONPIT
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.name}
              href={link.path}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                color: isActive(link.path) ? 'var(--dp-gold)' : 'var(--dp-muted)',
                transition: 'color 0.2s',
                position: 'relative',
                paddingBottom: '2px',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-text)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = isActive(link.path) ? 'var(--dp-gold)' : 'var(--dp-muted)')}
            >
              {link.name}
              {/* Ember active indicator */}
              {isActive(link.path) && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, var(--dp-blood), var(--dp-ember), var(--dp-blood))',
                    borderRadius: '1px',
                    boxShadow: '0 0 6px var(--dp-ember)',
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--dp-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        aria-hidden={!isOpen}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(8, 7, 6, 0.98)',
          borderBottom: '1px solid var(--dp-border)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isOpen ? '28px 0' : '0',
          gap: '20px',
          overflow: 'hidden',
          maxHeight: isOpen ? '500px' : '0',
          transition: 'max-height 0.35s ease, padding 0.35s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map(link => (
          <Link
            key={link.name}
            href={link.path}
            onClick={() => setIsOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              color: isActive(link.path) ? 'var(--dp-gold)' : 'var(--dp-muted)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
