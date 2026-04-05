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
  Egg
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

export default function App() {
  const [filters, setFilters] = useState({ city: 'all', type: 'all', search: '', petFriendly: false });
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  
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
            ${r.petFriendly ? `<span class="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>寵物友善</span>` : ''}
            ${r.types.map(t => `<span class="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-medium shadow-sm">${t}</span>`).join('')}
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
            <a href="${r.link}" target="_blank" class="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-bold no-underline text-[10px] transition-colors shadow-md">
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
    <div className="flex flex-col h-[100dvh] w-full relative overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-40 shrink-0">
        <Logo />
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-green-600 transition-colors">關於地圖</a>
          <a href="#" className="text-green-600 border-b-2 border-green-600 pb-1">餐廳總覽</a>
          <a href="#" className="hover:text-green-600 transition-colors">聯絡我們</a>
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            className="fixed inset-x-0 top-16 bg-white shadow-xl z-50 md:hidden border-t"
          >
            <nav className="flex flex-col p-4 gap-4 text-base font-medium text-gray-600">
              <a href="#" className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>
                <MapPin className="w-5 h-5 text-green-600" /> 關於地圖
              </a>
              <a href="#" className="flex items-center gap-3 p-2 bg-green-50 text-green-700 rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>
                <Leaf className="w-5 h-5" /> 餐廳總覽
              </a>
              <a href="#" className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>
                <Phone className="w-5 h-5 text-green-600" /> 聯絡我們
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar */}
        <AnimatePresence>
          {(showSidebar || window.innerWidth >= 768) && (
            <motion.div 
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-16 inset-x-0 bottom-0 z-40 md:inset-auto md:relative md:h-full md:translate-x-0 flex flex-col md:w-1/3 md:max-w-md bg-slate-50/80 backdrop-blur-sm shadow-2xl md:shadow-none border-r border-slate-200/60",
                !showSidebar && "hidden md:flex"
              )}
            >
              {/* Mobile Header */}
              <div className="flex md:hidden items-center justify-between p-4 border-b bg-white shrink-0">
                <span className="font-bold text-lg">餐廳列表</span>
                <button onClick={() => setShowSidebar(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-5 border-b space-y-4 bg-white shrink-0 shadow-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="搜尋餐廳名稱或地址..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-green-500 shadow-sm" 
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
                    <select 
                      className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-green-500 shadow-sm" 
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                      value={filters.type}
                    >
                      <option value="all">所有素食類別</option>
                      <option value="純素">純素</option>
                      <option value="奶素">奶素</option>
                      <option value="蛋素">蛋素</option>
                      <option value="五辛素">五辛素</option>
                    </select>
                  </div>
                  
                  {/* Pet Friendly Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={filters.petFriendly}
                        onChange={(e) => setFilters({...filters, petFriendly: e.target.checked})}
                      />
                      <div className={cn(
                        "w-10 h-5 rounded-full transition-colors",
                        filters.petFriendly ? "bg-green-500" : "bg-slate-300"
                      )}></div>
                      <div className={cn(
                        "absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform",
                        filters.petFriendly && "translate-x-5"
                      )}></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-green-600 transition-colors flex items-center gap-1.5">
                      <PawPrint className={cn("w-4 h-4", filters.petFriendly ? "text-orange-500" : "text-slate-400")} />
                      只看寵物友善
                    </span>
                  </label>
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between px-1">
                  <span>找到 {filteredRestaurants.length} 間餐廳</span>
                </div>
              </div>

              {/* List Container - Ensure height is handled for scrolling */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 custom-scrollbar min-h-0 pb-6">
                {displayedRestaurants.length > 0 ? (
                  displayedRestaurants.map((r, index) => (
                    <motion.div 
                      layout
                      key={r.id} 
                      onClick={() => handleCardClick(r.id)} 
                      className={cn(
                        "group p-5 border rounded-2xl cursor-pointer transition-all duration-300 bg-white",
                        activeCardId === r.id 
                          ? 'border-green-500 ring-2 ring-green-500/10 shadow-lg shadow-green-500/5' 
                          : 'border-slate-100 hover:border-green-200 hover:shadow-md'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 leading-tight group-hover:text-green-700 transition-colors">
                          {index + 1}. {r.name}
                        </h3>
                        <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded text-yellow-700 text-xs font-black shrink-0 border border-yellow-100">
                          {r.rating} <Star className="w-3 h-3 ml-0.5 fill-yellow-500 text-yellow-500" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                        {r.types.map(t => (
                          <span key={t} className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full border border-green-100 flex items-center">
                            {getVegIcon(t)} {t}
                          </span>
                        ))}
                        {r.petFriendly && (
                          <span className="text-[10px] bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-100 flex items-center font-bold">
                            <PawPrint className="w-3 h-3 mr-1" />
                            寵物友善
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-1">
                        <MapPin className="w-3 h-3 inline mr-1 text-slate-400" /> {r.address}
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
                      className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-green-600 transition-colors"
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
          
          {/* Mobile Search Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 md:hidden pointer-events-none">
            <div 
              className="bg-white/90 backdrop-blur shadow-lg rounded-full p-2 flex items-center gap-3 border border-slate-200 pointer-events-auto cursor-pointer" 
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-400 flex-1">搜尋素食餐廳...</span>
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
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
