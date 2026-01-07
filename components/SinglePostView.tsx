
import React, { useState, useEffect } from 'react';
import { Post, Category } from '../types';
import { X, Heart, MessageCircle, Share2, Sparkles, Loader2, Send, ArrowLeft, Calendar, User } from 'lucide-react';
import { analyzeImageWithGemini } from '../services/geminiService';
import PostCard from './PostCard';

interface SinglePostViewProps {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onPostSelect: (post: Post) => void;
  currentUser: any;
}

const SinglePostView: React.FC<SinglePostViewProps> = ({ 
  post, 
  allPosts, 
  onBack, 
  onLike, 
  onComment, 
  onPostSelect,
  currentUser 
}) => {
  const [commentText, setCommentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAiAnalysis(null);
  }, [post.id]);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulation of analysis
      const analysis = await analyzeImageWithGemini('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'image/png');
      setAiAnalysis(analysis || "Could not analyze this image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Hero Image Section */}
      <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        <img 
          src={post.thumbnail} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full transition-all shadow-lg group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-200">
                {post.category}
              </span>
              <div className="h-px w-8 bg-slate-200" />
              <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {post.authorName[0]}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none mb-1">{post.authorName}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1"><User size={12} /> Featured Contributor</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button 
                  onClick={() => onLike(post.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 hover:bg-rose-50 hover:border-rose-100 text-slate-600 hover:text-rose-500 transition-all"
                >
                  <Heart size={20} fill={post.likes > 42 ? "currentColor" : "none"} />
                  <span className="font-bold">{post.likes}</span>
                </button>
                <button className="p-2.5 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-600 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="prose prose-slate md:prose-xl max-w-none text-slate-700 leading-relaxed space-y-8 mb-16">
              {post.content.split('\n').map((para, i) => (
                <p key={i} className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-indigo-600 first-letter:mt-1">{para}</p>
              ))}
            </div>

            {/* AI Image Analysis Tool */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Lumina AI Visual Insights</h4>
                    <p className="text-xs text-slate-500">Intelligent image analysis by Gemini 3.0</p>
                  </div>
                </div>
                {!aiAnalysis && (
                  <button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
                  >
                    {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    Analyze Imagery
                  </button>
                )}
              </div>
              {aiAnalysis ? (
                <div className="text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500 bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
                   <p className="italic text-lg">"{aiAnalysis}"</p>
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Curious about the visual narrative? Our AI can analyze the artistic themes, lighting, and composition of the featured image to provide deeper context for this story.
                </p>
              )}
            </div>

            {/* Discussion */}
            <div className="border-t border-slate-100 pt-16">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-serif text-3xl font-bold text-slate-900">
                  Discussion <span className="text-indigo-600">({post.comments.length})</span>
                </h3>
              </div>

              <form onSubmit={handleCommentSubmit} className="mb-12 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div className="flex-grow flex flex-col gap-3">
                  <textarea 
                    placeholder={currentUser ? "Join the conversation..." : "Sign in to share your thoughts"}
                    disabled={!currentUser}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 ring-indigo-50 border-indigo-200 focus:outline-none disabled:cursor-not-allowed transition-all"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button 
                      disabled={!currentUser || !commentText.trim()}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      Post Comment <Send size={16} />
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-8">
                {post.comments.length > 0 ? (
                  post.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg flex-shrink-0">
                        {comment.userName[0]}
                      </div>
                      <div className="flex-grow bg-slate-50 p-6 rounded-3xl group-hover:bg-slate-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900">{comment.userName}</span>
                          <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 italic">
                    No comments yet. Start the discussion!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Posts Section */}
          <div className="mt-24 mb-16">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-serif text-3xl font-bold text-slate-900">More from <span className="text-indigo-600">{post.category}</span></h3>
              <button onClick={onBack} className="text-indigo-600 font-bold hover:underline">View all stories</button>
            </div>
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(rp => (
                  <PostCard key={rp.id} post={rp} onClick={onPostSelect} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                This is our only featured story in {post.category} for now. Check back soon for more!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostView;
