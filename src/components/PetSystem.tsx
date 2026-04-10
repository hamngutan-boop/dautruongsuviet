import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, X, ShoppingBag, ChevronRight, Zap, Coins, Trophy, Clock } from 'lucide-react';
import { PET_DATA } from '../constants';
import { cn } from '../lib/utils';
import { Pet, UserProgress } from '../types';

interface PetSystemProps {
  user: UserProgress;
  addPet: (petId: string) => void;
  selectPet: (petId: string) => void;
  spendGold: (amount: number) => boolean;
  onClose: () => void;
}

export const PetSystem = ({ user, addPet, selectPet, spendGold, onClose }: PetSystemProps) => {
  const [activeTab, setActiveTab] = useState<'my_pets' | 'shop'>('my_pets');
  const [selectedPet, setSelectedPet] = useState<Pet | any>(null);

  const getPetIcon = (type: string) => {
    switch (type) {
      case 'dragon': return <Sparkles size={32} />;
      case 'phoenix': return <Sparkles size={32} />;
      case 'tiger': return <Sparkles size={32} />;
      case 'horse': return <Sparkles size={32} />;
      case 'turtle': return <Sparkles size={32} />;
      case 'slime': return <div className="text-3xl">💧</div>;
      default: return <Sparkles size={32} />;
    }
  };

  const handleBuyPet = (pet: any) => {
    if (user.pets?.some(p => p.id === pet.id)) {
      alert('Bạn đã sở hữu linh thú này rồi!');
      return;
    }

    if (spendGold(pet.price)) {
      addPet(pet.id);
      alert(`Chúc mừng! Bạn đã nhận được ${pet.name}!`);
    } else {
      alert('Bạn không đủ vàng để nhận linh thú này.');
    }
  };

  const getBuffIcon = (type: string) => {
    switch (type) {
      case 'exp': return <Zap size={14} />;
      case 'gold': return <Coins size={14} />;
      case 'combatPower': return <Trophy size={14} />;
      case 'time': return <Clock size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const getBuffLabel = (type: string) => {
    switch (type) {
      case 'exp': return 'Kinh Nghiệm';
      case 'gold': return 'Vàng';
      case 'combatPower': return 'Lực Chiến';
      case 'time': return 'Thời Gian';
      default: return 'Sức Mạnh';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div className="max-w-4xl w-full bg-[#1A1B1E] border border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col h-[80vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6321] to-transparent" />
        
        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FF6321]/10 rounded-2xl text-[#FF6321]">
              <Heart size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">Linh Thú Hộ Mệnh</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Đồng hành cùng sử gia</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 rounded-2xl p-1">
              <button 
                onClick={() => setActiveTab('my_pets')}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all",
                  activeTab === 'my_pets' ? "bg-[#FF6321] text-black" : "text-gray-500 hover:text-white"
                )}
              >
                Của Tôi
              </button>
              <button 
                onClick={() => setActiveTab('shop')}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all",
                  activeTab === 'shop' ? "bg-[#FF6321] text-black" : "text-gray-500 hover:text-white"
                )}
              >
                Cửa Hàng
              </button>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'shop' ? (
            PET_DATA.map((pet) => (
              <motion.div 
                key={pet.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "bg-white/5 border border-white/10 rounded-3xl p-6 relative group overflow-hidden",
                  user.pets?.some(p => p.id === pet.id) && "opacity-50"
                )}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={64} />
                </div>

                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-[#FF6321]">
                  {getPetIcon(pet.type)}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{pet.name}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{pet.description}</p>

                <div className="flex items-center gap-2 mb-6">
                  <div className="px-3 py-1 bg-[#FF6321]/10 rounded-lg flex items-center gap-1.5 text-[#FF6321]">
                    {getBuffIcon(pet.buff.type)}
                    <span className="text-[10px] font-bold uppercase">+{pet.buff.value * 100}% {getBuffLabel(pet.buff.type)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleBuyPet(pet)}
                  disabled={user.pets?.some(p => p.id === pet.id)}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  {user.pets?.some(p => p.id === pet.id) ? 'Đã Sở Hữu' : (
                    <>
                      <Coins size={16} /> {pet.price.toLocaleString()} Vàng
                    </>
                  )}
                </button>
              </motion.div>
            ))
          ) : (
            user.pets && user.pets.length > 0 ? (
              user.pets.map((pet) => (
                <motion.div 
                  key={pet.id}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "bg-white/5 border rounded-3xl p-6 relative group overflow-hidden transition-all",
                    user.selectedPetId === pet.id ? "border-[#FF6321] bg-[#FF6321]/5" : "border-white/10"
                  )}
                >
                  {user.selectedPetId === pet.id && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-[#FF6321] text-black text-[8px] font-black uppercase rounded-md">
                      Đang Dùng
                    </div>
                  )}

                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-[#FF6321]">
                    {getPetIcon(pet.type)}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{pet.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                      pet.petClass === 'combat' ? "bg-red-500/20 text-red-500" :
                      pet.petClass === 'support' ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
                    )}>
                      {pet.petClass === 'combat' ? 'Chiến đấu' : pet.petClass === 'support' ? 'Hỗ trợ' : 'Thông thái'}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                      pet.evolution === 'aura' ? "bg-yellow-500/20 text-yellow-500" :
                      pet.evolution === 'gloom' ? "bg-gray-500/20 text-gray-400" : "bg-white/10 text-white"
                    )}>
                      {pet.evolution === 'aura' ? 'Hào quang' : pet.evolution === 'gloom' ? 'U ám' : 'Bình thường'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-3 py-1 bg-[#FF6321]/10 rounded-lg flex items-center gap-1.5 text-[#FF6321]">
                      {getBuffIcon(pet.buff.type)}
                      <span className="text-[10px] font-bold uppercase">+{pet.buff.value * 100}% {getBuffLabel(pet.buff.type)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => selectPet(pet.id)}
                    disabled={user.selectedPetId === pet.id}
                    className={cn(
                      "w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                      user.selectedPetId === pet.id ? "bg-white/5 text-gray-500" : "bg-[#FF6321] text-black hover:bg-[#ff7a45]"
                    )}
                  >
                    {user.selectedPetId === pet.id ? 'Đang Sử Dụng' : 'Sử Dụng'}
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                  <Heart size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chưa có linh thú nào</h3>
                <p className="text-gray-500 max-w-xs mb-8">Hãy ghé thăm Cửa Hàng để tìm cho mình một người bạn đồng hành trung thành.</p>
                <button 
                  onClick={() => setActiveTab('shop')}
                  className="px-8 py-3 bg-[#FF6321] text-black font-bold rounded-xl hover:bg-[#ff7a45] transition-all"
                >
                  Đến Cửa Hàng
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};
