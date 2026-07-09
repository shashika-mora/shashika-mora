'use client';

import { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, Briefcase, CheckCircle, AlertCircle, Pin } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [techStackText, setTechStackText] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [visibility, setVisibility] = useState(true);

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const data = await getProjects(false);
    setProjects(data);
    setLoading(false);
  }

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setLongDescription('');
    setGithubUrl('');
    setLiveUrl('');
    setTechStackText('');
    setFeatured(false);
    setOrder(projects.length);
    setImageUrl('');
    setVisibility(true);
    setIsEditing(true);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description || '');
    setLongDescription(project.longDescription || '');
    setGithubUrl(project.githubUrl || '');
    setLiveUrl(project.liveUrl || '');
    setTechStackText(project.techStack ? project.techStack.join(', ') : '');
    setFeatured(project.featured || false);
    setOrder(project.order || 0);
    setImageUrl(project.imageUrl || '');
    setVisibility(project.visibility !== false); // Default true
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setStatus({ loading: false, success: false, error: 'Title and description are required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const techStack = techStackText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const projectData = {
      title,
      description,
      longDescription,
      githubUrl,
      liveUrl,
      techStack,
      featured,
      order: Number(order) || 0,
      imageUrl,
      visibility,
    };

    try {
      if (editingId) {
        await updateProject(editingId, projectData);
      } else {
        await addProject(projectData);
      }
      setIsEditing(false);
      loadProjects();
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Failed to save project.' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Manage Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Add, update, and sort showcase items in your portfolio.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
          <CheckCircle size={16} />
          <span>Project saved successfully!</span>
        </div>
      )}

      {isEditing ? (
        /* Edit/Create Form */
        <form onSubmit={handleSave} className="glass-card p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <h3 className="font-heading text-lg font-bold text-white">
              {editingId ? 'Edit Project' : 'Create New Project'}
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
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Antigravity IDE"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</label>
              <input
                type="text"
                value={techStackText}
                onChange={(e) => setTechStackText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. React, Firebase, Node (comma separated)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Short Description *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Teaser description shown on the landing/projects lists."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detailed / Case Study (Markdown supported)</label>
            <textarea
              rows={6}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              placeholder="A detailed breakdown of the features, architecture, and goals..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="https://example.com/image.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GitHub Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="https://github.com/myusername/myrepo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live App URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="https://myapp.web.app"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Order (Sorting)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-slate-300">
                  Pin to Featured Projects on Landing Page
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visibility"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="visibility" className="text-sm font-semibold text-slate-300">
                  Published (Visible to public)
                </label>
              </div>
            </div>
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
              Save Project
            </button>
          </div>
        </form>
      ) : (
        /* Projects List Grid */
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-900">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
              <p className="text-slate-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Briefcase size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-lg">No projects configured</p>
              <p className="text-xs text-slate-650 mt-1">Click "Add Project" to add your first work showcase.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Tech Stack</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-center">Order</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-semibold text-white flex items-center gap-2">
                        {project.title}
                        {project.featured && <Pin size={12} className="text-pink-400 fill-pink-400" />}
                      </td>
                      <td className="p-4 text-slate-450 line-clamp-1 max-w-xs">{project.description}</td>
                      <td className="p-4 text-xs text-slate-400">{project.techStack?.join(', ') || '-'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          project.featured
                            ? 'bg-pink-950/40 text-pink-400 border border-pink-900/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {project.featured ? 'Featured' : 'Regular'}
                        </span>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            project.visibility !== false
                              ? 'bg-green-950/40 text-green-400 border border-green-900/30'
                              : 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/30'
                          }`}>
                            {project.visibility !== false ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono text-xs">{project.order}</td>
                      <td className="p-4 pr-6 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all inline-block"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
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
