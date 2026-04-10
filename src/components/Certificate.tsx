import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, Shield, Trophy, Download, Share2, X, Star, Calendar, User, Sparkles, Zap, Heart, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProgress, CertificateData } from '../types';

interface CertificateProps {
  user: UserProgress;
  certificate: Partial<CertificateData>;
  onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ user, certificate, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Đang chuẩn bị ảnh chia sẻ lên mạng xã hội...');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-amber-500 to-yellow-600';
      case 'epic': return 'from-purple-400 via-fuchsia-500 to-purple-600';
      case 'rare': return 'from-blue-400 via-cyan-500 to-blue-600';
      default: return 'from-gray-400 via-slate-500 to-gray-600';
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Zap size={48} />;
      case 'social': return <Heart size={48} />;
      case 'event': return <Sparkles size={48} />;
      case 'collection': return <BookOpen size={48} />;
      default: return <Award size={48} />;
    }
  };

  const rarity = certificate.rarity || 'common';
  const type = certificate.type || 'battle';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="max-w-4xl w-full flex flex-col gap-6 my-auto">
        <div className="flex justify-end gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF6321]/10 hover:bg-[#FF6321]/20 text-[#FF6321] rounded-2xl font-bold transition-all border border-[#FF6321]/30"
          >
            <Share2 size={20} />
            Chia sẻ
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10"
          >
            <Download size={20} />
            Tải Xuống
          </button>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all border border-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Certificate Content */}
        <div 
          ref={certificateRef}
          className={cn(
            "bg-[#FDFBF7] border-[16px] p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-[#2D241E] font-serif",
            rarity === 'legendary' ? "border-[#D4AF37]" : 
            rarity === 'epic' ? "border-[#8B5CF6]" : 
            rarity === 'rare' ? "border-[#3B82F6]" : "border-[#8B4513]"
          )}
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            {getCategoryIcon(type)}
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center mb-8 border-4 shadow-xl",
              rarity === 'legendary' ? "bg-yellow-500/10 border-yellow-500 text-yellow-600" :
              rarity === 'epic' ? "bg-purple-500/10 border-purple-500 text-purple-600" :
              rarity === 'rare' ? "bg-blue-500/10 border-blue-500 text-blue-600" :
              "bg-[#8B4513]/10 border-[#8B4513] text-[#8B4513]"
            )}>
              {getCategoryIcon(type)}
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-5xl font-black uppercase tracking-[0.25em] text-[#8B4513]">Bảng Vàng Công Trạng</h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Vinh Danh Hào Kiệt</span>
                <div className="h-0.5 w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
            </div>

            <div className="mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4 font-bold">Chứng nhận cho Sử Gia</p>
              <h2 className="text-7xl font-black text-[#2D241E] italic underline decoration-[#D4AF37] decoration-8 underline-offset-[12px] mb-4">
                {user.name}
              </h2>
            </div>

            <div className="mb-12 max-w-2xl">
              <p className="text-xl italic mb-6">Đã đạt được thành tựu hiển hách trong hành trình Đấu Trường Sử Việt:</p>
              <div className="relative inline-block px-12 py-6">
                <div className="absolute inset-0 bg-[#8B4513]/5 rounded-3xl -rotate-1" />
                <h3 className="text-4xl font-black text-[#8B4513] uppercase tracking-wider relative z-10">
                  "{certificate.achievement}"
                </h3>
              </div>
              {certificate.description && (
                <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                  {certificate.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-12 w-full mt-8 border-t border-b border-[#8B4513]/10 py-10">
              <div className="flex flex-col items-center">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Phân Loại</p>
                <span className={cn(
                  "px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r",
                  getRarityColor(rarity)
                )}>
                  {rarity}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Ngày Cấp</p>
                <p className="text-2xl font-black text-[#2D241E]">{certificate.date}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Lực Chiến</p>
                <p className="text-2xl font-black text-[#2D241E]">{user.combatPower}</p>
              </div>
            </div>

            <div className="mt-16 flex justify-between w-full px-12 items-end">
              <div className="text-center">
                <div className="w-48 h-px bg-gray-300 mb-4" />
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Dấu Ấn Triều Đình</p>
                <div className="mt-4 opacity-30">
                  <Shield size={48} className="mx-auto text-[#D4AF37]" />
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 border-4 border-[#8B4513]/20 rounded-full flex items-center justify-center mb-4 rotate-12">
                  <div className="text-[10px] font-black text-[#8B4513]/40 uppercase text-center leading-tight">
                    ĐÃ XÁC THỰC<br />SỬ VIỆT
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-48 h-px bg-gray-300 mb-4" />
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Chữ Ký Sử Gia</p>
                <p className="font-serif italic text-3xl text-[#8B4513] mt-4 tracking-tighter">{user.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.5em]">
          <span>Đấu Trường Sử Việt</span>
          <div className="w-2 h-2 rounded-full bg-[#FF6321]" />
          <span>Vinh Danh Hào Kiệt</span>
        </div>
      </div>
    </motion.div>
  );
};
