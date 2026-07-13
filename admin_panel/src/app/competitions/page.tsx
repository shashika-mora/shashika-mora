'use client';

import { useState, useEffect } from 'react';
import { getCompetitions, addCompetition, updateCompetition, deleteCompetition } from '../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, Trophy, CheckCircle, AlertCircle } from 'lucide-react';

export default function CompetitionsManager() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [award, setAward] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [order, setOrder] = useState(0);

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    loadCompetitions();
  }, []);

  async function loadCompetitions() {
    setLoading(true);
    const data = await getCompetitions();
    setCompetitions(data);
    setLoading(false);
  }

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setAward('');
    setDescription('');
    setImageUrl('');
    setImageUrl2('');
    setLink('');
    setDate('');
    setOrder(competitions.length);
    setIsEditing(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setTitle(record.title);
    setAward(record.award || '');
    setDescription(record.description || '');
    setImageUrl(record.imageUrl || '');
    setImageUrl2(record.imageUrl2 || '');
    setLink(record.link || '');
    setDate(record.date || '');
    setOrder(record.order || 0);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this competition record?')) return;
    try {
      await deleteCompetition(id);
      setCompetitions(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete competition record');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !award) {
      setStatus({ loading: false, success: false, error: 'Title and award/rank are required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const competitionData = {
      title,
      award,
      description,
      imageUrl,
      imageUrl2,
      link,
      date,
      order: Number(order) || 0,
    };

    try {
      if (editingId) {
        await updateCompetition(editingId, competitionData);
      } else {
        await addCompetition(competitionData);
      }
      setIsEditing(false);
      loadCompetitions();
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Failed to save competition record.' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Manage Competitions</h1>
          <p className="text-slate-400 text-sm mt-1">Configure competition wins, hackathons, rankings, and showcases.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            <Plus size={16} /> Add Competition
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
          <CheckCircle size={16} />
          <span>Competition record saved successfully!</span>
        </div>
      )}

      {isEditing ? (
        /* Edit/Create Form */
        <form onSubmit={handleSave} className="glass-card p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <h3 className="font-heading text-lg font-bold text-white">
              {editingId ? 'Edit Competition Record' : 'Create New Competition Record'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {status.error && (
            <div className="flex items-start gap-2 text-pink-400 bg-pink-950/20 border border-pink-900/30 p-4 rounded-xl text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Competition Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. IEEEXtreme 19.0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Award / Rank *</label>
              <input
                type="text"
                required
                value={award}
                onChange={(e) => setAward(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Global Rank 45, Country Rank 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. October 2025"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Index</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Link (Optional)</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. https://ieeextreme.org"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. https://example.com/trophy.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Secondary Image URL (Optional)</label>
              <input
                type="url"
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. https://example.com/team.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              placeholder="Detail your competition experience, achievements, role, and details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold transition-all"
            >
              {status.loading ? 'Saving...' : (
                <>
                  <Save size={14} /> Save Record
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Competitions List */
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading records...</div>
          ) : competitions.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Trophy size={48} className="mx-auto mb-4 opacity-20" />
              <p>No competition records configured yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="p-6">Order</th>
                    <th className="p-6">Title</th>
                    <th className="p-6">Award / Rank</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300 text-sm">
                  {competitions.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="p-6 font-mono text-slate-500">{record.order}</td>
                      <td className="p-6 font-bold text-white">{record.title}</td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-950/30 text-indigo-300 border border-indigo-900/30 text-xs font-medium">
                          {record.award}
                        </span>
                      </td>
                      <td className="p-6 text-slate-400">{record.date}</td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-pink-950/20 text-slate-400 hover:text-pink-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
