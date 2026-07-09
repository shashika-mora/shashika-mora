'use client';

import { useState, useEffect } from 'react';
import { getAcademics, addAcademic, updateAcademic, deleteAcademic } from '../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';

export default function AcademicsManager() {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [period, setPeriod] = useState('');
  const [gpa, setGpa] = useState('');
  const [achievementsText, setAchievementsText] = useState('');
  const [coursesText, setCoursesText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
    setInstitution('');
    setDegree('');
    setPeriod('');
    setGpa('');
    setAchievementsText('');
    setCoursesText('');
    setSkillsText('');
    setImageUrl('');
    setOrder(academics.length);
    setIsEditing(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setInstitution(record.institution);
    setDegree(record.degree || '');
    setPeriod(record.period || '');
    setGpa(record.gpa || '');
    setAchievementsText(record.achievements ? record.achievements.join('\n') : '');
    setCoursesText(record.courses ? record.courses.join(', ') : '');
    setSkillsText(record.skills ? record.skills.join(', ') : '');
    setImageUrl(record.imageUrl || '');
    setOrder(record.order || 0);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this educational record?')) return;
    try {
      await deleteAcademic(id);
      setAcademics(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete academic record');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!institution || !degree) {
      setStatus({ loading: false, success: false, error: 'Institution and degree/title are required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const achievements = achievementsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const courses = coursesText
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const academicData = {
      institution,
      degree,
      period,
      gpa,
      achievements,
      courses,
      skills,
      imageUrl,
      order: Number(order) || 0,
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
      setStatus({ loading: false, success: false, error: 'Failed to save academic record.' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Manage Academic Timeline</h1>
          <p className="text-slate-400 text-sm mt-1">Configure degrees, GPAs, achievements, and courses showcase.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            <Plus size={16} /> Add Record
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
          <CheckCircle size={16} />
          <span>Academic record saved successfully!</span>
        </div>
      )}

      {isEditing ? (
        /* Edit/Create Form */
        <form onSubmit={handleSave} className="glass-card p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <h3 className="font-heading text-lg font-bold text-white">
              {editingId ? 'Edit Academic Record' : 'Create New Academic Record'}
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
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Institution *</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. University of Moratuwa"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Degree / Qualification *</label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. B.Sc. Hons in Computer Science & Engineering"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Badge / Logo Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Period / Years</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 2022 - 2026"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GPA / Score</label>
              <input
                type="text"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 3.92 / 4.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Timeline Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Courses</label>
              <input
                type="text"
                value={coursesText}
                onChange={(e) => setCoursesText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Operating Systems, Algorithms (comma separated)"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills Gained</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. C, Python, Machine Learning (comma separated)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Achievements (One per line)</label>
            <textarea
              rows={4}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Dean's List award recipient for 4 semesters.&#10;Won 1st place in the national algorithm hackathon."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl border border-slate-880 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Save size={14} />
              Save Record
            </button>
          </div>
        </form>
      ) : (
        /* Academics List */
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-900">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
              <p className="text-slate-400">Loading academic records...</p>
            </div>
          ) : academics.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <GraduationCap size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-lg">No academic history found</p>
              <p className="text-xs text-slate-650 mt-1">Click "Add Record" to include your first educational milestone.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Institution</th>
                    <th className="p-4">Degree / Qualification</th>
                    <th className="p-4">Period</th>
                    <th className="p-4">GPA</th>
                    <th className="p-4 text-center">Order</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {academics.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-semibold text-white">{record.institution}</td>
                      <td className="p-4 text-slate-450">{record.degree}</td>
                      <td className="p-4 text-xs text-slate-400">{record.period || '-'}</td>
                      <td className="p-4 text-xs text-slate-400 font-semibold">{record.gpa || '-'}</td>
                      <td className="p-4 text-center font-mono text-xs">{record.order}</td>
                      <td className="p-4 pr-6 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all inline-block"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
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
