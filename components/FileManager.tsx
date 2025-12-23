
import React, { useState } from 'react';
import { MediaAsset } from '../types';
// Added Play to the lucide-react imports
import { Search, Grid, List, Trash2, Download, Eye, Image as ImageIcon, Video, Filter, Plus, Calendar, HardDrive, Play } from 'lucide-react';

interface FileManagerProps {
  assets: MediaAsset[];
  onDelete: (id: string) => void;
  onSelect?: (asset: MediaAsset) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ assets, onDelete, onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === 'all' || asset.type === filter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white">Content Library</h2>
          <p className="text-slate-400 mt-1">Manage your AI-generated visuals and video assets.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex">
            {(['all', 'image', 'video'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}s
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Stats */}
        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Storage Status</p>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Used Storage</span>
                <span className="text-slate-100 font-bold">14.2 GB / 50 GB</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[28%]" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg"><ImageIcon size={16} /></div>
                  <span className="text-sm font-medium text-slate-300">Images</span>
                </div>
                <span className="text-sm font-bold text-slate-100">{assets.filter(a => a.type === 'image').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-lg"><Video size={16} /></div>
                  <span className="text-sm font-medium text-slate-300">Videos</span>
                </div>
                <span className="text-sm font-bold text-slate-100">{assets.filter(a => a.type === 'video').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search assets by name or prompt..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all"
              >
                <div className="aspect-square bg-slate-800 relative">
                  {asset.type === 'image' ? (
                    <img src={asset.url} className="w-full h-full object-cover" alt={asset.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <Video size={32} className="text-slate-600" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={24} className="text-white fill-current" />
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onSelect?.(asset)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-[10px] font-bold"
                      >
                        <Plus size={14} /> USE
                      </button>
                      <button 
                        onClick={() => onDelete(asset.id)}
                        className="bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold text-slate-100 truncate">{asset.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">{asset.aspectRatio || '1:1'}</span>
                    <span className="text-[9px] text-slate-500">{asset.size || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="inline-flex p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-600">
                  <Filter size={32} />
                </div>
                <div>
                  <p className="text-slate-300 font-bold">No assets found</p>
                  <p className="text-slate-500 text-xs mt-1">Try changing your search or generation parameters.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
