import React from 'react';
import { Mail, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const NotificationHub = ({ user, setActiveTab, onShowTutorial }: any) => {
  return (
    <div className="flex items-center gap-2 bg-[#1A1B1E]/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
      <button 
        onClick={() => setActiveTab('mailbox')} 
        className="p-2 text-gray-500 hover:text-[#FF6321] transition-colors relative"
        title="Hộp thư"
      >
        <Mail size={18} />
        {user.mailbox?.some((m: any) => !m.isRead) && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>
      <button 
        onClick={onShowTutorial} 
        className="p-2 text-gray-500 hover:text-[#FF6321] transition-colors"
        title="Hướng dẫn tân thủ"
      >
        <HelpCircle size={18} />
      </button>
    </div>
  );
};
