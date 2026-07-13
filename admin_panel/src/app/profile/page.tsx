'use client';

import { useState, useEffect } from 'react';
import { getAboutConfig, updateAboutConfig } from '../../lib/firestore-service';
import { Save, User, Github, Linkedin, Mail, Cpu, Plus, X, CheckCircle, AlertCircle, ArrowUp, ArrowDown, Eye, EyeOff, Trash2 } from 'lucide-react';

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
  const [isAvailable, setIsAvailable] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Hero Phrases Manager
  const [heroPhrases, setHeroPhrases] = useState([]);
  const [newPhraseText, setNewPhraseText] = useState('');

  // Skills Manager
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillIcon, setNewSkillIcon] = useState('');

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      try {
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
          setIsAvailable(config.isAvailable !== false);
          setAvatarUrl(config.avatarUrl || '');
          setSkills(config.skills || []);

          if (config.heroPhrases && config.heroPhrases.length > 0) {
            setHeroPhrases(config.heroPhrases);
          } else {
            const parsed = (config.subtitle || '').split(',').map((ph, idx) => {
              const textVal = ph ? ph.trim() : '';
              return {
                text: textVal,
                visible: true,
                order: idx
              };
            }).filter(ph => ph.text);
            setHeroPhrases(parsed);
          }
        }
      } catch (err: any) {
        console.error('Error loading config in editor:', err);
        setStatus(prev => ({ ...prev, error: err.message || 'Failed to load profile config.' }));
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      const skillObj = {
        name: newSkillName.trim(),
        iconUrl: newSkillIcon.trim()
      };
      
      const exists = skills.some(s => {
        const parsed = typeof s === 'string' ? { name: s } : s;
        return parsed.name?.toLowerCase() === skillObj.name.toLowerCase();
      });

      if (!exists) {
        setSkills(prev => [...prev, skillObj]);
        setNewSkillName('');
        setNewSkillIcon('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddPhrase = () => {
    if (newPhraseText.trim()) {
      const newPhrase = {
        text: newPhraseText.trim(),
        visible: true,
        order: heroPhrases.length
      };
      setHeroPhrases(prev => [...prev, newPhrase]);
      setNewPhraseText('');
    }
  };

  const handleRemovePhrase = (index) => {
    setHeroPhrases(prev => prev.filter((_, idx) => idx !== index));
  };

  const togglePhraseVisibility = (index) => {
    setHeroPhrases(prev => prev.map((ph, idx) => {
      if (idx !== index) return ph;
      return { ...ph, visible: !ph.visible };
    }));
  };

  const movePhrase = (index, direction) => {
    const nextPhrases = [...heroPhrases];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= nextPhrases.length) return;
    
    // Swap
    const temp = nextPhrases[index];
    nextPhrases[index] = nextPhrases[targetIdx];
    nextPhrases[targetIdx] = temp;
    
    // Recalculate order
    setHeroPhrases(nextPhrases.map((ph, idx) => ({ ...ph, order: idx })));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    const profileData = {
      name,
      role,
      bio,
      secondaryBio,
      githubUrl,
      linkedinUrl,
      contactEmail,
      resumeUrl,
      availabilityStatus,
      isAvailable,
      avatarUrl,
      skills,
      heroPhrases,
      subtitle: heroPhrases.filter(ph => ph.visible).map(ph => ph.text).join(', ')
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Availability Status</label>
                <input
                  type="text"
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Actively looking for internships"
                />
              </div>
              <div className="flex flex-col justify-center pt-5">
                <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-650 focus:ring-indigo-500"
                  />
                  <span>Show Green Glow</span>
                </label>
              </div>
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
 
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Profile Picture URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="https://example.com/my-profile-pic.jpg"
              />
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

          <div className="glass-card p-8 rounded-2xl space-y-6 mt-8">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">✨</span>
              Hero Rotating Phrases
            </h3>
            <p className="text-slate-400 text-xs font-light">
              Manage the rotating text phrases displayed on the landing page hero section.
            </p>

            <div className="flex gap-3">
              <input
                type="text"
                value={newPhraseText}
                onChange={(e) => setNewPhraseText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPhrase())}
                placeholder="New phrase (e.g. Building hardware solutions)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddPhrase}
                className="px-5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white text-sm font-semibold transition-all active:scale-95 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="divide-y divide-slate-900/60 space-y-3">
              {heroPhrases.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No phrases configured.</p>
              ) : (
                heroPhrases.map((phrase: any, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-3 first:pt-0 gap-4">
                    <span className={`text-sm ${phrase.visible ? 'text-slate-200' : 'text-slate-600 line-through'}`}>
                      {phrase.text}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => movePhrase(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhrase(idx, 1)}
                        disabled={idx === heroPhrases.length - 1}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePhraseVisibility(idx)}
                        className={`p-1.5 rounded-lg bg-slate-950 border border-slate-900 transition-all active:scale-95 ${phrase.visible ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'}`}
                        title={phrase.visible ? 'Hide from homepage' : 'Show on homepage'}
                      >
                        {phrase.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhrase(idx)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 text-slate-500 hover:text-rose-400 transition-all active:scale-95"
                        title="Delete phrase"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
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

             <div className="space-y-3">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Skill name (e.g. React)"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillIcon}
                  onChange={(e) => setNewSkillIcon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Icon URL (e.g. https://...)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.length === 0 ? (
                <p className="text-slate-500 text-xs py-2">No skills configured.</p>
              ) : (
                skills.map((skill, index) => {
                  const name = typeof skill === 'string' ? skill : skill.name || '';
                  const iconUrl = typeof skill === 'string' ? '' : skill.iconUrl || '';
                  return (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300"
                    >
                      {iconUrl && (
                        <img src={iconUrl} alt={name} className="w-3.5 h-3.5 object-contain rounded-sm" />
                      )}
                      {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-500 hover:text-pink-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })
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
