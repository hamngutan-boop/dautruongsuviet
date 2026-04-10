import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Zap, Trophy, Settings, Target, Info, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface StartButtonHubProps {
  onStartMatch: (mode: string) => void;
  onInteraction?: () => void;
}

export const StartButtonHub: React.FC<StartButtonHubProps> = ({ onStartMatch, onInteraction }) => {
  const [isRadialOpen, setIsRadialOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  let timer: NodeJS.Timeout;

  const toggleRadial = () => {
    setIsRadialOpen(!isRadialOpen);
    if (!isRadialOpen && onInteraction) onInteraction();
  };

  const modes = [
    { icon: <Sword size={24} />, label: 'Đấu Hạng', mode: 'ranked' },
    { icon: <Zap size={24} />, label: 'Đấu Thường', mode: 'normal' },
    { icon: <Trophy size={24} />, label: 'Giải Trí', mode: 'fun' },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.button
          onClick={toggleRadial}
          className="w-24 h-24 rounded-full border-2 border-white/60 bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-white uppercase shadow-lg hover:bg-white/20 transition-all z-10 relative"
          whileTap={{ scale: 0.9 }}
        >
          {isRadialOpen ? 'CLOSE' : 'START'}
        </motion.button>

        <AnimatePresence>
          {isRadialOpen && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-32 -left-32 w-80 h-80 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50"
            >
              {modes.map((mode, index) => {
                const angle = (index * (360 / modes.length));
                return (
                  <motion.button
                    key={mode.mode}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartMatch(mode.mode);
                      setIsRadialOpen(false);
                    }}
                    className="absolute flex flex-col items-center gap-1 text-white hover:text-[#FF6321] transition-colors"
                    style={{ transform: `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)` }}
                  >
                    <div className="p-4 bg-white/10 rounded-full">{mode.icon}</div>
                    <span className="text-[10px] font-bold">{mode.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button 
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-white/5 px-4 py-2 rounded-full transition-all border border-white/10"
        >
          <Info size={14} /> Hướng dẫn nút START
        </button>
        <AnimatePresence>
          {showHint && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="text-xs text-left text-gray-300 bg-[#1A1B1E] border border-white/10 p-4 rounded-2xl max-w-[250px] space-y-3 mt-2">
                <p className="flex items-start gap-2">
                  <span className="text-[#FF6321] text-base leading-none">👆</span> 
                  <span><b>Nhấn nút:</b> Mở Menu Vòng Tròn để chọn các chế độ chơi ngay lập tức.</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
