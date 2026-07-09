'use client';

import { useState, useEffect } from 'react';
import { getAboutConfig, updateAboutConfig } from '../../../../lib/firestore-service';
import { Save, AlertCircle, CheckCircle, Info, Plus, Trash2 } from 'lucide-react';

const DEFAULT_ABOUT = {
  name: 'Shashika Dayarathna',
  title: 'CSE Undergrad @ University of Moratuwa 🎓',
  subtitle: 'Pure/Vibe Coder ✨ | OS Tinkerer 🐧',
  bio: "I'm a Computer Science and Engineering undergraduate currently exploring everything from low-level kernel tweaks to modern app development. My development process heavily relies on **Pure coding / Vibe coding**—diving in, breaking things, patching them up, and figuring it out along the way.",
  email: 'dayarathnaamst.24@uom.lk',
  linkedinUrl: 'https://www.linkedin.com/in/shashika-dayarathna-420875359',
  githubUrl: 'https://github.com/shashika-mora',
  skills: {
    'Languages & Core': ['Python', 'Java', 'C++', 'C', 'Shell Scripting'],
    'Web & Mobile': ['Next.js', 'React', 'Flutter', 'Android SDK', 'Tailwind CSS', 'Node.js'],
    'AI & Modern Tools': ['Gemini API', 'Claude / LLMs', 'Firebase', 'Git & GitHub', 'Mermaid.js']
  }
};

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ loading: false, success: false, error: null });

  // Skills state management helper
  const [skillsText, setSkillsText] = useState({});

  useEffect(() => {
    async function loadProfile() {
      const data = await getAboutConfig();
      const activeProfile = data || DEFAULT_ABOUT;
      setProfile(activeProfile);

      // Convert skills arrays to comma-separated strings for easy editing
      const textSkills = {};
      if (activeProfile.skills) {
        Object.entries(activeProfile.skills).forEach(([category, list]) => {
          textSkills[category] = list.join(', ');
        });
      }
      setSkillsText(textSkills);
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleFieldChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSkillTextChange = (category, val) => {
    setSkillsText(prev => ({ ...prev, [category]: val }));
  };

  const handleAddCategory = () => {
    const name = prompt('Enter new skill category name (e.g. Cloud & DevOps):');
    if (!name) return;
    if (skillsText[name] !== undefined) {
      alert('Category already exists!');
      return;
    }
    setSkillsText(prev => ({ ...prev, [name]: '' }));
  };

  const handleDeleteCategory = (category) => {
    if (!confirm(`Are you sure you want to delete category "${category}"?`)) return;
    setSkillsText(prev => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus({ loading: true, success: false, error: null });

    // Parse comma-separated skills text back to arrays
    const parsedSkills = {};
    Object.entries(skillsText).forEach(([category, text]) => {
      parsedSkills[category] = text
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    });

    const updatedProfile = {
      ...profile,
      skills: parsedSkills,
    };

    try {
      await updateAboutConfig(updatedProfile);
      setProfile(updatedProfile);
      setSaveStatus({ loading: false, success: true, error: null });
      setTimeout(() => setSaveStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setSaveStatus({ loading: false, success: false, error: 'Failed to save settings.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2"></div>
        <p className="text-slate-500 text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Title */}
      <div className="pb-6 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Profile Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Update bio, skills lists, and social contact details dynamically.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white mb-2">Primary Info</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Email</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hero Main Title</label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. CSE Undergrad @ UoM"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hero Subtitle</label>
              <input
                type="text"
                required
                value={profile.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Vibe Coder | OS Dev"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">About Bio (Markdown supported)</label>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Info size={10} /> Markdown enabled
                </span>
              </div>
              <textarea
                required
                rows={8}
                value={profile.bio}
                onChange={(e) => handleFieldChange('bio', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-y"
              />
            </div>
          </div>

          {/* Dynamic Skills Editor */}
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="font-heading text-lg font-bold text-white">Skills Matrix</h3>
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-850 bg-slate-900 hover:bg-slate-850 text-indigo-400 text-xs font-semibold transition-all"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(skillsText).map(([category, text]) => (
                <div key={category} className="space-y-2 p-4 bg-slate-900/30 rounded-xl border border-slate-900">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-300">{category}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="text-slate-600 hover:text-pink-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleSkillTextChange(category, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Separate skills with commas (e.g. Next.js, React, Node.js)"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links & Saving */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white mb-2">Social Profiles</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedinUrl || ''}
                onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GitHub URL</label>
              <input
                type="url"
                value={profile.githubUrl || ''}
                onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Panel */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            {saveStatus.error && (
              <div className="flex items-start gap-2 text-pink-400 bg-pink-950/20 border border-pink-900/30 p-4 rounded-xl text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{saveStatus.error}</span>
              </div>
            )}

            {saveStatus.success && (
              <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
                <CheckCircle size={16} />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saveStatus.loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {saveStatus.loading ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
