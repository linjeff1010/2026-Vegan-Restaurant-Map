import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { RESTAURANT_DATA } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  options?: string[];
}

interface ChatbotProps {
  setFilters?: React.Dispatch<React.SetStateAction<{ city: string, type: string, search: string, petFriendly: boolean }>>;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

// 預設的 QA 題庫（支援多組關鍵字交集比對）
const qaDatabase = [
  {
    conditions: [['台北', '北市'], ['港式', '飲茶', '港點']],
    answer: '在台北想吃港式蔬食，非常推薦中山區的「養心茶樓蔬食飲茶」（五星級精緻港點）或是松山區的「不葷主義茶餐廳」喔！'
  },
  {
    conditions: [['台北', '北市'], ['米其林', '必比登', '星級', '高級', '請客']],
    answer: '台北的米其林推薦蔬食，有連續多年獲必比登推薦的「祥和蔬食料理」（川式），以及榮獲米其林綠星的「小小樹食」和「陽明春天」，非常適合聚餐請客！'
  },
  {
    conditions: [['台北', '北市'], ['寵物', '狗', '貓', '毛孩']],
    answer: '台北的寵物友善蔬食餐廳，推薦大安區的「小小樹食」、信義區的「BaganHood 蔬食餐酒館」，以及大稻埕的「無口小廚」！'
  },
  {
    conditions: [['新北', '板橋'], ['吃到飽', '百匯', 'buffet']],
    answer: '新北的蔬食吃到飽，板橋有兩家非常棒的選擇：「果然匯 板橋店」以及「原素食府」，菜色都非常豐富！'
  },
  {
    conditions: [['新北', '新店'], ['義式', '披薩', '義大利麵', '聚餐']],
    answer: '新店非常有名的聚餐選擇是「布佬廚房 Bruce\'s Kitchen」，他們的披薩與義大利麵廣受好評，而且是寵物友善喔！另外裕隆城也有「Miacucina」可以選擇。'
  },
  {
    conditions: [['桃園'], ['約會', '西式', '漢堡', '義大利麵', '氣氛']],
    answer: '在桃園想找適合約會的西式蔬食，推薦「Monday 蔬食料理」的精緻漢堡與燉飯，或是「艾維農歐風素食」的法式擺盤料理！'
  },
  {
    conditions: [['新竹', '竹北'], ['日式', '拉麵', '麵']],
    answer: '新竹的日式蔬食，推薦竹北的「籽田野菜屋」（胡麻拉麵超讚），或是新竹市區的「井町日式蔬食」！'
  },
  {
    conditions: [['純素', '全素']],
    answer: '純素（全素）是指不包含任何動物性成分，也不包含五辛（蔥、蒜、韭、薤、興渠）的飲食喔！'
  },
  {
    conditions: [['五辛', '蔥', '蒜']],
    answer: '五辛素包含蔥、蒜、韭、薤、興渠。如果您吃五辛素，我們網站上有特別標示「五辛素」的餐廳可以選擇喔！'
  },
  {
    conditions: [['蛋奶', '奶素', '蛋素']],
    answer: '蛋奶素是指飲食中包含蛋製品或奶製品。我們網站的篩選器可以幫您精準找到提供蛋奶素餐點的餐廳！'
  },
  {
    conditions: [['你好', '哈囉', '嗨', 'hello', 'hi']],
    answer: '你好呀！我是好蔬出發的小幫手，您可以試著問我：「台北的港式飲茶」、「板橋的吃到飽」或是「新竹的拉麵」喔！🥦'
  }
];

const getBotResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  for (const qa of qaDatabase) {
    const isMatch = qa.conditions.every(group => 
      group.some(keyword => lowerInput.includes(keyword))
    );
    if (isMatch) {
      return qa.answer;
    }
  }
  return '這是一個好問題！不過我目前還在學習中，建議您可以直接使用左側的「搜尋」功能，或是點擊下方按鈕重新尋找餐廳喔！🥦';
};

type WizardStep = 'idle' | 'q1_city' | 'q2_type' | 'q3_pet' | 'done';

