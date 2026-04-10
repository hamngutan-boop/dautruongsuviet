import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, BarChart2, MessageSquare, Heart, AlertTriangle, UserPlus } from 'lucide-react';
import { MatchHistory } from '../types';

interface PostGameScreenProps {
  match: MatchHistory;
  onClose: () => void;
}

export const PostGameScreen: React.FC<PostGameScreenProps> = ({ match, onClose }) => {
  const [step, setStep] = useState<'honor' | 'stats' | 'feedback'>('honor');

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'honor' && (
          <motion.div 
            key="honor"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <Trophy size={96} className="text-yellow-500 mx-auto" />
            <h1 className="text-4xl font-black text-white uppercase tracking-widest">Chiến thắng!</h1>
            <p className="text-gray-400">Bạn đã đạt danh hiệu MVP trận đấu.</p>
            <button onClick={() => setStep('stats')} className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest">Tiếp tục</button>
          </motion.div>
        )}

        {step === 'stats' && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6"
          >
            <div className="flex items-center gap-3 text-white">
              <BarChart2 />
              <h2 className="text-2xl font-black uppercase">Chỉ số chi tiết</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-gray-400 text-xs">KDA</p>
                <p className="text-2xl font-bold text-white">{match.stats?.kda || 'N/A'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-gray-400 text-xs">Vàng/Phút</p>
                <p className="text-2xl font-bold text-white">{match.stats?.goldPerMinute || 'N/A'}</p>
              </div>
            </div>
            <button onClick={() => setStep('feedback')} className="w-full bg-white/10 text-white py-3 rounded-full font-bold uppercase tracking-widest">Tiếp tục</button>
          </motion.div>
        )}

        {step === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6"
          >
            <h2 className="text-2xl font-black text-white uppercase">Phản hồi</h2>
            <div className="flex gap-4">
              <button className="flex-1 bg-green-500/20 text-green-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <Heart size={18} /> Tặng tim
              </button>
              <button className="flex-1 bg-blue-500/20 text-blue-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <UserPlus size={18} /> Kết bạn
              </button>
              <button className="flex-1 bg-red-500/20 text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <AlertTriangle size={18} /> Tố cáo
              </button>
            </div>
            <button onClick={onClose} className="w-full bg-white text-black py-3 rounded-full font-bold uppercase tracking-widest">Hoàn tất</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
