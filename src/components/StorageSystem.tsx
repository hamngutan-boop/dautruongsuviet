import React, { useState, useEffect } from 'react';
import { Database, FileImage, FileVideo, FileText, Download, Trash2, MessageSquare, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export const StorageSystem = ({ user, addTicketReply, addMail }: any) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'logs' | 'feedback'>('evidence');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [allTickets, setAllTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = () => {
      const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
      const tickets: any[] = [];
      for (const [uid, userData] of Object.entries(usersDb)) {
        const u = userData as any;
        if (u.supportTickets && Array.isArray(u.supportTickets)) {
          u.supportTickets.forEach((t: any) => {
            // Ensure each ticket has the latest uid and username from the user object
            tickets.push({ ...t, uid: u.uid || uid, username: u.name });
          });
        }
      }
      tickets.sort((a, b) => {
        // Simple string comparison for dates, assuming format 'DD/MM/YYYY, HH:mm:ss'
        // For a more robust solution, parse the dates properly.
        return b.id.localeCompare(a.id); // Fallback to ID sorting which has timestamp
      });
      setAllTickets(tickets);
    };

    fetchTickets();
    // Refresh every 5 seconds
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReply = (ticketId: string, uid: string, username: string) => {
    const content = replyContent[ticketId];
    if (!content?.trim()) return;

    const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
    const targetUser = usersDb[uid];
    
    if (targetUser) {
      // Update ticket in target user's data
      targetUser.supportTickets = targetUser.supportTickets.map((t: any) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'investigating',
            updatedAt: new Date().toLocaleString('vi-VN'),
            replies: [...(t.replies || []), { sender: 'system', content, date: new Date().toLocaleString('vi-VN') }]
          };
        }
        return t;
      });

      // Add mail to target user
      const newMail = {
        id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'Admin',
        title: 'Phản hồi từ Admin',
        content: `Chào ${username},\n\nAdmin đã phản hồi ý kiến của bạn:\n"${content}"\n\nCảm ơn bạn đã đóng góp!`,
        isRead: false,
        date: new Date().toLocaleDateString('vi-VN'),
        type: 'system'
      };
      
      // Ensure no duplicate IDs in mailbox
      const currentMailbox = targetUser.mailbox || [];
      targetUser.mailbox = [newMail, ...currentMailbox.filter((m: any) => m.id !== newMail.id)];

      // Save back to DB
      usersDb[uid] = targetUser;
      localStorage.setItem('dau_truong_su_viet_users_db', JSON.stringify(usersDb));

      // Update local state
      setAllTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'investigating',
            replies: [...(t.replies || []), { sender: 'system', content, date: new Date().toLocaleString('vi-VN') }]
          };
        }
        return t;
      }));
    }

    // Clear input
    setReplyContent(prev => ({ ...prev, [ticketId]: '' }));
  };

  const evidenceList = [
    { id: 'ev_001', reportId: 'r1', type: 'video', url: 'hack_speed_record.mp4', date: '2026-04-04 10:45', size: '15.2 MB' },
    { id: 'ev_002', reportId: 'r2', type: 'image', url: 'chat_spam_screenshot.png', date: '2026-04-04 10:43', size: '1.5 MB' },
  ];

  const logList = [
    { id: 'log_001', userId: 'Player123', action: 'System Login', date: '2026-04-04 08:00', details: 'IP: 192.168.1.1' },
    { id: 'log_002', userId: 'User456', action: 'Match Completed', date: '2026-04-04 08:15', details: 'Match ID: #9981' },
    { id: 'log_003', userId: 'System', action: 'Daily Backup', date: '2026-04-04 00:00', details: 'Size: 2.4 GB, Status: Success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('evidence')}
          className={cn("font-bold text-sm transition-colors", activeTab === 'evidence' ? "text-[#FF6321]" : "text-gray-500 hover:text-white")}
        >
          Bằng Chứng (Evidence)
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={cn("font-bold text-sm transition-colors", activeTab === 'logs' ? "text-[#FF6321]" : "text-gray-500 hover:text-white")}
        >
          Nhật Ký (Logs)
        </button>
        <button 
          onClick={() => setActiveTab('feedback')}
          className={cn("font-bold text-sm transition-colors", activeTab === 'feedback' ? "text-[#FF6321]" : "text-gray-500 hover:text-white")}
        >
          Phản Hồi (Feedback)
        </button>
      </div>

      {activeTab === 'evidence' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceList.map(item => (
            <div key={item.id} className="bg-[#151619] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-gray-400">
                  {item.type === 'video' ? <FileVideo size={24} /> : <FileImage size={24} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.url}</p>
                  <p className="text-xs text-gray-500">Report ID: {item.reportId} • {item.size}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] text-gray-500">{item.date}</span>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"><Download size={14} /></button>
                  <button className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-2">
          {logList.map(log => (
            <div key={log.id} className="bg-[#151619] border border-white/5 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText size={16} className="text-gray-500" />
                <div>
                  <p className="text-sm font-bold text-white">[{log.userId}] {log.action}</p>
                  <p className="text-xs text-gray-500">{log.details}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-mono">{log.date}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {(!allTickets || allTickets.length === 0) ? (
            <p className="text-gray-500 text-center py-8">Chưa có phản hồi nào từ người dùng.</p>
          ) : (
            allTickets.map((ticket: any) => (
              <div key={ticket.id} className="bg-[#151619] border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-[#FF6321]" />
                    <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{ticket.createdAt}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Người gửi: <span className="text-white">{ticket.username}</span>
                </div>
                <p className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg">{ticket.content}</p>
                
                {ticket.replies && ticket.replies.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {ticket.replies.map((reply: any, idx: number) => (
                      <div key={idx} className={cn(
                        "text-xs p-3 rounded-lg",
                        reply.sender === 'system' ? "bg-[#FF6321]/10 text-[#FF6321] border border-[#FF6321]/20" : "bg-white/5 text-gray-300"
                      )}>
                        <span className="font-bold">{reply.sender === 'system' ? 'Admin' : 'Người chơi'}: </span>
                        {reply.content}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <input 
                    type="text"
                    value={replyContent[ticket.id] || ''}
                    onChange={(e) => setReplyContent(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                    placeholder="Nhập phản hồi cho người chơi..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6321]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleReply(ticket.id, ticket.uid, ticket.username);
                    }}
                  />
                  <button 
                    onClick={() => handleReply(ticket.id, ticket.uid, ticket.username)}
                    disabled={!replyContent[ticket.id]?.trim()}
                    className="bg-[#FF6321] text-black px-3 py-2 rounded-lg hover:bg-[#FF7A45] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={14} />
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Phân loại: <span className="text-white">{ticket.category}</span>
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
                    ticket.status === 'pending' ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500"
                  )}>
                    {ticket.status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
