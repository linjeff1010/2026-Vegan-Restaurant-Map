import React from 'react';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-sm">
      {/* 愛心背景 */}
      <path d="M50 85C50 85 15 60 15 35C15 20 30 15 45 25C47.5 26.5 50 28 50 28C50 28 52.5 26.5 55 25C70 15 85 20 85 35C85 60 50 85 50 85Z" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2"/>
      {/* 狗狗剪影 */}
      <path d="M42 45C42 45 35 45 35 52C35 60 45 65 50 65C55 65 65 60 65 52C65 45 58 45 58 45V40C58 40 58 35 50 35C42 35 42 40 42 40V45Z" fill="#166534"/>
      <path d="M38 42L34 35M62 42L66 35" stroke="#166534" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="45" cy="48" r="1.5" fill="white"/>
      <circle cx="55" cy="48" r="1.5" fill="white"/>
      <path d="M48 55C50 57 52 55 52 55" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    </svg>
    <div className="flex flex-col leading-none">
      <span className="text-lg font-black tracking-tighter text-slate-800">蔬食地圖指南</span>
      <span className="text-[10px] font-medium text-green-600 uppercase tracking-widest">Vege Love Map</span>
    </div>
  </div>
);
