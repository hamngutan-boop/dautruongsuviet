import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, MessageSquare, Search, ArrowRight, BookOpen, Plus, Heart, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Milestone, General, MILESTONES, GENERALS } from '../types';
import { RELATIONSHIPS, RELATIONSHIP_QUESTIONS } from '../constants';
import { chatWithAncestor, analyzeHistoryEvents } from '../services/geminiService'; // Assuming these are in services

const TimelineView = () => {
  const [filter, setFilter] = useState<'All' | 'VN' | 'World'>('All');
  const [selectedEvent, setSelectedEvent] = useState<Milestone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMilestones = MILESTONES.filter(m => {
    const matchesFilter = filter === 'All' || m.category === filter;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.year.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  }).sort((a, b) => a.year - b.year);

  return (
    <div className="pt-24 pb-24 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="max-w-xl">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white italic leading-none">
            Sử Ký <span className="text-[#FF6321]">Visual</span>
          </h1>
          <p className="text-gray-500 text-sm mt-4 font-medium leading-relaxed">
            Khám phá dòng chảy lịch sử qua giao diện tương tác hiện đại. 
            Dữ liệu được tổng hợp từ các nguồn sử liệu uy tín.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Tìm kiếm sự kiện, năm, nhân vật..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-[#1A1B1E] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-[#FF6321] transition-all w-full md:w-80"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'VN', 'World'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  filter === f ? "bg-[#FF6321] border-[#FF6321] text-black shadow-[0_5px_15px_rgba(255,99,33,0.3)]" : "border-white/10 text-gray-500 hover:border-white/30 bg-white/5"
                )}
              >
                {f === 'All' ? 'Tất cả' : f === 'VN' ? 'Việt Nam' : 'Thế Giới'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6321] via-white/10 to-transparent rounded-full" />
        
        <div className="space-y-16 pl-16">
          {filteredMilestones.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[53px] top-2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0B] border-2 border-white/10 flex items-center justify-center group-hover:border-[#FF6321] transition-all duration-500 group-hover:rotate-45">
                  <div className="w-2 h-2 rounded-full bg-[#FF6321] group-hover:scale-150 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => setSelectedEvent(m)}
                className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 cursor-pointer hover:border-[#FF6321]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6321]/5 group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-5xl font-black text-white/5 font-mono absolute top-4 right-8 group-hover:text-[#FF6321]/10 transition-colors">
                      {m.year}
                    </span>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-black text-[#FF6321] font-mono tracking-tighter">{m.year}</span>
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                        {m.category === 'VN' ? 'Sử Việt' : 'Sử Thế Giới'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#FF6321] transition-colors leading-tight">{m.title}</h3>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-[#FF6321]" size={20} />
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                  {m.description}
                </p>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6321]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sự kiện tiêu biểu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={12} className="text-gray-600" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Xem chi tiết</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredMilestones.length === 0 && (
        <div className="text-center py-24">
          <History size={64} className="mx-auto text-gray-800 mb-6" />
          <h3 className="text-xl font-bold text-gray-500">Không tìm thấy sự kiện nào</h3>
          <p className="text-gray-600 text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-[#1A1B1E] border border-white/10 p-10 rounded-[40px] max-w-2xl w-full relative overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FF6321] to-transparent" />
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-5xl font-black text-[#FF6321] font-mono tracking-tighter">{selectedEvent.year}</span>
                    <span className="px-4 py-1 bg-[#FF6321]/10 rounded-full text-[10px] font-black text-[#FF6321] uppercase tracking-widest border border-[#FF6321]/20">
                      {selectedEvent.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử Thế giới'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tight leading-tight">{selectedEvent.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)} 
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Bối cảnh & Diễn biến</h4>
                  <p className="text-gray-300 text-lg leading-relaxed font-medium">{selectedEvent.description}</p>
                </div>

                <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 relative group">
                  <div className="absolute -top-3 left-8 px-4 py-1 bg-[#FF6321] text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                    Giai thoại & Chi tiết
                  </div>
                  <p className="text-sm text-gray-400 italic leading-relaxed">
                    "Dữ liệu đang được cập nhật từ kho lưu trữ quốc gia. Giai thoại này sẽ giúp bạn hiểu sâu hơn về tầm vóc và ý nghĩa của sự kiện lịch sử này trong dòng chảy thời đại."
                  </p>
                  <div className="mt-6 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF6321] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#FF6321] animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-[#FF6321] animate-bounce delay-200" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#FF6321] text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-[#FF7A45] transition-all">
                    Lưu vào bộ sưu tập
                  </button>
                  <button className="px-8 bg-white/5 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 border border-white/10 transition-all">
                    Chia sẻ
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LearningPath = ({ weakness, onSelectQuestion, onStartPractice }: { 
  weakness: string, 
  onSelectQuestion: (q: string) => void,
  onStartPractice: (category: string, periods: string[]) => void
}) => {
  const suggestions = {
    'Lịch sử thế giới': [
      { title: 'Văn minh Cổ đại', desc: 'Khám phá Ai Cập, Hy Lạp, La Mã và những kỳ quan.', question: 'Kể tên các kỳ quan thế giới cổ đại?', category: 'World', period: 'Cổ đại Thế giới' },
      { title: 'Đêm trường Trung cổ', desc: 'Thời kỳ phong kiến phương Tây và Thập tự chinh.', question: 'Đặc điểm của chế độ phong kiến Tây Âu?', category: 'World', period: 'Trung đại Thế giới' },
      { title: 'Cách mạng công nghiệp', desc: 'Sự thay đổi của thế giới qua các cuộc cách mạng.', question: 'Tóm tắt các cuộc cách mạng công nghiệp?', category: 'World', period: 'Cận đại Thế giới' }
    ],
    'Lịch sử Việt Nam': [
      { title: 'Các triều đại phong kiến', desc: 'Hệ thống lại các triều đại từ Ngô đến Nguyễn.', question: 'Kể tên các triều đại phong kiến Việt Nam?', category: 'VN', period: 'Phong kiến (Đại Việt)' },
      { title: 'Kháng chiến chống Pháp', desc: 'Các giai đoạn quan trọng từ 1858 đến 1954.', question: 'Các giai đoạn chính của kháng chiến chống Pháp?', category: 'VN', period: 'Hiện đại' },
      { title: 'Công cuộc đổi mới', desc: 'Sự thay đổi của đất nước từ năm 1986.', question: 'Ý nghĩa của công cuộc Đổi mới 1986?', category: 'VN', period: 'Hiện đại' }
    ]
  };

  const path = suggestions[weakness as keyof typeof suggestions] || [];

  return (
    <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#FF6321] rounded-lg text-black">
          <BookOpen size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Lộ trình học tập cá nhân hóa</h3>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Dựa trên điểm yếu: {weakness}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {path.map((item, i) => (
          <div 
            key={i} 
            className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-[#FF6321]/50 transition-all group"
          >
            <h4 className="text-sm font-bold text-white group-hover:text-[#FF6321]">{item.title}</h4>
            <p className="text-[10px] text-gray-400 mt-1 mb-4">{item.desc}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => onSelectQuestion(item.question)}
                className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Hỏi AI
              </button>
              <button 
                onClick={() => onStartPractice(item.category, [item.period])}
                className="flex-1 py-2 bg-[#FF6321] rounded-lg text-[9px] font-bold text-black uppercase tracking-widest hover:bg-[#FF7A45] transition-all"
              >
                Luyện tập
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder for AIChatView, will implement next
const AIChatView = ({ user, updateWeaknesses, onStartPractice, updateRelationship, updateQuestProgress }: any) => {
  const [selectedAncestor, setSelectedAncestor] = useState<General | null>(null);
  const [messages, setMessages] = useState<{ role: string, parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);
  const [relationship, setRelationship] = useState('Người hậu thế');
  const [eventA, setEventA] = useState('');
  const [eventB, setEventB] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  const currentRelationship = selectedAncestor ? user.relationships?.[selectedAncestor.id] : null;

  const handleEstablishRelationship = async () => {
    if (!selectedAncestor) return;
    setLoading(true);
    const requestMsg = `Ta muốn thiết lập mối quan hệ "${relationship}" với người. Người có đồng ý không?`;
    const userMsg = { role: 'user', parts: [{ text: requestMsg }] };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await chatWithAncestor(selectedAncestor.name, requestMsg, messages, relationship);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
      
      const positiveWords = ['đồng ý', 'chấp thuận', 'vinh dự', 'sẵn lòng', 'ta cũng vậy'];
      const isAgreed = positiveWords.some(word => response.toLowerCase().includes(word));

      if (isAgreed) {
        const anniversary = new Date().toLocaleDateString('vi-VN');
        updateRelationship(selectedAncestor.id, relationship, anniversary, true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || !selectedAncestor) return;
    const userMsg = { role: 'user', parts: [{ text: messageText }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAncestor(selectedAncestor.name, messageText, messages, relationship);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
      updateQuestProgress('ai_chat');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!eventA || !eventB) return;
    setLoading(true);
    try {
      const res = await analyzeHistoryEvents(eventA, eventB);
      setAnalysisResult(res);
      updateQuestProgress('ai_chat');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Sử Gia AI</h1>
          <button 
            onClick={() => setAnalysisMode(!analysisMode)}
            className="text-[10px] font-bold text-[#FF6321] uppercase border border-[#FF6321] px-3 py-1 rounded-full hover:bg-[#FF6321] hover:text-black transition-all"
          >
            {analysisMode ? 'Trò chuyện' : 'Phân tích sự kiện'}
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-2">Hỏi đáp với các nhân vật lịch sử hoặc phân tích chuyên sâu.</p>
      </div>

      {!analysisMode ? (
        <>
          {!selectedAncestor ? (
            <div className="flex-1 overflow-y-auto pb-8">
              {user.weaknesses && user.weaknesses.length > 0 && (
                <LearningPath 
                  weakness={user.weaknesses[0]} 
                  onSelectQuestion={(q) => {
                    // Find a relevant ancestor for the question
                    const ancestor = GENERALS.find(g => g.id === 'ho-chi-minh') || GENERALS[0];
                    setSelectedAncestor(ancestor);
                    handleSend(q);
                  }}
                  onStartPractice={onStartPractice}
                />
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GENERALS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAncestor(a)}
                    className="p-6 bg-[#1A1B1E] border border-white/10 rounded-2xl text-white font-bold hover:border-[#FF6321] transition-all flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                    </div>
                    <div className="text-center">
                      <p className="text-sm">{a.name}</p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold mt-1">{a.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-[#1A1B1E] border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FF6321]">
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold leading-none">{selectedAncestor.name}</span>
                      {currentRelationship?.isConfirmed ? (
                        <div className="flex items-center gap-1 bg-[#FF6321]/20 px-1.5 py-0.5 rounded text-[8px] text-[#FF6321] font-bold border border-[#FF6321]/30">
                          <Heart size={8} fill="#FF6321" />
                          <span>{currentRelationship.type}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={handleEstablishRelationship}
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#FF6321] text-black rounded-full hover:scale-105 transition-all shadow-lg shadow-[#FF6321]/20"
                        >
                          <Plus size={10} strokeWidth={3} />
                          <span className="text-[9px] font-black uppercase">Thiết lập quan hệ</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <select 
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="bg-transparent text-[10px] text-[#FF6321] font-bold uppercase tracking-widest outline-none cursor-pointer"
                        disabled={currentRelationship?.isConfirmed}
                      >
                        {RELATIONSHIPS.map(r => (
                          <option key={r.id} value={r.label} className="bg-[#1A1B1E] text-white">{r.label}</option>
                        ))}
                      </select>
                      {currentRelationship?.isConfirmed && (
                        <div className="flex items-center gap-1 text-[8px] text-gray-500 font-bold uppercase">
                          <CalendarIcon size={8} />
                          <span>Từ: {currentRelationship.anniversary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSelectedAncestor(null); setMessages([]); }} className="text-xs text-gray-500 hover:text-white uppercase font-bold">Đổi nhân vật</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="space-y-4">
                    {selectedAncestor.suggestedQuestions && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Câu hỏi gợi ý:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedAncestor.suggestedQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(q)}
                              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:border-[#FF6321] hover:text-[#FF6321] transition-all text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Gợi ý theo quan hệ ({relationship}):</p>
                      <div className="flex flex-wrap gap-2">
                        {RELATIONSHIP_QUESTIONS[relationship]?.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(q)}
                            className="px-4 py-2 bg-[#FF6321]/10 border border-[#FF6321]/30 rounded-xl text-xs text-[#FF6321] hover:bg-[#FF6321]/20 transition-all text-left"
                          >
                            {q}
                          </button>
                        ))}
                        <button 
                          onClick={() => handleSend(`Với tư cách là ${relationship}, người có lời khuyên nào cho ta không?`)} 
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:border-[#FF6321] transition-all"
                        >
                          Lời khuyên cho ta
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      m.role === 'user' ? "bg-[#FF6321] text-black font-medium" : "bg-white/5 text-gray-300"
                    )}>
                      {m.parts[0].text}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-xs text-gray-500 italic animate-pulse">Đang hồi đáp...</div>}
              </div>
              <div className="p-4 bg-white/5 border-t border-white/10">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập câu hỏi..."
                  className="w-full bg-[#1A1B1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6321]"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col bg-[#1A1B1E] border border-white/10 rounded-3xl p-6">
          <div className="space-y-4">
            <input type="text" value={eventA} onChange={e => setEventA(e.target.value)} placeholder="Sự kiện A..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
            <input type="text" value={eventB} onChange={e => setEventB(e.target.value)} placeholder="Sự kiện B..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
            <button onClick={handleAnalyze} className="w-full bg-[#FF6321] text-black font-bold py-3 rounded-xl">Phân tích</button>
          </div>
          {analysisResult && <p className="text-gray-300 mt-6 text-sm">{analysisResult}</p>}
        </div>
      )}
    </div>
  );
};


export const SuHaView = ({ user, updateWeaknesses, onStartPractice, updateRelationship, updateQuestProgress }: any) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'ai'>('timeline');

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <div className="flex bg-[#1A1B1E] p-1 rounded-2xl border border-white/10 mb-8">
        <button 
          onClick={() => setActiveTab('timeline')}
          className={cn("flex-1 py-3 text-xs font-bold uppercase rounded-xl transition-all", activeTab === 'timeline' ? "bg-[#FF6321] text-black" : "text-gray-500")}
        >
          Sử Ký
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={cn("flex-1 py-3 text-xs font-bold uppercase rounded-xl transition-all", activeTab === 'ai' ? "bg-[#FF6321] text-black" : "text-gray-500")}
        >
          Sử Gia AI
        </button>
      </div>

      {activeTab === 'timeline' ? <TimelineView /> : <AIChatView user={user} updateWeaknesses={updateWeaknesses} onStartPractice={onStartPractice} updateRelationship={updateRelationship} updateQuestProgress={updateQuestProgress} />}
    </div>
  );
};
