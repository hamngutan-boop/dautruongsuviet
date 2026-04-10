import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  LifeBuoy, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  ChevronRight, 
  X,
  ShieldCheck,
  HelpCircle,
  Mail
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProgress, SupportTicket } from '../types';

interface SupportCenterProps {
  user: UserProgress;
  onClose: () => void;
  createTicket: (title: string, category: 'bug' | 'payment' | 'account' | 'other', content: string) => void;
  addReply: (ticketId: string, content: string, sender: 'user' | 'system') => void;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ user, onClose, createTicket, addReply }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'chatbot'>('faq');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // Ticket Form State
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'bug' | 'payment' | 'account' | 'other'>('bug');
  const [ticketContent, setTicketContent] = useState('');
  
  // Reply State
  const [replyContent, setReplyContent] = useState('');

  const selectedTicket = user.supportTickets?.find(t => t.id === selectedTicketId);

  const faqs = [
    { q: 'Làm sao để tăng điểm uy tín?', a: 'Bạn có thể tăng điểm uy tín bằng cách hoàn thành các trận đấu mà không rời trận, nhận vinh danh từ người chơi khác, hoặc tham gia các sự kiện cộng đồng.' },
    { q: 'Tại sao tôi bị trừ điểm uy tín?', a: 'Điểm uy tín bị trừ khi bạn rời trận (AFK), có ngôn ngữ không phù hợp, hoặc bị nhiều người chơi tố cáo đúng sự thật.' },
    { q: 'Làm sao để đổi tên nhân vật?', a: 'Bạn cần sở hữu "Thẻ Đổi Tên" trong túi đồ. Bạn có thể mua thẻ này tại Cửa Hàng bằng Ruby.' },
    { q: 'Tôi bị mất kết nối khi đang đấu?', a: 'Hệ thống sẽ cố gắng kết nối lại cho bạn trong 2 phút. Nếu quá thời gian, bạn sẽ bị tính là rời trận.' }
  ];

  const handleCreateTicket = () => {
    if (!ticketTitle || !ticketContent) return;
    createTicket(ticketTitle, ticketCategory, ticketContent);
    setTicketTitle('');
    setTicketContent('');
    setShowCreateTicket(false);
  };

  const handleSendReply = () => {
    if (!replyContent || !selectedTicketId) return;
    addReply(selectedTicketId, replyContent, 'user');
    setReplyContent('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-[#151619] border border-white/10 w-full max-w-4xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              <LifeBuoy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Trung tâm hỗ trợ</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Phản hồi & Giải đáp thắc mắc</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/10 p-4 space-y-2 hidden md:block bg-black/20">
            <button 
              onClick={() => setActiveTab('faq')}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-3 transition-all font-bold text-xs uppercase tracking-widest",
                activeTab === 'faq' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-white/5"
              )}
            >
              <HelpCircle size={18} /> Giải đáp (FAQ)
            </button>
            <button 
              onClick={() => setActiveTab('tickets')}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-3 transition-all font-bold text-xs uppercase tracking-widest",
                activeTab === 'tickets' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-white/5"
              )}
            >
              <Ticket size={18} /> Yêu cầu hỗ trợ
            </button>
            <button 
              onClick={() => setActiveTab('chatbot')}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-3 transition-all font-bold text-xs uppercase tracking-widest",
                activeTab === 'chatbot' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-white/5"
              )}
            >
              <MessageSquare size={18} /> Chatbot AI
            </button>

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase">Uy tín của bạn</span>
              </div>
              <div className="text-2xl font-black text-white">{user.reputation}</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Bậc: {user.reputationTier}</div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-black/40">
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">Câu hỏi thường gặp</h3>
                <div className="grid gap-4">
                  {faqs.map((faq, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all group"
                    >
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        <span className="text-blue-500">Q:</span> {faq.q}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        <span className="text-green-500 font-bold">A:</span> {faq.a}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">Danh sách yêu cầu</h3>
                  <button 
                    onClick={() => setShowCreateTicket(true)}
                    className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all"
                  >
                    Gửi yêu cầu mới
                  </button>
                </div>

                <div className="space-y-3">
                  {user.supportTickets?.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                      <Ticket size={48} className="mx-auto text-gray-700 mb-4" />
                      <p className="text-gray-500 text-xs font-bold uppercase">Bạn chưa có yêu cầu hỗ trợ nào</p>
                    </div>
                  ) : (
                    user.supportTickets?.map((ticket) => (
                      <button 
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={cn(
                          "w-full p-5 rounded-2xl border transition-all flex items-center justify-between group",
                          selectedTicketId === ticket.id ? "bg-blue-500/10 border-blue-500" : "bg-white/5 border-white/10 hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            ticket.status === 'resolved' ? "bg-green-500/20 text-green-500" : 
                            ticket.status === 'investigating' ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                          )}>
                            {ticket.status === 'resolved' ? <CheckCircle2 size={20} /> : 
                             ticket.status === 'investigating' ? <Clock size={20} /> : <AlertCircle size={20} />}
                          </div>
                          <div className="text-left">
                            <h4 className="text-white font-bold text-sm mb-1">{ticket.title}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{ticket.category}</span>
                              <span className="text-[9px] text-gray-600">•</span>
                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{ticket.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chatbot' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-black/20 rounded-3xl border border-white/5 p-6 mb-4 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <MessageSquare size={16} />
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-xs text-white">Xin chào Sử Gia **{user.name}**! Tôi là trợ lý AI của Đấu Trường Sử Việt. Tôi có thể giúp gì cho bạn hôm nay?</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Lỗi nạp thẻ', 'Tố cáo người chơi', 'Quên mật khẩu', 'Sự kiện mới'].map(q => (
                      <button key={q} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập nội dung cần hỗ trợ..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {showCreateTicket && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Gửi yêu cầu hỗ trợ</h3>
                <button onClick={() => setShowCreateTicket(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block">Người gửi</label>
                  <span className="text-xs text-white font-bold">{user.name}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block">UID</label>
                  <span className="text-[10px] text-blue-400 font-mono">{user.uid}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Tiêu đề</label>
                  <input 
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Tóm tắt vấn đề của bạn..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Danh mục</label>
                  <select 
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="bug" className="bg-[#1A1B1E]">Lỗi Game (Bug)</option>
                    <option value="payment" className="bg-[#1A1B1E]">Nạp tiền / Thanh toán</option>
                    <option value="account" className="bg-[#1A1B1E]">Tài khoản / Bảo mật</option>
                    <option value="other" className="bg-[#1A1B1E]">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Nội dung chi tiết</label>
                  <textarea 
                    value={ticketContent}
                    onChange={(e) => setTicketContent(e.target.value)}
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 min-h-[150px]"
                  />
                </div>
              </div>

              <button 
                onClick={handleCreateTicket}
                disabled={!ticketTitle || !ticketContent}
                className="w-full py-4 bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                Gửi yêu cầu ngay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicketId && selectedTicket && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 z-[60] flex items-center justify-end p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-[#1A1B1E] border-l border-white/10 w-full max-w-2xl h-full rounded-l-3xl flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedTicketId(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
                    <X size={24} />
                  </button>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{selectedTicket.title}</h3>
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">#{selectedTicket.id}</span>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  selectedTicket.status === 'resolved' ? "bg-green-500/20 text-green-500" : 
                  selectedTicket.status === 'investigating' ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                )}>
                  {selectedTicket.status}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Original Message */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {user.name[0]}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{user.name}</span>
                    <span className="text-[9px] text-gray-600 ml-auto">{selectedTicket.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedTicket.content}</p>
                </div>

                {/* Replies */}
                {selectedTicket.replies.map((reply, i) => (
                  <div key={i} className={cn(
                    "p-5 rounded-2xl border max-w-[90%]",
                    reply.sender === 'system' ? "bg-blue-500/10 border-blue-500/30 ml-auto" : "bg-white/5 border-white/10"
                  )}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold",
                        reply.sender === 'system' ? "bg-blue-500" : "bg-gray-700"
                      )}>
                        {reply.sender === 'system' ? <ShieldCheck size={12} /> : user.name[0]}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {reply.sender === 'system' ? 'Hệ thống hỗ trợ' : user.name}
                      </span>
                      <span className="text-[9px] text-gray-600 ml-auto">{reply.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{reply.content}</p>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'resolved' && (
                <div className="p-6 border-t border-white/10 bg-black/20">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Nhập phản hồi của bạn..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={handleSendReply}
                      disabled={!replyContent}
                      className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
