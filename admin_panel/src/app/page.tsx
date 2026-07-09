'use client';

import { useState, useEffect } from 'react';
import { getBlogs, getProjects, getAcademics, getMessages } from '../lib/firestore-service';
import { FileText, Briefcase, GraduationCap, Mail, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    blogsPublished: 0,
    projects: 0,
    projectsFeatured: 0,
    academics: 0,
    messages: 0,
    messagesUnread: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const blogsData = await getBlogs(false);
        const projectsData = await getProjects(false);
        const academicsData = await getAcademics();
        const messagesData = await getMessages();

        const publishedBlogs = blogsData.filter(b => b.published).length;
        const featuredProjects = projectsData.filter(p => p.featured).length;
        const unreadMessages = messagesData.filter(m => m.status === 'unread').length;

        setStats({
          blogs: blogsData.length,
          blogsPublished: publishedBlogs,
          projects: projectsData.length,
          projectsFeatured: featuredProjects,
          academics: academicsData.length,
          messages: messagesData.length,
          messagesUnread: unreadMessages,
        });

        setRecentMessages(messagesData.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { name: 'Blog Posts', value: stats.blogs, subtext: `${stats.blogsPublished} Published`, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-950/20', link: '/blogs' },
    { name: 'Projects', value: stats.projects, subtext: `${stats.projectsFeatured} Featured`, icon: Briefcase, color: 'text-pink-400', bg: 'bg-pink-950/20', link: '/projects' },
    { name: 'Academic Records', value: stats.academics, subtext: 'Timeline Entries', icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-950/20', link: '/academics' },
    { name: 'Messages', value: stats.messages, subtext: `${stats.messagesUnread} Unread`, icon: Mail, color: 'text-emerald-400', bg: 'bg-emerald-950/20', link: '/messages' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2"></div>
        <p className="text-slate-500 text-sm">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Title */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-900">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Quick statistics and inbox management overview.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-semibold">
          <Shield size={12} />
          Secure Admin Session
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.name}
              href={card.link}
              className="glass-card p-6 rounded-2xl hover:scale-[1.02] hover:border-slate-800 transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{card.name}</span>
                <span className="text-3xl font-bold text-white block">{card.value}</span>
                <span className="text-xs text-slate-400 block">{card.subtext}</span>
              </div>
              <div className={`${card.bg} ${card.color} p-4 rounded-xl shrink-0`}>
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity / Messages split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-400" />
              Recent Inquiries
            </h3>
            <Link
              href="/messages"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Inbox Manager <ArrowRight size={12} />
            </Link>
          </div>

          <div className="glass-card rounded-2xl p-6 divide-y divide-slate-900/60 space-y-4">
            {recentMessages.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No messages received yet.</p>
            ) : (
              recentMessages.map((msg, idx) => (
                <div key={msg.id} className={`pt-4 first:pt-0 ${msg.status === 'unread' ? 'font-medium' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm text-slate-200">{msg.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-400 mb-2">{msg.email}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documentation / Tips */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-white">System Logs</h3>
          <div className="glass-card p-6 rounded-2xl space-y-4 text-sm leading-relaxed text-slate-400 font-light">
            <p>
              Welcome back to your Admin panel! Here you can fully manage your dynamic website data:
            </p>
            <ul className="list-disc pl-4 space-y-2 text-xs">
              <li>Create articles in <span className="font-semibold text-slate-200">Blogs</span> to share knowledge.</li>
              <li>Add entries to <span className="font-semibold text-slate-200">Projects</span> to update your portfolio grid.</li>
              <li>Maintain your educational background in <span className="font-semibold text-slate-200">Academic</span>.</li>
              <li>Read messages and respond via email directly.</li>
              <li>Configure landing page details dynamically in <span className="font-semibold text-slate-200">Profile Settings</span>.</li>
            </ul>
            <div className="pt-4 border-t border-slate-900 text-xs text-slate-500">
              Note: Database calls are securely authenticated.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
