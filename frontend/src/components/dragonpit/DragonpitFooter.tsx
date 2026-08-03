'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Facebook, Instagram } from 'lucide-react';
import { getAboutConfig } from '../../lib/firestore-service';
import DragonSigil from './DragonSigil';

export default function DragonpitFooter() {
  const currentYear = new Date().getFullYear();
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    getAboutConfig().then(data => { if (data) setAbout(data); });
  }, []);

  const name    = about?.name    || 'Shashika Dayarathna';
  const github  = about?.githubUrl;
  const linkedin= about?.linkedinUrl;
  const email   = about?.email   || about?.contactEmail;
  const facebook= about?.facebookUrl;
  const insta   = about?.instaUrl;

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
        padding: '48px 24px 32px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '32px', textAlign: 'center' }}>
          <DragonSigil size={36} />
          <p
            style={{
              fontFamily: 'var(--font-heading, Georgia, serif)',
              fontWeight: 900,
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--dp-gold)',
            }}
          >
            THE DRAGONPIT
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--dp-muted)', letterSpacing: '0.04em' }}>
            Ideas hatch here. Systems take flight.
          </p>
        </div>

        {/* Gold divider */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--dp-border), transparent)',
            marginBottom: '28px',
          }}
        />

        {/* Bottom row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                style={{
                  color: 'var(--dp-muted)',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-gold)')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--dp-muted)')}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--dp-muted)', opacity: 0.6 }}>
            © {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
