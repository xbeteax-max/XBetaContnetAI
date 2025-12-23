
import React from 'react';
import { ViewState } from '../types';
import { NAV_ITEMS } from '../constants';
import { X as Close, Zap } from 'lucide-react';

interface SidebarProps {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onClose }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-full flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Zap className="text-white fill-current" size={20} />
          </div>
          <h1 className="text-xl font-display font-extrabold tracking-tight text-white uppercase">Omni<span className="text-indigo-400">Content</span></h1>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
          <Close size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onViewChange(item.id as ViewState);
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <span className={`${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 m-4 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">AI Credits</p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3">
          <div className="bg-indigo-500 h-full rounded-full w-[72%]"></div>
        </div>
        <p className="text-[10px] text-slate-400">720 / 1000 credits remaining</p>
        <button className="mt-4 w-full bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 py-2 rounded-lg text-xs font-semibold text-indigo-400 transition-colors">
          Upgrade Pro
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
