import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Chào Sử Gia! Tôi là Trợ Lý Sử Việt. Bạn muốn tìm hiểu về sự kiện hay nhân vật lịch sử nào hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ text: `Bạn là một chuyên gia lịch sử Việt Nam và thế giới, tên là "Sử Gia Trợ Lý". Hãy trả lời câu hỏi sau một cách ngắn gọn, chính xác và hào hùng: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "Bạn là Sử Gia Trợ Lý, một chuyên gia lịch sử thân thiện, uyên bác. Luôn trả lời bằng tiếng Việt. Sử dụng ngôn ngữ trang trọng nhưng dễ hiểu. Nếu câu hỏi không liên quan đến lịch sử, hãy nhắc nhở người dùng rằng bạn ở đây để giúp họ tìm hiểu về lịch sử dân tộc và thế giới."
        }
      });

      const aiResponse = response.text || "Xin lỗi, tôi gặp chút trục trặc khi tra cứu sử liệu. Hãy thử lại nhé!";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Có lỗi xảy ra khi kết nối với kho tàng sử liệu. Vui lòng kiểm tra kết nối mạng." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#FF6321] text-black rounded-full shadow-[0_10px_30px_rgba(255,99,33,0.4)] flex items-center justify-center border-2 border-white/20"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-[#1A1B1E] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#FF6321] to-[#FF8C00] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black uppercase italic leading-none">Sử Gia Trợ Lý</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-black/60 uppercase">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-white/10" : "bg-[#FF6321]/20"
                  )}>
                    {msg.role === 'user' ? <User size={14} className="text-gray-400" /> : <Bot size={14} className="text-[#FF6321]" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-[#FF6321] text-black font-medium rounded-tr-none" 
                      : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none"
                  )}>
                    <div className="markdown-body prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-[#FF6321]/20 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-[#FF6321]" />
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 size={14} className="text-[#FF6321] animate-spin" />
                    <span className="text-xs text-gray-500 font-medium">Đang tra cứu sử liệu...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi về lịch sử..."
                  className="w-full bg-[#1A1B1E] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-[#FF6321] transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FF6321] text-black rounded-lg flex items-center justify-center disabled:opacity-50 transition-all hover:bg-[#FF7A45]"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Sparkles size={10} className="text-[#FF6321]" />
                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Sử dụng trí tuệ nhân tạo Gemini</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
