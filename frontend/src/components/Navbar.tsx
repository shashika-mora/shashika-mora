'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Terminal } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', path: '/#about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Academic', path: '/academics' },
    { name: 'Competitions', path: '/competitions' },
    { name: 'Blog', path: '/blog' },
    { name: 'Thoughts', path: '/thoughts' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md border-b ${
        scrolled
          ? 'bg-slate-950/80 border-slate-800 shadow-lg py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="font-heading font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          SHASHIKA
        </Link>
 
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
 
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
 
      {/* Mobile Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-slate-950/95 border-b border-slate-900 backdrop-blur-xl flex flex-col items-center py-6 space-y-4 shadow-2xl transition-all duration-300 origin-top ${
          isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible h-0 overflow-hidden'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-slate-300 hover:text-indigo-400 transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
