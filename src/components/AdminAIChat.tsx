import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { adminChat } from '../services/geminiService';

export const AdminAIChat = ({ context }: { context: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await adminChat(userMessage, context);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'Không có phản hồi.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Có lỗi xảy ra khi kết nối với AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1B1E] rounded-3xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 font-bold text-white flex items-center gap-2">
        <MessageSquare size={20} className="text-[#FF6321]" /> Trợ thủ Admin
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("p-3 rounded-2xl text-sm", m.role === 'user' ? "bg-[#FF6321]/20 text-white ml-auto max-w-[80%]" : "bg-white/5 text-gray-300 mr-auto max-w-[80%]")}>
            {m.text}
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm">Đang suy nghĩ...</div>}
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#151619] border border-white/10 rounded-full px-4 py-2 text-white text-sm"
          placeholder="Nhập câu lệnh cho trợ thủ..."
        />
        <button onClick={handleSend} className="p-2 bg-[#FF6321] rounded-full text-black"><Send size={18} /></button>
      </div>
    </div>
  );
};
