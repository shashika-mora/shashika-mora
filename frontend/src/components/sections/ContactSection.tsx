'use client';

import { useState } from 'react';
import { Mail, Linkedin, Github, Facebook, Instagram, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { addMessage } from '../../lib/firestore-service';
import DragonpitSectionHeader from '../dragonpit/DragonpitSectionHeader';

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
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  const socialItems = [
    { label: 'Email (Work)',     icon: Mail,      href: `mailto:${about?.email || about?.contactEmail}`,           text: about?.email || about?.contactEmail },
    { label: 'Email (Personal)', icon: Mail,      href: `mailto:${about?.emailPersonal || 'shashikatheekshana67@gmail.com'}`, text: about?.emailPersonal || 'shashikatheekshana67@gmail.com' },
    { label: 'LinkedIn',         icon: Linkedin,  href: about?.linkedinUrl,  text: 'shashika-dayarathna', external: true },
    { label: 'GitHub',           icon: Github,    href: about?.githubUrl,    text: 'shashika-mora', external: true },
    { label: 'Facebook',         icon: Facebook,  href: about?.facebookUrl || 'https://web.facebook.com/shashika.dayarathna.2025/', text: 'shashika.dayarathna.2025', external: true },
    { label: 'Instagram',        icon: Instagram, href: about?.instaUrl || 'https://www.instagram.com/shashika_daya/', text: 'shashika_daya', external: true },
  ].filter(s => s.href);

  return (
    <section
      id="contact"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid var(--dp-border)',
        background: 'rgba(8,7,6,0.5)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <DragonpitSectionHeader
          label="Contact"
          themed="SEND YOUR RAVEN"
          description="Want to collaborate, discuss systems, or just say hello? Send a message."
        />

        <div
          className="contact-card"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '32px',
          }}
        >
          {/* Social info column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {socialItems.map(({ label, icon: Icon, href, text, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="dp-ember-hover"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 16px',
                  background: 'var(--dp-panel)',
                  border: '1px solid var(--dp-border)',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
              >
                <Icon size={16} aria-hidden="true" style={{ color: 'var(--dp-red)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dp-muted)', marginBottom: '2px' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--dp-smoke)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              borderRadius: '4px',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  placeholder="Ser Firstname"
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
                  placeholder="raven@domain.com"
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
                placeholder="Regarding…"
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
                placeholder="Write your message here…"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Status messages */}
            {status.error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--dp-ember)' }}>
                <AlertTriangle size={14} aria-hidden="true" /> {status.error}
              </div>
            )}
            {status.success && (
              <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#4ade80' }}>
                <CheckCircle size={14} aria-hidden="true" /> Message sent! I'll get back to you soon.
              </div>
            )}

            <button
              type="submit"
              disabled={status.loading}
              className="dp-btn-primary"
              style={{ width: '100%' }}
            >
              {status.loading ? 'Sending…' : 'Send Raven'}
              <Send size={14} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #contact .contact-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
