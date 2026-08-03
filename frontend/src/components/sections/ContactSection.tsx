'use client';

import { useState } from 'react';
import { Mail, Linkedin, Github, Facebook, Instagram, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { addMessage } from '../../lib/firestore-service';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';
import DragonBackgroundLayer from '../dragonpit/DragonBackgroundLayer';

interface ContactSectionProps {
  about: any;
}

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };
const INITIAL_STATUS = { loading: false, success: false, error: null as string | null };

export default function ContactSection({ about }: ContactSectionProps) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState(INITIAL_STATUS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ loading: false, success: false, error: 'Please fill in all required fields.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });
    try {
      await addMessage(formData);
      setFormData(INITIAL_FORM);
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch {
      setStatus({ loading: false, success: false, error: 'Failed to send raven. Please try again.' });
    }
  };

  const socialItems = [
    { label: 'Raven (Work Email)', icon: Mail, href: about?.email || about?.contactEmail ? `mailto:${about?.email || about?.contactEmail}` : undefined, text: about?.email || about?.contactEmail },
    { label: 'Raven (Personal Email)', icon: Mail, href: about?.emailPersonal ? `mailto:${about?.emailPersonal}` : undefined, text: about?.emailPersonal },
    { label: 'LinkedIn Realm', icon: Linkedin, href: about?.linkedinUrl, text: 'shashika-dayarathna', external: true },
    { label: 'GitHub Forge', icon: Github, href: about?.githubUrl, text: 'shashika-mora', external: true },
    { label: 'Facebook', icon: Facebook, href: about?.facebookUrl || 'https://web.facebook.com/shashika.dayarathna.2025/', text: 'shashika.dayarathna.2025', external: true },
    { label: 'Instagram', icon: Instagram, href: about?.instaUrl || 'https://www.instagram.com/shashika_daya/', text: 'shashika_daya', external: true },
  ].filter(s => s.href && s.text);

  return (
    <section
      id="contact"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(10,8,7,0.7)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Dragon Parallax Layer */}
      <DragonBackgroundLayer imageSrc="/dragonpit/Meleys_Seasmoke_Vermax.jpg" opacity={0.14} position="top-right" />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <DragonpitSectionHeader
          label="Contact"
          themed="VHAGAR THE HOARY DREAD · SEND A RAVEN"
          description="Whether for engineering inquiries, software projects, research, or dragon lore — send a raven across the realm."
        />

        <div
          className="contact-card"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.8fr',
            gap: '36px',
          }}
        >
          {/* Social info column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {socialItems.map(({ label, icon: Icon, href, text, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="dp-ember-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  background: 'var(--dp-panel)',
                  border: '1px solid var(--dp-border)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                <Icon size={18} aria-hidden="true" style={{ color: 'var(--dp-gold-bright)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dp-gold-soft)', marginBottom: '2px' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {text}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              background: 'var(--dp-panel)',
              border: '1px solid var(--dp-border)',
              borderRadius: '6px',
              padding: '36px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label htmlFor="name" className="dp-label">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="dp-input"
                  placeholder="Your Name..."
                />
              </div>
              <div>
                <label htmlFor="email" className="dp-label">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="dp-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="dp-label">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                className="dp-input"
                placeholder="Regarding engineering / project / research..."
              />
            </div>

            <div>
              <label htmlFor="message" className="dp-label">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="dp-input"
                placeholder="Write your message..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Status messages */}
            {status.error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dp-red-bright)', fontWeight: 600 }}>
                <AlertTriangle size={16} aria-hidden="true" /> {status.error}
              </div>
            )}
            {status.success && (
              <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4ade80', fontWeight: 600 }}>
                <CheckCircle size={16} aria-hidden="true" /> Raven dispatched successfully! I will answer your call shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={status.loading}
              className="dp-btn-primary"
              style={{ width: '100%', fontSize: '0.95rem' }}
            >
              {status.loading ? 'Dispatching Raven…' : 'Send Raven 🗡️'}
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact .contact-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
