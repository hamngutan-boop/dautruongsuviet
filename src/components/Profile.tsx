import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Award, Edit3, Save, X, LogOut, Sword, Zap, Heart, Sparkles, BookOpen, Star, Eye, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProgress, CertificateData } from '../types';
import { MatchHistoryView } from './MatchHistoryView';

interface ProfileProps {
  user: UserProgress;
  onClose: () => void;
  logout: () => void;
  toggleShowcaseCertificate: (id: string) => void;
  onViewCertificate: (cert: CertificateData) => void;
  initialTab?: 'info' | 'certificates' | 'history';
}

export const Profile: React.FC<ProfileProps> = ({ user, onClose, logout, toggleShowcaseCertificate, onViewCertificate, initialTab = 'info' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'certificates' | 'history'>(initialTab);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  useEffect(() => {
    const savedBio = localStorage.getItem(`bio_${user.uid}`);
    if (savedBio) {
      setBio(savedBio);
    }
  }, [user.uid]);

  const handleSave = () => {
    localStorage.setItem(`bio_${user.uid}`, bio);
    setIsEditing(false);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Zap size={14} />;
      case 'social': return <Heart size={14} />;
      case 'event': return <Sparkles size={14} />;
      case 'collection': return <BookOpen size={14} />;
      default: return <Award size={14} />;
    }
  };

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5';
      case 'epic': return 'text-purple-500 border-purple-500/30 bg-purple-500/5';
      case 'rare': return 'text-blue-500 border-blue-500/30 bg-blue-500/5';
      default: return 'text-gray-400 border-white/10 bg-white/5';
    }
  };

  const showcasedCerts = user.certificates?.filter(c => user.showcaseCertificateIds?.includes(c.id)) || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <div className="bg-[#1A1B1E] border border-white/10 rounded-[2.5rem] w-full max-w-2xl relative max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6321] to-transparent" />
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-gray-500 hover:text-white transition-all z-10">
          <X size={20} />
        </button>

        <div className="p-8 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="relative group">
            <div className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center mb-4 border-4 transition-all duration-500",
              user.avatarFrame ? `border-[${user.avatarFrame}] shadow-lg` : "border-[#FF6321] bg-[#FF6321]/10"
            )}>
              <User size={56} className="text-[#FF6321]" />
            </div>
            {user.avatarFrame && (
              <div className="absolute -inset-2 border-2 border-yellow-500/50 rounded-full animate-pulse pointer-events-none" />
            )}
          </div>
          
          <h2 className={cn(
            "text-3xl font-black uppercase italic tracking-tighter",
            user.nameColor ? `text-[${user.nameColor}]` : "text-white"
          )}>
            {user.name}
          </h2>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-[#FF6321] font-black uppercase text-[10px] tracking-widest">
                <Award size={12} /> Uy tín
              </div>
              <span className="text-white font-bold text-lg">{user.reputation}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-yellow-500 font-black uppercase text-[10px] tracking-widest">
                <Sword size={12} /> Lực chiến
              </div>
              <span className="text-white font-bold text-lg">{user.combatPower}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-blue-400 font-black uppercase text-[10px] tracking-widest">
                <Star size={12} /> Cấp độ
              </div>
              <span className="text-white font-bold text-lg">{user.level}</span>
            </div>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 mx-8 mt-6 rounded-2xl">
          {(['info', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-[#FF6321] text-black shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              {tab === 'info' ? 'Thông tin' : 'Lịch sử'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Reputation Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                      <ShieldCheck size={12} className="text-blue-500" /> Chỉ số uy tín
                    </h3>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      user.reputationTier === 'Vinh Quang' ? "bg-yellow-500/20 text-yellow-500" :
                      user.reputationTier === 'Tích Cực' ? "bg-green-500/20 text-green-500" :
                      user.reputationTier === 'Ổn Định' ? "bg-blue-500/20 text-blue-500" :
                      user.reputationTier === 'Cảnh Cáo' ? "bg-orange-500/20 text-orange-500" : "bg-red-500/20 text-red-500"
                    )}>
                      {user.reputationTier}
                    </div>
                  </div>
                  <div className="flex items-end gap-3 mb-4">
                    <div className="text-4xl font-black text-white">{user.reputation}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">/ 120 Điểm</div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-6">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(user.reputation / 120) * 100}%` }}
                      className={cn(
                        "h-full bg-gradient-to-r",
                        user.reputation >= 90 ? "from-green-600 to-green-400" :
                        user.reputation >= 70 ? "from-blue-600 to-blue-400" :
                        user.reputation >= 40 ? "from-orange-600 to-orange-400" : "from-red-600 to-red-400"
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Lịch sử biến động</h4>
                    {user.reputationHistory?.length === 0 ? (
                      <p className="text-[10px] text-gray-600 italic">Chưa có biến động uy tín nào.</p>
                    ) : (
                      user.reputationHistory?.slice(0, 3).map((h) => (
                        <div key={h.id} className="flex items-center justify-between text-[10px] p-2 bg-white/5 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className={h.change > 0 ? "text-green-500" : "text-red-500"}>
                              {h.change > 0 ? `+${h.change}` : h.change}
                            </span>
                            <span className="text-gray-400">{h.reason}</span>
                          </div>
                          <span className="text-gray-600 text-[8px]">{h.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Showcase Section */}
                <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-6">
                  <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Star size={14} className="text-[#D4AF37]" /> Bảng Vàng Vinh Danh
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[0, 1, 2, 3, 4].map((i) => {
                      const cert = showcasedCerts[i];
                      return (
                        <div 
                          key={i}
                          onClick={() => cert && onViewCertificate(cert)}
                          className={cn(
                            "aspect-square rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer group relative",
                            cert 
                              ? "bg-[#D4AF37]/20 border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10" 
                              : "bg-white/5 border-dashed border-white/10 text-gray-700 hover:border-white/20"
                          )}
                        >
                          {cert ? getCategoryIcon(cert.type) : <Award size={20} />}
                          {cert && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center border-2 border-[#1A1B1E]">
                              <Star size={10} className="text-black" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tiểu sử sử gia</label>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="text-[#FF6321] hover:scale-110 transition-transform">
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-[#FF6321] transition-all"
                        rows={3}
                        placeholder="Kể về hành trình của bạn..."
                      />
                      <button onClick={handleSave} className="w-full py-3 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-[#FF7A45] transition-all">
                        <Save size={16} /> Lưu thay đổi
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl italic text-gray-300 text-sm leading-relaxed">
                      "{bio || 'Chưa có tiểu sử'}"
                    </div>
                  )}
                </div>

                <button onClick={logout} className="w-full py-4 bg-red-500/10 text-red-500 font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all border border-red-500/20">
                  <LogOut size={18} /> Đăng xuất khỏi hệ thống
                </button>
              </motion.div>
            )}

            {activeTab === 'certificates' && (
              <motion.div 
                key="certs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {user.certificates && user.certificates.length > 0 ? (
              <div className="space-y-8">
                {['skill', 'social', 'event', 'collection'].map(category => {
                  const certs = user.certificates.filter(c => c.type === category);
                  if (certs.length === 0) return null;
                  return (
                    <div key={category} className="space-y-3">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">
                        {category === 'skill' ? 'Kỹ năng' : category === 'social' ? 'Cộng đồng' : category === 'event' ? 'Sự kiện' : 'Bộ sưu tập'}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {certs.map((cert) => {
                          const isShowcased = user.showcaseCertificateIds?.includes(cert.id);
                          return (
                            <div 
                              key={cert.id} 
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                                getRarityClass(cert.rarity)
                              )}
                            >
                              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                {getCategoryIcon(cert.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-sm font-black text-white uppercase truncate">{cert.achievement}</h4>
                                  <span className="text-[8px] font-bold opacity-50 uppercase tracking-widest">{cert.date}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{cert.description || 'Chứng chỉ vinh danh thành tựu.'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => onViewCertificate(cert)}
                                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                                  title="Xem chi tiết"
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  onClick={() => toggleShowcaseCertificate(cert.id)}
                                  className={cn(
                                    "p-2 rounded-lg transition-all",
                                    isShowcased ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-400 hover:text-yellow-500"
                                  )}
                                  title={isShowcased ? "Bỏ trưng bày" : "Trưng bày"}
                                >
                                  <Star size={16} fill={isShowcased ? "currentColor" : "none"} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
                  <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Award size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Bạn chưa đạt được chứng chỉ nào.</p>
                    <p className="text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Hãy tham gia đấu trường để vinh danh!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {user.matchHistory && user.matchHistory.length > 0 ? (
                  user.matchHistory.map((match) => (
                    <div key={match.id} className="space-y-2">
                      <div 
                        onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
                        className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                            match.result === 'win' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          )}>
                            {match.result === 'win' ? 'W' : 'L'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{match.opponentName}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{match.mode || 'Đối kháng'} • {match.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white">{match.score}</p>
                          <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Điểm số</p>
                        </div>
                      </div>
                      {expandedMatchId === match.id && <MatchHistoryView match={match} />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Sword size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Chưa có lịch sử thi đấu.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

