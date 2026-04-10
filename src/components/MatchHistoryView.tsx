import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MatchHistory } from '../types';
import { ShieldCheck, Clock, Download } from 'lucide-react';

interface MatchHistoryViewProps {
  match: MatchHistory;
}

export const MatchHistoryView: React.FC<MatchHistoryViewProps> = ({ match }) => {
  if (!match.stats) return null;

  const data = [
    { subject: 'KDA', A: match.stats.kda * 10, fullMark: 100 },
    { subject: 'Vàng/P', A: match.stats.goldPerMinute / 10, fullMark: 100 },
    { subject: 'Sát Thương', A: match.stats.damageDealt / 100, fullMark: 100 },
    { subject: 'Kiểm Soát', A: match.stats.mapControl, fullMark: 100 },
  ];

  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-white uppercase tracking-widest">Chi tiết trận đấu</h3>
        {match.hasJusticeAction && (
          <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck size={14} /> Môi trường sạch
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Chỉ số" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-400">Dòng thời gian sự kiện</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {match.timeline?.map((event, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-gray-300">
                <Clock size={12} className="text-gray-500" />
                <span className="font-mono text-gray-500">{event.timestamp}</span>
                <span>{event.description}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">
            <Download size={14} /> Tải Replay
          </button>
        </div>
      </div>
    </div>
  );
};
