import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          © {currentYear} Shashika Dayarathna. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <a
            href="https://github.com/shashika-mora"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/shashika-dayarathna-420875359"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:shashika.24@cse.mrt.ac.lk"
            className="hover:text-white transition-colors"
          >
            Email
          </a>
          <a
            href="https://web.facebook.com/shashika.dayarathna.2025/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/shashika_daya/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
