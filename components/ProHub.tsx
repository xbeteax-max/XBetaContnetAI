
import React, { useEffect, useRef, useState } from 'react';
import { Post } from '../types';
import { PLATFORMS } from '../constants';
import { Trophy, Flame, User, MessageCircle, Heart, Share2, Crown, Star, TrendingUp, Layers } from 'lucide-react';

interface ProHubProps {
  posts: Post[];
}

interface UserAggregatedStats {
  name: string;
  avatar: string;
  totalEngagement: number;
  postCount: number;
  topPlatform: string;
}

const ProHub: React.FC<ProHubProps> = ({ posts }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Aggregate stats per user
  const userAggregates = posts.reduce((acc, post) => {
    if (!post.author) return acc;
    const authorName = post.author.name;
    
    if (!acc[authorName]) {
      acc[authorName] = {
        name: authorName,
        avatar: post.author.avatar,
        totalEngagement: 0,
        postCount: 0,
        topPlatform: post.platform,
        platformCounts: {} as Record<string, number>
      };
    }
    
    const user = acc[authorName];
    // Fix: Ensure post.engagement is treated as number for addition
    user.totalEngagement += (Number(post.engagement) || 0);
    user.postCount += 1;
    
    // Track platform frequency to find their "top" or "main" platform
    const platformCounts = user.platformCounts as Record<string, number>;
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    
    // Fix line 45: Ensure arithmetic operation handles number types explicitly
    const entries = Object.entries(platformCounts) as [string, number][];
    user.topPlatform = entries.sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))[0][0];
    
    return acc;
  }, {} as Record<string, any>);

  // Sorted list of top 10 unique users
  const top10Users: UserAggregatedStats[] = Object.values(userAggregates)
    // Fix: Resolve arithmetic operation errors by casting values to numbers in the sort function
    .sort((a: any, b: any) => (Number(b.totalEngagement) || 0) - (Number(a.totalEngagement) || 0))
    .slice(0, 10) as UserAggregatedStats[];
  
  // Duplicate posts for seamless infinite scroll in the wall
  const scrollPosts = [...posts, ...posts, ...posts];

  useEffect(() => {
    let animationFrameId: number;
    const scroll = () => {
      if (scrollRef.current && !isPaused) {
        scrollRef.current.scrollTop += 1;
        if (scrollRef.current.scrollTop >= scrollRef.current.scrollHeight / 2) {
          scrollRef.current.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Left Column: Top 10 Leaderboard of Users */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-500/10 rounded-2xl">
              <Trophy className="text-amber-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Top 10 Creators</h2>
              <p className="text-xs text-slate-500 font-medium">Ranked by Cumulative Engagement</p>
            </div>
          </div>

          <div className="space-y-3">
            {top10Users.length > 0 ? top10Users.map((user, idx) => (
              <div 
                key={`${user.name}-${idx}`} 
                className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${idx === 0 ? 'bg-indigo-600/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-slate-800/30 border-slate-700/50'}`}
              >
                <div className="w-8 h-8 flex items-center justify-center font-display font-black text-lg italic text-slate-500">
                  {idx === 0 ? <Crown className="text-amber-400" size={20} /> : idx + 1}
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 shrink-0">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{user.topPlatform}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] text-indigo-400 font-bold">{(user.totalEngagement / 1000).toFixed(1)}K Total</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Layers size={10} />
                    <span className="text-[10px] font-bold">{user.postCount}</span>
                  </div>
                  {idx < 3 && <TrendingUp className="text-emerald-500" size={12} />}
                </div>
              </div>
            )) : (
              <div className="py-12 text-center">
                <p className="text-slate-500 text-sm italic">No data synced yet...</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-slate-800/20 rounded-2xl border border-slate-700/30">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">How it works</p>
            <p className="text-xs text-slate-400 leading-relaxed">Engagement is calculated by aggregating likes, shares, and comments across all synced platforms for each unique Pro account.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Live Discover Feed (Auto-scrolling) */}
      <div className="xl:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/10 rounded-2xl">
              <Flame className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Live Pro Wall</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time content share from verified creators</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Discover</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="h-[800px] overflow-y-hidden space-y-6 px-4 custom-scrollbar relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {scrollPosts.map((post, i) => (
            <div 
              key={`${post.id}-${i}`}
              className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30">
                      <img src={post.author?.avatar} className="w-full h-full object-cover" alt="Author" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1 rounded-full border-2 border-slate-900">
                      <Star size={10} className="text-white fill-current" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100">{post.author?.name}</h4>
                      <span className="bg-indigo-600/10 text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-500/20">PRO</span>
                    </div>
                    <p className="text-xs text-slate-500">@{post.author?.name.toLowerCase().replace(' ', '_')} · OmniContent verified</p>
                  </div>
                </div>
                <div className={`${PLATFORMS.find(p => p.id === post.platform)?.color} p-2 rounded-xl text-white shadow-lg`}>
                  {PLATFORMS.find(p => p.id === post.platform)?.icon}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{post.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{post.content}</p>
                
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video relative">
                    <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post content" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
                <div className="flex gap-6">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={18} />
                    <span className="text-xs font-bold">{(post.engagement * 0.4).toFixed(0)}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-xs font-bold">{(post.engagement * 0.1).toFixed(0)}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Omniscore</p>
                    <p className="text-sm font-bold text-indigo-400">{post.rating}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Shadow Overlay for smooth fading at the top/bottom */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
};

export default ProHub;
