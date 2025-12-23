
import React, { useState, useEffect } from 'react';
import { Menu, X as Close, Bell, Search, User, Key } from 'lucide-react';
import { ViewState, Trend, Post, MediaAsset } from './types';
import { NAV_ITEMS, MOCK_POSTS, INITIAL_ASSETS } from './constants';
import { getRealTimeTrends } from './services/gemini';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Composer from './components/Composer';
import AnalyticsView from './components/AnalyticsView';
import Ticker from './components/Ticker';
import ProHub from './components/ProHub';
import AIChatBot from './components/AIChatBot';
import FileManager from './components/FileManager';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>(MOCK_POSTS);
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_ASSETS);

  const fetchTrends = async () => {
    const newTrends = await getRealTimeTrends();
    setTrends(newTrends);
  };

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(fetchTrends, 30 * 60 * 1000); // 30 min update
    return () => clearInterval(interval);
  }, []);

  const handlePostCreated = (post: Post) => {
    setMyPosts([post, ...myPosts]);
    setActiveView('dashboard');
  };

  const handleSaveAsset = (asset: MediaAsset) => {
    setAssets(prev => [asset, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard posts={myPosts} onNavigate={setActiveView} />;
      case 'composer':
        return <Composer onPost={handlePostCreated} onSaveAsset={handleSaveAsset} assets={assets} />;
      case 'analytics':
        return <AnalyticsView key="analytics" posts={myPosts} />;
      case 'trends':
        return <AnalyticsView key="trends" posts={myPosts} defaultShowTrends={true} />;
      case 'community':
        return <ProHub posts={myPosts} />;
      case 'chat':
        return <AIChatBot />;
      case 'files':
        return <FileManager assets={assets} onDelete={handleDeleteAsset} onSelect={(asset) => {
          setActiveView('composer');
          // Integration happens via direct state selection in Composer when active
        }} />;
      default:
        return <Dashboard posts={myPosts} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 p-3 rounded-full shadow-lg shadow-indigo-500/20"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed lg:relative z-40 h-full`}>
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics, posts, or library..." 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <Key size={14} /> Billing Docs
            </a>
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Alex Creator</p>
                <p className="text-xs text-slate-500">Pro Plan</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-400/50">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Trend Ticker */}
        <Ticker trends={trends} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
