import React from 'react';
import { Leaf } from 'lucide-react';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-slate-900/20 border border-slate-700">
      <Leaf className="w-4.5 h-4.5 text-emerald-400" />
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"></div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-lg font-black tracking-tight text-slate-800 flex items-center">
        Veg<span className="text-emerald-500">Map</span>
        <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-widest uppercase">Beta</span>
      </span>
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Taiwan</span>
    </div>
  </div>
);
