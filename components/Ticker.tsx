
import React from 'react';
import { Trend } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Link2 } from 'lucide-react';

interface TickerProps {
  trends: Trend[];
}

const Ticker: React.FC<TickerProps> = ({ trends }) => {
  return (
    <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center overflow-hidden whitespace-nowrap">
      <div className="bg-slate-900 px-4 h-full flex items-center border-r border-slate-800 z-10 shrink-0">
        <TrendingUp size={16} className="text-indigo-400 mr-2" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Trends</span>
      </div>
      
      <div className="flex items-center animate-marquee hover:pause-animation">
        {trends.length > 0 ? [...trends, ...trends].map((trend, idx) => (
          <div key={`${trend.tag}-${idx}`} className="flex items-center gap-3 px-6 border-r border-slate-800/50">
            <span className="text-sm font-bold text-slate-100">{trend.tag}</span>
            <span className="text-xs text-slate-500 font-medium">{trend.volume}</span>
            {trend.sentiment === 'positive' && <ArrowUpRight size={14} className="text-emerald-500" />}
            {trend.sentiment === 'negative' && <ArrowDownRight size={14} className="text-rose-500" />}
            {trend.sentiment === 'neutral' && <Minus size={14} className="text-slate-500" />}
            
            {/* Search Grounding Attribution */}
            {trend.sources && trend.sources.length > 0 && (
              <a 
                href={trend.sources[0]} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-1.5 py-0.5 rounded ml-1"
                title="View Source"
              >
                <Link2 size={10} />
                Source
              </a>
            )}
          </div>
        )) : (
          <div className="px-6 text-sm text-slate-500 italic">Syncing global social pulse...</div>
        )}
      </div>
    </div>
  );
};

export default Ticker;
