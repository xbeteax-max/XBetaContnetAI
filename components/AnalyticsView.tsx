
import React, { useState } from 'react';
import { Post } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Target, BarChart as ChartIcon, ExternalLink, TrendingUp, Zap } from 'lucide-react';

interface AnalyticsViewProps {
  posts: Post[];
  defaultShowTrends?: boolean;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ posts, defaultShowTrends = false }) => {
  const [tab, setTab] = useState<'my-growth' | 'global-trends'>(defaultShowTrends ? 'global-trends' : 'my-growth');

  const PLATFORM_COLORS = {
    youtube: '#ef4444', // Red-500
    instagram: '#ec4899', // Pink-500
    x: '#0ea5e9', // Sky-500
    tiktok: '#9333ea', // Purple-600
    facebook: '#3b82f6', // Blue-500
  };

  // Updated time-series data for User's Personal Growth per platform including Facebook
  const myGrowthData = [
    { name: 'Mon', youtube: 1200, instagram: 800, x: 400, tiktok: 1500, facebook: 600 },
    { name: 'Tue', youtube: 1900, instagram: 1100, x: 450, tiktok: 2100, facebook: 750 },
    { name: 'Wed', youtube: 1700, instagram: 1400, x: 900, tiktok: 1800, facebook: 820 },
    { name: 'Thu', youtube: 2400, instagram: 1600, x: 700, tiktok: 2900, facebook: 950 },
    { name: 'Fri', youtube: 2100, instagram: 2000, x: 1100, tiktok: 2400, facebook: 1100 },
    { name: 'Sat', youtube: 2800, instagram: 2400, x: 1300, tiktok: 3500, facebook: 1350 },
    { name: 'Sun', youtube: 3200, instagram: 2100, x: 1500, tiktok: 4200, facebook: 1200 },
  ];

  // Mock time-series data for Global Trends Platform Engagement including Facebook
  const globalTrendTimelineData = [
    { day: 'Mon', youtube: 65, instagram: 45, x: 30, tiktok: 70, facebook: 40 },
    { day: 'Tue', youtube: 68, instagram: 52, x: 28, tiktok: 75, facebook: 42 },
    { day: 'Wed', youtube: 75, instagram: 58, x: 45, tiktok: 82, facebook: 50 },
    { day: 'Thu', youtube: 72, instagram: 65, x: 38, tiktok: 88, facebook: 55 },
    { day: 'Fri', youtube: 80, instagram: 72, x: 42, tiktok: 94, facebook: 62 },
    { day: 'Sat', youtube: 92, instagram: 88, x: 55, tiktok: 98, facebook: 68 },
    { day: 'Sun', youtube: 85, instagram: 72, x: 48, tiktok: 94, facebook: 60 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white">Advanced Intelligence</h2>
          <p className="text-slate-400 mt-1">Cross-platform data correlation and trend forecasting.</p>
        </div>
        <div className="bg-slate-900 p-1 rounded-xl flex">
          <button
            onClick={() => setTab('my-growth')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === 'my-growth' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Growth
          </button>
          <button
            onClick={() => setTab('global-trends')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === 'global-trends' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Global Trends
          </button>
        </div>
      </div>

      {tab === 'my-growth' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center gap-2">
                  <ChartIcon size={20} className="text-indigo-400" />
                  Personal Engagement Growth
                </h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">YouTube</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Instagram</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">X</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TikTok</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Facebook</span>
                  </div>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={myGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMyYT" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PLATFORM_COLORS.youtube} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={PLATFORM_COLORS.youtube} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMyIG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PLATFORM_COLORS.instagram} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={PLATFORM_COLORS.instagram} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMyX" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PLATFORM_COLORS.x} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={PLATFORM_COLORS.x} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMyTikTok" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PLATFORM_COLORS.tiktok} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={PLATFORM_COLORS.tiktok} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMyFB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PLATFORM_COLORS.facebook} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={PLATFORM_COLORS.facebook} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'}}
                    />
                    <Area type="monotone" dataKey="youtube" stroke={PLATFORM_COLORS.youtube} strokeWidth={3} fillOpacity={1} fill="url(#colorMyYT)" />
                    <Area type="monotone" dataKey="instagram" stroke={PLATFORM_COLORS.instagram} strokeWidth={3} fillOpacity={1} fill="url(#colorMyIG)" />
                    <Area type="monotone" dataKey="x" stroke={PLATFORM_COLORS.x} strokeWidth={3} fillOpacity={1} fill="url(#colorMyX)" />
                    <Area type="monotone" dataKey="tiktok" stroke={PLATFORM_COLORS.tiktok} strokeWidth={3} fillOpacity={1} fill="url(#colorMyTikTok)" />
                    <Area type="monotone" dataKey="facebook" stroke={PLATFORM_COLORS.facebook} strokeWidth={3} fillOpacity={1} fill="url(#colorMyFB)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold mb-6">Recent Distribution History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-800">
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Post</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Channels</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Rating</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {posts.slice(0, 5).map((post) => (
                      <tr key={post.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
                              {post.imageUrl ? (
                                <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
                              ) : (
                                <div className="w-full h-full bg-slate-700" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm truncate max-w-[120px]">{post.title}</p>
                              <p className="text-xs text-slate-500">{post.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter">{post.platform.slice(0, 2)}</div>
                            <div className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">AI</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`text-sm font-bold ${post.rating > 70 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {post.rating}%
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="p-2 bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <Target size={18} />
                Audience Profile
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 opacity-80">
                    <span>Gen Z (18-24)</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1 rounded-full">
                    <div className="bg-white h-full rounded-full w-[42%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 opacity-80">
                    <span>Millennials (25-34)</span>
                    <span>38%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1 rounded-full">
                    <div className="bg-white h-full rounded-full w-[38%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 opacity-80">
                    <span>Others</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1 rounded-full">
                    <div className="bg-white h-full rounded-full w-[20%]" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 flex gap-4">
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold opacity-60">Primary Locale</p>
                  <p className="font-bold">USA, UK, IN</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold opacity-60">Peak Time</p>
                  <p className="font-bold">6 PM EST</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-sky-400" />
                Channel Health
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'YouTube', score: 92, color: 'bg-red-500' },
                  { label: 'TikTok', score: 88, color: 'bg-purple-600' },
                  { label: 'Instagram', score: 78, color: 'bg-pink-500' },
                  { label: 'Facebook', score: 62, color: 'bg-blue-500' },
                  { label: 'X (Twitter)', score: 45, color: 'bg-sky-500' },
                ].map((channel, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-300">{channel.label}</span>
                      <span className="font-bold text-slate-100">{channel.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${channel.color} h-full rounded-full`} style={{ width: `${channel.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Global Engagement Trend Graph */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp size={24} className="text-indigo-400" />
                  Global Market Engagement Timeline
                </h3>
                <p className="text-slate-500 text-sm mt-1">Real-time aggregate engagement velocity over the last 7 days.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">YouTube</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Instagram</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">X</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TikTok</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Facebook</span>
                </div>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={globalTrendTimelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradYouTube" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLATFORM_COLORS.youtube} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={PLATFORM_COLORS.youtube} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradInstagram" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLATFORM_COLORS.instagram} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={PLATFORM_COLORS.instagram} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradX" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLATFORM_COLORS.x} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={PLATFORM_COLORS.x} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradTikTok" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLATFORM_COLORS.tiktok} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={PLATFORM_COLORS.tiktok} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradFacebook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLATFORM_COLORS.facebook} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={PLATFORM_COLORS.facebook} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11}} 
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'}}
                    itemStyle={{fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="youtube" stroke={PLATFORM_COLORS.youtube} strokeWidth={3} fillOpacity={1} fill="url(#gradYouTube)" />
                  <Area type="monotone" dataKey="instagram" stroke={PLATFORM_COLORS.instagram} strokeWidth={3} fillOpacity={1} fill="url(#gradInstagram)" />
                  <Area type="monotone" dataKey="x" stroke={PLATFORM_COLORS.x} strokeWidth={3} fillOpacity={1} fill="url(#gradX)" />
                  <Area type="monotone" dataKey="tiktok" stroke={PLATFORM_COLORS.tiktok} strokeWidth={3} fillOpacity={1} fill="url(#gradTikTok)" />
                  <Area type="monotone" dataKey="facebook" stroke={PLATFORM_COLORS.facebook} strokeWidth={3} fillOpacity={1} fill="url(#gradFacebook)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Zap size={64} className="text-indigo-400" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
                    <Target size={24} />
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded">TRENDING</span>
                </div>
                <h4 className="font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">#{['AIContentRev', 'CreatorEconomy', 'GenAI2025', 'NoCodeMagic', 'TechDaily', 'FutureWork', 'SocialPulse', 'DesignThinking'][i-1]}</h4>
                <p className="text-sm text-slate-500 mb-4">Focus on short-form educational snippets about LLM workflows.</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(u => (
                      <div key={u} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">12.4K Users</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
