import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { adminChat } from '../services/geminiService';

export const AuditSystem = () => {
  const [reports, setReports] = useState([
    { id: 'r1', reportedUser: 'Player123', reason: 'Hack', status: 'pending', aiScore: 0.95, type: 'violation' },
    { id: 'r2', reportedUser: 'User456', reason: 'AFK', status: 'pending', aiScore: 0.4, type: 'violation' },
    { id: 'r3', reportedUser: 'TestUser123', reason: 'Game hay nhưng thỉnh thoảng bị lag ở màn hình chọn tướng. Mong admin fix sớm!', status: 'pending', aiScore: 0.1, type: 'feedback' },
  ]);

  const handleVerify = (id: string, status: 'processed' | 'trash') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">Hệ thống Kiểm tra (AI Filter)</h3>
      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="bg-[#151619] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {report.type === 'feedback' ? <MessageSquare className="text-blue-500" size={20} /> : <AlertCircle className="text-yellow-500" size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {report.reportedUser} <span className="text-[10px] font-normal text-gray-500 px-2 py-0.5 bg-white/10 rounded-full ml-2">{report.type === 'feedback' ? 'Góp ý' : 'Báo cáo'}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-md">{report.type === 'feedback' ? 'Nội dung: ' : 'Lý do: '}{report.reason}</p>
                <p className="text-[10px] text-[#FF6321] mt-2 font-mono">AI Score (Khả năng vi phạm/spam): {(report.aiScore * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleVerify(report.id, 'processed')} className="p-2 bg-green-500/20 text-green-500 rounded-full" title="Duyệt"><CheckCircle size={20} /></button>
              <button onClick={() => handleVerify(report.id, 'trash')} className="p-2 bg-red-500/20 text-red-500 rounded-full" title="Bỏ qua"><XCircle size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
