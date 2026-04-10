import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion } from 'motion/react';
import { AlertTriangle, Send, X, Camera, Clock, ShieldCheck } from 'lucide-react';

const REPORT_CATEGORIES = [
  { id: 'toxic', label: 'Phát ngôn gây hấn', icon: '🗣️' },
  { id: 'cheat', label: 'Gian lận (Hack/Cheat)', icon: '🛡️' },
  { id: 'feeder', label: 'Cố tình thua', icon: '📉' },
  { id: 'afk', label: 'Rời trận (AFK)', icon: '💤' },
  { id: 'other', label: 'Khác', icon: '❓' }
];

export const Report: React.FC<{ reportedUid?: string; onClose: () => void; updateReputation: (points: number, xp: number) => void; friends?: any[] }> = ({ reportedUid = '', onClose, updateReputation, friends = [] }) => {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('toxic');
  const [evidenceType, setEvidenceType] = useState<'none' | 'screenshot' | 'timestamp'>('none');
  const [evidenceValue, setEvidenceValue] = useState('');
  const [targetUser, setTargetUser] = useState(reportedUid === 'system' ? '' : reportedUid);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    if (!targetUser.trim()) {
      alert('Vui lòng chọn hoặc nhập ID/tên người muốn tố cáo.');
      return;
    }
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do tố cáo.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI Filter
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'reports'), {
          reporterUid: auth.currentUser?.uid,
          reportedUid: targetUser,
          category,
          reason,
          evidence: {
            type: evidenceType,
            value: evidenceValue
          },
          timestamp: serverTimestamp(),
          status: 'pending'
        });

        // Deduct reputation for reporting (to prevent spam)
        updateReputation(-5, 0); 
        
        alert('Đã gửi tố cáo thành công! Hệ thống AI đang quét bằng chứng. Bạn sẽ nhận được thông báo nếu tố cáo được xử lý.');
        onClose();
      } catch (error) {
        console.error('Lỗi gửi tố cáo:', error);
        alert('Có lỗi xảy ra khi gửi tố cáo.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-[#1A1B1E] border border-red-500/30 rounded-3xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
        
        <div className="flex items-center gap-3 mb-6 text-red-500">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-black uppercase tracking-tighter">Tố cáo vi phạm</h2>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Đối tượng</label>
            <div className="relative">
              <input 
                type="text"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="Nhập ID hoặc tên người dùng..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Danh mục vi phạm</label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                    category === cat.id 
                      ? 'bg-red-500/20 border-red-500 text-red-500' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Bằng chứng số (Tùy chọn)</label>
            <div className="flex gap-2 mb-2">
              <button 
                onClick={() => setEvidenceType('screenshot')}
                className={`flex-1 p-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-2 ${evidenceType === 'screenshot' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-white/5 border-white/10 text-gray-500'}`}
              >
                <Camera size={14} /> Ảnh chụp
              </button>
              <button 
                onClick={() => setEvidenceType('timestamp')}
                className={`flex-1 p-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-2 ${evidenceType === 'timestamp' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/10 text-gray-500'}`}
              >
                <Clock size={14} /> Mốc thời gian
              </button>
            </div>
            {evidenceType !== 'none' && (
              <input 
                type="text"
                value={evidenceValue}
                onChange={(e) => setEvidenceValue(e.target.value)}
                placeholder={evidenceType === 'screenshot' ? "Dán link ảnh bằng chứng..." : "Ví dụ: 02:45 - 03:10..."}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-red-500"
              />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Chi tiết vụ việc</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả cụ thể hành vi vi phạm..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-red-500 min-h-[100px]"
            />
          </div>
        </div>
        
        <button 
          onClick={handleSubmit} 
          disabled={!reason || !targetUser || isAnalyzing}
          className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/20"
        >
          {isAnalyzing ? (
            <>
              <ShieldCheck className="animate-pulse" size={18} />
              Đang phân tích AI...
            </>
          ) : (
            <>
              <Send size={18} />
              Gửi tố cáo ngay
            </>
          )}
        </button>

        <p className="text-[9px] text-gray-500 text-center mt-4 italic">
          * Việc tố cáo sai sự thật có thể dẫn đến việc bị trừ điểm uy tín nặng.
        </p>
      </div>
    </motion.div>
  );
};
