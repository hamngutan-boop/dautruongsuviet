import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Database, ShieldCheck, Search, Settings, X, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { AdminAIChat } from './AdminAIChat';
import { MonitoringSystem } from './MonitoringSystem';
import { AuditSystem } from './AuditSystem';
import { SearchEngine } from './SearchEngine';
import { ControlPanel } from './ControlPanel';
import { StorageSystem } from './StorageSystem';

export const AdminDashboard = ({ user, onClose, addTicketReply, addMail }: any) => {
  const [activeSystem, setActiveSystem] = useState('monitoring');
  const [showGuide, setShowGuide] = useState(false);

  const systems = [
    { id: 'monitoring', icon: Eye, label: 'Quan Sát', desc: 'Theo dõi log game thời gian thực, phát hiện hành vi bất thường (Hack, AFK, Spam).' },
    { id: 'storage', icon: Database, label: 'Lưu Trữ', desc: 'Nơi lưu trữ an toàn các bằng chứng (hình ảnh, video) và nhật ký hệ thống.' },
    { id: 'audit', icon: ShieldCheck, label: 'Kiểm Tra', desc: 'Hệ thống AI tự động chấm điểm (AI Score) độ tin cậy của các báo cáo vi phạm.' },
    { id: 'search', icon: Search, label: 'Tìm Kiếm', desc: 'Công cụ truy vấn dữ liệu người chơi, lịch sử vi phạm bằng từ khóa hoặc AI.' },
    { id: 'control', icon: Settings, label: 'Quản Lý', desc: 'Bảng điều khiển thực thi quyền lực: Khóa tài khoản, trừ điểm uy tín, hoặc tặng thưởng.' },
  ];

  const renderSystem = () => {
    switch (activeSystem) {
      case 'monitoring': return <MonitoringSystem />;
      case 'storage': return <StorageSystem user={user} addTicketReply={addTicketReply} addMail={addMail} />;
      case 'audit': return <AuditSystem />;
      case 'search': return <SearchEngine />;
      case 'control': return <ControlPanel />;
      default: return <p className="text-gray-400">Đang phát triển hệ thống {systems.find(s => s.id === activeSystem)?.label}...</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#151619] p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-white uppercase italic">Admin Dashboard</h1>
          <button 
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 text-xs text-[#FF6321] hover:text-white bg-[#FF6321]/10 px-3 py-1.5 rounded-full transition-all border border-[#FF6321]/30"
          >
            <Info size={14} /> Hướng dẫn cơ chế
          </button>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white"><X size={24} /></button>
      </div>

      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1B1E] border border-white/10 p-8 rounded-3xl max-w-2xl w-full relative"
            >
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-white uppercase italic mb-6 text-center">Cơ chế hoạt động Admin</h2>
              <div className="space-y-4">
                {systems.map(sys => (
                  <div key={sys.id} className="flex gap-4 p-4 bg-[#151619] rounded-2xl border border-white/5">
                    <div className="p-3 bg-white/5 rounded-xl h-fit">
                      <sys.icon className="text-[#FF6321]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{sys.label}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{sys.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[#FF6321]/10 border border-[#FF6321]/30 rounded-2xl">
                <p className="text-sm text-[#FF6321] font-bold flex items-center gap-2">
                  <Info size={16} /> Trợ thủ AI (Cột bên phải) luôn túc trực để giúp bạn phân tích dữ liệu từ 5 hệ thống này.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {systems.map(sys => (
              <button
                key={sys.id}
                onClick={() => setActiveSystem(sys.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase text-xs transition-all",
                  activeSystem === sys.id ? "bg-[#FF6321] text-black" : "bg-[#1A1B1E] text-gray-400 hover:bg-white/5"
                )}
              >
                <sys.icon size={16} /> {sys.label}
              </button>
            ))}
          </div>

          <div className="bg-[#1A1B1E] border border-white/10 p-8 rounded-3xl min-h-[500px]">
            <h2 className="text-xl font-bold text-white mb-6 uppercase">
              {systems.find(s => s.id === activeSystem)?.label}
            </h2>
            {renderSystem()}
          </div>
        </div>
        
        <div className="h-[600px]">
          <AdminAIChat context={`Admin đang quản lý hệ thống game. Hệ thống hiện tại gồm: ${systems.map(s => s.label).join(', ')}.`} />
        </div>
      </div>
    </div>
  );
};
