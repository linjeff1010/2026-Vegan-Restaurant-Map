/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Facebook, 
  Instagram, 
  X, 
  Menu, 
  Leaf, 
  List as ListIcon,
  PawPrint,
  Milk,
  Egg,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RESTAURANT_DATA } from './constants';
import { Restaurant } from './types';
import { Logo } from './components/Logo';
import { cn } from './lib/utils';

const getVegIcon = (type: string) => {
  const className = "w-3 h-3 mr-1 shrink-0";
  switch(type) {
    case "純素": 
      return <Leaf className={className} />;
    case "奶素": 
      return <Milk className={className} />;
    case "蛋素": 
      return <Egg className={className} />;
    case "五辛素": 
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-3"/><path d="M5 13a7 7 0 0 0 14 0 7 7 0 0 0-14 0z"/><path d="M12 6V2"/><path d="M8 4l2 2"/><path d="M16 4l-2 2"/>
        </svg>
      );
    default: 
      return null;
  }
};

const getVegTagStyle = (type: string) => {
  switch(type) {
    case "純素": 
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "奶素": 
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "蛋素": 
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "五辛素": 
      return "bg-green-100 text-green-700 border-green-200";
    default: 
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getPopupVegTagStyle = (type: string) => {
  switch(type) {
    case "純素": 
      return "bg-emerald-500 text-white";
    case "奶素": 
      return "bg-yellow-400 text-yellow-900";
    case "蛋素": 
      return "bg-orange-400 text-white";
    case "五辛素": 
      return "bg-green-500 text-white";
    default: 
      return "bg-slate-600 text-white";
  }
};

export default function App() {
  const [filters, setFilters] = useState({ city: 'all', type: 'all', search: '', petFriendly: false });
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const isDesktopRef = useRef(typeof window !== 'undefined' ? window.innerWidth >= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop !== isDesktopRef.current) {
        setShowSidebar(isDesktop);
        isDesktopRef.current = isDesktop;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Record<number, L.Marker>>({});

  const filteredRestaurants = useMemo(() => {
    return RESTAURANT_DATA.filter(r => {
      const matchCity = filters.city === 'all' || r.city === filters.city;
      const matchType = filters.type === 'all' || r.types.includes(filters.type);
      const matchPet = !filters.petFriendly || r.petFriendly;
      const matchSearch = r.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                         r.address.toLowerCase().includes(filters.search.toLowerCase());
      return matchCity && matchType && matchPet && matchSearch;
    });
  }, [filters]);

  useEffect(() => {
    setVisibleCount(20);
  }, [filters]);

  const displayedRestaurants = filteredRestaurants.slice(0, visibleCount);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map-container', { 
        attributionControl: false,
        zoomControl: false 
      }).setView([25.048, 121.535], 13);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      const container = document.getElementById('map-container');
      if (container) resizeObserver.observe(container);

      setTimeout(() => map.invalidateSize(), 500);
    }
  }, []);

  useEffect(() => {
    if (markersLayerRef.current && mapRef.current) {
      markersLayerRef.current.clearLayers();
      markersMapRef.current = {};

      filteredRestaurants.forEach(r => {
        const customIcon = L.divIcon({
          className: 'bg-transparent',
          html: `<div class="marker-pin w-9 h-9 bg-green-600 hover:bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white cursor-pointer transform hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                 </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36]
        });

        const marker = L.marker([r.lat, r.lng], { icon: customIcon });
        
        const popupContent = document.createElement('div');
        popupContent.className = "font-sans min-w-[220px] max-w-[260px]";
        popupContent.innerHTML = `
          <div class="flex justify-between items-start mb-1.5">
            <h3 class="font-bold text-sm text-slate-800 leading-tight pr-2">${r.name}</h3>
            <span class="text-[11px] text-yellow-600 font-black shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">${r.rating} ⭐</span>
          </div>
          
          <div class="flex flex-wrap gap-1 mb-2">
            ${r.petFriendly ? `<span class="text-[9px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>寵物友善</span>` : ''}
            ${r.types.map(t => `<span class="text-[9px] ${getPopupVegTagStyle(t)} px-1.5 py-0.5 rounded-full font-medium shadow-sm">${t}</span>`).join('')}
          </div>

          <p class="text-[10px] text-slate-600 mb-2 leading-relaxed italic border-l-2 border-green-200 pl-2">${r.desc || '暫無簡介'}</p>
          
          <p class="text-[10px] text-slate-400 mb-3 flex items-start gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${r.address}
          </p>

          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex gap-1.5">
              ${r.phone ? `<a href="tel:${r.phone}" title="撥打電話" class="flex items-center justify-center w-7 h-7 bg-slate-100 hover:!bg-green-600 rounded-full !text-slate-600 hover:!text-white transition-all duration-300 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></a>` : ''}
              ${r.fb ? `<a href="${r.fb}" target="_blank" title="Facebook" class="flex items-center justify-center w-7 h-7 bg-slate-100 hover:!bg-blue-600 rounded-full !text-slate-600 hover:!text-white transition-all duration-300 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>` : ''}
              ${r.ig ? `<a href="${r.ig}" target="_blank" title="Instagram" class="flex items-center justify-center w-7 h-7 bg-slate-100 hover:!bg-pink-600 rounded-full !text-slate-600 hover:!text-white transition-all duration-300 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>` : ''}
            </div>
            <a href="${r.link}" target="_blank" class="flex-1 text-center bg-green-600 hover:bg-green-700 !text-white py-1.5 rounded-lg font-bold no-underline text-[10px] transition-colors shadow-md">
              Google Maps
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          autoPanPaddingTopLeft: [10, 80],
          autoPanPaddingBottomRight: [10, 10]
        }).on('click', () => {
          setActiveCardId(r.id);
        }).addTo(markersLayerRef.current!);
        
        markersMapRef.current[r.id] = marker;
      });
    }
  }, [filteredRestaurants]);

  const handleCardClick = (id: number) => {
    setActiveCardId(id);
    const r = RESTAURANT_DATA.find(x => x.id === id);
    if (r && mapRef.current) {
      mapRef.current.setView([r.lat, r.lng], 16, { animate: true });
      markersMapRef.current[id].openPopup();
    }
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full relative overflow-hidden bg-slate-50 pt-16 md:pt-0">
      
      {/* Mobile Header (Restored) */}
      <header className="md:hidden h-16 bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-between px-6 z-50 fixed top-0 inset-x-0 border-b border-slate-200/50">
        <Logo />
        <button 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl shadow-2xl z-40 md:hidden border-b border-slate-200/50"
          >
            <nav className="flex flex-col p-4 gap-2 text-sm font-medium text-slate-600">
              <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setShowMobileMenu(false)}>
                <MapPin className="w-5 h-5 text-emerald-500" /> 關於地圖
              </a>
              <a href="#" className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl transition-colors" onClick={() => setShowMobileMenu(false)}>
                <Leaf className="w-5 h-5" /> 餐廳總覽
              </a>
              <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setShowMobileMenu(false)}>
                <Phone className="w-5 h-5 text-emerald-500" /> 聯絡我們
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar - Futuristic Minimalist White */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? -400 : 0, x: typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : "-100%" }}
              animate={{ marginLeft: 0, x: 0 }}
              exit={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? -400 : 0, x: typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : "-100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-16 z-30 md:relative md:top-0 md:h-full flex flex-col w-full md:w-[400px] bg-white/95 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-100"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-3 md:p-6 border-b border-slate-100 bg-white shrink-0">
                <div className="hidden md:block">
                  <Logo />
                </div>
                <div className="md:hidden font-bold text-slate-800 text-base">
                  搜尋與篩選
                </div>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 group relative"
                >
                  <Menu className="w-5 h-5 hidden md:block" />
                  <X className="w-5 h-5 md:hidden" />
                  
                  {/* Tooltip for Desktop */}
                  <span className="hidden md:block absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    收合側邊欄
                  </span>
                </button>
              </div>

              {/* Filters Area - Tech Minimalist */}
              <div className="p-3 md:p-4 border-b border-slate-100 space-y-2.5 md:space-y-3 bg-white/50 shrink-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                    <div className="pl-3 md:pl-4 pr-2 text-slate-400">
                      <Search className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="搜尋餐廳名稱或地址..." 
                      className="w-full py-2 md:py-2.5 pr-4 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 md:gap-3">
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="relative">
                      <select 
                        className="w-full appearance-none border border-slate-200 py-1.5 md:py-2 pl-3 md:pl-4 pr-8 md:pr-10 rounded-xl text-sm font-medium bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm" 
                        onChange={(e) => setFilters({...filters, city: e.target.value})}
                        value={filters.city}
                      >
                        <option value="all">所有縣市</option>
                        <option value="台北市">台北市</option>
                        <option value="新北市">新北市</option>
                        <option value="桃園市">桃園市</option>
                        <option value="新竹市">新竹市</option>
                        <option value="新竹縣">新竹縣</option>
                        <option value="苗栗縣">苗栗縣</option>
                        <option value="台中市">台中市</option>
                        <option value="彰化縣">彰化縣</option>
                        <option value="南投縣">南投縣</option>
                        <option value="宜蘭縣">宜蘭縣</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none border border-slate-200 py-1.5 md:py-2 pl-3 md:pl-4 pr-8 md:pr-10 rounded-xl text-sm font-medium bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm" 
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                        value={filters.type}
                      >
                        <option value="all">所有素別</option>
                        <option value="純素">純素</option>
                        <option value="奶素">奶素</option>
                        <option value="蛋素">蛋素</option>
                        <option value="五辛素">五辛素</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Pet Friendly Toggle - Tech Style */}
                  <label className="flex items-center justify-between cursor-pointer group p-1.5 md:p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <PawPrint className={cn("w-4 h-4 transition-colors", filters.petFriendly ? "text-emerald-500" : "text-slate-400")} />
                      寵物友善空間
                    </span>
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={filters.petFriendly}
                        onChange={(e) => setFilters({...filters, petFriendly: e.target.checked})}
                      />
                      <div className={cn(
                        "w-11 h-6 rounded-full transition-all duration-300 ease-in-out shadow-inner",
                        filters.petFriendly ? "bg-emerald-500" : "bg-slate-200"
                      )}></div>
                      <div className={cn(
                        "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm",
                        filters.petFriendly && "translate-x-5"
                      )}></div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-bold text-slate-600">
                    共找到 {filteredRestaurants.length} 間餐廳
                  </div>
                  <button 
                    onClick={() => setFilters({ city: 'all', type: 'all', search: '', petFriendly: false })}
                    className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    清除篩選
                  </button>
                </div>
              </div>

              {/* List Container */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 custom-scrollbar min-h-0 bg-slate-50/30 pb-24 md:pb-6">
                {displayedRestaurants.length > 0 ? (
                  displayedRestaurants.map((r, index) => (
                    <motion.div 
                      layout
                      key={r.id} 
                      onClick={() => handleCardClick(r.id)} 
                      className={cn(
                        "group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 bg-white border",
                        activeCardId === r.id 
                          ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] z-10' 
                          : 'border-slate-200/60 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-200/50'
                      )}
                    >
                      {/* Active accent line */}
                      {activeCardId === r.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full"></div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-emerald-600 transition-colors pr-2">
                          {index + 1}. {r.name}
                        </h3>
                        <div className="flex items-center text-slate-800 text-xs font-black shrink-0">
                          {r.rating} <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3 items-center">
                        {r.types.map(t => (
                          <span key={t} className={cn("text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md border flex items-center", getVegTagStyle(t))}>
                            {getVegIcon(t)} <span className="ml-1">{t}</span>
                          </span>
                        ))}
                        {r.petFriendly && (
                          <span className="text-[10px] font-bold tracking-wide bg-yellow-300 text-yellow-900 px-2.5 py-1 rounded-md border border-yellow-400 flex items-center shadow-sm">
                            <PawPrint className="w-3 h-3 mr-1" />
                            寵物友善
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 font-medium flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" /> 
                        <span className="truncate">{r.address}</span>
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <Search className="w-12 h-12 mb-2 opacity-10" />
                    <p className="text-sm font-medium">找不到相關餐廳</p>
                  </div>
                )}
                
                {visibleCount < filteredRestaurants.length && (
                  <div className="flex justify-center pt-2 pb-6">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setVisibleCount(prev => prev + 20);
                      }}
                      className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      看更多餐廳
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Area */}
        <div className="flex-1 h-full relative z-1">
          <div id="map-container" className="w-full h-full"></div>
          
          {/* Desktop Sidebar Toggle (when closed) */}
          {!showSidebar && (
            <div className="hidden md:block absolute top-4 left-4 z-30">
              <button 
                onClick={() => setShowSidebar(true)}
                className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors group relative"
              >
                <Menu className="w-6 h-6" />
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  展開側邊欄
                </span>
              </button>
            </div>
          )}

          {/* Floating Header over Map (Desktop) */}
          <div className="hidden md:flex absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-3 items-center gap-6 border border-slate-200/60">
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-emerald-600 transition-colors">關於地圖</a>
              <a href="#" className="text-emerald-600 border-b-2 border-emerald-600 pb-0.5">餐廳總覽</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">聯絡我們</a>
            </nav>
          </div>

          {/* Mobile Search Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 md:hidden pointer-events-none">
            <div className="bg-white/90 backdrop-blur shadow-lg rounded-full p-2 flex items-center gap-2 border border-slate-200 pointer-events-auto">
              <button 
                onClick={() => setShowSidebar(true)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
              </button>
              <input 
                type="text"
                placeholder="搜尋素食餐廳..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSidebar(true);
                  }
                }}
              />
              <button 
                onClick={() => setShowSidebar(true)}
                className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 hover:bg-emerald-700 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile List Toggle */}
          {!showSidebar && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 md:hidden">
              <button 
                onClick={() => setShowSidebar(true)}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-full flex items-center gap-2 shadow-2xl active:scale-95 transition-transform"
              >
                <ListIcon className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">查看清單</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
