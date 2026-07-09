'use client';

import { useState, useEffect } from 'react';
import { getBlogs, addBlog, updateBlog, deleteBlog } from '../../lib/firestore-service';
import { Plus, Edit2, Trash2, Save, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [readingTime, setReadingTime] = useState(5);
  const [content, setContent] = useState('');

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    const data = await getBlogs(false);
    setBlogs(data);
    setLoading(false);
  }

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingId) {
      setSlug(generateSlug(val));
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setImageUrl('');
    setTagsText('');
    setPublished(false);
    setFeatured(false);
    setReadingTime(5);
    setContent('');
    setIsEditing(true);
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setSummary(blog.summary || '');
    setImageUrl(blog.imageUrl || '');
    setTagsText(blog.tags ? blog.tags.join(', ') : '');
    setPublished(blog.published || false);
    setFeatured(blog.featured || false);
    setReadingTime(blog.readingTime || 5);
    setContent(blog.content || '');
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog post');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      setStatus({ loading: false, success: false, error: 'Title, slug, and content are required.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const blogData = {
      title,
      slug,
      summary,
      imageUrl,
      tags,
      published,
      featured,
      readingTime: Number(readingTime) || 5,
      content,
      publishedAt: published ? new Date().toISOString() : null,
    };

    try {
      if (editingId) {
        await updateBlog(editingId, blogData);
      } else {
        await addBlog(blogData);
      }
      setIsEditing(false);
      loadBlogs();
      setStatus({ loading: false, success: true, error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Failed to save blog post.' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-white">Manage Blogs</h1>
          <p className="text-slate-400 text-sm mt-1">Create, edit, and publish article posts on your website.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            <Plus size={16} /> Add New Post
          </button>
        )}
      </div>

      {status.success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-950/10 border border-green-900/20 p-4 rounded-xl text-xs">
          <CheckCircle size={16} />
          <span>Blog post saved successfully!</span>
        </div>
      )}

      {isEditing ? (
        /* Edit/Create Form */
        <form onSubmit={handleSave} className="glass-card p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <h3 className="font-heading text-lg font-bold text-white">
              {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. My Journey into OS Dev"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. my-journey-into-os-dev"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Summary / Teaser</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Short 1-2 sentence overview shown in lists."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cover Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Linux, C, OS Dev (comma separated)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estimated Reading Time (Minutes)</label>
              <input
                type="number"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="5"
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
                  Featured (Pin to Landing Page)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="published" className="text-sm font-semibold text-slate-300">
                  Publish Post (Make visible to public)
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Article Body (Markdown supported)</label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-y"
              placeholder="# Write article here..."
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
              Save Post
            </button>
          </div>
        </form>
      ) : (
        /* Blog Posts List */
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-900">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-r-2 mb-4"></div>
              <p className="text-slate-400">Loading blog posts...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <FileText size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-lg">No blog posts found</p>
              <p className="text-xs text-slate-650 mt-1">Click "Add New Post" to write your first article.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Title</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Tags</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Published Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-semibold text-white">{blog.title}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{blog.slug}</td>
                      <td className="p-4 text-xs text-slate-400">{blog.tags?.join(', ') || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          blog.published
                            ? 'bg-green-950/40 text-green-400 border border-green-900/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                        {blog.featured && (
                          <div className="mt-1">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-950/40 text-pink-400 border border-pink-900/30">
                              Featured
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleEdit(blog)}
                          title="Edit Post"
                          className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all inline-block"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          title="Delete Post"
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
