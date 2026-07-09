'use client';

import { useState } from 'react';
import { addMessage } from '../../lib/firestore-service';
import { Mail, Linkedin, Github, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

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
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light">
          Have an exciting project, a role opportunity, or just want to chat about operating systems and philosophy? Drop a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
            <Mail className="text-indigo-400 shrink-0" size={24} />
            <div>
              <h4 className="font-heading font-semibold text-white mb-1">Email</h4>
              <a href="mailto:dayarathnaamst.24@uom.lk" className="text-slate-400 hover:text-white text-sm break-all">
                dayarathnaamst.24@uom.lk
              </a>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
            <Linkedin className="text-indigo-400 shrink-0" size={24} />
            <div>
              <h4 className="font-heading font-semibold text-white mb-1">LinkedIn</h4>
              <a href="https://www.linkedin.com/in/shashika-dayarathna-420875359" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm">
                Shashika Dayarathna
              </a>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
            <Github className="text-indigo-400 shrink-0" size={24} />
            <div>
              <h4 className="font-heading font-semibold text-white mb-1">GitHub</h4>
              <a href="https://github.com/shashika-mora" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm">
                shashika-mora
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
                rows={5}
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
  );
}
