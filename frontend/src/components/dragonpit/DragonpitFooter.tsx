'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Facebook, Instagram } from 'lucide-react';
import { getAboutConfig } from '../../lib/firestore-service';
import DragonSigil from './DragonSigil';

export default function DragonpitFooter() {
  const currentYear = new Date().getFullYear();
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    getAboutConfig().then(data => { if (data) setAbout(data); });
  }, []);

  const name     = about?.name     || 'Shashika Dayarathna';
  const github   = about?.githubUrl;
  const linkedin = about?.linkedinUrl;
  const email    = about?.email    || about?.contactEmail;
  const facebook = about?.facebookUrl;
  const insta    = about?.instaUrl;

  const socialLinks = [
    github   && { href: github,   label: 'GitHub',    icon: Github },
    linkedin && { href: linkedin, label: 'LinkedIn',   icon: Linkedin },
    email    && { href: `mailto:${email}`, label: 'Email', icon: Mail },
    facebook && { href: facebook, label: 'Facebook',  icon: Facebook },
    insta    && { href: insta,    label: 'Instagram', icon: Instagram },
  ].filter(Boolean) as { href: string; label: string; icon: any }[];

  return (
    <footer
      style={{
        background: 'var(--dp-obsidian)',
        borderTop: '1px solid var(--dp-border)',
        padding: '48px 24px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Desktop Centered Symmetrical Grid (1fr auto 1fr) */}
      <div
        className="hidden md:grid"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        {/* Left Wing: Branding & Tagline (Right aligned towards center line) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '18px',
            textAlign: 'right',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-heading, Georgia, serif)',
                fontWeight: 900,
                fontSize: '0.95rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--dp-gold-bright)',
                marginBottom: '3px',
              }}
            >
              THE DRAGONPIT
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--dp-smoke)', letterSpacing: '0.04em' }}>
              Ideas hatch here. Systems take flight.
            </p>
          </div>
          <DragonSigil size={38} glowing />
        </div>

        {/* Center Vertical Divider Line (Mathematically Centered) */}
        <div
          aria-hidden="true"
          style={{
            width: '1px',
            height: '56px',
            background: 'linear-gradient(180deg, transparent 0%, var(--dp-gold-bright) 50%, transparent 100%)',
            opacity: 0.6,
          }}
        />

        {/* Right Wing: Social Links & Copyright Notice (Left aligned from center line) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                style={{
                  color: 'var(--dp-smoke)',
                  transition: 'color 0.2s, transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold-bright)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-smoke)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--dp-muted)', opacity: 0.8 }}>
            © {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile Stacked View */}
      <div
        className="flex md:hidden flex-col items-center text-center gap-6"
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <div className="flex flex-col items-center gap-3">
          <DragonSigil size={36} glowing />
          <div>
            <p
              style={{
                fontFamily: 'var(--font-heading, Georgia, serif)',
                fontWeight: 900,
                fontSize: '0.9rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dp-gold-bright)',
              }}
            >
              THE DRAGONPIT
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--dp-smoke)' }}>
              Ideas hatch here. Systems take flight.
            </p>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--dp-gold-bright), transparent)',
            opacity: 0.4,
          }}
        />

        <div className="flex flex-col items-center gap-3">
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                style={{ color: 'var(--dp-smoke)' }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--dp-muted)', opacity: 0.8 }}>
            © {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
