'use client';

import { useState, useEffect } from 'react';
import { getAboutConfig } from '../lib/firestore-service';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [about, setAbout] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getAboutConfig();
      if (data) setAbout(data);
    }
    load();
  }, []);

  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          © {currentYear} {about?.name || 'Shashika Dayarathna'}. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          {about?.githubUrl && (
            <a
              href={about.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          )}
          {about?.linkedinUrl && (
            <a
              href={about.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          )}
          {about?.email && (
            <a
              href={`mailto:${about.email}`}
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          )}
          {about?.facebookUrl && (
            <a
              href={about.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
          )}
          {about?.instaUrl && (
            <a
              href={about.instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
