
import React, { useState } from 'react';
import { Menu, X, Search, User, LogOut, Github, Instagram } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onLoginClick: () => void;
  onCategorySelect: (cat: Category | null) => void;
  activeCategory: Category | null;
  onSearch: (q: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  onLogout,
  onLoginClick,
  onCategorySelect,
  activeCategory,
  onSearch
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1
              onClick={() => onCategorySelect(null)}
              className="font-serif text-2xl font-bold cursor-pointer text-indigo-600 tracking-tight"
            >
              SAMINA
            </h1>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${activeCategory === cat ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center bg-slate-100 rounded-full px-3 py-1.5 focus-within:ring-2 ring-indigo-200 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm px-2 w-32 lg:w-48"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </form>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:inline text-sm font-medium text-slate-700">Hello, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Sign In
              </button>
            )}

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-4 space-y-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategorySelect(cat);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-lg font-medium ${activeCategory === cat ? 'text-indigo-600' : 'text-slate-500'}`}
                >
                  {cat}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {!user && (
                  <button
                    onClick={onLoginClick}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-white mb-4">SAMINA</h2>
              <p className="max-w-xs text-slate-400">
                A community for the curious. Exploring the intersections of art, science, and the digital future.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><X size={16} /> X</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Instagram size={16} /> Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Github size={16} /> Github</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2024 Samina. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              Handcrafted with <span className="text-pink-500">♥</span> for creators.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
