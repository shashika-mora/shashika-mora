'use client';

import { useState, useEffect } from 'react';
import { getAboutConfig, updateAboutConfig } from '../../lib/firestore-service';
import { Save, User, Github, Linkedin, Mail, Cpu, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  // Profile Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [secondaryBio, setSecondaryBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');

  // Skills Manager
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      const config = await getAboutConfig();
      if (config) {
        setName(config.name || '');
        setRole(config.role || '');
        setBio(config.bio || '');
        setSecondaryBio(config.secondaryBio || '');
        setGithubUrl(config.githubUrl || '');
        setLinkedinUrl(config.linkedinUrl || '');
        setContactEmail(config.contactEmail || '');
        setResumeUrl(config.resumeUrl || '');
        setAvailabilityStatus(config.availabilityStatus || '');
        setSkills(config.skills || []);
      }
      setLoading(false);
    }
    loadConfig();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    const profileData = {
      name,
      role,
      bio,
      githubUrl,
      linkedinUrl,
      contactEmail,
      resumeUrl,
      availabilityStatus,
      skills,
    };

    try {
      await updateAboutConfig(profileData);
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Failed to update profile settings.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2"></div>
        <p className="text-slate-500 text-sm">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900">
        <h1 className="font-heading text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure details, bio text, social handles, and technical skills.</p>
      </div>

      {status.success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
          <CheckCircle size={16} />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {status.error && (
        <div className="flex items-start gap-2 text-pink-400 bg-pink-950/20 border border-pink-900/30 p-4 rounded-xl text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <User size={18} className="text-indigo-400" />
              General Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Shashika Dayarathna"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Role / Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. CSE Student / Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Availability Status</label>
                <input
                  type="text"
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Actively looking for internships"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resume / CV URL</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Bio (Hero Section)</label>
              <textarea
                required
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
                placeholder="A strong opening statement about yourself..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detailed Biography (About Section)</label>
              <textarea
                rows={6}
                value={secondaryBio}
                onChange={(e) => setSecondaryBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
                placeholder="A longer summary of your work, interests, education, and career goals..."
              />
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-indigo-400" />
              Contacts & Social URLs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail size={12} /> Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. shashika@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Github size={12} /> GitHub Profile
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="https://github.com/myusername"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Linkedin size={12} /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="https://linkedin.com/in/myusername"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Submit */}
        <div className="space-y-8">
          {/* Skills Panel */}
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Cpu size={18} className="text-indigo-400" />
              Technical Stack Skills
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Docker, TypeScript"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.length === 0 ? (
                <p className="text-slate-500 text-xs py-2">No skills configured.</p>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-500 hover:text-pink-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={status.loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/10"
          >
            <Save size={18} />
            {status.loading ? 'Saving Profile...' : 'Save Profile Config'}
          </button>
        </div>
      </form>
    </div>
  );
}