export const Chatbot: React.FC<ChatbotProps> = ({ setFilters, setShowSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('q1_city');
  const [wizardData, setWizardData] = useState({ city: '', type: '', petFriendly: false, rawCity: '' });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: '你好！我是好蔬出發的蔬食小幫手 🥦\n讓我們來幫您找餐廳吧！\n\nＱ1：您想要查詢哪個縣市的素食呢？ (例如：台北市、新北市)',
      options: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const normalizeCity = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes('台北') || text.includes('北市')) return '台北市';
    if (text.includes('新北') || text.includes('板橋') || text.includes('新店')) return '新北市';
    if (text.includes('桃園') || text.includes('中壢')) return '桃園市';
    if (text.includes('新竹市')) return '新竹市';
    if (text.includes('新竹') || text.includes('竹北')) return '新竹縣';
    if (text.includes('台中') || text.includes('中市')) return '台中市';
    if (text.includes('彰化')) return '彰化縣';
    if (text.includes('南投')) return '南投縣';
    if (text.includes('宜蘭')) return '宜蘭縣';
    if (text.includes('苗栗')) return '苗栗縣';
    return 'all';
  };

  const processWizard = (userInput: string): { content: string, options?: string[] } | null => {
    if (wizardStep === 'q1_city') {
      const city = normalizeCity(userInput);
      setWizardData(prev => ({ ...prev, city, rawCity: userInput }));
      setWizardStep('q2_type');
      return {
        content: `好的，為您尋找「${userInput}」的餐廳。\n\nＱ2：您想要尋找哪種素食別的餐廳呢？`,
        options: ['純素', '奶素', '蛋素', '五辛素', '不拘']
      };
    } else if (wizardStep === 'q2_type') {
      const type = userInput === '不拘' ? 'all' : userInput;
      setWizardData(prev => ({ ...prev, type }));
      setWizardStep('q3_pet');
      return {
        content: `了解，素食類別為「${userInput}」。\n\nＱ3：您會攜帶寵物前往，需要寵物友善餐廳推薦嗎？`,
        options: ['是，需要寵物友善', '否，不需要']
      };
    } else if (wizardStep === 'q3_pet') {
      const petFriendly = userInput.includes('是');
      const finalData = { ...wizardData, petFriendly };
      setWizardData(finalData);
      setWizardStep('done');
      
      // Execute filter
      if (setFilters) {
        setFilters({
          city: finalData.city,
          type: finalData.type,
          search: finalData.city === 'all' ? finalData.rawCity : '',
          petFriendly: finalData.petFriendly
        });
      }
      if (setShowSidebar) {
        setShowSidebar(true);
      }

      // Find matching restaurants to list in chat
      const results = RESTAURANT_DATA.filter(r => {
        const matchCity = finalData.city === 'all' || r.city === finalData.city;
        const matchType = finalData.type === 'all' || r.types.includes(finalData.type);
        const matchPet = !finalData.petFriendly || r.petFriendly;
        const matchSearch = finalData.city === 'all' ? (r.name.includes(finalData.rawCity) || r.address.includes(finalData.rawCity)) : true;
        return matchCity && matchType && matchPet && matchSearch;
      });

      let resultText = `設定完成！我已經幫您將左側清單更新囉！🎉\n\n`;
      if (results.length > 0) {
        resultText += `為您找到 ${results.length} 間符合條件的餐廳，推薦前幾名給您：\n`;
        results.slice(0, 3).forEach((r, i) => {
          resultText += `${i + 1}. ${r.name} (${r.rating}⭐)\n`;
        });
        if (results.length > 3) {
          resultText += `...還有更多好店，請查看左側清單！\n`;
        }
      } else {
        resultText += `抱歉，目前沒有找到完全符合條件的餐廳，您可以嘗試放寬條件喔！\n`;
      }
      
      resultText += `\n如果您還有其他問題（例如：「什麼是五辛素？」），可以直接問我，或者點擊下方按鈕重新尋找餐廳！`;

      return {
        content: resultText,
        options: ['重新尋找餐廳']
      };
    } else if (wizardStep === 'done' && userInput === '重新尋找餐廳') {
      setWizardStep('q1_city');
      setWizardData({ city: '', type: '', petFriendly: false, rawCity: '' });
      return {
        content: '沒問題！讓我們重新開始。\n\nＱ1：您想要查詢哪個縣市的素食呢？ (例如：台北市、新北市)',
        options: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']
      };
    }
    
    return null;
  };

  const handleUserInput = (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let botMessage: Message;
      
      const wizardResponse = processWizard(text.trim());
      
      if (wizardResponse) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: wizardResponse.content,
          options: wizardResponse.options
        };
      } else {
        // Fallback to QA
        const replyText = getBotResponse(text.trim());
        botMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: replyText,
          options: ['重新尋找餐廳']
        };
      }

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUserInput(input);
  };

  const handleOptionClick = (option: string) => {
    handleUserInput(option);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/25",
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-emerald-500 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI 蔬食小幫手</h3>
                  <p className="text-xs text-emerald-100">線上為您解答</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === 'user' 
                        ? "bg-emerald-500 text-white rounded-tr-sm" 
                        : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            disabled={isLoading}
                            className="text-xs bg-white text-emerald-600 border border-emerald-200 px-3 py-2 rounded-full hover:bg-emerald-50 transition-colors disabled:opacity-50 text-left shadow-sm"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    <span className="text-sm text-slate-500">正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={wizardStep !== 'done' ? "請輸入或點選上方選項..." : "輸入訊息或關鍵字..."}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-500 shadow-sm"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
