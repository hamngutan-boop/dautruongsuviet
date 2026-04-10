import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, MapIcon, Users, Trophy, Book, ShoppingBag, Gift, Settings, MoreHorizontal, X } from 'lucide-react';
import { cn } from '../lib/utils';

const tabs = [
  { id: 'arena', icon: Sword, label: 'Đấu Trường' },
  { id: 'campaign', icon: MapIcon, label: 'Chiến Dịch' },
  { id: 'social', icon: Users, label: 'Xã Hội' },
  { id: 'leaderboard', icon: Trophy, label: 'Xếp Hạng' },
  { id: 'su_ha', icon: Book, label: 'Sử Hà' },
  { id: 'shop', icon: ShoppingBag, label: 'Cửa Hàng' },
  { id: 'events', icon: Gift, label: 'Sự Kiện' },
  { id: 'settings', icon: Settings, label: 'Cài Đặt' },
];

export const SmartHub = ({ activeTab, setActiveTab }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="grid grid-cols-2 gap-2 bg-[#1A1B1E]/90 backdrop-blur-xl border border-[#FF6321]/30 p-4 rounded-3xl mb-4 shadow-2xl"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center p-3 rounded-2xl transition-all w-24",
                  activeTab === tab.id ? "bg-[#FF6321] text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon size={20} />
                <span className="text-[10px] font-bold uppercase mt-1">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[#1A1B1E] border-2 border-[#FF6321] text-[#FF6321] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MoreHorizontal size={24} />}
      </button>
    </div>
  );
};
