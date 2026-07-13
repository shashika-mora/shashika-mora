'use client';

import { useState, useEffect } from 'react';
import { getThoughts, addThought, updateThought, deleteThought } from '../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, MessageSquare, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ThoughtsManager() {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [date, setDate] = useState('');

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    loadThoughts();
  }, []);

  async function loadThoughts() {
    setLoading(true);
    const data = await getThoughts();
    setThoughts(data);
    setLoading(false);
  }

  const handleAddNew = () => {
    setEditingId(null);
    setContent('');
    setCategory('Tech');
    
    // Default to current date format like "Jul 13, 2026"
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    setDate(new Date().toLocaleDateString('en-US', options));
    
    setIsEditing(true);
  };

  const handleEdit = (thought) => {
    setEditingId(thought.id);
    setContent(thought.content);
    setCategory(thought.category || 'Tech');
    setDate(thought.date || '');
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this thought?')) return;
    try {
      await deleteThought(id);
      setThoughts(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete thought');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content) {
      setStatus({ loading: false, success: false, error: 'Thought content is required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const thoughtData = {
      content,
      category,
      date,
    };

    try {
      if (editingId) {
        await updateThought(editingId, thoughtData);
      } else {
        await addThought(thoughtData);
      }
      setIsEditing(false);
      loadThoughts();
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus({ loading: false, success: false, error: null }), 3000);
    } catch (error: any) {
      console.error('Error saving thought:', error);
      setStatus({ loading: false, success: false, error: error.message || 'Error occurred while saving.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-900">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white flex items-center gap-3">
            <MessageSquare className="text-indigo-400" size={32} />
            Daily Thoughts Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Publish short notes, thoughts, and updates to your landing page.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={16} />
            Create Thought
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-sm">
          <CheckCircle size={18} />
          <span>Thought saved successfully!</span>
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
            {editingId ? 'Edit Thought' : 'Add New Daily Thought'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all"
              >
                <option value="Tech">Tech</option>
                <option value="Academic">Academic</option>
                <option value="Life">Life</option>
                <option value="Ideas">Ideas</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Date</label>
              <input
                type="text"
                placeholder="e.g. Jul 13, 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Thought Content</label>
            <textarea
              rows={4}
              placeholder="What are you thinking about today? Markdown is supported."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-700 resize-y min-h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-950">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              <Save size={16} />
              {status.loading ? 'Saving...' : 'Save Thought'}
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2"></div>
          <p className="text-slate-500 text-sm">Loading thoughts...</p>
        </div>
      ) : thoughts.length === 0 ? (
        <div className="glass-card text-center py-16 text-slate-500 rounded-2xl border border-slate-900/60">
          <MessageSquare className="mx-auto text-slate-700 mb-4" size={40} />
          <p className="text-lg font-medium text-slate-400">No thoughts published yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Click the button in the top right to write your first daily thought update.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {thoughts.map((thought) => (
            <div key={thought.id} className="glass-card p-6 rounded-2xl border border-slate-900 hover:border-slate-850 transition-all flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded bg-indigo-950 text-indigo-400 border border-indigo-900/40">
                      {thought.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{thought.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(thought)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-lg transition-all active:scale-95"
                      title="Edit thought"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(thought.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-lg transition-all active:scale-95"
                      title="Delete thought"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm whitespace-pre-wrap font-light leading-relaxed">
                  {thought.content}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-950 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ThumbsUp size={14} className="text-emerald-500" />
                  {thought.likes || 0} Likes
                </span>
                <span className="flex items-center gap-1.5">
                  <ThumbsDown size={14} className="text-rose-500" />
                  {thought.dislikes || 0} Dislikes
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
