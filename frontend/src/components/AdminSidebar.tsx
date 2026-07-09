'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../lib/firebase';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  Mail,
  User,
  LogOut,
  ExternalLink
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth(app);

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blogs', path: '/admin/dashboard/blogs', icon: FileText },
    { name: 'Projects', path: '/admin/dashboard/projects', icon: Briefcase },
    { name: 'Academic', path: '/admin/dashboard/academics', icon: GraduationCap },
    { name: 'Messages', path: '/admin/dashboard/messages', icon: Mail },
    { name: 'Profile Settings', path: '/admin/dashboard/profile', icon: User },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-900">
        <Link href="/admin/dashboard" className="font-heading font-extrabold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          SHASHIKA ADMIN
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-900 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            View Live Site
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-pink-400 hover:bg-pink-950/20 hover:text-pink-300 transition-all text-left"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
