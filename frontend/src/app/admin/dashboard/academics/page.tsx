'use client';

import { useState, useEffect } from 'react';
import { getAcademics, addAcademic, updateAcademic, deleteAcademic } from '../../../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';

export default function AcademicsManager() {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [period, setPeriod] = useState('');
  const [grade, setGrade] = useState('');
  const [details, setDetails] = useState('');
  const [order, setOrder] = useState(0);

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    loadAcademics();
  }, []);

  async function loadAcademics() {
    setLoading(true);
    const data = await getAcademics();
    setAcademics(data);
    setLoading(false);
  }

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setInstitution('');
    setPeriod('');
    setGrade('');
    setDetails('');
    setOrder(academics.length + 1);
    setIsEditing(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setInstitution(item.institution);
    setPeriod(item.period || '');
    setGrade(item.grade || '');
    setDetails(item.details || '');
    setOrder(item.order || 0);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this educational entry?')) return;
    try {
      await deleteAcademic(id);
      setAcademics(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !institution) {
      setStatus({ loading: false, success: false, error: 'Degree/Course title and institution are required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const academicData = {
      title,
      institution,
      period,
      grade,
      details,
      order: Number(order),
    };

    try {
      if (editingId) {
        await updateAcademic(editingId, academicData);
      } else {
        await addAcademic(academicData);
      }
      setIsEditing(false);
      loadAcademics();
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Failed to save entry.' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Manage Academic Timeline</h1>
          <p className="text-slate-400 text-sm mt-1">Configure degrees, school achievements, or relevant course accomplishments.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            <Plus size={16} /> Add New Entry
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
          <CheckCircle size={16} />
          <span>Timeline entry saved successfully!</span>
        </div>
      )}

      {isEditing ? (
        /* Edit/Create Form */
        <form onSubmit={handleSave} className="glass-card p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <h3 className="font-heading text-lg font-bold text-white">
              {editingId ? 'Edit Academic Entry' : 'Create New Academic Entry'}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Degree / Certification Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. B.Sc. Engineering (Hons) in Computer Science"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Order Weight *</label>
              <input
                type="number"
                required
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 1 (smaller shows first)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Institution / University *</label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. University of Moratuwa"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Time Period / Graduation Date</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 2023 - Present"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GPA / Score / Honors</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. GPA: 3.9/4.0 or 3 A's"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Details / Achievements (Markdown supported)</label>
            <textarea
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-y"
              placeholder="List core courses, research publications, or awards."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Save size={14} />
              Save Entry
            </button>
          </div>
        </form>
      ) : (
        /* Academics List Table */
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-900">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
              <p className="text-slate-400">Loading educational timeline...</p>
            </div>
          ) : academics.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <GraduationCap size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-lg">No academic records configured</p>
              <p className="text-xs text-slate-650 mt-1">Click "Add New Entry" to build your educational timeline.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Order</th>
                    <th className="p-4">Title / Degree</th>
                    <th className="p-4">Institution</th>
                    <th className="p-4">Period</th>
                    <th className="p-4">Grade / Honors</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {academics.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 text-indigo-400 font-mono font-bold text-xs">{item.order}</td>
                      <td className="p-4 font-semibold text-white">{item.title}</td>
                      <td className="p-4 text-xs text-slate-450">{item.institution}</td>
                      <td className="p-4 text-xs text-slate-400">{item.period || '-'}</td>
                      <td className="p-4 text-xs text-pink-400/90 font-medium">{item.grade || '-'}</td>
                      <td className="p-4 pr-6 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit Entry"
                          className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all inline-block"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete Entry"
                          className="p-2 rounded-lg bg-pink-950/10 border border-pink-900/20 hover:bg-pink-900/30 text-pink-400 hover:text-pink-300 transition-all inline-block"
                        >
                          <Trash2 size={12} />
                        </button>
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
