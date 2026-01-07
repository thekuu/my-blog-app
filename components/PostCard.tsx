
import React from 'react';
import { Post } from '../types';
import { Calendar, User, Heart, MessageCircle, ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <article 
      onClick={() => onClick(post)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          src={post.thumbnail} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User size={12} />
            {post.authorName}
          </div>
        </div>
        
        <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Heart size={16} className="text-rose-400" />
              <span className="text-xs font-medium">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <MessageCircle size={16} className="text-indigo-400" />
              <span className="text-xs font-medium">{post.comments.length}</span>
            </div>
          </div>
          
          <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group/btn">
            Read More
            <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
