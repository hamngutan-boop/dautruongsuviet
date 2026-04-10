import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';
import { STORY_DATA } from '../constants';

export const StoryIntro = ({ onClose }: { onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const eras = STORY_DATA.eras;
  const story = eras[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div className="max-w-2xl w-full bg-[#1A1B1E] border border-white/10 rounded-[2rem] overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6321] to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FF6321]/10 rounded-lg text-[#FF6321]">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">Sử Ký Huyền Thoại</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="relative">
                <h3 className="text-xl font-bold text-[#FF6321] mb-4">{story.name}</h3>
                <p className="text-gray-300 leading-relaxed text-lg italic font-medium">
                  "{story.description}"
                </p>
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#FF6321]/20 rounded-full" />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-1">
              {eras.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-[#FF6321]' : 'w-2 bg-white/10'}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              
              {currentIndex < eras.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-6 py-3 bg-[#FF6321] text-black font-bold rounded-xl hover:bg-[#ff7a45] transition-all flex items-center gap-2"
                >
                  Tiếp Theo <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  Bắt Đầu Hành Trình <Sparkles size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
