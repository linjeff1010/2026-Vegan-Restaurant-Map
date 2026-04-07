import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-white px-6 sm:px-8 pt-6 sm:pt-8 pb-4 relative shrink-0 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 text-left">隱私權政策與服務免責聲明</h2>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  歡迎您使用「好蔬出發 Go Veggie」（以下簡稱「本網站」）。本網站致力於提供全台素食、蔬食及寵物友善餐廳之客觀資訊檢索服務。
                </p>
                <p>
                  為保障您的權益，並釐清本網站之服務目的與法律責任，請您於使用本網站前，詳細閱讀以下《隱私權政策與服務免責聲明》（以下簡稱本聲明）。當您繼續瀏覽或使用本網站提供之服務時，即表示您已閱讀、瞭解並同意接受本聲明之所有內容。
                </p>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">第一部分：隱私權保護政策</h3>
                  <p>本網站尊重並保護您的個人隱私權，針對資料蒐集與使用規範如下：</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">1. 個人資料之蒐集與處理</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>無主動蒐集：</strong>本網站為前端靜態展示平台，本站「不會」主動要求、蒐集、處理或利用您的姓名、電話、電子郵件、身分證字號或精確的 GPS 定位等足以識別您個人身分之資料（PII）。</li>
                      <li><strong>系統日誌與技術數據：</strong>當您瀏覽本網站時，為維持網站正常運作，我們的網頁代管伺服器（例如：GitHub Pages）可能會自動記錄一般性的技術數據，包括但不限於：您的 IP 位址、使用時間、使用的瀏覽器、作業系統及點擊紀錄等。這些數據僅用於網路流量分析與服務品質改善，無法據此辨識特定個人。</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">2. 第三方服務與外部連結</h4>
                    <p>本網站的運作依賴部分第三方開源套件與服務，包含但不限於：</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>地圖服務：</strong>本網站使用 Leaflet 框架與 CartoDB 圖磚服務，底層地圖資料來源為 OpenStreetMap。</li>
                      <li><strong>外部連結：</strong>本網站提供導向 Google Maps、Facebook、Instagram 等第三方平台之按鈕或連結。</li>
                    </ul>
                    <p className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                      請注意：當您點擊外部連結離開本網站，或載入上述第三方地圖服務時，您的瀏覽行為將適用該第三方服務供應商的隱私權政策，且該第三方可能會向您發送 Cookies 或蒐集您的行為數據。本網站對第三方平台的隱私權實務不負任何連帶責任。
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">第二部分：服務免責聲明（使用者必讀）</h3>
                  <p>本網站旨在提供便利的素食資訊彙整，然因餐飲實務狀況多變，為避免消費爭議，特此聲明：</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">1. 資訊準確性與即時性</h4>
                    <p>本網站所收錄之餐廳名稱、地址、聯絡方式、評分、素食分類（如：純素、奶素、蛋素、五辛素）及寵物友善標示，皆彙整自網路公開資料或社群使用者反饋。</p>
                    <p className="font-medium text-amber-700">本網站不保證所有資訊之絕對正確性、完整性與即時性。 店家之營業狀況、菜單內容、經營方針隨時可能發生變更，本網站不具備即時更新所有店家動態之能力與義務。</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">2. 飲食禁忌與過敏原風險聲明（極為重要）</h4>
                    <p>素食定義因人而異（例如：是否有共鍋共線、是否有微量動物性成分、是否確實為無五辛），且可能涉及個人嚴重過敏原（如花生、奶蛋麩質等）。</p>
                    <p className="font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
                      本網站提供之「素食類別標籤」僅供初步過濾與參考。 強烈建議對飲食有嚴格要求之純素者，或具備任何食物過敏史之使用者，於實際消費前，務必親自透過電話或官方社群向實體店家確認其烹調方式與食材成分。若因使用本站資訊而導致誤食、過敏反應或任何身心健康損害，本網站概不負責，亦不負任何民事或刑事之損害賠償責任。
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">3. 寵物友善規定之變動</h4>
                    <p>本網站標示之「🐾 寵物友善」僅代表該店家曾有接待寵物之紀錄。各店家對於寵物是否能落地、是否需牽繩、裝籠或推車，以及體型限制等具體規範皆有不同，且可能隨時修改。前往用餐前請務必遵循店家當下的現場規範。</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">4. 服務中斷與終止</h4>
                    <p>本網站保留隨時修改、暫停或永久終止本服務（或其任何部分）的權利，且無須事先通知使用者。對於因服務中斷所可能造成之不便或損失，本網站不負任何賠償責任。</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">第三部分：智慧財產權與資料下架機制</h3>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">1. 智慧財產權</h4>
                    <p>本網站之版面設計、UI/UX 介面、原創插畫 Logo 等，其著作權皆屬本網站開發者所有。地圖資料版權歸 OpenStreetMap 貢獻者及 CARTO 所有。本網站引述之餐廳名稱與公開事實資訊，為合理使用範圍。</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">2. 資料更新與下架聯繫</h4>
                    <p>本網站尊重複數店家之營業權益。若您為清單中收錄之實體店家經營者，且發現本網站所載之貴店資訊有誤，或您基於任何商業考量，不希望貴店資訊被收錄於本網站中，請透過以下方式與我們聯繫。我們將於核實身分後，儘速為您更新或移除該筆資料。</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>聯絡信箱：</strong>linjeff1010@gmail.com</li>
                      <li><strong>更新處理時間：</strong>收到信件後約 3-5 個工作天內處理。</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 text-sm text-slate-400 text-right">
                  最後更新日期：2026 年 04 月 07 日
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="p-6 sm:px-8 sm:py-6 border-t border-slate-100 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
