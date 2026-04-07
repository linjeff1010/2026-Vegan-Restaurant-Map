import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white px-6 sm:px-8 pt-6 sm:pt-8 pb-4 relative">
              <h2 className="text-2xl font-bold text-slate-800 text-left">站長的話</h2>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <p className="text-lg font-medium text-emerald-600 mb-4 text-left">
                歡迎來到好蔬出發，一起來探索蔬食圈！
              </p>
              
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  這是一個<strong>非營利</strong>的蔬食推廣計畫，希望透過這個地圖，讓大家更輕鬆地找到身邊的美味素食與蔬食餐廳。
                </p>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800 flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                  <p>
                    本站資料主要由 AI 輔助生成與網路資料蒐集而來。若您發現任何餐廳資訊（如素食分類、營業狀態）有誤，非常歡迎來信告知我們，讓我們一起完善這個友善的蔬食圈！
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="mt-8 w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                我已瞭解
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
