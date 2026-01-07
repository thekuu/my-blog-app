
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, FileText, X, LayoutGrid, List } from 'lucide-react';
import { Post, Category } from '../types';
import { CATEGORIES } from '../constants';

interface DashboardProps {
  userPosts: Post[];
  onCreatePost: (post: Partial<Post>) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userPosts, onCreatePost, onUpdatePost, onDeletePost }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const initialPostState = {
    title: '',
    content: '',
    category: Category.ART,
    thumbnail: 'https://picsum.photos/800/600?random=' + Math.floor(Math.random() * 1000)
  };

  const [postForm, setPostForm] = useState(initialPostState);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Find original to preserve other fields
      const original = userPosts.find(p => p.id === editingId);
      if (original) {
        onUpdatePost({
          ...original,
          ...postForm
        });
      }
    } else {
      onCreatePost(postForm);
    }

    resetForm();
  };

  const handleEditClick = (post: Post) => {
    setEditingId(post.id);
    setPostForm({
      title: post.title,
      content: post.content,
      category: post.category,
      thumbnail: post.thumbnail
    });
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setPostForm(initialPostState);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="font-serif text-4xl font-bold text-slate-900 mb-2">My Creative Studio</h2>
          <p className="text-slate-500">Manage your stories, drafts, and inspirations.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button
            onClick={() => { resetForm(); setIsCreating(true); }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Create New Story
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-12 animate-in slide-in-from-top-10 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Story' : 'New Story'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
          </div>
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Capture attention with a great title..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-indigo-100 focus:outline-none transition-all"
                    value={postForm.title}
                    onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-indigo-100 focus:outline-none transition-all appearance-none"
                    value={postForm.category}
                    onChange={e => setPostForm({ ...postForm, category: e.target.value as Category })}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thumbnail URL (Mock)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 ring-indigo-100 focus:outline-none transition-all"
                      value={postForm.thumbnail}
                      onChange={e => setPostForm({ ...postForm, thumbnail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Story Content</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Tell your story. Support for rich text formatting coming soon..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 ring-indigo-100 focus:outline-none transition-all"
                  value={postForm.content}
                  onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                {editingId ? 'Update Story' : 'Publish Story'}
              </button>
            </div>
          </form>
        </div>
      )}

      {userPosts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No stories yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            You haven't shared any stories with the Samina community. Start by clicking the "Create New Story" button.
          </p>
        </div>
      ) : (
        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {userPosts.map(post => (
            <div key={post.id} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:shadow-lg ${view === 'list' ? 'flex items-center p-4' : ''}`}>
              {view === 'grid' ? (
                <>
                  <div className="aspect-video relative overflow-hidden">
                    <img src={post.thumbnail} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{post.title}</h4>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => onDeletePost(post.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img src={post.thumbnail} className="w-16 h-16 rounded-xl object-cover mr-4" alt="" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900">{post.title}</h4>
                    <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button onClick={() => onDeletePost(post.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={20} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
