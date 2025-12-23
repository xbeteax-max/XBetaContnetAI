
import React from 'react';
import { Post, ViewState } from '../types';
import { PLATFORMS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// Fixed BarChart3 import by moving it to the main lucide-react import section
import { ArrowUpRight, Star, AlertCircle, Play, FileText, Video, Calendar, BarChart3 } from 'lucide-react';

interface DashboardProps {
  posts: Post[];
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, onNavigate }) => {
  const sortedByRating = [...posts].sort((a, b) => b.rating - a.rating);
  const top3 = sortedByRating.slice(0, 3);
  const bottom3 = sortedByRating.reverse().slice(0, 3);

  const stats = [
    { label: 'Total Engagement', value: '124.8K', growth: '+12.5%', color: 'text-indigo-400' },
    { label: 'Avg Rating', value: '74.2', growth: '+3.1%', color: 'text-emerald-400' },
    { label: 'Total Posts', value: '1,420', growth: '+5.2%', color: 'text-amber-400' },
    { label: 'Active Reach', value: '2.1M', growth: '+1.4%', color: 'text-pink-400' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'reel': return <Video size={16} />;
      case 'vlog': return <Play size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white">Platform Overview</h2>
          <p className="text-slate-400 mt-1">Real-time performance across your connected channels.</p>
        </div>
        <button 
          onClick={() => onNavigate('composer')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Create Content
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                {stat.growth}
                <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 3 Performers */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Star size={20} className="fill-current" />
            <h3 className="font-display font-bold text-xl uppercase tracking-wide">Top 3 Performing Posts</h3>
          </div>
          <div className="grid gap-4">
            {top3.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 relative">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      {getIcon(post.type)}
                    </div>
                  )}
                  <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md p-0.5 rounded text-[10px] font-bold">
                    {post.rating}%
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{post.platform}</span>
                      {post.scheduledAt && (
                        <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded uppercase">
                          <Calendar size={10} /> Scheduled
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-500">{post.engagement.toLocaleString()} Eng.</span>
                  </div>
                  <h4 className="font-bold text-slate-100 truncate">{post.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom 3 Attention Required */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle size={20} />
            <h3 className="font-display font-bold text-xl uppercase tracking-wide">Optimization Needed (Bottom 3)</h3>
          </div>
          <div className="grid gap-4">
            {bottom3.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-rose-500/30 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 relative">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      {getIcon(post.type)}
                    </div>
                  )}
                  <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md p-0.5 rounded text-[10px] font-bold text-rose-400">
                    {post.rating}%
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{post.platform}</span>
                    <span className="text-xs font-bold text-rose-400">{post.engagement.toLocaleString()} Eng.</span>
                  </div>
                  <h4 className="font-bold text-slate-100 truncate">{post.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Engagement Chart */}
      <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <BarChart3 size={20} className="text-indigo-400" />
          Weekly Engagement by Platform
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PLATFORMS.map(p => ({ name: p.id, value: Math.floor(Math.random() * 50000) }))}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc'}}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {PLATFORMS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
