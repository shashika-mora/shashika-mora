'use client';

import { useState, useEffect } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, Cpu, CheckCircle, AlertCircle } from 'lucide-react';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Languages');
  const [level, setLevel] = useState('Working Knowledge');
  const [iconUrl, setIconUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    setLoading(true);
    const data = await getSkills();
    setSkills(data);
    setLoading(false);
  }

  const handleAddNew = () => {
    setEditingId(null);
    setName('');
    setCategory('Languages');
    setLevel('Working Knowledge');
    setIconUrl('');
    setOrder(skills.length);
    setVisible(true);
    setIsEditing(true);
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category || 'Languages');
    setLevel(skill.level || 'Working Knowledge');
    setIconUrl(skill.iconUrl || '');
    setOrder(skill.order || 0);
    setVisible(skill.visible !== false);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete skill');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name) {
      setStatus({ loading: false, success: false, error: 'Skill name is required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const skillData = {
      name,
      category,
      level,
      iconUrl,
      order: Number(order),
      visible,
    };

    try {
      if (editingId) {
        await updateSkill(editingId, skillData);
      } else {
        await addSkill(skillData);
      }
      setIsEditing(false);
      loadSkills();
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus({ loading: false, success: false, error: null }), 3000);
    } catch (error: any) {
      console.error('Error saving skill:', error);
      setStatus({ loading: false, success: false, error: error.message || 'Error occurred while saving.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-900">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white flex items-center gap-3">
            <Cpu className="text-indigo-400" size={32} />
            Skills Catalog Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage technical skills, categories, proficiency levels, and order.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={16} />
            Create Skill
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-sm">
          <CheckCircle size={18} />
          <span>Skill saved successfully!</span>
        </div>
      )}

      {status.error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 text-sm">
          <AlertCircle size={18} />
          <span>{status.error}</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="glass-card p-8 rounded-2xl border border-slate-900 space-y-6">
          <h2 className="text-xl font-bold text-white mb-2">
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skill Name</label>
              <input
                type="text"
                required
                placeholder="e.g. React, Flutter, Python"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all"
              >
                <option value="Languages">Languages</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Databases">Databases</option>
                <option value="Tools">Tools</option>
                <option value="Currently Learning">Currently Learning</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Proficiency Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all"
              >
                <option value="Learning">Learning</option>
                <option value="Familiar">Familiar</option>
                <option value="Working Knowledge">Working Knowledge</option>
                <option value="Proficient">Proficient</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all"
              />
            </div>

            <div className="flex flex-col justify-center pt-5">
              <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-650 focus:ring-indigo-500"
                />
                <span>Visible on Portfolio</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Icon URL</label>
            <input
              type="url"
              placeholder="e.g. https://cdn.simpleicons.org/react"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-950">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
            >
              <span className="shrink-0"><X size={16} /></span>
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              <span className="shrink-0"><Save size={16} /></span>
              {status.loading ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2"></div>
          <p className="text-slate-500 text-sm">Loading skills catalog...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="glass-card text-center py-16 text-slate-500 rounded-2xl border border-slate-900/60">
          <Cpu className="mx-auto text-slate-700 mb-4" size={40} />
          <p className="text-lg font-medium text-slate-400">No skills in catalog yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Click the button in the top right to register your first skill profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="glass-card p-6 rounded-2xl border border-slate-900 hover:border-slate-850 transition-all flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded bg-indigo-950 text-indigo-400 border border-indigo-900/40">
                      {skill.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Order: {skill.order}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-lg transition-all active:scale-95"
                      title="Edit skill"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-lg transition-all active:scale-95"
                      title="Delete skill"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {skill.iconUrl && (
                    <img src={skill.iconUrl} alt={skill.name} className="w-8 h-8 object-contain rounded-md" />
                  )}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white leading-tight">
                      {skill.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Level: {skill.level}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-950 text-xs text-slate-500">
                <span>Visibility: {skill.visible !== false ? '✅ Visible' : '❌ Hidden'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
