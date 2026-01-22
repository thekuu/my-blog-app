
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import PostCard from './components/PostCard';
import SinglePostView from './components/SinglePostView';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import { Post, Category, User } from './types';
import { supabase } from './services/supabaseClient';
import { Search as SearchIcon, Sparkles, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auth State Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
      if (session?.user) {
        // Need to fetch profile if we want name/avatar
        // For now, mapping auth.user to our User type
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email!,
          avatar: session.user.user_metadata.avatar_url
        };
        setCurrentUser(user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email!,
          avatar: session.user.user_metadata.avatar_url
        };
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setShowDashboard(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Posts
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author_name,
        comments (
          id,
          content,
          created_at,
          user_id,
          user_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      // Map data to match Post interface (snake_case to camelCase)
      const formattedPosts: Post[] = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        authorId: p.author_id,
        authorName: p.author_name || 'Unknown',
        category: p.category as Category,
        thumbnail: p.thumbnail,
        createdAt: p.created_at,
        likes: p.likes || 0,
        comments: (p.comments || []).map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          userName: c.user_name || 'Anonymous',
          content: c.content,
          createdAt: c.created_at
        })),
        tags: p.tags || [],
        attachments: p.attachments || []
      }));
      setPosts(formattedPosts);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Initial load

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setShowDashboard(false);
  };

  // Re-fetch posts when dashboard or home is viewed to keep data fresh
  useEffect(() => {
    if (!selectedPost) {
      fetchPosts();
    }
  }, [showDashboard, selectedPost]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory ? post.category === activeCategory : true;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const handleCreatePost = async (newPostData: Partial<Post>) => {
    if (!currentUser) return;

    const postPayload = {
      title: newPostData.title,
      content: newPostData.content,
      excerpt: (newPostData.content?.substring(0, 150) || '') + '...',
      category: newPostData.category,
      thumbnail: newPostData.thumbnail || 'https://picsum.photos/800/600?random=' + Math.floor(Math.random() * 1000),
      author_id: currentUser.id,
      author_name: currentUser.name,
      tags: [],
      attachments: []
    };

    const { error } = await supabase.from('posts').insert(postPayload);

    if (error) {
      console.error("Error creating post", error);
    } else {
      fetchPosts();
    }
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    const { error } = await supabase.from('posts').update({
      title: updatedPost.title,
      content: updatedPost.content,
      category: updatedPost.category,
      thumbnail: updatedPost.thumbnail,
      excerpt: (updatedPost.content?.substring(0, 150) || '') + '...',
    }).eq('id', updatedPost.id);

    if (error) {
      console.error("Error updating post", error);
    } else {
      fetchPosts();
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    // Optimistic update
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // In a real app we'd have a 'likes' table to prevent double liking, 
    // but for this simple schema we just increment.
    const newLikes = post.likes + 1;
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLikes } : p));

    const { error } = await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);

    if (error) {
      console.error("Error updating likes:", error);
      // Revert optimistic update
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: post.likes } : p));
    }
  };

  // This function is passed to SinglePostView but we need to update it to use Supabase
  const handleComment = async (postId: string, content: string) => {
    if (!currentUser) return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      content: content,
      user_id: currentUser.id,
      user_name: currentUser.name
    });

    if (error) {
      console.error("Error commenting", error);
    } else {
      // Re-fetch to show new comment
      fetchPosts();
      // Also update selectedPost if it's open (tricky with state, better to refetch)
      // Actually we are passing this down to SinglePostView, let's make sure it refreshes
      // SinglePostView uses `allPosts` to find the post, so updating `posts` is enough.
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setShowDashboard(false);
  };

  const handleCategorySelect = (cat: Category | null) => {
    setActiveCategory(cat);
    setSelectedPost(null);
    setShowDashboard(false);
  };

  // Find updated selected post from posts array if possible to show new comments
  const currentSelectedPost = selectedPost ? posts.find(p => p.id === selectedPost.id) || selectedPost : null;

  return (
    <Layout
      user={currentUser}
      onLogout={handleLogout}
      onLoginClick={() => setIsAuthModalOpen(true)}
      onCategorySelect={handleCategorySelect}
      activeCategory={activeCategory}
      onSearch={setSearchQuery}
    >
      {currentSelectedPost ? (
        <SinglePostView
          post={currentSelectedPost}
          allPosts={posts}
          onBack={() => setSelectedPost(null)}
          onLike={handleLike}
          onComment={handleComment}
          onPostSelect={handlePostClick}
          currentUser={currentUser}
        />
      ) : showDashboard && currentUser ? (
        <Dashboard
          userPosts={posts.filter(p => p.authorId === currentUser.id)}
          onCreatePost={handleCreatePost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
        />
      ) : (
        <>
          {/* Featured / Hero Section (only on home) */}
{!showDashboard && !activeCategory && !searchQuery && (
  <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-slate-900 mb-16">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img
        src="https://picsum.photos/1920/1080?random=10"
        alt="hero"
        className="w-full h-full object-cover opacity-50 scale-[1.03] blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
    </div>

    {/* Content */}
    <div className="container mx-auto px-4 z-10 py-12 md:py-24">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-indigo-400 font-bold tracking-[0.2em] uppercase text-xs mb-6">
          <Sparkles size={16} />
          The Future of Creativity
        </span>

        <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Where Science Meets <span className="text-indigo-400 italic">Art</span>.
        </h2>

        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
          Explore a universe of high-quality insights on technology, design, and beyond. Join our community of visionaries today.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-6">
          {!currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
            >
              Start Reading
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => setShowDashboard(true)}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              Open My Studio
            </button>
          )}
        </div>
      </div>
    </div>
  </section>
)}



          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <div>
                <h2 className="font-serif text-4xl font-bold text-slate-900 mb-2">
                  {activeCategory ? `Latest in ${activeCategory}` : searchQuery ? `Results for "${searchQuery}"` : 'The Fresh Feed'}
                </h2>
                <p className="text-slate-500">Discover thought-provoking pieces curated for you.</p>
              </div>

              <div className="flex items-center gap-4">
                {currentUser && (
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="hidden md:flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 px-6 py-3 rounded-full font-semibold transition-all shadow-sm"
                  >
                    <Filter size={18} />
                    My Dashboard
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">Loading...</div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex p-6 bg-slate-100 rounded-full mb-6">
                  <SearchIcon size={40} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching stories</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button
                  onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
                  className="mt-8 text-indigo-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={() => { }} // Not used anymore as we listen to auth state
        />
      )}

      <ChatWidget />
    </Layout>
  );
};

export default App;
