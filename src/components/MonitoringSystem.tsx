import React, { useState } from 'react';
import { Play, AlertTriangle, Video, Search, Filter, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const MonitoringSystem = () => {
  const [filter, setFilter] = useState<'All' | 'Hack' | 'AFK' | 'Spam'>('All');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const logs = [
    { id: 1, user: 'Player123', action: 'Hack tốc độ', time: '10:45:01', type: 'Hack', details: 'Phát hiện tốc độ di chuyển bất thường trong trận đấu #9982' },
    { id: 2, user: 'User456', action: 'AFK trong trận', time: '10:44:20', type: 'AFK', details: 'Người chơi không di chuyển trong 3 phút tại trận #9981' },
    { id: 3, user: 'Spammer789', action: 'Spam chat', time: '10:43:10', type: 'Spam', details: 'Gửi 50 tin nhắn trong 10 giây' },
  ];

  const filteredLogs = filter === 'All' ? logs : logs.filter(l => l.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Live Game Logs</h3>
        <div className="flex gap-2">
          {['All', 'Hack', 'AFK', 'Spam'].map(f => (
            <button key={f} onClick={() => setFilter(f as any)} className={cn("px-3 py-1 rounded-full text-xs font-bold", filter === f ? "bg-[#FF6321] text-black" : "bg-white/5 text-gray-400")}>{f}</button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredLogs.map(log => (
          <div key={log.id} className="bg-[#151619] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={cn(log.type === 'Hack' ? 'text-red-500' : 'text-yellow-500')} size={20} />
                <div>
                  <p className="text-sm font-bold text-white">{log.user}</p>
                  <p className="text-xs text-gray-400">{log.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white/5 rounded-full hover:bg-[#FF6321]/20 text-gray-400 hover:text-[#FF6321]" title="Quay màn hình"><Video size={16} /></button>
                <div className="text-xs text-gray-500 font-mono">{log.time}</div>
              </div>
            </div>
            {selectedLog?.id === log.id && (
              <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-300">
                <p>{log.details}</p>
                <button className="mt-2 text-[#FF6321] font-bold">Hỏi trợ thủ AI về log này</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
