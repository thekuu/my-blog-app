
import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { X, Heart, MessageCircle, Share2, Sparkles, Loader2, Send } from 'lucide-react';
import { analyzeImageWithGemini } from '../services/geminiService';

interface PostModalProps {
  post: Post;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  currentUser: any;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, onLike, onComment, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    // In a real app, we'd fetch the thumbnail as a blob/base64
    // Here we simulate converting the thumbnail URL to an analysis call
    try {
      // Mock base64 for demo purposes as we can't easily fetch CORS picsum images
      // In production, the user-uploaded file would already be base64.
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Left Side: Media */}
        <div className="md:w-3/5 h-64 md:h-auto overflow-y-auto bg-slate-100 flex flex-col">
          <img src={post.thumbnail} alt={post.title} className="w-full object-cover min-h-[300px] md:min-h-full" />
        </div>

        {/* Right Side: Content */}
        <div className="md:w-2/5 flex flex-col h-full bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>

          <div className="p-8 flex-grow overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold mb-4 text-slate-900 leading-tight">
              {post.title}
            </h2>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {post.authorName[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.authorName}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>

            <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed space-y-4 mb-10">
              {post.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* AI Image Analysis Tool */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Sparkles size={16} className="text-indigo-600" />
                  AI Image Insights
                </div>
                {!aiAnalysis && (
                  <button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                  >
                    {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Analyze Photo
                  </button>
                )}
              </div>
              {aiAnalysis ? (
                <div className="text-xs text-slate-600 italic animate-in fade-in duration-500 leading-relaxed">
                  {aiAnalysis}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Let Lumina AI analyze the artistic themes and technical aspects of this post's featured image.
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-12 border-t border-slate-100 pt-8">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                Discussion <span className="text-sm font-normal text-slate-400">({post.comments.length})</span>
              </h4>
              <div className="space-y-6">
                {post.comments.length > 0 ? (
                  post.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {comment.userName[0]}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                          <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No comments yet. Be the first to join the conversation!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Interaction Bar */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => onLike(post.id)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <Heart size={20} />
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MessageCircle size={20} />
                  <span className="text-sm font-bold">{post.comments.length}</span>
                </div>
              </div>
              <button className="text-slate-600 hover:text-indigo-600 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input 
                type="text" 
                placeholder={currentUser ? "Add a comment..." : "Sign in to comment"}
                disabled={!currentUser}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-indigo-100 focus:outline-none disabled:cursor-not-allowed"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                disabled={!currentUser || !commentText.trim()}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
