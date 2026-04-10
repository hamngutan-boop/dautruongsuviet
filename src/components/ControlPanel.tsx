import React, { useState } from 'react';
import { Lock, Award, MinusCircle, User } from 'lucide-react';

export const ControlPanel = () => {
  const [targetUser, setTargetUser] = useState('');

  const actions = [
    { id: 'ban', icon: Lock, label: 'Khóa tài khoản', color: 'text-red-500' },
    { id: 'deduct', icon: MinusCircle, label: 'Trừ điểm uy tín', color: 'text-yellow-500' },
    { id: 'reward', icon: Award, label: 'Tặng quà vinh danh', color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#151619] border border-white/10 p-6 rounded-3xl">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nhập User_ID mục tiêu</label>
        <input 
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          className="w-full bg-[#0A0A0B] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm"
          placeholder="VD: Player123"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(action => (
          <button 
            key={action.id}
            disabled={!targetUser}
            className="bg-[#151619] border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-4 hover:border-[#FF6321] transition-all disabled:opacity-50"
          >
            <action.icon className={action.color} size={32} />
            <span className="text-sm font-bold text-white">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
