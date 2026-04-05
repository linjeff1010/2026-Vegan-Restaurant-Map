import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [dots, setDots] = useState('');
  const [text, setText] = useState('');
  const fullText = "Loading";

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Typing effect for "Loading"
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, []);

  // Looping dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fffdfa]"
    >
      <div className="relative w-72 h-72 flex items-center justify-center mb-4">
        {/* 請將 src 替換為您上傳的圖片路徑，例如 "/loading-dog.png" */}
        <img 
          src="/your-dog-image.png" 
          alt="Loading" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[#6b5e53] font-bold tracking-[0.2em] text-xl flex items-center"
      >
        <span>{text}</span>
        <span className="w-8 text-left">{dots}</span>
      </motion.div>
    </motion.div>
  );
}
