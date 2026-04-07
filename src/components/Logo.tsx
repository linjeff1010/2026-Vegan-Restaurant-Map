import React from 'react';

export const Logo: React.FC = () => (
  <div className="flex items-center">
    <img 
      src="/go-veggie-logo.png" 
      alt="好蔬出發 Go Veggie - 台灣素食餐廳地圖" 
      title="好蔬出發 Go Veggie"
      className="h-10 w-auto max-w-[200px] object-contain"
      width="200"
      height="40"
    />
  </div>
);
