import React, { useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, Reply } from 'lucide-react';

export const FeedbackSystem = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 'f1', user: 'TestUser_01', category: 'bug', content: 'Game thỉnh thoảng bị lag khi vào chế độ Đạp Sơn Hà.', status: 'pending', date: new Date().toLocaleDateString() },
    { id: 'f2', user: 'TestUser_01', category: 'other', content: 'Nên thêm nhiều câu hỏi về thời kỳ nhà Trần hơn.', status: 'pending', date: new Date().toLocaleDateString() },
  ]);

  const handleAction = (id: string, status: 'resolved' | 'rejected') => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Ý kiến phản hồi & Hỗ trợ</h3>
        <button 
          onClick={() => {
            const newFeedback = {
              id: `f${Date.now()}`,
              user: `Player_${Math.floor(Math.random() * 1000)}`,
              category: 'idea',
              content: 'Tôi nghĩ nên thêm chế độ đấu 2v2 để chơi cùng bạn bè!',
              status: 'pending',
              date: new Date().toLocaleDateString()
            };
            setFeedbacks([newFeedback, ...feedbacks]);
          }}
          className="px-4 py-2 bg-[#FF6321] text-black font-bold text-xs rounded-full"
        >
          + Tạo phản hồi Test
        </button>
      </div>

      <div className="space-y-4">
        {feedbacks.map(fb => (
          <div key={fb.id} className={`bg-[#151619] border ${fb.status === 'pending' ? 'border-white/10' : 'border-green-500/30 opacity-50'} p-4 rounded-2xl`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#FF6321]" />
                <span className="text-sm font-bold text-white">{fb.user}</span>
                <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full uppercase text-gray-400">{fb.category}</span>
              </div>
              <span className="text-xs text-gray-500">{fb.date}</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">{fb.content}</p>
            
            {fb.status === 'pending' && (
              <div className="flex gap-2 justify-end border-t border-white/5 pt-3">
                <button onClick={() => handleAction(fb.id, 'resolved')} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-all">
                  <CheckCircle size={14} /> Đã xử lý
                </button>
                <button onClick={() => handleAction(fb.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-all">
                  <XCircle size={14} /> Bỏ qua
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg text-xs font-bold hover:bg-blue-500/30 transition-all">
                  <Reply size={14} /> Phản hồi user
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
