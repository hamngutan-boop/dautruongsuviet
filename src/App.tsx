import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Profile } from './components/Profile';
import { SuHaView } from './components/SuHaView';
import { Report } from './components/Report';
import { SupportCenter } from './components/SupportCenter';
import { AIChat } from './components/AIChat';
import { Certificate } from './components/Certificate';
import { StoryIntro } from './components/StoryIntro';
import { PetSystem } from './components/PetSystem';
import { RELATIONSHIPS, RELATIONSHIP_QUESTIONS, SHOP_ITEMS, STORY_DATA, LEARNING_DOCUMENTS } from './constants';
import { StartButtonHub } from './components/StartButtonHub';
import { SmartHub } from './components/SmartHub';
import { NotificationHub } from './components/NotificationHub';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  Sword, 
  Map as MapIcon, 
  MessageSquare, 
  ShoppingBag, 
  Trophy, 
  User as UserIcon,
  ChevronRight,
  History,
  Zap,
  Shield,
  Volume2,
  Search,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Award,
  Settings,
  Fingerprint,
  Copy,
  Plus,
  Heart,
  LifeBuoy,
  ChevronUp,
  ArrowUpCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserPlus,
  Users,
  Send,
  Crown,
  Book,
  Music,
  Dices,
  Coins,
  Mail,
  Package,
  Gem,
  Gift,
  Grid3X3,
  X,
  Flame,
  Star,
  Type,
  Mountain,
  Cpu,
  Eye,
  FileText,
  Sparkles,
  Download,
  Printer,
  Share2,
  LogOut,
  Play,
  ChevronLeft,
  ChevronDown,
  Quote,
  Clock,
  MapPin,
} from 'lucide-react';
import { cn } from './lib/utils';
import { useUserProgress } from './hooks/useUserProgress';
import { GENERALS, MILESTONES, QUIZ_DATA, CHARACTER_QUIZ_DATA, EPITHET_QUIZ_DATA, EVENT_GUESSING_DATA, CHRONOLOGICAL_DATA, DYNASTY_DATA, CAMPAIGN_DATA, Milestone, General, QuizQuestion, CharacterQuizQuestion, EpithetQuizQuestion, EventGuessingQuestion, ChronologicalQuestion, DynastyQuestion, SpeedModeConfig, Item, CertificateData } from './types';
import { chatWithAncestor, analyzeHistoryEvents } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

import { soundManager } from './lib/sounds';

// --- Components ---

const TimelineView = ({ onStartPractice, onClose }: { onStartPractice: (category: string, periods: string[]) => void, onClose: () => void }) => {
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<'VN' | 'World'>('VN');
  const [viewingEraDocs, setViewingEraDocs] = useState<string | null>(null);

  const filteredEras = STORY_DATA.eras.filter(era => era.category === activeCategory);

  const toggleEra = (eraName: string) => {
    setSelectedEras(prev => 
      prev.includes(eraName) 
        ? prev.filter(e => e !== eraName) 
        : [...prev, eraName]
    );
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Sử Ký Toàn Thư</h1>
          <p className="text-gray-400 text-sm mt-2">Khám phá các thời kỳ lịch sử hào hùng của dân tộc và thế giới. (Chọn nhiều thời kỳ để ôn tập)</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveCategory('VN')}
          className={cn(
            "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2",
            activeCategory === 'VN' ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
          )}
        >
          Lịch Sử Việt Nam
        </button>
        <button 
          onClick={() => setActiveCategory('World')}
          className={cn(
            "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2",
            activeCategory === 'World' ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
          )}
        >
          Lịch Sử Thế Giới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEras.map((era, index) => {
          const isSelected = selectedEras.includes(era.name);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all group relative overflow-hidden flex flex-col",
                isSelected ? "border-[#FF6321] bg-[#FF6321]/10" : "border-white/10 bg-[#1A1B1E] hover:border-white/30"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  onClick={() => toggleEra(era.name)}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform cursor-pointer",
                    isSelected ? "bg-[#FF6321] text-black" : "bg-[#FF6321]/10 text-[#FF6321] group-hover:scale-110"
                  )}
                >
                  {isSelected ? <CheckCircle2 size={24} /> : <History size={24} />}
                </div>
                <button 
                  onClick={() => setViewingEraDocs(era.name)}
                  className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-[#FF6321] hover:bg-[#FF6321]/10 transition-all"
                  title="Xem tài liệu"
                >
                  <BookOpen size={18} />
                </button>
              </div>
              <div onClick={() => toggleEra(era.name)} className="cursor-pointer flex-1">
                <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tight">{era.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{era.description}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#FF6321] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {isSelected ? 'Đã chọn' : 'Chọn thời kỳ này'} <ArrowRight size={12} />
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Giai đoạn {index + 1}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {viewingEraDocs && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1B1E] border border-[#FF6321]/30 p-8 rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setViewingEraDocs(null)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321]">
                  <Book size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{viewingEraDocs}</h2>
                  <p className="text-[#FF6321] text-[10px] font-black uppercase tracking-widest mt-1">Tài liệu học tập • {activeCategory === 'VN' ? 'Sử Việt' : 'Sử Thế Giới'}</p>
                </div>
              </div>

              <div className="space-y-8">
                {LEARNING_DOCUMENTS[viewingEraDocs] ? (
                  LEARNING_DOCUMENTS[viewingEraDocs].map((doc, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <h4 className="text-lg font-black text-white uppercase italic mb-3 flex items-center gap-2">
                        <Zap size={16} className="text-[#FF6321]" /> {doc.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{doc.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Dữ liệu đang được cập nhật...</p>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex justify-center">
                <button 
                  onClick={() => setViewingEraDocs(null)}
                  className="px-12 py-4 bg-white/5 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
                >
                  Đóng tài liệu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEras.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className="bg-[#1A1B1E] border border-[#FF6321]/30 p-6 rounded-[2.5rem] shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321]">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase italic text-sm">Đã chọn {selectedEras.length} thời kỳ</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sẵn sàng ôn tập</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEras([])}
                  className="text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-widest"
                >
                  Xóa tất cả
                </button>
              </div>
              <button 
                onClick={() => onStartPractice(activeCategory, selectedEras)}
                className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF7A45] transition-all shadow-lg shadow-[#FF6321]/20"
              >
                Bắt đầu ôn tập
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ user, logout, onShowTutorial, setActiveTab, setLevel, onShowProfile, setShowStory, setShowPetSystem, isFocusMode }: any) => {
  const [showRuby, setShowRuby] = useState(false);
  const currentExp = (user.points || 0) % 500;
  const expPercentage = (currentExp / 500) * 100;

  return (
  <header className={cn("fixed top-0 left-0 right-0 bg-[#151619]/80 backdrop-blur-md border-b border-white/10 p-4 z-50 transition-all", isFocusMode && "opacity-0 hover:opacity-100")}>
    <div className="w-full max-w-7xl mx-auto flex justify-between items-center gap-4">
      <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={onShowProfile}>
        <div className="w-10 h-10 rounded-full bg-[#FF6321] flex items-center justify-center font-bold text-black shrink-0 relative">
          {user.name ? user.name[0].toUpperCase() : '?'}
          {user.selectedPetId && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1A1B1E] rounded-full border border-[#FF6321] flex items-center justify-center overflow-hidden">
              <div className="text-[8px] font-black text-[#FF6321]">🐾</div>
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-bold text-white leading-none flex items-center gap-2 truncate">
            {user.name}
            {user.selectedTitle && (
              <span className="text-[9px] bg-[#FF6321]/20 text-[#FF6321] px-1.5 py-0.5 rounded border border-[#FF6321]/30 shrink-0">
                {user.selectedTitle}
              </span>
            )}
          </h2>
          <div className="text-[10px] text-[#FF6321] uppercase font-bold tracking-widest mt-1 flex items-center gap-1 truncate">
            Rank: {user.rank} • 
            <span 
              onClick={(e) => {
                e.stopPropagation();
                if (user.level < 100) {
                  setLevel(100);
                  soundManager.play('success');
                }
              }}
              className="cursor-pointer hover:text-white transition-colors"
              title="Click to Buff Level 100"
            >
              LVL {user.level}
            </span> 
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden relative" title={`${currentExp} / 500 EXP`}>
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF6321] to-yellow-500 transition-all duration-500"
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
          <button 
            onClick={() => setShowStory(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6321]/10 hover:bg-[#FF6321]/20 rounded-lg text-[10px] font-bold text-[#FF6321] transition-all border border-[#FF6321]/30"
          >
            <BookOpen size={14} /> Cốt Truyện
          </button>
          <button 
            onClick={() => setShowPetSystem(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-all border border-white/10"
          >
            <Zap size={14} /> Linh Thú
          </button>
        </div>
        <div className="flex items-center gap-4 mr-2">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-end gap-1"><Coins size={10} className="text-yellow-500"/> Vàng</p>
            <p className="text-sm font-mono font-bold text-yellow-500">{(user.gold || 0).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-end gap-1"><Gem size={10} className="text-rose-500"/> Ruby</p>
            <p className="text-sm font-mono font-bold text-rose-500">{(user.ruby || 0).toLocaleString()}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Điểm</p>
            <p className="text-sm font-mono font-bold text-white">{(user.points || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isFocusMode && <NotificationHub user={user} setActiveTab={setActiveTab} onShowTutorial={onShowTutorial} />}
          <button 
            onClick={() => setActiveTab('settings')} 
            className="p-2 text-gray-500 hover:text-[#FF6321] transition-colors"
            title="Cài đặt"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={onShowProfile} 
            className="p-2 text-gray-500 hover:text-[#FF6321] transition-colors"
            title="Hồ sơ người dùng"
          >
            <UserIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  </header>
  );
};

const TutorialOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const steps = [
    { title: "Chào mừng Tân Thủ!", content: "Chào mừng bạn đến với Đấu Trường Sử Việt. Hãy cùng khám phá cách trở thành một Sử Gia vĩ đại." },
    { title: "Chọn Tướng", content: "Mỗi vị tướng có kỹ năng riêng. Hãy chọn người phù hợp với chiến thuật của bạn." },
    { title: "Đấu Trường", content: "Trả lời câu hỏi lịch sử để gây sát thương. Có 3 chế độ: Sơ, Trung, Cao." },
    { title: "Bang Hội & Bạn Bè", content: "Gia nhập Bang hội để cùng nhau vượt phó bản toàn server." }
  ];
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1A1B1E] border border-[#FF6321] p-8 rounded-3xl max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-black text-[#FF6321] uppercase italic mb-4">{steps[step].title}</h2>
        <p className="text-gray-300 mb-8">{steps[step].content}</p>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500 font-bold uppercase">Bước {step + 1} / {steps.length}</span>
          <button 
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
            className="px-6 py-2 bg-[#FF6321] text-black font-bold uppercase text-xs rounded-xl"
          >
            {step < steps.length - 1 ? 'Tiếp theo' : 'Bắt đầu ngay'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const WordSearchView = ({ user, addPoints, onBack }: any) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordsToFind, setWordsToFind] = useState<{ word: string, original: string, found: boolean, positions?: { r: number, c: number }[] }[]>([]);
  const [selectionStart, setSelectionStart] = useState<{ r: number, c: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ r: number, c: number } | null>(null);
  const [foundCells, setFoundCells] = useState<{ r: number, c: number }[]>([]);
  const [score, setScore] = useState(0);

  const normalize = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/\s+/g, '').toUpperCase();
  };

  const initializeGame = () => {
    const historicalNames = [
      "HỒ CHÍ MINH", "VÕ NGUYÊN GIÁP", "LÊ LỢI", "TRẦN HƯNG ĐẠO", 
      "NGUYỄN TRÃI", "QUANG TRUNG", "BÀ TRIỆU", "LÝ THÁI TỔ", 
      "LÝ THƯỜNG KIỆT", "TRẦN THỦ ĐỘ", "NGUYỄN TRUNG TRỰC", "NGÔ QUYỀN",
      "ĐINH TIÊN HOÀNG", "LÊ THÁNH TÔNG", "MINH MẠNG", "HÀM NGHI"
    ];
    
    const selected = historicalNames.sort(() => 0.5 - Math.random()).slice(0, 6);
    const words = selected.map(name => ({
      word: normalize(name),
      original: name,
      found: false,
      positions: [] as { r: number, c: number }[]
    }));

    const size = 12;
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(''));
    const alphabet = "AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY";

    // Directions: [dr, dc]
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal Down-Right
      [-1, 1],  // Diagonal Up-Right
      [0, -1],  // Horizontal Reverse
      [-1, 0],  // Vertical Reverse
    ];

    // Place words
    words.forEach((wordObj) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 300) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const dr = dir[0];
        const dc = dir[1];
        
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        
        const endR = r + dr * (wordObj.word.length - 1);
        const endC = c + dc * (wordObj.word.length - 1);

        if (endR >= 0 && endR < size && endC >= 0 && endC < size) {
          let canPlace = true;
          const tempPositions = [];
          for (let i = 0; i < wordObj.word.length; i++) {
            const currR = r + dr * i;
            const currC = c + dc * i;
            if (newGrid[currR][currC] !== '' && newGrid[currR][currC] !== wordObj.word[i]) {
              canPlace = false;
              break;
            }
            tempPositions.push({ r: currR, c: currC });
          }
          
          if (canPlace) {
            for (let i = 0; i < wordObj.word.length; i++) {
              newGrid[r + dr * i][c + dc * i] = wordObj.word[i];
            }
            wordObj.positions = tempPositions;
            placed = true;
          }
        }
        attempts++;
      }
    });

    // Fill empty cells
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
    setWordsToFind(words);
    setSelectionStart(null);
    setSelectionEnd(null);
    setFoundCells([]);
    setScore(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const getSelectionLine = (start: { r: number, c: number }, end: { r: number, c: number }) => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    
    if (steps === 0) return [start];
    
    // Check if it's a valid straight line (H, V, or 45-deg Diagonal)
    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);
    
    if (!isHorizontal && !isVertical && !isDiagonal) return null;
    
    const stepR = dr / steps;
    const stepC = dc / steps;
    
    const line = [];
    for (let i = 0; i <= steps; i++) {
      line.push({
        r: Math.round(start.r + stepR * i),
        c: Math.round(start.c + stepC * i)
      });
    }
    return line;
  };

  const handleCellClick = (r: number, c: number) => {
    if (!selectionStart) {
      setSelectionStart({ r, c });
      setSelectionEnd({ r, c });
      soundManager.play('click');
    } else {
      const line = getSelectionLine(selectionStart, { r, c });
      if (line) {
        const selectedWord = line.map(cell => grid[cell.r][cell.c]).join('');
        const reversedWord = [...line].reverse().map(cell => grid[cell.r][cell.c]).join('');
        
        const matchedWordIndex = wordsToFind.findIndex(w => !w.found && (w.word === selectedWord || w.word === reversedWord));
        
        if (matchedWordIndex !== -1) {
          soundManager.play('success');
          const newWords = [...wordsToFind];
          newWords[matchedWordIndex].found = true;
          setWordsToFind(newWords);
          setFoundCells([...foundCells, ...line]);
          setScore(s => s + 100);
          addPoints(100, 'solo');
        } else {
          soundManager.play('click'); // Or a fail sound if available
        }
      }
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  const handleCellHover = (r: number, c: number) => {
    if (selectionStart) {
      setSelectionEnd({ r, c });
    }
  };

  const currentSelectionLine = selectionStart && selectionEnd ? getSelectionLine(selectionStart, selectionEnd) : null;

  const isGameComplete = wordsToFind.length > 0 && wordsToFind.every(w => w.found);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6321]/20 flex items-center justify-center border border-[#FF6321]/30">
            <Search className="text-[#FF6321]" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic leading-none">Tìm Chữ Trong Ô Chữ</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Tìm tên các vị anh hùng dân tộc</p>
          </div>
        </div>
        <div className="bg-[#1A1B1E] px-6 py-3 rounded-2xl border border-white/10">
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-right mb-1">Điểm số</div>
          <div className="text-[#FF6321] font-black text-2xl font-mono leading-none">{score}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#1A1B1E] p-4 sm:p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF6321]/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-10 gap-1 sm:gap-2 aspect-square relative z-10">
              {grid.map((row, r) => row.map((char, c) => {
                const isSelected = currentSelectionLine?.some(cell => cell.r === r && cell.c === c);
                const isFound = foundCells.some(cell => cell.r === r && cell.c === c);
                const isStart = selectionStart?.r === r && selectionStart?.c === c;
                
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    onMouseEnter={() => handleCellHover(r, c)}
                    className={cn(
                      "aspect-square flex items-center justify-center text-xs sm:text-base font-black rounded-lg transition-all duration-200",
                      isFound ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]" :
                      isStart ? "bg-[#FF6321] text-black scale-110 z-20 shadow-[0_0_20px_rgba(255,99,33,0.6)]" :
                      isSelected ? "bg-[#FF6321]/40 text-white scale-105 z-10" :
                      "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
                    )}
                  >
                    {char}
                  </button>
                );
              }))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <Zap size={12} className="text-[#FF6321]" />
            <span>Mẹo: Chọn ô đầu và ô cuối của từ để xác nhận</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1A1B1E] p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6321]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={14} className="text-[#FF6321]" /> Danh sách từ cần tìm
            </h3>
            <div className="space-y-2 relative z-10">
              {wordsToFind.map((w, i) => (
                <motion.div 
                  key={i} 
                  initial={false}
                  animate={{ scale: w.found ? 1 : 1 }}
                  className={cn(
                    "p-3 rounded-xl border transition-all flex items-center justify-between group",
                    w.found ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-white/5 border-white/10 text-gray-400"
                  )}
                >
                  <span className={cn("text-xs font-bold uppercase tracking-wider", w.found && "line-through opacity-50")}>
                    {w.original}
                  </span>
                  {w.found ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#FF6321] transition-colors" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isGameComplete && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-gradient-to-br from-[#FF6321] to-[#FF8C00] p-8 rounded-[2.5rem] text-center space-y-6 shadow-[0_20px_50px_rgba(255,99,33,0.3)]"
              >
                <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy size={48} className="text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black uppercase italic leading-none">Tuyệt Vời!</h3>
                  <p className="text-black/60 text-xs font-bold uppercase tracking-widest mt-2">Bạn đã tìm thấy tất cả</p>
                </div>
                <button 
                  onClick={initializeGame}
                  className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-xl"
                >
                  Chơi lại
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={onBack}
            className="w-full py-4 bg-white/5 border border-white/10 text-gray-500 font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} className="rotate-180" />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

const MODE_INSTRUCTIONS: Record<string, { title: string, description: string, rules: string[] }> = {
  battle: {
    title: "Đấu Trường Kiến Thức",
    description: "Thử thách kiến thức lịch sử qua các thời kỳ.",
    rules: [
      "Trả lời 5 câu hỏi trắc nghiệm.",
      "Sử dụng kỹ năng của Tướng (tốn năng lượng) để hỗ trợ.",
      "Trả lời càng nhanh, điểm nhận được càng cao.",
      "Chiến thắng để nhận Vàng, Ruby và điểm Uy tín."
    ]
  },
  character_battle: {
    title: "Nhận Diện Anh Hùng",
    description: "Đoán tên các vị anh hùng dân tộc qua hình ảnh và mô tả.",
    rules: [
      "Quan sát hình ảnh hoặc đọc mô tả nhân vật.",
      "Chọn đáp án đúng trong các lựa chọn.",
      "Mỗi câu trả lời đúng mang lại điểm số và phần thưởng."
    ]
  },
  epithet_battle: {
    title: "Danh Nhân Đất Việt",
    description: "Tìm tên danh nhân qua tước hiệu và biệt danh.",
    rules: [
      "Đọc tước hiệu hoặc biệt danh nổi tiếng.",
      "Xác định đúng tên của danh nhân đó.",
      "Thử thách sự hiểu biết sâu rộng về các nhân vật lịch sử."
    ]
  },
  true_false: {
    title: "Đúng / Sai",
    description: "Xác minh tính chính xác của các sự kiện lịch sử.",
    rules: [
      "Đọc thông tin lịch sử được đưa ra.",
      "Chọn 'Đúng' hoặc 'Sai' trong thời gian 60 giây.",
      "Yêu cầu sự chính xác tuyệt đối về kiến thức."
    ]
  },
  fill_blank: {
    title: "Điền Chỗ Trống",
    description: "Hoàn thiện các đoạn văn lịch sử.",
    rules: [
      "Đọc đoạn văn hoặc sự kiện còn thiếu thông tin.",
      "Nhập hoặc chọn từ đúng để điền vào chỗ trống.",
      "Kiểm tra khả năng nhớ chi tiết các sự kiện."
    ]
  },
  dap_son_ha: {
    title: "Đạp Sơn Hà",
    description: "Cuộc đua leo núi kiến thức kịch tính.",
    rules: [
      "Trả lời đúng để leo lên các bậc núi.",
      "Mỗi 4 lượt được chọn 1 Bùa hộ thân (Buff).",
      "Sử dụng Buff để tấn công đối thủ hoặc bảo vệ bản thân.",
      "Ai chạm đỉnh núi trước sẽ giành chiến thắng."
    ]
  },
  ranked: {
    title: "Đấu Hạng (Ranked)",
    description: "Khẳng định vị thế trên bảng xếp hạng sử học.",
    rules: [
      "Trận đấu kéo dài 10 phút liên tục.",
      "Trả lời đúng càng nhiều câu hỏi càng tốt.",
      "Thắng trận nhận Sao để thăng hạng (Đồng -> Chiến Thần).",
      "Tích lũy Tinh túy để bảo vệ hạng khi thua."
    ]
  },
  su_van: {
    title: "Sử Vận",
    description: "Thử thách vận may và kiến thức ngẫu nhiên.",
    rules: [
      "Gieo xúc xắc hoặc quay số để nhận câu hỏi.",
      "Mỗi ô tương ứng với một loại thử thách hoặc phần thưởng.",
      "Kết hợp giữa may mắn và kiến thức lịch sử."
    ]
  },
  raid: {
    title: "Đột Kích (Phó Bản)",
    description: "Chế độ PvE đặc biệt đánh boss toàn server.",
    rules: [
      "Cùng cộng đồng tiêu diệt Boss cứ điểm.",
      "Mỗi câu trả lời đúng gây sát thương lớn.",
      "Nhận phần thưởng hiếm khi Boss bị tiêu diệt."
    ]
  },
  event_guessing: {
    title: "Định Vị Lịch Sử",
    description: "Đoán sự kiện dựa trên địa điểm và thời gian.",
    rules: [
      "Một địa danh và một mốc thời gian sẽ hiện ra.",
      "Chọn sự kiện lịch sử chính xác đã xảy ra tại đó.",
      "Kiểm tra khả năng kết nối không gian và thời gian."
    ]
  },
  chronological: {
    title: "Sắp Xếp Thời Gian",
    description: "Sắp xếp các sự kiện theo đúng thứ tự thời gian.",
    rules: [
      "Kéo thả hoặc nhấn để sắp xếp các sự kiện.",
      "Thứ tự từ xưa đến nay (tăng dần theo năm).",
      "Đúng toàn bộ nhận 30 điểm và thưởng lớn."
    ]
  },
  dynasty: {
    title: "Phân Loại Triều Đại",
    description: "Xác định nhân vật/sự kiện thuộc triều đại nào.",
    rules: [
      "Xem tên nhân vật hoặc sự kiện lịch sử.",
      "Chọn đúng triều đại tương ứng trong danh sách.",
      "Mỗi câu đúng được 10 điểm."
    ]
  }
};

const GameInstructionModal = ({ mode, onConfirm, onCancel, customConfig, setCustomConfig }: { 
  mode: string, 
  onConfirm: () => void, 
  onCancel: () => void,
  customConfig: any,
  setCustomConfig: (val: any) => void
}) => {
  const instruction = MODE_INSTRUCTIONS[mode];
  if (!instruction) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4"
    >
      <div className="bg-[#1A1B1E] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onCancel} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-all">
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-[#FF6321]/20 rounded-3xl flex items-center justify-center text-[#FF6321] mb-6 shadow-[0_0_30px_rgba(255,99,33,0.2)]">
            <HelpCircle size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">{instruction.title}</h2>
          <p className="text-gray-400 text-sm">{instruction.description}</p>
        </div>

        {/* Custom Configuration Section */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 mb-8">
          <h3 className="text-[10px] font-black text-[#FF6321] uppercase tracking-widest flex items-center gap-2">
            <Settings size={14} /> Thiết lập trận đấu
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Số câu hỏi</label>
              <input 
                type="number" min="1" max="100000"
                value={customConfig.questionCount}
                onChange={(e) => setCustomConfig((prev: any) => ({ ...prev, questionCount: Math.max(1, parseInt(e.target.value) || 0) }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#FF6321] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Thời gian (phút)</label>
              <input 
                type="number" min="0.1" max="60" step="0.1"
                value={customConfig.duration}
                onChange={(e) => setCustomConfig((prev: any) => ({ ...prev, duration: Math.max(0.1, parseFloat(e.target.value) || 0) }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#FF6321] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-[10px] font-black text-[#FF6321] uppercase tracking-widest mb-2">Quy tắc trò chơi</h3>
          {instruction.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="mt-1">
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-wider rounded-2xl hover:bg-[#ff7a45] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,99,33,0.3)]"
        >
          Sẵn Sàng <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const ArenaView = ({ 
  user, addPoints, addGold, addRuby, consumeBuffs, selectGeneral, updateWeaknesses, 
  initialConfig, onClearConfig, updateQuestProgress, recordMatch, updateDapSonHaStats, 
  updateRankedStats, setActiveTab, showCertificate, setShowCertificate, 
  certificateData, setCertificateData, addCertificate, onShowCertificate,
  updateReputation, theme, toggleTheme
}: any) => {
  const [gameState, setGameState] = useState<'selection' | 'mode_selection' | 'dap_son_ha_selection' | 'difficulty' | 'battle' | 'character_battle' | 'epithet_battle' | 'word_search' | 'entertainment' | 'result' | 'social' | 'true_false' | 'fill_blank' | 'dap_son_ha' | 'sub_mode_selection' | 'ranked_battle' | 'ranked_mode_selection' | 'su_van' | 'raid' | 'event_guessing' | 'chronological' | 'dynasty'>('selection');
  const [speedConfig, setSpeedConfig] = useState<SpeedModeConfig>({ questionCount: 10, mode: 'fast', duration: 10 });
  const [customConfig, setCustomConfig] = useState({ questionCount: 5, duration: 1 });
  const [lastMode, setLastMode] = useState<'battle' | 'character_battle' | 'epithet_battle' | 'true_false' | 'fill_blank' | 'dap_son_ha' | 'ranked' | 'su_van' | 'raid' | 'event_guessing' | 'chronological' | 'dynasty' | null>(null);
  const [pendingMode, setPendingMode] = useState<string | null>(null);
  const [selectedModeCategory, setSelectedModeCategory] = useState<'normal' | 'fun' | 'practice' | null>(null);
  const [gameType, setGameType] = useState<'solo' | 'vs_machine' | 'pvp'>('solo');
  const [difficulty, setDifficulty] = useState<'Sơ' | 'Trung' | 'Cao'>('Sơ');
  const [isReverseMode, setIsReverseMode] = useState(false);

  const renderVerticalTrack = () => {
    if (gameType !== 'vs_machine' || !quizQuestions || quizQuestions.length === 0) return null;
    const total = quizQuestions.length;
    const showNodes = total <= 20;

    return (
      <div className="hidden md:flex flex-col items-center justify-between w-12 bg-[#1A1B1E] rounded-full border border-white/10 py-6 relative shrink-0" style={{ minHeight: '300px' }}>
        <div className="absolute top-6 bottom-6 w-1 bg-white/5 rounded-full" />
        <motion.div 
          className="absolute top-6 w-1 bg-[#FF6321] rounded-full"
          initial={{ height: 0 }}
          animate={{ height: `calc(${(currentQuestionIndex / Math.max(1, total - 1)) * 100}% - 1.5rem)` }}
        />
        {showNodes && quizQuestions.map((_, i) => (
          <div key={i} className="relative z-10 w-full flex justify-center items-center">
            <div className={cn("w-2 h-2 rounded-full transition-all", i <= currentQuestionIndex ? "bg-[#FF6321]" : "bg-white/20")} />
          </div>
        ))}
        
        {/* Player Icon */}
        <motion.div 
          animate={{ top: `calc(1.5rem + ${(currentQuestionIndex / Math.max(1, total - 1)) * 100}% - 1.5rem)` }}
          className="absolute -left-3 z-20"
        >
          <div className="bg-white p-1 rounded-full shadow-lg">
            <UserIcon size={12} className="text-[#FF6321]" />
          </div>
        </motion.div>

        {/* AI Icon */}
        <motion.div 
          animate={{ top: `calc(1.5rem + ${(Math.min(aiQuestionIndex, total - 1) / Math.max(1, total - 1)) * 100}% - 1.5rem)` }}
          className="absolute -right-3 z-20"
        >
          <div className="bg-purple-500 p-1 rounded-full shadow-lg">
            <Cpu size={12} className="text-white" />
          </div>
        </motion.div>
      </div>
    );
  };

  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogueText, setDialogueText] = useState('');
  const [category, setCategory] = useState<'VN' | 'World' | 'All'>('All');
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [currentCharacterQuiz, setCurrentCharacterQuiz] = useState<CharacterQuizQuestion | null>(null);
  const [currentEpithetQuiz, setCurrentEpithetQuiz] = useState<EpithetQuizQuestion | null>(null);
  const [currentEventGuessingQuiz, setCurrentEventGuessingQuiz] = useState<EventGuessingQuestion | null>(null);
  const [currentChronologicalQuiz, setCurrentChronologicalQuiz] = useState<ChronologicalQuestion | null>(null);
  const [chronologicalOrder, setChronologicalOrder] = useState<{id: string, text: string}[]>([]);
  const [currentDynastyQuiz, setCurrentDynastyQuiz] = useState<DynastyQuestion | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [characterQuizQuestions, setCharacterQuizQuestions] = useState<CharacterQuizQuestion[]>([]);
  const [epithetQuizQuestions, setEpithetQuizQuestions] = useState<EpithetQuizQuestion[]>([]);
  const [eventGuessingQuestions, setEventGuessingQuestions] = useState<EventGuessingQuestion[]>([]);
  const [chronologicalQuestions, setChronologicalQuestions] = useState<ChronologicalQuestion[]>([]);
  const [dynastyQuestions, setDynastyQuestions] = useState<DynastyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [aiHp, setAiHp] = useState(1000);
  const [aiMountainHeight, setAiMountainHeight] = useState(0);
  const [aiQuestionIndex, setAiQuestionIndex] = useState(0);
  const [aiSummary, setAiSummary] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [rankedTimeLeft, setRankedTimeLeft] = useState(600); // 10 minutes
  const [rankedCorrectAnswers, setRankedCorrectAnswers] = useState(0);
  const [aiSelectedAnswer, setAiSelectedAnswer] = useState<number | null>(null);
  const [activeDapSonHaBuffs, setActiveDapSonHaBuffs] = useState<string[]>([]);
  const [mountainHeight, setMountainHeight] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [isAiStunned, setIsAiStunned] = useState(false);
  const [dapSonHaShield, setDapSonHaShield] = useState(false);
  const [showDapSonHaBuffSelection, setShowDapSonHaBuffSelection] = useState(false);
  const [pendingDapSonHaAction, setPendingDapSonHaAction] = useState(false);
  const [dapSonHaActionCooldown, setDapSonHaActionCooldown] = useState(false);
  const [dapSonHaTurnCount, setDapSonHaTurnCount] = useState(0);
  const [showBuffSelection, setShowBuffSelection] = useState(false);
  const [opponentShield, setOpponentShield] = useState(false);
  const [opponentMountainHeight, setOpponentMountainHeight] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [activeGeneralEffects, setActiveGeneralEffects] = useState<Record<string, any>>({});
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  const [shieldActive, setShieldActive] = useState(false);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionMode, setInstructionMode] = useState<string | null>(null);
  const [pendingGameStart, setPendingGameStart] = useState<(() => void) | null>(null);
  const [shortAnswerInput, setShortAnswerInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Keyboard Shortcuts for Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (['battle', 'character_battle', 'epithet_battle', 'true_false', 'dap_son_ha'].includes(gameState)) {
        if (e.key >= '1' && e.key <= '4') {
          const index = parseInt(e.key) - 1;
          let options: any[] = [];
          let handler: any = null;

          if (gameState === 'battle' || gameState === 'dap_son_ha') {
            options = currentQuiz?.options || [];
            if (gameState === 'dap_son_ha') {
              const q = quizQuestions[currentQuestionIndex];
              options = q?.type === 'true-false' ? ['Đúng', 'Sai'] : q?.options || [];
              handler = handleDapSonHaAnswer;
            } else {
              handler = handleAnswer;
            }
          } else if (gameState === 'character_battle') {
            options = currentCharacterQuiz?.options || [];
            handler = handleCharacterAnswer;
          } else if (gameState === 'epithet_battle') {
            options = currentEpithetQuiz?.options || [];
            handler = handleEpithetAnswer;
          } else if (gameState === 'true_false') {
            options = [0, 1]; // Đúng, Sai
            handler = handleTrueFalseAnswer;
          }

          if (options[index] !== undefined && handler) {
            handler(gameState === 'true_false' ? index : (gameState === 'battle' ? index : options[index]));
          }
        }
      }

      if (gameState === 'dap_son_ha' && pendingDapSonHaAction) {
        if (e.key.toLowerCase() === 'a') executeDapSonHaAction('attack');
        if (e.key.toLowerCase() === 'd') executeDapSonHaAction('defend');
      }

      if (e.key === 'Escape') {
        if (showInstructions) setShowInstructions(false);
        else if (showDapSonHaBuffSelection) setShowDapSonHaBuffSelection(false);
        else if (showBuffSelection) setShowBuffSelection(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQuiz, currentCharacterQuiz, currentEpithetQuiz, showInstructions, showDapSonHaBuffSelection, showBuffSelection, pendingDapSonHaAction, currentQuestionIndex, quizQuestions]);

  const triggerStart = (mode: string, startFn: () => void) => {
    setInstructionMode(mode);
    setPendingGameStart(() => startFn);
    setShowInstructions(true);
  };

  const confirmStart = () => {
    if (pendingGameStart) {
      setAiSummary('');
      pendingGameStart();
      setPendingGameStart(null);
    }
    setShowInstructions(false);
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'ranked_battle' && rankedTimeLeft > 0) {
      timer = setInterval(() => {
        setRankedTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (rankedTimeLeft === 0 && gameState === 'ranked_battle') {
      setGameState('result');
      setLastMode('ranked');
    }
    return () => clearInterval(timer);
  }, [gameState, rankedTimeLeft]);

  useEffect(() => {
    if (gameState === 'result' && lastMode) {
      let result: 'win' | 'loss' | 'draw' = 'draw';
      let opponentName = 'Máy';
      let matchScore = score;

      if (gameType === 'vs_machine' || gameType === 'pvp') {
        if (lastMode === 'dap_son_ha') {
          result = mountainHeight >= targetHeight ? 'win' : 'loss';
          matchScore = mountainHeight;
        } else if (lastMode === 'ranked') {
          // Ranked result based on correct answers and speed
          // For now, let's say 10 correct answers is a win
          result = rankedCorrectAnswers >= 10 ? 'win' : 'loss';
          matchScore = rankedCorrectAnswers;
        } else {
          result = currentQuestionIndex >= aiQuestionIndex ? 'win' : 'loss';
        }
      } else {
        result = 'win';
      }

      if (lastMode === 'ranked') {
        updateRankedStats(gameType, result);
        opponentName = gameType === 'pvp' ? 'Người Chơi (Ranked)' : gameType === 'vs_machine' ? 'Máy (Ranked)' : 'Đấu Đơn (Ranked)';
      }

      recordMatch(opponentName, result, matchScore, lastMode === 'ranked' ? gameType : undefined);
    }
  }, [gameState]);

  useEffect(() => {
    if (['battle', 'character_battle', 'epithet_battle', 'raid', 'ranked_battle'].includes(gameState)) {
      const recoveryRate = user.inventory.some((i: any) => i.id === 'equip_horse') ? 10 : 5;
      const interval = setInterval(() => {
        setEnergy(prev => Math.min(prev + recoveryRate, maxEnergy));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, user.inventory, maxEnergy]);

  // Timer for Dap Son Ha, and Battle
  useEffect(() => {
    if ((gameState === 'dap_son_ha' || gameState === 'battle') && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAiSummary("Thời gian đã cạn kiệt. Trong lịch sử, nắm bắt thời cơ là yếu tố then chốt. Hãy nhanh tay hơn ở lần sau!");
            setGameState('result');
            if (gameState === 'dap_son_ha') {
              setBattleLog(prevLog => ['Hết thời gian! Bạn đã thất bại.', ...prevLog]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const useSkill = (skillIndex: number) => {
    const general = GENERALS.find(g => g.id === user.selectedGeneralId);
    if (!general || !general.skills[skillIndex]) return;
    
    const skill = general.skills[skillIndex];
    const isPassive = skill.type === 'passive';
    const energyCost = isPassive ? 0 : 30; // Passive skills are free to activate manually but have cooldown
    
    if (energy < energyCost) {
      setBattleLog(prev => [...prev, `Không đủ năng lượng! Cần ${energyCost} năng lượng.`]);
      return;
    }

    // Check cooldown
    if (skillCooldowns[skill.name] > 0) {
      setBattleLog(prev => [...prev, `Kỹ năng ${skill.name} đang trong thời gian hồi (${skillCooldowns[skill.name]} lượt).`]);
      return;
    }

    soundManager.play('click');
    setBattleLog(prev => [...prev, `${isPassive ? 'Kích hoạt nội tại' : 'Kích hoạt kỹ năng'}: ${skill.name}!`]);
    setEnergy(prev => prev - energyCost);

    // Apply effect
    const { type, value } = skill.battleEffect;
    
    switch (type) {
      case 'time_slow':
        setBattleLog(prev => [...prev, `Thời gian suy nghĩ được kéo dài.`]);
        break;
      case 'score_boost':
        setActiveGeneralEffects(prev => ({ ...prev, score_multiplier: value }));
        setBattleLog(prev => [...prev, `Điểm số câu tiếp theo sẽ được x${value}!`]);
        break;
      case 'skip_wrong':
        setShieldActive(true);
        setBattleLog(prev => [...prev, `Lớp bảo vệ kích hoạt! Bạn sẽ không bị phạt nếu trả lời sai.`]);
        break;
      case 'heal':
        if (currentQuestionIndex < quizQuestions.length - 1) {
          const next = currentQuestionIndex + 1;
          setCurrentQuestionIndex(next);
          setCurrentQuiz(quizQuestions[next]);
          setBattleLog(prev => [...prev, `Tăng tốc! Bạn tiến lên 1 bước miễn phí!`]);
        }
        break;
      case 'damage_boost':
        setActiveGeneralEffects(prev => ({ ...prev, damage_boost: value }));
        setAiQuestionIndex(prev => Math.max(0, prev - 1));
        setBattleLog(prev => [...prev, `Tấn công! Đẩy lùi Máy 1 bước!`]);
        break;
      case 'bonus_reward':
        setBattleLog(prev => [...prev, `Phần thưởng sau trận đấu sẽ được tăng thêm!`]);
        break;
      case 'xp_boost':
        setBattleLog(prev => [...prev, `Kinh nghiệm nhận được tăng mạnh!`]);
        break;
      case 'change_question':
        if (gameState === 'battle' && currentQuiz) {
          const filtered = quizQuestions.filter(q => q.id !== currentQuiz.id);
          const next = filtered[Math.floor(Math.random() * filtered.length)];
          setCurrentQuiz(next);
          setBattleLog(prev => [...prev, `Đã đổi sang câu hỏi mới!`]);
        } else if (gameState === 'character_battle' && currentCharacterQuiz) {
          const filtered = characterQuizQuestions.filter(q => q.id !== currentCharacterQuiz.id);
          const next = filtered[Math.floor(Math.random() * filtered.length)];
          setCurrentCharacterQuiz(next);
          setBattleLog(prev => [...prev, `Đã đổi sang câu hỏi mới!`]);
        } else if (gameState === 'epithet_battle' && currentEpithetQuiz) {
          const filtered = epithetQuizQuestions.filter(q => q.id !== currentEpithetQuiz.id);
          const next = filtered[Math.floor(Math.random() * filtered.length)];
          setCurrentEpithetQuiz(next);
          setBattleLog(prev => [...prev, `Đã đổi sang câu hỏi mới!`]);
        }
        break;
    }

    // Set cooldown
    setSkillCooldowns(prev => ({ ...prev, [skill.name]: skill.cooldown || 3 }));
  };

  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [selectedCharAnswer, setSelectedCharAnswer] = useState<string | null>(null);
  const [selectedDynastyAnswer, setSelectedDynastyAnswer] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const periods = ['Cổ đại', 'Trung đại', 'Cận đại', 'Hiện đại'].filter(p => {
    if (category === 'All') return true;
    return QUIZ_DATA.some(q => q.period === p && q.category === category);
  });

  const startBattle = (diff: 'Sơ' | 'Trung' | 'Cao', configOverride?: any) => {
    if (!user.selectedGeneralId) {
      alert("Vui lòng chọn Tướng trước khi xuất trận!");
      return;
    }

    const executeStart = () => {
      setDifficulty(diff);
      setGameState('battle');
      setLastMode('battle');
      setIsReverseMode(Math.random() < 0.3); // 30% chance to be reverse mode
      setShowHint(false);
      setScore(0);
      setHp(100);
      setEnergy(0);
      setSelectedAnswer(null);
      setSelectedCharAnswer(null);
      setCurrentQuestionIndex(0);
      setIsTransitioning(false);
      
      let filteredQuiz = QUIZ_DATA;
      const cat = configOverride?.category || category;
      const pers = configOverride?.periods || selectedPeriods;

      if (cat !== 'All') {
        filteredQuiz = filteredQuiz.filter(q => q.category === cat);
      }
      if (pers && pers.length > 0 && !pers.includes('All')) {
        filteredQuiz = filteredQuiz.filter(q => pers.includes(q.period));
      }

      // Avoid repetition: filter out used questions if possible
      let availableQuestions = filteredQuiz.filter(q => !usedQuestionIds.has(q.id));
      if (availableQuestions.length < customConfig.questionCount) {
        // If not enough unused questions, reset used list for this category/period
        availableQuestions = filteredQuiz;
        setUsedQuestionIds(new Set());
      }

      if (availableQuestions.length === 0) {
        alert("Không có câu hỏi nào phù hợp với lựa chọn của bạn. Đang chọn ngẫu nhiên...");
        availableQuestions = QUIZ_DATA;
      }

      // Select questions based on customConfig.questionCount
      const selectedQuestions = [...availableQuestions].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount).map(q => {
        const originalCorrectAnswer = typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : q.correctAnswer;
        const shuffledOptions = q.options ? [...q.options].sort(() => 0.5 - Math.random()) : [];
        const newCorrectAnswer = typeof q.correctAnswer === 'number' ? shuffledOptions.indexOf(originalCorrectAnswer as string) : q.correctAnswer;
        
        // Mark as used
        setUsedQuestionIds(prev => new Set(prev).add(q.id));
        
        return { ...q, options: shuffledOptions, correctAnswer: newCorrectAnswer };
      });
      setQuizQuestions(selectedQuestions);
      setCurrentQuiz(selectedQuestions[0]);
      setTimeLeft(customConfig.duration * 60);
      setBattleLog([`Trận chiến [${diff}] - [${cat}] - [${pers.join(', ')}] bắt đầu!`, `Tướng ${GENERALS.find(g => g.id === user.selectedGeneralId)?.name} đã sẵn sàng.`, `Thử thách gồm ${customConfig.questionCount} câu hỏi.`]);
    };

    triggerStart('battle', executeStart);
  };

  useEffect(() => {
    if (initialConfig && user.selectedGeneralId) {
      if (initialConfig.startInRankedSelection) {
        setGameState('ranked_mode_selection');
      } else {
        setCategory(initialConfig.category);
        setSelectedPeriods(initialConfig.periods || []);
        startBattle('Sơ', initialConfig);
      }
      onClearConfig();
    }
  }, [initialConfig, user.selectedGeneralId]);

  useEffect(() => {
    if (gameState === 'result' && score > 0) {
      consumeBuffs();
    }
  }, [gameState, score, consumeBuffs]);

  // Global AI Logic for Vs Machine modes
  useEffect(() => {
    let interval: any;
    const machineModes = ['battle', 'character_battle', 'epithet_battle', 'true_false', 'fill_blank', 'dap_son_ha', 'ranked_battle'];
    if (gameState && machineModes.includes(gameState) && gameType === 'vs_machine' && !isTransitioning) {
      if (gameState === 'dap_son_ha' && isAiStunned) return;
      
      interval = setInterval(() => {
        if (Math.random() < 0.12) { // 12% chance to progress every 2.5s
          const target = gameState === 'dap_son_ha' ? 15 : 10;
          
          if (gameState === 'dap_son_ha') {
            setAiMountainHeight(prev => {
              const next = Math.min(target, prev + 1);
              if (next >= target) {
                setAiSummary("Máy đã chạm đỉnh trước! Đừng nản lòng, lịch sử là một hành trình học hỏi không ngừng!");
                setGameState('result');
                setBattleLog(prevLog => ['Máy đã chạm đỉnh trước! Thất bại.', ...prevLog]);
              }
              return next;
            });
          } else {
            setAiQuestionIndex(prev => {
              const next = prev + 1;
              if (next >= target) {
                setAiSummary("Máy đã về đích trước! Máy đã phân tích và đưa ra đáp án nhanh hơn. Hãy rèn luyện thêm nhé!");
                setGameState('result');
                setBattleLog(prevLog => ['Máy đã về đích trước! Thất bại.', ...prevLog]);
              }
              return next;
            });
          }
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [gameState, gameType, isTransitioning, speedConfig.questionCount, isAiStunned]);

  const startRankedBattle = (mode: 'solo' | 'machine' | 'pvp') => {
    if (!user.selectedGeneralId) {
      alert("Vui lòng chọn Tướng trước khi xuất trận!");
      return;
    }

    const executeStart = () => {
      setGameState('ranked_battle');
      setLastMode('ranked');
      setGameType(mode === 'solo' ? 'solo' : mode === 'machine' ? 'vs_machine' : 'pvp');
      setDifficulty('Cao');
      setShowHint(false);
      setScore(0);
      setHp(100);
      setEnergy(0);
      setAiHp(100);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(0);
      setIsTransitioning(false);
      setRankedTimeLeft(600); // 10 minutes
      setRankedCorrectAnswers(0);
      
      const selectedQuestions = [...QUIZ_DATA].sort(() => 0.5 - Math.random()).slice(0, 10).map(q => {
        const originalCorrectAnswer = typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : q.correctAnswer;
        const shuffledOptions = q.options ? [...q.options].sort(() => 0.5 - Math.random()) : [];
        const newCorrectAnswer = typeof q.correctAnswer === 'number' ? shuffledOptions.indexOf(originalCorrectAnswer as string) : q.correctAnswer;
        return { ...q, options: shuffledOptions, correctAnswer: newCorrectAnswer };
      });
      setQuizQuestions(selectedQuestions);
      setCurrentQuiz(selectedQuestions[0]);
      setBattleLog(['TRẬN ĐẤU RANK BẮT ĐẦU! Hãy trả lời đúng nhiều nhất có thể trong 10 phút.', ...battleLog]);
      soundManager.play('success');
    };

    triggerStart('ranked', executeStart);
  };

  const startMode = (mode: string) => {
    setPendingMode(mode);
    setGameState('sub_mode_selection');
  };

  const finalizeModeStart = (type: 'solo' | 'vs_machine') => {
    setGameType(type);
    setAiHp(100);
    setAiMountainHeight(0);
    setAiQuestionIndex(0);
    setAiSelectedAnswer(null);
    setIsAiStunned(false);
    setOpponentShield(false);
    setOpponentMountainHeight(0);
    
    switch (pendingMode) {
      case 'battle':
        setGameState('difficulty');
        break;
      case 'character':
        startCharacterBattle();
        break;
      case 'epithet':
        startEpithetBattle();
        break;
      case 'true_false':
        startTrueFalse();
        break;
      case 'fill_blank':
        startFillBlank();
        break;
      case 'dap_son_ha':
        startDapSonHa(type);
        break;
      case 'su_van':
        startSuVan();
        break;
      case 'raid':
        startRaid();
        break;
      case 'event_guessing':
        startEventGuessing();
        break;
      case 'chronological':
        startChronological();
        break;
      case 'dynasty':
        startDynasty();
        break;
    }
  };

  const startSuVan = () => {
    if (!user.selectedGeneralId) {
      alert("Vui lòng chọn Tướng trước khi gieo xúc xắc!");
      return;
    }

    const executeStart = () => {
      setGameState('su_van');
      setLastMode('su_van');
      setScore(0);
      setHp(100);
      setEnergy(0);
      setCurrentQuestionIndex(0);
      setBattleLog(["Bắt đầu hành trình Sử Vận!", "Gieo xúc xắc để nhận thử thách..."]);
      
      const selectedQuestions = [...QUIZ_DATA].sort(() => 0.5 - Math.random()).slice(0, 10).map(q => {
        const originalCorrectAnswer = typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : q.correctAnswer;
        const shuffledOptions = q.options ? [...q.options].sort(() => 0.5 - Math.random()) : [];
        const newCorrectAnswer = typeof q.correctAnswer === 'number' ? shuffledOptions.indexOf(originalCorrectAnswer as string) : q.correctAnswer;
        return { ...q, options: shuffledOptions, correctAnswer: newCorrectAnswer };
      });
      setQuizQuestions(selectedQuestions);
      setCurrentQuiz(selectedQuestions[0]);
    };

    triggerStart('su_van', executeStart);
  };

  const startRaid = () => {
    if (!user.selectedGeneralId) {
      alert("Vui lòng chọn Tướng trước khi tham gia Phó Bản!");
      return;
    }

    const executeStart = () => {
      setGameState('raid');
      setLastMode('raid');
      setScore(0);
      setHp(100);
      setEnergy(0);
      setCurrentQuestionIndex(0);
      setBattleLog([
        "CHIẾN DỊCH ĐIỆN BIÊN PHỦ - PHÓ BẢN TOÀN SERVER",
        "Mục tiêu: Tiêu diệt cứ điểm đối phương bằng kiến thức.",
        "Lưu ý: Đây là trận chiến trường kỳ, hãy cẩn trọng!"
      ]);
      
      const selectedQuestions = [...QUIZ_DATA].sort(() => 0.5 - Math.random()).slice(0, 10).map(q => {
        const originalCorrectAnswer = typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : q.correctAnswer;
        const shuffledOptions = q.options ? [...q.options].sort(() => 0.5 - Math.random()) : [];
        const newCorrectAnswer = typeof q.correctAnswer === 'number' ? shuffledOptions.indexOf(originalCorrectAnswer as string) : q.correctAnswer;
        return { ...q, options: shuffledOptions, correctAnswer: newCorrectAnswer };
      });
      setQuizQuestions(selectedQuestions);
      setCurrentQuiz(selectedQuestions[0]);
    };

    triggerStart('raid', executeStart);
  };

  const startTrueFalse = () => {
    const executeStart = () => {
      const filtered = QUIZ_DATA.filter(q => q.type === 'true-false');
      if (filtered.length === 0) return;
      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount);
      setQuizQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(customConfig.duration * 60);
      setGameState('true_false');
      setLastMode('true_false');
      setBattleLog([`Bắt đầu chế độ Đúng/Sai! Thử thách ${customConfig.questionCount} câu.`]);
    };
    triggerStart('true_false', executeStart);
  };

  const startFillBlank = () => {
    const executeStart = () => {
      const filtered = QUIZ_DATA.filter(q => q.type === 'fill-blank');
      if (filtered.length === 0) return;
      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount);
      setQuizQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(customConfig.duration * 60);
      setGameState('fill_blank');
      setLastMode('fill_blank');
      setBattleLog([`Bắt đầu chế độ Điền vào chỗ trống! Thử thách ${customConfig.questionCount} câu.`]);
    };
    triggerStart('fill_blank', executeStart);
  };

  const startEventGuessing = () => {
    const executeStart = () => {
      setGameState('event_guessing');
      setLastMode('event_guessing');
      setScore(0);
      setHp(100);
      setCurrentQuestionIndex(0);
      
      const filtered = EVENT_GUESSING_DATA.filter(q => category === 'All' || q.category === category);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount);
      setEventGuessingQuestions(shuffled);
      setCurrentEventGuessingQuiz(shuffled[0]);
      setTimeLeft(customConfig.duration * 60);
      setBattleLog(['Bắt đầu Định Vị Lịch Sử!', 'Hãy chọn sự kiện đúng với địa điểm và thời gian được đưa ra.']);
    };
    triggerStart('event_guessing', executeStart);
  };

  const handleEventGuessingAnswer = (answer: string) => {
    if (!currentEventGuessingQuiz || isTransitioning) return;
    
    setIsTransitioning(true);
    const isCorrect = answer === currentEventGuessingQuiz.correctAnswer;
    
    if (isCorrect) {
      soundManager.play('success');
      setScore(prev => prev + 200);
      setBattleLog(prev => [`Chính xác! ${currentEventGuessingQuiz.correctAnswer} - ${currentEventGuessingQuiz.explanation}`, ...prev]);
      addPoints(20, 'solo', true);
      addGold(100, true);
    } else {
      soundManager.play('wrong');
      setHp(prev => Math.max(0, prev - 20));
      setBattleLog(prev => [`Sai rồi! Đáp án đúng là: ${currentEventGuessingQuiz.correctAnswer}`, ...prev]);
    }

    setTimeout(() => {
      if (currentQuestionIndex < eventGuessingQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentEventGuessingQuiz(eventGuessingQuestions[currentQuestionIndex + 1]);
        setIsTransitioning(false);
      } else {
        setGameState('result');
        setLastMode('event_guessing');
      }
    }, 2000);
  };

  const startChronological = () => {
    const executeStart = () => {
      setGameState('chronological');
      setLastMode('chronological');
      setScore(0);
      setHp(100);
      setCurrentQuestionIndex(0);
      
      const filtered = CHRONOLOGICAL_DATA.filter(q => category === 'All' || q.category === category);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount);
      setChronologicalQuestions(shuffled);
      const firstQuiz = shuffled[0];
      setCurrentChronologicalQuiz(firstQuiz);
      setChronologicalOrder([...firstQuiz.events].sort(() => Math.random() - 0.5));
      setTimeLeft(customConfig.duration * 60);
      setBattleLog(['Bắt đầu Sắp Xếp Thời Gian!', 'Sắp xếp các sự kiện theo thứ tự từ xưa đến nay.']);
    };
    triggerStart('chronological', executeStart);
  };

  const startDynasty = () => {
    const executeStart = () => {
      setGameState('dynasty');
      setLastMode('dynasty');
      setScore(0);
      setHp(100);
      setCurrentQuestionIndex(0);
      
      const filtered = DYNASTY_DATA.filter(q => category === 'All' || q.category === category);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount);
      setDynastyQuestions(shuffled);
      setCurrentDynastyQuiz(shuffled[0]);
      setTimeLeft(customConfig.duration * 60);
      setBattleLog(['Bắt đầu Phân Loại Triều Đại!', 'Xác định nhân vật/sự kiện thuộc triều đại nào.']);
    };
    triggerStart('dynasty', executeStart);
  };

  const handleChronologicalAnswer = (isCorrect: boolean) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (isCorrect) {
      setScore(prev => prev + 30);
      setBattleLog(prev => ['Chính xác! Bạn đã sắp xếp đúng thứ tự.', ...prev]);
      soundManager.play('success');
      addPoints(30, 'solo', true);
      addGold(150, true);
    } else {
      setBattleLog(prev => ['Sai rồi! Thứ tự chưa chính xác.', ...prev]);
      soundManager.play('wrong');
      setHp(prev => Math.max(0, prev - 25));
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < chronologicalQuestions.length) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        const nextQuiz = chronologicalQuestions[nextIndex];
        setCurrentChronologicalQuiz(nextQuiz);
        setChronologicalOrder([...nextQuiz.events].sort(() => Math.random() - 0.5));
        setIsTransitioning(false);
      } else {
        setGameState('result');
        setLastMode('chronological');
      }
    }, 2000);
  };

  const handleDynastyAnswer = (answer: string) => {
    if (!currentDynastyQuiz || isTransitioning) return;
    setSelectedDynastyAnswer(answer);
    setIsTransitioning(true);
    
    const isCorrect = answer === currentDynastyQuiz.correctDynasty;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setBattleLog(prev => [`Chính xác! ${currentDynastyQuiz.subject} thuộc ${answer}.`, ...prev]);
      soundManager.play('success');
      addPoints(10, 'solo', true);
      addGold(50, true);
    } else {
      setBattleLog(prev => [`Sai rồi! ${currentDynastyQuiz.subject} thuộc ${currentDynastyQuiz.correctDynasty}.`, ...prev]);
      soundManager.play('wrong');
      setHp(prev => Math.max(0, prev - 15));
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < dynastyQuestions.length) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentDynastyQuiz(dynastyQuestions[nextIndex]);
        setSelectedDynastyAnswer(null);
        setIsTransitioning(false);
      } else {
        setGameState('result');
        setLastMode('dynasty');
      }
    }, 2000);
  };

  const handleTrueFalseAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || isTransitioning) return;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(answerIndex);
    setIsTransitioning(true);

    if (isCorrect) {
      setScore(prev => prev + 100);
      if (gameType === 'vs_machine' || gameType === 'pvp') {
        setAiHp(prev => Math.max(0, prev - 20));
      }
      setBattleLog(prev => [`Câu ${currentQuestionIndex + 1}: Chính xác!`, ...prev]);
      soundManager.play('success');
      addPoints(10, 'solo', true);
      addGold(50, true);
    } else {
      setBattleLog(prev => [`Câu ${currentQuestionIndex + 1}: Sai rồi!`, ...prev]);
      soundManager.play('wrong');
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsTransitioning(false);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }, 1000);
  };

  const handleFillBlankAnswer = (answer: string) => {
    if (selectedAnswer !== null || isTransitioning) return;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answer.trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
    setSelectedAnswer(answer);
    setIsTransitioning(true);

    if (isCorrect) {
      setScore(prev => prev + 100);
      if (gameType === 'vs_machine' || gameType === 'pvp') {
        setAiHp(prev => Math.max(0, prev - 20));
      }
      setBattleLog(prev => [`Câu ${currentQuestionIndex + 1}: Chính xác!`, ...prev]);
      soundManager.play('success');
      addPoints(15, 'solo', true);
      addGold(75, true);
    } else {
      setBattleLog(prev => [`Câu ${currentQuestionIndex + 1}: Sai rồi! Đáp án là: ${currentQuestion.correctAnswer}`, ...prev]);
      soundManager.play('wrong');
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsTransitioning(false);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  const targetHeight = 15;

  const startDapSonHa = (mode: 'solo' | 'vs_machine' | 'pvp') => {
    const executeStart = () => {
      const shuffled = [...QUIZ_DATA]
        .filter(q => q.type !== 'fill-blank')
        .sort(() => 0.5 - Math.random());
      setQuizQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setAiHp(100);
      setMountainHeight(0);
      setAiMountainHeight(0);
      setOpponentMountainHeight(0);
      setWrongAttempts(0);
      setQuestionStartTime(Date.now());
      setActiveDapSonHaBuffs([]);
      setIsAiStunned(false);
      setDapSonHaShield(false);
      setOpponentShield(false);
      setDapSonHaTurnCount(0);
      setShowBuffSelection(false);
      setGameType(mode);
      setTimeLeft(300); 
      setGameState('dap_son_ha');
      setLastMode('dap_son_ha');
      setBattleLog([`Bắt đầu Đạp Sơn Hà (${mode === 'solo' ? 'Đơn' : mode === 'vs_machine' ? 'Đấu Máy' : 'Đấu Người'})!`, 'Mỗi câu hỏi có 5 phút. Càng chậm điểm càng giảm!']);
    };
    triggerStart('dap_son_ha', executeStart);
  };

  // AI Logic for Dap Son Ha
  useEffect(() => {
    let interval: any;
    if (gameState === 'dap_son_ha' && gameType === 'vs_machine' && !isAiStunned) {
      interval = setInterval(() => {
        if (Math.random() < 0.15) { // 15% chance to climb every 3s
          setAiMountainHeight(prev => {
            const next = Math.min(targetHeight, prev + 1);
            if (next >= targetHeight && gameState === 'dap_son_ha') {
              setGameState('result');
              setBattleLog(prevLog => ['AI đã chạm đỉnh trước! Thất bại.', ...prevLog]);
            }
            return next;
          });
        }
        if (Math.random() < 0.1) { // 10% chance to attack/defend
          const action = Math.random();
          if (action < 0.5) { // Attack
            if (dapSonHaShield) {
              setDapSonHaShield(false);
              setBattleLog(prev => ['AI CÔNG: Phá vỡ giáp của bạn!', ...prev]);
            } else {
              setMountainHeight(prev => Math.max(0, prev - 1));
              setBattleLog(prev => ['AI CÔNG: Bạn bị tụt 1 bậc!', ...prev]);
            }
          } else { // Defend
            setOpponentShield(true);
            setBattleLog(prev => ['AI THỦ: Tạo lá chắn bảo vệ!', ...prev]);
          }
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameState, gameType, isAiStunned]);

  const proceedToNextDapSonHa = () => {
    setSelectedAnswer(null);
    setIsTransitioning(false);
    setPendingDapSonHaAction(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setWrongAttempts(0);
    } else {
      setGameState('result');
    }
  };

  const executeDapSonHaAction = (type: 'attack' | 'defend') => {
    if (type === 'attack') {
      if (opponentShield) {
        setOpponentShield(false);
        setBattleLog(prev => ['BẠN CÔNG: Phá vỡ giáp của đối thủ!', ...prev]);
      } else {
        const damage = 2;
        if (gameType === 'vs_machine') {
          setAiMountainHeight(prev => Math.max(0, prev - damage));
        } else {
          setOpponentMountainHeight(prev => Math.max(0, prev - damage));
        }
        setBattleLog(prev => [`BẠN CÔNG: Đối thủ bị tụt ${damage} bậc!`, ...prev]);
      }
      soundManager.play('success');
    } else {
      setDapSonHaShield(true);
      setBattleLog(prev => ['BẠN THỦ: Tạo lá chắn bảo vệ!', ...prev]);
      soundManager.play('success');
    }
    
    setTimeout(() => {
      proceedToNextDapSonHa();
    }, 800);
  };

  const handleDapSonHaAnswer = (index: number | string) => {
    if (isTransitioning) return;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = typeof index === 'number' 
      ? index === currentQuestion.correctAnswer 
      : String(index).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
    
    if (isCorrect) {
      setIsTransitioning(true);
      soundManager.play('success');
      
      // Calculate points: Base 1000, penalty for time and wrong attempts
      const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
      const timePenalty = timeTaken * 2; // -2 points per second
      const accuracyPenalty = wrongAttempts * 200;
      const pointsEarned = Math.max(10, 1000 - timePenalty - accuracyPenalty);
      
      let moveUp = 1;
      if (activeDapSonHaBuffs.includes('Thần Tốc')) moveUp = 2;
      
      setMountainHeight(prev => Math.min(targetHeight, prev + moveUp));
      setScore(prev => prev + pointsEarned);
      addPoints(pointsEarned);
      addGold(Math.floor(pointsEarned / 10));
      setBattleLog(prev => [`Chính xác! +${pointsEarned} điểm. Leo lên ${moveUp} bậc.`, ...prev]);
      setIsTransitioning(true);

      // Tactical Choice (not in solo)
      if (gameType !== 'solo') {
        setPendingDapSonHaAction(true);
      } else {
        setTimeout(() => {
          proceedToNextDapSonHa();
        }, 1000);
      }

      setDapSonHaTurnCount(prev => {
        const next = prev + 1;
        if (next % 4 === 0) {
          setShowDapSonHaBuffSelection(true);
        }
        return next;
      });

      // Remove one-time buffs
      if (activeDapSonHaBuffs.includes('Thiên Nhãn')) {
        setActiveDapSonHaBuffs(prev => prev.filter(b => b !== 'Thiên Nhãn'));
      }
      if (activeDapSonHaBuffs.includes('Thần Tốc')) {
        setActiveDapSonHaBuffs(prev => prev.filter(b => b !== 'Thần Tốc'));
      }

      // Random buff/debuff every 3 steps (not in solo for harmful ones)
      if ((mountainHeight + moveUp) % 3 === 0 && mountainHeight + moveUp < targetHeight) {
        const events = [
          { name: 'Thần Tốc', type: 'good', desc: 'Leo nhanh gấp đôi trong lượt tới!' },
          { name: 'Phúc Lành', type: 'good', desc: 'Hồi phục 1 HP!' },
          { name: 'Thiên Nhãn', type: 'good', desc: 'Xoá toàn bộ đáp án sai ở câu kế tiếp!' },
          { name: 'Động Đất', type: 'good', desc: 'Khống chế AI trong 1 phút!' }
        ];
        
        if (gameType !== 'solo') {
          events.push(
            { name: 'Sương Mù', type: 'bad', desc: 'Thời gian suy nghĩ bị giảm!' },
            { name: 'Đá Lở', type: 'bad', desc: 'Bị tụt 1 bậc!' }
          );
        }

        const event = events[Math.floor(Math.random() * events.length)];
        setBattleLog(prev => [`SỰ KIỆN: ${event.name}! ${event.desc}`, ...prev]);
        
        if (event.name === 'Thần Tốc') setActiveDapSonHaBuffs(prev => [...prev, 'Thần Tốc']);
        if (event.name === 'Phúc Lành') setHp(prev => Math.min(maxHp, prev + 1));
        if (event.name === 'Sương Mù') setTimeLeft(prev => Math.max(5, prev - 30));
        if (event.name === 'Đá Lở') setMountainHeight(prev => Math.max(0, prev - 1));
        if (event.name === 'Thiên Nhãn') setActiveDapSonHaBuffs(prev => [...prev, 'Thiên Nhãn']);
        if (event.name === 'Động Đất') {
          setIsAiStunned(true);
          setTimeout(() => setIsAiStunned(false), 60000);
        }
      }

      setTimeout(() => {
        setIsTransitioning(false);
        setSelectedAnswer(null);
        setDapSonHaShield(false); // Shield expires after turn
        
        if (mountainHeight + moveUp >= targetHeight) {
          setGameState('result');
          setBattleLog(prev => ['CHÚC MỪNG! Bạn đã chinh phục đỉnh núi!', ...prev]);
          updateDapSonHaStats(gameType as any, score + pointsEarned, Math.floor((Date.now() - questionStartTime) / 1000));
        } else if ((dapSonHaTurnCount + 1) % 4 === 0) {
          setShowBuffSelection(true);
        } else {
          setCurrentQuestionIndex(prev => (prev + 1) % quizQuestions.length);
          setWrongAttempts(0);
          setQuestionStartTime(Date.now());
          setTimeLeft(300);
        }
      }, 1500);
    } else {
      soundManager.play('wrong');
      setWrongAttempts(prev => prev + 1);
      setBattleLog(prev => [`Sai rồi! Thử lại nhé. (Lần sai: ${wrongAttempts + 1})`, ...prev]);
      setSelectedAnswer(index);
      setTimeout(() => setSelectedAnswer(null), 500);
    }
  };

  const startCharacterBattle = () => {
    if (!user.selectedGeneralId) {
      alert("Vui lòng chọn Tướng trước khi xuất trận!");
      return;
    }

    const executeStart = () => {
      setGameState('character_battle');
      setLastMode('character_battle');
      setShowHint(false);
      setScore(0);
      setSelectedAnswer(null);
      setSelectedCharAnswer(null);
      setCurrentQuestionIndex(0);
      setIsTransitioning(false);
      
      let filteredCharacterQuiz = CHARACTER_QUIZ_DATA;
      if (category !== 'All') {
        filteredCharacterQuiz = filteredCharacterQuiz.filter(q => q.category === category);
      }

      if (filteredCharacterQuiz.length === 0) {
        filteredCharacterQuiz = CHARACTER_QUIZ_DATA;
      }

      // Select questions based on customConfig.questionCount
      const selectedQuestions = [...filteredCharacterQuiz].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount).map(q => {
        const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
        return { ...q, options: shuffledOptions };
      });
      setLastMode('character_battle');
      setCharacterQuizQuestions(selectedQuestions);
      setCurrentCharacterQuiz(selectedQuestions[0]);
      setTimeLeft(customConfig.duration * 60);
      setBattleLog([`Thử thách "Nhìn câu đoán nhân vật" bắt đầu!`, `Tướng ${GENERALS.find(g => g.id === user.selectedGeneralId)?.name} đang quan sát...`, `Thử thách gồm ${customConfig.questionCount} câu hỏi.`]);
    };

    triggerStart('character_battle', executeStart);
  };

  const startEpithetBattle = () => {
    if (!user.selectedGeneralId) {
      alert("Vui lòng chọn Tướng trước khi xuất trận!");
      return;
    }

    const executeStart = () => {
      setGameState('epithet_battle');
      setLastMode('epithet_battle');
      setShowHint(false);
      setScore(0);
      setSelectedAnswer(null);
      setSelectedCharAnswer(null);
      setCurrentQuestionIndex(0);
      setIsTransitioning(false);
      
      let filteredEpithetQuiz = EPITHET_QUIZ_DATA;
      if (category !== 'All') {
        filteredEpithetQuiz = filteredEpithetQuiz.filter(q => q.category === category);
      }

      if (filteredEpithetQuiz.length === 0) {
        filteredEpithetQuiz = EPITHET_QUIZ_DATA;
      }

      // Select questions based on customConfig.questionCount
      const selectedQuestions = [...filteredEpithetQuiz].sort(() => 0.5 - Math.random()).slice(0, customConfig.questionCount).map(q => {
        const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
        return { ...q, options: shuffledOptions };
      });
      setEpithetQuizQuestions(selectedQuestions);
      setCurrentEpithetQuiz(selectedQuestions[0]);
      setTimeLeft(customConfig.duration * 60);
      setBattleLog([`Thử thách "Đoán tên qua danh hiệu" bắt đầu!`, `Tướng ${GENERALS.find(g => g.id === user.selectedGeneralId)?.name} đang chuẩn bị...`, `Thử thách gồm ${customConfig.questionCount} câu hỏi.`]);
    };

    triggerStart('epithet_battle', executeStart);
  };

  const renderQuestion = (quiz: QuizQuestion, onAnswer: (index: number | string) => void, selected: number | string | null, correctOnly: boolean = false) => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF6321] animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Thời kỳ: {quiz.period}</span>
          </div>
          {!showHint && selected === null && (
            <button 
              onClick={() => {
                setShowHint(true);
                soundManager.play('click');
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-[#FF6321]/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-[#FF6321] transition-all border border-white/5 hover:border-[#FF6321]/30"
            >
              <Sparkles size={12} /> Gợi Ý
            </button>
          )}
        </div>

        {showHint && selected === null && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#FF6321]/5 border border-[#FF6321]/20 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[#FF6321]/20 rounded-lg text-[#FF6321]">
                <Sparkles size={14} />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                <span className="text-[#FF6321] font-bold not-italic">Gợi ý:</span> {quiz.hint || 'Hãy nhớ lại những kiến thức sử học bạn đã học được!'}
              </p>
            </div>
          </motion.div>
        )}

        {quiz.type === 'fill-blank' ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nhập đáp án của bạn..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-[#FF6321] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    onAnswer(val);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              disabled={selected !== null}
            />
            {correctOnly && (
              <p className="text-[10px] text-[#FF6321] uppercase font-bold text-center italic">Thiên Nhãn: Đáp án là "{quiz.correctAnswer}"</p>
            )}
            {!correctOnly && <p className="text-[10px] text-gray-500 uppercase font-bold text-center italic">Nhấn Enter để gửi đáp án</p>}
          </div>
        ) : (
          <div className={cn("grid gap-4", quiz.type === 'true-false' ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2")}>
            {(quiz.options || []).map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === quiz.correctAnswer;
              const isHidden = correctOnly && !isCorrect;
              
              if (isHidden) return null;

              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => onAnswer(i)}
                  disabled={selected !== null || isTransitioning}
                  className={cn(
                    "w-full p-6 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center relative overflow-hidden",
                    selected === null ? "bg-white/5 border-white/5 hover:border-[#FF6321]/50" :
                    isCorrect ? "bg-green-500/20 border-green-500 text-green-500" :
                    isSelected ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/5 border-white/5 opacity-50"
                  )}
                >
                  <span className="text-sm tracking-tight">{opt}</span>
                  {isSelected && <span className="text-[8px] bg-[#FF6321] text-black px-1.5 py-0.5 rounded font-black uppercase">Bạn</span>}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleSuVanAnswer = (index: number | string) => {
    if (!currentQuiz || selectedAnswer !== null || isTransitioning) return;
    setSelectedAnswer(index);
    const isCorrect = index === currentQuiz.correctAnswer;
    
    if (isCorrect) {
      soundManager.play('success');
      const randomPoints = Math.floor(Math.random() * 6) + 1; // 1 to 6
      setScore(s => s + randomPoints);
      setBattleLog(prev => [...prev, `CHÍNH XÁC! Bạn gieo xúc xắc được ${randomPoints} điểm.`]);
      addPoints(randomPoints, 'solo', true);
      addGold(randomPoints * 10, true);
      if (Math.random() < 0.2) {
        addRuby(1);
        setBattleLog(prev => [...prev, `May mắn! Bạn nhặt được 1 Ruby.`]);
      }
      updateQuestProgress('battle_win', 1, currentQuiz.category);
    } else {
      soundManager.play('failure');
      const correctText = typeof currentQuiz.correctAnswer === 'number' ? currentQuiz.options?.[currentQuiz.correctAnswer as number] : currentQuiz.correctAnswer;
      setBattleLog(prev => [...prev, `SAI RỒI! Không nhận được điểm. Đáp án: ${correctText}`]);
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < 9) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentQuiz(quizQuestions[currentQuestionIndex + 1]);
        setSelectedAnswer(null);
        setShowHint(false);
        setIsTransitioning(false);
      } else {
        setGameState('result');
      }
    }, 2000);
  };

  const handleRaidAnswer = (index: number | string) => {
    if (!currentQuiz || selectedAnswer !== null || isTransitioning) return;
    setSelectedAnswer(index);
    const isCorrect = index === currentQuiz.correctAnswer;
    
    if (isCorrect) {
      soundManager.play('success');
      let damage = 500; // High damage for raid
      
      // Equipment effect: Bow
      if (user.inventory.some((i: any) => i.id === 'equip_bow')) {
        damage = Math.floor(damage * 1.15);
      }

      setScore(s => s + damage);
      setBattleLog(prev => [...prev, isReverseMode ? `CHÍNH XÁC! Bạn đã tìm ra đáp án SAI. Gây ${damage} sát thương lên cứ điểm.` : `CHÍNH XÁC! Gây ${damage} sát thương lên cứ điểm.`]);
      addPoints(200, 'raid', true);
      addGold(100, true);
      if (Math.random() < 0.3) { // Higher chance in raid
        addRuby(2);
        setBattleLog(prev => [...prev, `May mắn! Bạn nhặt được 2 Ruby.`]);
      }
      updateQuestProgress('battle_win', 1, currentQuiz.category);
    } else {
      soundManager.play('failure');
      const correctText = typeof currentQuiz.correctAnswer === 'number' ? currentQuiz.options?.[currentQuiz.correctAnswer as number] : currentQuiz.correctAnswer;
      setBattleLog(prev => [...prev, isReverseMode ? `THẤT BẠI! Bạn phải chọn đáp án SAI.` : `THẤT BẠI! Đòn tấn công bị chặn lại. Đáp án: ${correctText}`]);
      
      // Boss Counter-Attack logic
      const counterDamage = 20;
      let actualDamage = counterDamage;
      if (user.inventory.some((i: any) => i.id === 'equip_armor')) {
        actualDamage = Math.floor(counterDamage * 0.8);
        setBattleLog(prev => [...prev, `Giáp Trụ giúp giảm sát thương nhận được! Bạn mất ${actualDamage} HP.`]);
      } else {
        setBattleLog(prev => [...prev, `Boss phản công! Bạn mất ${actualDamage} HP.`]);
      }
      setHp(prev => Math.max(0, prev - actualDamage));
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setHp(currentHp => {
        if (currentHp <= 0) {
          setGameState('result');
          return 0;
        }
        
        if (currentQuestionIndex < quizQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setCurrentQuiz(quizQuestions[nextIndex]);
          setSelectedAnswer(null);
          setIsTransitioning(false);
          setBattleLog(prev => [...prev, `--- Đợt tấn công tiếp theo (${nextIndex + 1}/${quizQuestions.length}) ---`]);
        } else {
          setGameState('result');
        }
        return currentHp;
      });
    }, 2000);
  };

  const handleAnswer = (index: number | string) => {
    if (!currentQuiz || selectedAnswer !== null || isTransitioning) return;
    setSelectedAnswer(index);
    const isCorrect = isReverseMode ? index !== currentQuiz.correctAnswer : index === currentQuiz.correctAnswer;
    
    if (isCorrect) {
      soundManager.play('success');
      let points = Math.floor(100 * (difficulty === 'Sơ' ? 1 : difficulty === 'Trung' ? 1.5 : 2));
      
      // Apply general effects
      if (activeGeneralEffects.score_multiplier) {
        points = Math.floor(points * activeGeneralEffects.score_multiplier);
        setActiveGeneralEffects(prev => {
          const { score_multiplier, ...rest } = prev;
          return rest;
        });
      }

      if (activeGeneralEffects.damage_boost) {
        points = Math.floor(points * activeGeneralEffects.damage_boost);
      }
      
      setScore(s => s + points);
      setBattleLog(prev => [...prev, isReverseMode ? `Chính xác! Bạn đã tìm ra đáp án SAI. Tiến lên 1 bước.` : `Chính xác! Bạn tiến lên 1 bước.`]);
      addPoints(points, 'solo', true);
      addGold(Math.floor(points / 2), true);
      if (Math.random() < 0.2) {
        addRuby(1);
        setBattleLog(prev => [...prev, `May mắn! Bạn nhặt được 1 Ruby.`]);
      }
      
      if (currentQuiz.explanation) {
        setBattleLog(prev => [...prev, `Kiến thức: ${currentQuiz.explanation}`]);
      }
      updateWeaknesses(currentQuiz.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử thế giới', 'remove');
      updateQuestProgress('battle_win', 1, currentQuiz.category);
    } else {
      soundManager.play('failure');
      if (shieldActive) {
        setShieldActive(false);
        setBattleLog(prev => [...prev, `Lớp bảo vệ đã đỡ đòn cho bạn! Không bị chững lại.`]);
      } else {
        const correctText = typeof currentQuiz.correctAnswer === 'number' ? currentQuiz.options?.[currentQuiz.correctAnswer as number] : currentQuiz.correctAnswer;
        setBattleLog(prev => [...prev, isReverseMode ? `Sai rồi! Bạn bị chững lại.` : `Sai rồi! Đáp án đúng là: ${correctText}. Bạn bị chững lại.`]);
        if (currentQuiz.explanation) {
          setBattleLog(prev => [...prev, `Giải thích: ${currentQuiz.explanation}`]);
        }
        updateWeaknesses(currentQuiz.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử thế giới', 'add');
      }
    }
    
    // Update cooldowns
    setSkillCooldowns(prev => {
      const newCooldowns = { ...prev };
      Object.keys(newCooldowns).forEach(key => {
        if (newCooldowns[key] > 0) newCooldowns[key] -= 1;
      });
      return newCooldowns;
    });
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuiz(quizQuestions[nextIndex]);
        setSelectedAnswer(null);
        setShowHint(false);
        setIsTransitioning(false);
        setBattleLog(prev => [...prev, `--- Câu hỏi tiếp theo (${nextIndex + 1}/${quizQuestions.length}) ---`]);
      } else {
        setAiSummary("Bạn đã thể hiện bản lĩnh của một bậc vĩ nhân. Máy đã hoàn toàn bị khuất phục trước kiến thức uyên bác của bạn!");
        setGameState('result');
      }
    }, 2000);
  };

  const handleCharacterAnswer = (answer: string) => {
    if (!currentCharacterQuiz || selectedCharAnswer !== null || isTransitioning) return;
    setSelectedCharAnswer(answer);
    const isCorrect = isReverseMode ? answer !== currentCharacterQuiz.correctAnswer : answer === currentCharacterQuiz.correctAnswer;
    
    if (isCorrect) {
      soundManager.play('success');
      let points = 150;
      
      // Apply general effects
      if (activeGeneralEffects.score_multiplier) {
        points = Math.floor(points * activeGeneralEffects.score_multiplier);
        setActiveGeneralEffects(prev => {
          const { score_multiplier, ...rest } = prev;
          return rest;
        });
      }

      if (activeGeneralEffects.damage_boost) {
        points = Math.floor(points * activeGeneralEffects.damage_boost);
      }
      
      setScore(s => s + points);
      if (gameType === 'vs_machine' || gameType === 'pvp') {
        setAiHp(prev => {
          const next = Math.max(0, prev - 25);
          if (next <= 0) {
            setGameState('result');
            setBattleLog(prevLog => ['Bạn đã chiến thắng đối thủ!', ...prevLog]);
          }
          return next;
        });
      }
      setBattleLog(prev => [...prev, isReverseMode ? `Chính xác! Bạn đã tìm ra đáp án SAI. Gây ${points} sát thương.` : `Tuyệt vời! Bạn đã nhận ra ${answer}. Gây ${points} sát thương.`]);
      if (currentCharacterQuiz.explanation) {
        setBattleLog(prev => [...prev, `Thông tin: ${currentCharacterQuiz.explanation}`]);
      }
      addPoints(points, 'solo', true);
      addGold(Math.floor(points / 2), true);
      if (Math.random() < 0.2) {
        addRuby(1);
        setBattleLog(prev => [...prev, `May mắn! Bạn nhặt được 1 Ruby.`]);
      }
      updateWeaknesses(currentCharacterQuiz.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử thế giới', 'remove');
      updateQuestProgress('battle_win', 1, currentCharacterQuiz.category);
    } else {
      soundManager.play('failure');
      if (shieldActive) {
        setShieldActive(false);
        setBattleLog(prev => [...prev, `Lớp bảo vệ đã đỡ đòn cho bạn! Không bị trừ HP.`]);
      } else {
        const damageTaken = 25;
        setHp(prev => Math.max(0, prev - damageTaken));
        setBattleLog(prev => [...prev, isReverseMode ? `Sai rồi! Bạn mất ${damageTaken} HP.` : `Sai rồi! Đó là ${currentCharacterQuiz.correctAnswer}. Bạn mất ${damageTaken} HP.`]);
        if (currentCharacterQuiz.explanation) {
          setBattleLog(prev => [...prev, `Giải thích: ${currentCharacterQuiz.explanation}`]);
        }
        updateWeaknesses(currentCharacterQuiz.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử thế giới', 'add');
      }
    }
    
    // Update cooldowns
    setSkillCooldowns(prev => {
      const newCooldowns = { ...prev };
      Object.keys(newCooldowns).forEach(key => {
        if (newCooldowns[key] > 0) newCooldowns[key] -= 1;
      });
      return newCooldowns;
    });
    
    setIsTransitioning(true);
    setTimeout(() => {
      setHp(currentHp => {
        if (currentHp <= 0) {
          setGameState('result');
          return 0;
        }
        
        if (currentQuestionIndex < characterQuizQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setCurrentCharacterQuiz(characterQuizQuestions[nextIndex]);
          setSelectedCharAnswer(null);
          setShowHint(false);
          setIsTransitioning(false);
          setBattleLog(prev => [...prev, `--- Câu hỏi tiếp theo (${nextIndex + 1}/${characterQuizQuestions.length}) ---`]);
        } else {
          setAiSummary("Nhân vật này không thể làm khó được bạn. Một chiến thắng thuyết phục!");
          setGameState('result');
        }
        return currentHp;
      });
    }, 2000);
  };

  const handleEpithetAnswer = (answer: string) => {
    if (!currentEpithetQuiz || selectedCharAnswer !== null || isTransitioning) return;
    setSelectedCharAnswer(answer);
    const isCorrect = isReverseMode ? answer !== currentEpithetQuiz.correctAnswer : answer === currentEpithetQuiz.correctAnswer;
    
    if (isCorrect) {
      soundManager.play('success');
      let points = 150;
      
      // Apply general effects
      if (activeGeneralEffects.score_multiplier) {
        points = Math.floor(points * activeGeneralEffects.score_multiplier);
        setActiveGeneralEffects(prev => {
          const { score_multiplier, ...rest } = prev;
          return rest;
        });
      }

      if (activeGeneralEffects.damage_boost) {
        points = Math.floor(points * activeGeneralEffects.damage_boost);
      }
      
      setScore(s => s + points);
      if (gameType === 'vs_machine' || gameType === 'pvp') {
        setAiHp(prev => {
          const next = Math.max(0, prev - 25);
          if (next <= 0) {
            setGameState('result');
            setBattleLog(prevLog => ['Bạn đã chiến thắng đối thủ!', ...prevLog]);
          }
          return next;
        });
      }
      setBattleLog(prev => [...prev, isReverseMode ? `Chính xác! Bạn đã tìm ra đáp án SAI. Gây ${points} sát thương.` : `Chính xác! ${answer} chính là người mang danh hiệu này. Gây ${points} sát thương.`]);
      if (currentEpithetQuiz.explanation) {
        setBattleLog(prev => [...prev, `Thông tin: ${currentEpithetQuiz.explanation}`]);
      }
      addPoints(points, 'solo', true);
      addGold(Math.floor(points / 2), true);
      if (Math.random() < 0.2) {
        addRuby(1);
        setBattleLog(prev => [...prev, `May mắn! Bạn nhặt được 1 Ruby.`]);
      }
      updateWeaknesses(currentEpithetQuiz.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử thế giới', 'remove');
      updateQuestProgress('battle_win', 1, currentEpithetQuiz.category);
    } else {
      soundManager.play('failure');
      if (shieldActive) {
        setShieldActive(false);
        setBattleLog(prev => [...prev, `Lớp bảo vệ đã đỡ đòn cho bạn! Không bị trừ HP.`]);
      } else {
        const damageTaken = 30;
        setHp(prev => Math.max(0, prev - damageTaken));
        setBattleLog(prev => [...prev, isReverseMode ? `Sai rồi! Bạn mất ${damageTaken} HP.` : `Sai rồi! Danh hiệu này thuộc về ${currentEpithetQuiz.correctAnswer}. Bạn mất ${damageTaken} HP.`]);
        if (currentEpithetQuiz.explanation) {
          setBattleLog(prev => [...prev, `Giải thích: ${currentEpithetQuiz.explanation}`]);
        }
        updateWeaknesses(currentEpithetQuiz.category === 'VN' ? 'Lịch sử Việt Nam' : 'Lịch sử thế giới', 'add');
      }
    }
    
    // Update cooldowns
    setSkillCooldowns(prev => {
      const newCooldowns = { ...prev };
      Object.keys(newCooldowns).forEach(key => {
        if (newCooldowns[key] > 0) newCooldowns[key] -= 1;
      });
      return newCooldowns;
    });
    
    setIsTransitioning(true);
    setTimeout(() => {
      setHp(currentHp => {
        if (currentHp <= 0) {
          setGameState('result');
          return 0;
        }

        if (currentQuestionIndex < epithetQuizQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setCurrentEpithetQuiz(epithetQuizQuestions[nextIndex]);
          setSelectedCharAnswer(null);
          setShowHint(false);
          setIsTransitioning(false);
          setBattleLog(prev => [...prev, `--- Câu hỏi tiếp theo (${nextIndex + 1}/${epithetQuizQuestions.length}) ---`]);
        } else {
          setGameState('result');
        }
        return currentHp;
      });
    }, 3500);
  };

  const handlePlayAgain = () => {
    soundManager.play('click');
    if (lastMode === 'battle') startBattle(difficulty);
    else if (lastMode === 'character_battle') startCharacterBattle();
    else if (lastMode === 'epithet_battle') startEpithetBattle();
    else if (lastMode === 'dap_son_ha') startDapSonHa(gameType);
    else if (lastMode === 'true_false') startTrueFalse();
    else if (lastMode === 'fill_blank') startFillBlank();
    else if (lastMode === 'ranked') startRankedBattle(gameType === 'vs_machine' ? 'machine' : gameType as any);
    else if (lastMode === 'su_van') startSuVan();
    else if (lastMode === 'raid') startRaid();
    else if (lastMode === 'event_guessing') startEventGuessing();
    else if (lastMode === 'chronological') startChronological();
    else if (lastMode === 'dynasty') startDynasty();
    else setGameState('mode_selection');
  };

  return (
    <div className="pt-24 pb-24 px-4 w-full max-w-7xl mx-auto">
      {/* Server Raid Banner */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        onClick={startRaid}
        className="bg-gradient-to-r from-[#FF6321]/20 to-transparent border border-[#FF6321]/30 rounded-2xl p-6 mb-8 flex justify-between items-center cursor-pointer group"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown size={14} className="text-[#FF6321] animate-pulse" />
            <h4 className="text-[10px] font-bold text-[#FF6321] uppercase tracking-widest">Phó bản toàn Server</h4>
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic group-hover:text-[#FF6321] transition-colors">Chiến dịch Điện Biên Phủ</h3>
          <p className="text-xs text-gray-400 mt-1">Cùng cộng đồng tiêu diệt cứ điểm cuối cùng.</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 w-48 h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="h-full bg-[#FF6321] shadow-[0_0_10px_#FF6321]"
              />
            </div>
            <span className="text-[10px] font-bold text-[#FF6321]">65% HP</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#FF6321] flex items-center justify-center text-black">
            <Sword size={24} />
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Tham gia ngay</span>
        </div>
      </motion.div>

      {gameState === 'selection' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Chọn Tướng</h1>
              <p className="text-gray-400 text-sm mt-2">Mỗi vị tướng có kỹ năng đặc biệt hỗ trợ bạn.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => (window as any).dispatchEvent(new CustomEvent('openStory'))}
                className="p-3 bg-[#FF6321]/10 border border-[#FF6321]/30 rounded-2xl text-[#FF6321] hover:bg-[#FF6321]/20 transition-all"
                title="Cốt Truyện"
              >
                <BookOpen size={20} />
              </button>
              <button 
                onClick={() => (window as any).dispatchEvent(new CustomEvent('openPet'))}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"
                title="Linh Thú"
              >
                <Zap size={20} />
              </button>
            </div>
          </div>

          {/* Daily Missions */}
          <div className="bg-[#1A1B1E] border border-white/10 rounded-2xl p-4 mb-8">
            <h3 className="text-[10px] font-bold text-[#FF6321] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap size={14} /> Nhiệm vụ hàng ngày
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-gray-300">Vượt ải Chi Lăng (Thắng 1 trận)</span>
                <span className="text-[10px] font-bold text-[#FF6321]">50 P</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-gray-300">Chiến dịch Điện Biên Phủ (Trả lời 3 câu đúng)</span>
                <span className="text-[10px] font-bold text-gray-500">0/3</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GENERALS.map((gen) => (
              <motion.div
                key={gen.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => selectGeneral(gen.id)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 p-4 cursor-pointer transition-all",
                  user.selectedGeneralId === gen.id ? "border-[#FF6321] bg-[#FF6321]/10" : "border-white/10 bg-[#1A1B1E] hover:border-white/30"
                )}
              >
                <div className="w-full h-48 bg-white/5 rounded-xl mb-4 flex items-center justify-center">
                  {/* Image removed as per request */}
                </div>
                <h3 className="text-xl font-bold text-white">{gen.name}</h3>
                <p className="text-[10px] text-[#FF6321] uppercase font-bold tracking-widest mb-2">{gen.title}</p>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{gen.description}</p>
                <div className="space-y-2">
                  {gen.skills.map((skill, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap size={12} className="text-[#FF6321] mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-white uppercase">{skill.name}</p>
                        <p className="text-[9px] text-gray-500">{skill.effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {user.selectedGeneralId === gen.id && (
                  <div className="absolute top-2 right-2 bg-[#FF6321] text-black p-1 rounded-full">
                    <Shield size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => {
              soundManager.play('click');
              setGameState('mode_selection');
            }}
            className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#FF7A45] transition-all mt-8"
          >
            Tiếp Theo
          </button>
        </div>
      )}

      {/* Dap Son Ha Buff Selection Modal */}
      <AnimatePresence>
        {showDapSonHaBuffSelection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1B1E] border border-[#FF6321]/30 p-8 rounded-[2.5rem] max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-[#FF6321]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#FF6321]/30">
                <Zap className="text-[#FF6321]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-2 tracking-tighter">Chọn Bùa Hộ Thân</h3>
              <p className="text-gray-500 text-sm mb-8">Sau 4 lượt leo núi, bạn được chọn 1 sự trợ giúp từ thần linh.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Thần Tốc', desc: 'Leo nhanh gấp đôi trong lượt tới', icon: Zap, type: 'buff' },
                  { name: 'Thiên Nhãn', desc: 'Xoá đáp án sai ở câu kế tiếp', icon: Eye, type: 'buff' },
                  { name: 'Kim Cang', desc: 'Tạo giáp bảo vệ ngay lập tức', icon: Shield, type: 'buff' },
                  { name: 'Sương Mù', desc: 'Làm mờ câu hỏi của đối thủ (5s)', icon: AlertTriangle, type: 'debuff' },
                  { name: 'Đóng Băng', desc: 'Đối thủ không thể leo núi (5s)', icon: Zap, type: 'debuff' }
                ].map((buff) => (
                  <button
                    key={buff.name}
                    onClick={() => {
                      if (buff.name === 'Kim Cang') {
                        setDapSonHaShield(true);
                      } else if (buff.name === 'Đóng Băng') {
                        setIsAiStunned(true);
                        setTimeout(() => setIsAiStunned(false), 5000);
                        setBattleLog(prev => ['BẠN DÙNG: Đóng Băng đối thủ!', ...prev]);
                      } else if (buff.name === 'Sương Mù') {
                        setBattleLog(prev => ['BẠN DÙNG: Sương Mù che mắt đối thủ!', ...prev]);
                      } else {
                        setActiveDapSonHaBuffs(prev => [...prev, buff.name]);
                      }
                      setShowDapSonHaBuffSelection(false);
                      soundManager.play('success');
                    }}
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-2xl transition-all text-left group",
                      buff.type === 'buff' 
                        ? "bg-white/5 border-white/10 hover:border-[#FF6321] hover:bg-[#FF6321]/5" 
                        : "bg-red-500/5 border-red-500/10 hover:border-red-500 hover:bg-red-500/10"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-all",
                      buff.type === 'buff' ? "bg-white/5 group-hover:bg-[#FF6321]/20" : "bg-red-500/10 group-hover:bg-red-500/30"
                    )}>
                      <buff.icon size={20} className={buff.type === 'buff' ? "text-[#FF6321]" : "text-red-500"} />
                    </div>
                    <div>
                      <h4 className={cn("text-sm font-bold uppercase", buff.type === 'buff' ? "text-white" : "text-red-500")}>{buff.name}</h4>
                      <p className="text-[10px] text-gray-500">{buff.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {gameState === 'mode_selection' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
          <h2 className="text-3xl font-black text-white uppercase italic mb-12 text-center">Chọn Chế Độ Chơi</h2>
          
          {!selectedModeCategory ? (
            <StartButtonHub onStartMatch={(mode) => {
              soundManager.play('click');
              if (mode === 'ranked') setGameState('ranked_mode_selection');
              else if (mode === 'normal') setSelectedModeCategory('normal');
              else if (mode === 'fun') setSelectedModeCategory('fun');
            }} onInteraction={() => {
              setDialogueText("Hôm nay leo hạng chứ?");
              setShowDialogue(true);
              setTimeout(() => setShowDialogue(false), 3000);
            }} />
          ) : (
            <div className="w-full max-w-2xl">
              <button 
                onClick={() => setSelectedModeCategory(null)}
                className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold"
              >
                ← Quay lại
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModeCategory === 'normal' && (
                  <>
                    <button onClick={() => startMode('battle')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Trắc nghiệm</h3>
                      <p className="text-xs text-gray-400">Kiểm tra kiến thức lịch sử với các câu hỏi đa lựa chọn.</p>
                    </button>
                    <button onClick={() => startMode('true_false')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Đúng/Sai</h3>
                      <p className="text-xs text-gray-400">Phán đoán nhanh tính xác thực của các sự kiện.</p>
                    </button>
                    <button onClick={() => startMode('fill_blank')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Điền từ</h3>
                      <p className="text-xs text-gray-400">Hoàn thiện các đoạn văn lịch sử còn thiếu.</p>
                    </button>
                  </>
                )}
                {selectedModeCategory === 'fun' && (
                  <>
                    <button onClick={() => startMode('character')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Đoán nhân vật</h3>
                      <p className="text-xs text-gray-400">Nhận diện các danh nhân lịch sử qua dữ kiện.</p>
                    </button>
                    <button onClick={() => startMode('epithet')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Nối danh xưng</h3>
                      <p className="text-xs text-gray-400">Ghép nối đúng tên gọi và danh xưng của các nhân vật.</p>
                    </button>
                    <button onClick={() => startMode('dap_son_ha')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Đạp Sơn Hà</h3>
                      <p className="text-xs text-gray-400">Chế độ sinh tồn leo tháp với độ khó tăng dần.</p>
                    </button>
                    <button onClick={() => startMode('su_van')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Sử Văn</h3>
                      <p className="text-xs text-gray-400">Thử thách vận may và kiến thức ngẫu nhiên.</p>
                    </button>
                    <button onClick={() => startMode('event_guessing')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Định Vị Lịch Sử</h3>
                      <p className="text-xs text-gray-400">Đoán sự kiện dựa trên địa điểm và thời gian.</p>
                    </button>
                    <button onClick={() => startMode('chronological')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Sắp Xếp Thời Gian</h3>
                      <p className="text-xs text-gray-400">Sắp xếp các sự kiện theo đúng thứ tự thời gian.</p>
                    </button>
                    <button onClick={() => startMode('dynasty')} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left">
                      <h3 className="text-lg font-bold text-white mb-2">Phân Loại Triều Đại</h3>
                      <p className="text-xs text-gray-400">Xác định nhân vật/sự kiện thuộc triều đại nào.</p>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          
          {showDialogue && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-6 bg-[#FF6321] text-black p-4 rounded-2xl shadow-xl z-50 font-bold">
              {dialogueText}
            </motion.div>
          )}
          
          <div className="max-w-md mx-auto mt-12 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#FF6321] uppercase tracking-widest text-left">Lịch sử</label>
              <div className="flex gap-2">
                {(['All', 'VN', 'World'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setSelectedPeriods([]);
                    }}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all",
                      category === cat ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10"
                    )}
                  >
                    {cat === 'All' ? 'Tất cả' : cat === 'VN' ? 'Việt Nam' : 'Thế Giới'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-bold text-[#FF6321] uppercase tracking-widest text-left">Thời kỳ (Chọn nhiều)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedPeriods([])}
                className={cn(
                  "py-2 px-3 rounded-xl text-[10px] font-bold uppercase border transition-all",
                  selectedPeriods.length === 0 ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                )}
              >
                Tất cả
              </button>
              {periods.map(p => (
                <button
                  key={p}
                  onClick={() => {
                    soundManager.play('click');
                    setSelectedPeriods(prev => 
                      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                    );
                  }}
                  className={cn(
                    "py-2 px-3 rounded-xl text-[10px] font-bold uppercase border transition-all text-left truncate",
                    selectedPeriods.includes(p) ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#FF6321] uppercase tracking-widest text-left">Cài đặt</label>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsReverseMode(!isReverseMode);
              }}
              className={cn(
                "w-full py-3 rounded-lg text-[10px] font-bold uppercase border transition-all flex items-center justify-center gap-2",
                isReverseMode ? "bg-red-500/20 text-red-500 border-red-500" : "bg-white/5 text-gray-500 border-white/10"
              )}
            >
              {isReverseMode ? 'Chế độ nghịch đảo: BẬT' : 'Chế độ nghịch đảo: TẮT'}
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                toggleTheme();
              }}
              className="w-full py-3 rounded-lg text-[10px] font-bold uppercase border border-white/10 bg-white/5 text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {theme === 'dark' ? 'Chế độ: Tối' : 'Chế độ: Sáng'}
            </button>
          </div>
        </div>
      )}

      {gameState === 'difficulty' && (
        <div className="space-y-6 text-center py-12">
          <h2 className="text-3xl font-black text-white uppercase italic mb-8">Chọn Độ Khó</h2>
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            {(['Sơ', 'Trung', 'Cao'] as const).map((d) => (
              <button
                key={d}
                onClick={() => {
                  soundManager.play('click');
                  startBattle(d);
                }}
                className={cn(
                  "py-6 rounded-2xl border-2 font-black uppercase tracking-widest transition-all",
                  d === 'Sơ' ? "border-green-500/30 bg-green-500/10 text-green-500" :
                  d === 'Trung' ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500" :
                  "border-red-500/30 bg-red-500/10 text-red-500"
                )}
              >
                Chế độ {d}
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              soundManager.play('click');
              setGameState('selection');
            }}
            className="text-gray-500 uppercase font-bold text-xs mt-8"
          >
            Quay lại
          </button>
        </div>
      )}

      {gameState === 'battle' && currentQuiz && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col md:flex-row gap-6">
            {renderVerticalTrack()}
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex-1 w-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6321]" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                      Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}
                    </span>
                    <div className="flex gap-1.5">
                      {[...Array(quizQuestions.length)].map((_, i) => (
                        <div key={i} className={cn(
                          "w-2 h-2 rounded-full transition-all duration-500",
                          i < currentQuestionIndex ? "bg-[#FF6321] shadow-[0_0_5px_#FF6321]" : i === currentQuestionIndex ? "bg-white animate-pulse scale-125" : "bg-white/10"
                        )} />
                      ))}
                    </div>
                  </div>
                  {gameType === 'vs_machine' && (
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 max-w-[200px] hidden sm:block">
                      <div className="flex h-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentQuestionIndex / quizQuestions.length) * 100}%` }}
                          className="h-full bg-[#FF6321] shadow-[0_0_10px_#FF6321]"
                        />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(aiQuestionIndex / 10) * 100}%` }}
                          className="h-full bg-purple-500 opacity-50"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={175.9}
                      animate={{ strokeDashoffset: 175.9 * (1 - timeLeft / 60) }}
                      className={cn(
                        "transition-all duration-1000",
                        timeLeft <= 10 ? "text-red-500" : "text-[#FF6321]"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white font-mono">
                    {timeLeft}
                  </div>
                </div>
              </div>

              {isReverseMode && (
                <div className="bg-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl mb-6 text-center border border-red-500/30 animate-pulse">
                  CHẾ ĐỘ NGHỊCH ĐẢO: TÌM ĐÁP ÁN SAI!
                </div>
              )}

              <motion.h2 
                key={currentQuestionIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-white leading-tight mb-10 min-h-[4rem]"
              >
                {currentQuiz.question}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuiz.options.map((opt, i) => {
                  const isCorrect = i === currentQuiz.correctAnswer;
                  const isSelected = i === selectedAnswer;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={selectedAnswer !== null}
                      onClick={() => {
                        soundManager.play('click');
                        handleAnswer(i);
                      }}
                      className={cn(
                        "w-full p-6 text-left border-2 rounded-2xl transition-all relative group overflow-hidden",
                        selectedAnswer === null 
                          ? "bg-white/5 border-white/5 hover:border-[#FF6321] hover:bg-white/10" 
                          : isCorrect 
                            ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                            : isSelected 
                              ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                              : "bg-white/5 border-white/5 opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-lg font-bold">{opt}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/10 rounded text-[8px] font-black uppercase tracking-widest text-white">Bạn</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Kỹ năng Tướng</h3>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-blue-500" />
                  <span className="text-xs font-mono font-bold text-white">{Math.floor(energy)}/{maxEnergy}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {GENERALS.find(g => g.id === user.selectedGeneralId)?.skills.map((skill, idx) => {
                  const cooldown = skillCooldowns[skill.name] || 0;
                  const isPassive = skill.type === 'passive';
                  const canUse = !isPassive && energy >= 30 && cooldown === 0 && selectedAnswer === null;
                  return (
                    <button
                      key={idx}
                      disabled={!canUse && !isPassive}
                      onClick={() => useSkill(idx)}
                      className={cn(
                        "flex flex-col items-center p-4 rounded-2xl border transition-all relative group",
                        isPassive 
                          ? "bg-blue-500/5 border-blue-500/20" 
                          : canUse
                            ? "bg-[#FF6321]/10 border-[#FF6321]/30 hover:border-[#FF6321] hover:bg-[#FF6321]/20"
                            : "bg-white/5 border-white/10 opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110",
                        isPassive ? "bg-blue-500/20 text-blue-400" : "bg-[#FF6321]/20 text-[#FF6321]"
                      )}>
                        {isPassive ? <Shield size={20} /> : <Zap size={20} />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">{skill.name}</span>
                      {!isPassive && <span className="text-[8px] font-bold text-blue-400 mt-1">30 NL</span>}
                      {cooldown > 0 && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl font-mono font-bold text-[#FF6321]">
                          {cooldown}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký chiến trường
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.includes('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.includes('SAI RỒI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-white/5 text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
                {battleLog.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 italic text-xs text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                      <Sword size={20} />
                    </div>
                    Chưa có ghi chép trận đấu...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF6321] to-[#FF8C00] rounded-3xl p-6 text-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Điểm hiện tại</p>
                  <p className="text-2xl font-black font-mono leading-none">{score}</p>
                </div>
              </div>
              <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentQuestionIndex / quizQuestions.length) * 100}%` }}
                  className="h-full bg-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'character_battle' && currentCharacterQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6321]" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                    Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}
                  </span>
                  <span className="text-[10px] text-[#FF6321] uppercase font-bold tracking-widest">Nhân vật lịch sử</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>

              {gameType === 'vs_machine' && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-red-500 flex items-center gap-1"><Heart size={12} /> Sinh lực</span>
                      <span className="text-white">{hp}/{maxHp}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-purple-500 flex items-center gap-1"><Cpu size={12} /> Máy</span>
                      <span className="text-white">{aiHp}/{maxHp}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(aiHp / maxHp) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8 p-8 bg-white/5 rounded-3xl border border-white/10 italic text-xl text-white text-center relative">
                <Quote className="absolute top-4 left-4 text-white/10" size={40} />
                "{currentCharacterQuiz.quote}"
                <Quote className="absolute bottom-4 right-4 text-white/10 rotate-180" size={40} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCharacterQuiz.options.map((opt, i) => {
                  const isCorrect = opt === currentCharacterQuiz.correctAnswer;
                  const isSelected = opt === selectedCharAnswer;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={selectedCharAnswer !== null}
                      onClick={() => {
                        soundManager.play('click');
                        handleCharacterAnswer(opt);
                      }}
                      className={cn(
                        "w-full p-6 text-left border-2 rounded-2xl transition-all relative group overflow-hidden",
                        selectedCharAnswer === null 
                          ? "bg-white/5 border-white/5 hover:border-[#FF6321] hover:bg-white/10" 
                          : isCorrect 
                            ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                            : isSelected 
                              ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                              : "bg-white/5 border-white/10 opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-lg font-bold">{opt}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Kỹ năng Tướng</h3>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-blue-500" />
                  <span className="text-xs font-mono font-bold text-white">{Math.floor(energy)}/{maxEnergy}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {GENERALS.find(g => g.id === user.selectedGeneralId)?.skills.map((skill, idx) => {
                  const cooldown = skillCooldowns[skill.name] || 0;
                  const isPassive = skill.type === 'passive';
                  const canUse = !isPassive && energy >= 30 && cooldown === 0 && selectedCharAnswer === null;
                  return (
                    <button
                      key={idx}
                      disabled={!canUse && !isPassive}
                      onClick={() => useSkill(idx)}
                      className={cn(
                        "flex flex-col items-center p-4 rounded-2xl border transition-all relative group",
                        isPassive 
                          ? "bg-blue-500/5 border-blue-500/20" 
                          : canUse
                            ? "bg-[#FF6321]/10 border-[#FF6321]/30 hover:border-[#FF6321] hover:bg-[#FF6321]/20"
                            : "bg-white/5 border-white/10 opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110",
                        isPassive ? "bg-blue-500/20 text-blue-400" : "bg-[#FF6321]/20 text-[#FF6321]"
                      )}>
                        {isPassive ? <Shield size={20} /> : <Zap size={20} />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">{skill.name}</span>
                      {!isPassive && <span className="text-[8px] font-bold text-blue-400 mt-1">30 NL</span>}
                      {cooldown > 0 && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl font-mono font-bold text-[#FF6321]">
                          {cooldown}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký chiến trường
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.includes('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.includes('SAI RỒI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-white/5 text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {gameState === 'epithet_battle' && currentEpithetQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6321]" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                    Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}
                  </span>
                  <span className="text-[10px] text-[#FF6321] uppercase font-bold tracking-widest">Danh hiệu nhân vật</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowHint(true)}
                    className="text-[10px] text-[#FF6321] uppercase font-bold tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <HelpCircle size={12} /> Gợi ý (ESC)
                  </button>
                  <div className="text-2xl font-black text-white font-mono">
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {gameType === 'vs_machine' && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-red-500 flex items-center gap-1"><Heart size={12} /> Sinh lực</span>
                      <span className="text-white">{hp}/{maxHp}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-purple-500 flex items-center gap-1"><Cpu size={12} /> Máy</span>
                      <span className="text-white">{aiHp}/{maxHp}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(aiHp / maxHp) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8 p-8 bg-white/5 rounded-3xl border border-white/10 text-center relative">
                <p className="text-gray-500 uppercase font-bold text-[10px] tracking-widest mb-2">Ai được mệnh danh là:</p>
                <h2 className="text-3xl font-black text-[#FF6321] italic">"{currentEpithetQuiz.epithet}"</h2>
              </div>

              {showHint && currentEpithetQuiz.hint && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#FF6321]/10 border border-[#FF6321]/30 rounded-xl text-xs text-[#FF6321] italic flex items-center gap-3"
                >
                  <HelpCircle size={16} />
                  <span>Gợi ý: {currentEpithetQuiz.hint}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEpithetQuiz.options.map((opt, i) => {
                  const isCorrect = opt === currentEpithetQuiz.correctAnswer;
                  const isSelected = opt === selectedCharAnswer;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={selectedCharAnswer !== null}
                      onClick={() => {
                        soundManager.play('click');
                        handleEpithetAnswer(opt);
                      }}
                      className={cn(
                        "w-full p-6 text-left border-2 rounded-2xl transition-all relative group overflow-hidden",
                        selectedCharAnswer === null 
                          ? "bg-white/5 border-white/5 hover:border-[#FF6321] hover:bg-white/10" 
                          : isCorrect 
                            ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                            : isSelected 
                              ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                              : "bg-white/5 border-white/5 opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-lg font-bold">{opt}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Kỹ năng Tướng</h3>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-blue-500" />
                  <span className="text-xs font-mono font-bold text-white">{Math.floor(energy)}/{maxEnergy}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {GENERALS.find(g => g.id === user.selectedGeneralId)?.skills.map((skill, idx) => {
                  const cooldown = skillCooldowns[skill.name] || 0;
                  const isPassive = skill.type === 'passive';
                  const canUse = !isPassive && energy >= 30 && cooldown === 0 && selectedCharAnswer === null;
                  return (
                    <button
                      key={idx}
                      disabled={!canUse && !isPassive}
                      onClick={() => useSkill(idx)}
                      className={cn(
                        "flex flex-col items-center p-4 rounded-2xl border transition-all relative group",
                        isPassive 
                          ? "bg-blue-500/5 border-blue-500/20" 
                          : canUse
                            ? "bg-[#FF6321]/10 border-[#FF6321]/30 hover:border-[#FF6321] hover:bg-[#FF6321]/20"
                            : "bg-white/5 border-white/10 opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110",
                        isPassive ? "bg-blue-500/20 text-blue-400" : "bg-[#FF6321]/20 text-[#FF6321]"
                      )}>
                        {isPassive ? <Shield size={20} /> : <Zap size={20} />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">{skill.name}</span>
                      {!isPassive && <span className="text-[8px] font-bold text-blue-400 mt-1">30 NL</span>}
                      {cooldown > 0 && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl font-mono font-bold text-[#FF6321]">
                          {cooldown}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký chiến trường
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.includes('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.includes('SAI RỒI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-white/5 text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {gameState === 'word_search' && (
        <WordSearchView user={user} addPoints={addPoints} onBack={() => setGameState('mode_selection')} />
      )}

      {gameState === 'raid' && currentQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center bg-[#1A1B1E] p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6321]/5 to-transparent" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#FF6321]/20 flex items-center justify-center border border-[#FF6321]/30 shadow-[0_0_20px_rgba(255,99,33,0.3)]">
                  <Crown size={40} className="text-[#FF6321]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Cứ điểm Him Lam</h2>
                  <p className="text-xs text-[#FF6321] uppercase font-bold tracking-[0.3em]">Boss Phó Bản Toàn Server</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-5xl font-black text-[#FF6321] font-mono leading-none">{score}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">Sát thương gây ra</p>
              </div>
            </div>

            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6321]" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                    Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}
                  </span>
                  <div className="flex gap-2">
                    {[...Array(quizQuestions.length)].map((_, i) => (
                      <div key={i} className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-500",
                        i < currentQuestionIndex ? "bg-[#FF6321] shadow-[0_0_8px_#FF6321]" : i === currentQuestionIndex ? "bg-white animate-pulse scale-125" : "bg-white/10"
                      )} />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">
                  Đang công phá...
                </div>
              </div>

              {isReverseMode && (
                <div className="bg-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl mb-6 text-center border border-red-500/30 animate-pulse">
                  CHẾ ĐỘ NGHỊCH ĐẢO: TÌM ĐÁP ÁN SAI!
                </div>
              )}
              
              <motion.h2 
                key={currentQuestionIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-white leading-tight mb-10 min-h-[4rem]"
              >
                {currentQuiz.question}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuestion(currentQuiz, handleRaidAnswer, selectedAnswer)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký chiến trường
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.startsWith('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.startsWith('THẤT BẠI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'su_van' && currentQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center bg-[#1A1B1E] p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <Dices size={40} className="text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Vòng Quay Sử Vận</h2>
                  <p className="text-xs text-purple-500 uppercase font-bold tracking-[0.3em]">Thử thách ngẫu nhiên</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-5xl font-black text-purple-500 font-mono leading-none">{score}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">Điểm tích lũy</p>
              </div>
            </div>

            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                    Câu hỏi {currentQuestionIndex + 1}/10
                  </span>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">
                  Đang gieo xúc xắc...
                </div>
              </div>
              
              <motion.h2 
                key={currentQuestionIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-white leading-tight mb-10 min-h-[4rem]"
              >
                {currentQuiz.question}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuestion(currentQuiz, handleSuVanAnswer, selectedAnswer)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký hành trình
                </h3>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.startsWith('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.startsWith('SAI RỒI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'event_guessing' && currentEventGuessingQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                    Câu {currentQuestionIndex + 1}/{eventGuessingQuestions.length}
                  </span>
                  <span className="text-[10px] text-blue-500 uppercase font-bold tracking-widest">Điểm: {score}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Địa điểm</p>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-500" size={24} />
                    <span className="text-xl font-bold text-white">{currentEventGuessingQuiz.location}</span>
                  </div>
                </div>
                <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Thời gian</p>
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-500" size={24} />
                    <span className="text-xl font-bold text-white">Năm {currentEventGuessingQuiz.year}</span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-widest">Sự kiện nào đã xảy ra?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEventGuessingQuiz.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEventGuessingAnswer(option)}
                    disabled={isTransitioning}
                    className={cn(
                      "p-6 rounded-2xl border text-left transition-all relative overflow-hidden group",
                      isTransitioning && option === currentEventGuessingQuiz.correctAnswer ? "bg-green-500/20 border-green-500 text-green-400" :
                      isTransitioning && option !== currentEventGuessingQuiz.correctAnswer ? "bg-white/5 border-white/10 text-gray-500 opacity-50" :
                      "bg-white/5 border-white/10 text-white hover:border-blue-500 hover:bg-blue-500/5"
                    )}
                  >
                    <span className="relative z-10 font-bold">{option}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký định vị
                </h3>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.startsWith('Chính xác') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.startsWith('Sai rồi') ? "bg-red-500/5 border-red-500/10 text-red-400" : "text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'chronological' && currentChronologicalQuiz && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6321]/20 rounded-xl flex items-center justify-center text-[#FF6321]">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Sắp Xếp Thời Gian</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Câu {currentQuestionIndex + 1} / {chronologicalQuestions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Điểm số</p>
                  <p className="text-xl font-black text-[#FF6321]">{score}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#FF6321] flex items-center justify-center relative">
                  <span className="text-sm font-black text-white">{timeLeft}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-lg font-bold text-white text-center mb-6">Sắp xếp các sự kiện sau theo thứ tự thời gian (từ xưa đến nay):</p>
              
              <div className="space-y-3">
                {chronologicalOrder.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    layout
                    className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl group hover:border-[#FF6321]/50 transition-all"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-[#FF6321]">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-sm font-bold text-white">{event.text}</div>
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => {
                          if (idx > 0) {
                            const newOrder = [...chronologicalOrder];
                            [newOrder[idx], newOrder[idx-1]] = [newOrder[idx-1], newOrder[idx]];
                            setChronologicalOrder(newOrder);
                          }
                        }}
                        disabled={idx === 0 || isTransitioning}
                        className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white disabled:opacity-20"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (idx < chronologicalOrder.length - 1) {
                            const newOrder = [...chronologicalOrder];
                            [newOrder[idx], newOrder[idx+1]] = [newOrder[idx+1], newOrder[idx]];
                            setChronologicalOrder(newOrder);
                          }
                        }}
                        disabled={idx === chronologicalOrder.length - 1 || isTransitioning}
                        className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white disabled:opacity-20"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const sortedEvents = [...currentChronologicalQuiz.events].sort((a, b) => a.year - b.year);
                const isCorrect = chronologicalOrder.every((event, idx) => event.id === sortedEvents[idx].id);
                handleChronologicalAnswer(isCorrect);
              }}
              disabled={isTransitioning}
              className="w-full py-4 bg-[#FF6321] text-black font-black uppercase italic tracking-tighter rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isTransitioning ? 'Đang kiểm tra...' : 'Xác nhận thứ tự'}
            </button>
          </div>
        </div>
      )}

      {gameState === 'dynasty' && currentDynastyQuiz && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6321]/20 rounded-xl flex items-center justify-center text-[#FF6321]">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Phân Loại Triều Đại</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Câu {currentQuestionIndex + 1} / {dynastyQuestions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Điểm số</p>
                  <p className="text-xl font-black text-[#FF6321]">{score}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#FF6321] flex items-center justify-center relative">
                  <span className="text-sm font-black text-white">{timeLeft}</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <p className="text-[10px] text-[#FF6321] font-black uppercase tracking-[0.2em] mb-2">Nhân vật / Sự kiện</p>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{currentDynastyQuiz.subject}</h3>
              <p className="text-gray-400 text-sm mt-4">Thuộc triều đại nào sau đây?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDynastyQuiz.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleDynastyAnswer(opt)}
                  disabled={isTransitioning}
                  className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#FF6321] hover:bg-[#FF6321]/5 transition-all group disabled:opacity-50"
                >
                  <span className="text-sm font-bold text-white group-hover:text-[#FF6321]">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'social' && (
        <SocialView user={user} />
      )}

      {(gameState === 'true_false' || gameState === 'fill_blank') && quizQuestions[currentQuestionIndex] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6321]" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                    Câu {currentQuestionIndex + 1}/{quizQuestions.length}
                  </span>
                  <span className="text-[10px] text-[#FF6321] uppercase font-bold tracking-widest">Điểm: {score}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>

              {gameType === 'vs_machine' && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-red-500 flex items-center gap-1"><Heart size={12} /> Sinh lực</span>
                      <span className="text-white">{hp}/{maxHp}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-purple-500 flex items-center gap-1"><Cpu size={12} /> Máy</span>
                      <span className="text-white">{aiHp}/{maxHp}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(aiHp / maxHp) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight">{quizQuestions[currentQuestionIndex].question}</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {renderQuestion(
                  quizQuestions[currentQuestionIndex], 
                  gameState === 'true_false' ? (idx) => handleTrueFalseAnswer(idx as number) : (val) => handleFillBlankAnswer(val as string),
                  selectedAnswer
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký chiến trường
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.includes('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.includes('SAI RỒI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-white/5 text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {gameState === 'sub_mode_selection' && (
        <div className="space-y-12 py-12 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Chọn Hình Thức</h2>
            <p className="text-gray-500 uppercase tracking-widest font-bold text-xs">Bạn muốn thử thách bản thân hay đấu với máy?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.play('click');
                finalizeModeStart('solo');
              }}
              className="p-10 rounded-3xl bg-[#1A1B1E] border-2 border-white/10 hover:border-[#FF6321] transition-all group"
            >
              <UserIcon size={48} className="mx-auto mb-4 text-gray-500 group-hover:text-[#FF6321] transition-colors" />
              <h3 className="text-2xl font-bold text-white uppercase italic">Chế Độ Đơn</h3>
              <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">Tập trung rèn luyện bản thân</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.play('click');
                finalizeModeStart('vs_machine');
              }}
              className="p-10 rounded-3xl bg-[#FF6321]/5 border-2 border-[#FF6321]/20 hover:border-[#FF6321] transition-all group"
            >
              <Cpu size={48} className="mx-auto mb-4 text-[#FF6321]" />
              <h3 className="text-2xl font-bold text-white uppercase italic">Đấu Với Máy</h3>
              <p className="text-[10px] text-[#FF6321] mt-2 uppercase font-bold tracking-widest">Thử thách tốc độ cùng AI</p>
            </motion.button>
          </div>

          <button
            onClick={() => setGameState('mode_selection')}
            className="text-gray-500 uppercase font-black text-xs tracking-widest hover:text-white transition-colors"
          >
            Quay Lại
          </button>
        </div>
      )}

      {gameState === 'dap_son_ha_selection' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Đạp Sơn Hà</h1>
            <p className="text-gray-500 font-medium">Chọn chế độ chinh phục đỉnh núi.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => startDapSonHa('solo')}
              className="group bg-[#1A1B1E] border border-white/10 p-8 rounded-[2.5rem] hover:border-green-500/50 transition-all text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30">
                <UserIcon className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">Đấu Đơn</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Chinh phục đỉnh núi một mình. Không có công thủ và bùa hại.</p>
            </button>

            <button 
              onClick={() => startDapSonHa('vs_machine')}
              className="group bg-[#1A1B1E] border border-white/10 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                <Cpu className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">Đấu Máy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Thi thố với AI. Có cơ chế công thủ và bùa hại.</p>
            </button>

            <button 
              onClick={() => startDapSonHa('pvp')}
              className="group bg-[#1A1B1E] border border-white/10 p-8 rounded-[2.5rem] hover:border-[#FF6321]/50 transition-all text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-[#FF6321]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#FF6321]/30">
                <Users className="text-[#FF6321]" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">Đấu Người</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Đối đầu trực tiếp với người chơi khác (Simulated PvP).</p>
            </button>
          </div>
          
          <button onClick={() => setGameState('mode_selection')} className="text-gray-500 hover:text-white transition-all flex items-center gap-2 mx-auto uppercase font-black text-xs tracking-widest">
            <ArrowRight className="rotate-180" size={16} /> Quay lại
          </button>
        </div>
      )}

      {gameState === 'dap_son_ha' && quizQuestions[currentQuestionIndex] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4">
          {/* Mountain Progress */}
          <div className="lg:col-span-3 bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[400px]">
            <div className="text-center w-full">
              <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest mb-4">Độ Cao</h3>
              <div className="flex justify-center items-end gap-2">
                <div className="text-4xl font-black text-white italic">{mountainHeight}</div>
                {gameType !== 'solo' && (
                  <div className="text-xl font-black text-red-500 italic mb-1">/ {gameType === 'vs_machine' ? aiMountainHeight : opponentMountainHeight}</div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 uppercase mt-1 font-bold">Bậc (Bạn / Đối Thủ)</p>
            </div>

            <div className="relative w-16 h-64 bg-white/5 rounded-full overflow-hidden border border-white/10 my-8">
              {/* Opponent Progress Bar */}
              {gameType !== 'solo' && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${((gameType === 'vs_machine' ? aiMountainHeight : opponentMountainHeight) / targetHeight) * 100}%` }}
                  className="absolute bottom-0 right-0 w-1/2 bg-red-500/20"
                />
              )}
              
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(mountainHeight / targetHeight) * 100}%` }}
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FF6321] to-[#FF8A5C] shadow-[0_0_20px_rgba(255,99,33,0.4)]"
              />
              
              {/* Mountain Markers */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-white/10" style={{ bottom: `${(i + 1) * 20}%` }} />
              ))}
              
              {/* Player Icon */}
              <motion.div 
                animate={{ bottom: `${(mountainHeight / targetHeight) * 100}%` }}
                className="absolute left-1/4 -translate-x-1/2 -mb-4 z-20"
              >
                <div className="bg-white p-1 rounded-full shadow-lg relative">
                  <Mountain size={14} className="text-[#FF6321]" />
                  {dapSonHaShield && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.5 }}
                      className="absolute inset-0 border-2 border-blue-500 rounded-full"
                    />
                  )}
                </div>
              </motion.div>

              {/* Opponent Icon */}
              {gameType !== 'solo' && (
                <motion.div 
                  animate={{ bottom: `${((gameType === 'vs_machine' ? aiMountainHeight : opponentMountainHeight) / targetHeight) * 100}%` }}
                  className="absolute right-1/4 translate-x-1/2 -mb-4 z-10"
                >
                  <div className="bg-red-500 p-1 rounded-full shadow-lg relative">
                    {gameType === 'vs_machine' ? <Cpu size={14} className="text-white" /> : <UserIcon size={14} className="text-white" />}
                    {opponentShield && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full scale-150" />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="w-full space-y-2">
              <div className="text-[10px] text-gray-500 uppercase font-bold text-center mb-2">Trạng Thái</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {isAiStunned && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-500 text-[8px] font-bold rounded-full border border-red-500/30 animate-pulse">
                    ĐỐI THỦ BỊ KHỐNG CHẾ
                  </span>
                )}
                {dapSonHaShield && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-[8px] font-bold rounded-full border border-blue-500/30">
                    ĐANG CÓ GIÁP
                  </span>
                )}
                {activeDapSonHaBuffs.length > 0 ? activeDapSonHaBuffs.map((buff, i) => (
                  <span key={i} className="px-2 py-1 bg-[#FF6321]/20 text-[#FF6321] text-[8px] font-bold rounded-full border border-[#FF6321]/30">
                    {buff}
                  </span>
                )) : !isAiStunned && !dapSonHaShield && <span className="text-[8px] text-gray-600 italic">Bình thường</span>}
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="text-3xl font-black text-white/20 font-mono">
                  {timeLeft}s
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#FF6321]/10 flex items-center justify-center border border-[#FF6321]/20">
                  <HelpCircle className="text-[#FF6321]" size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] text-[#FF6321] font-black uppercase tracking-widest">Thử Thách Leo Núi</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase italic">Câu hỏi số {currentQuestionIndex + 1}</p>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight">
                {quizQuestions[currentQuestionIndex].question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDapSonHaAction ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 space-y-6">
                    <h3 className="text-xl font-black text-[#FF6321] uppercase italic tracking-tighter animate-bounce">Chọn Hành Động Chiến Thuật!</h3>
                    <div className="flex gap-6 w-full max-w-md">
                      <button 
                        onClick={() => executeDapSonHaAction('attack')}
                        className="flex-1 group bg-red-500/10 border-2 border-red-500/30 p-6 rounded-2xl hover:bg-red-500/20 hover:border-red-500 transition-all flex flex-col items-center gap-3"
                      >
                        <Sword size={32} className="text-red-500 group-hover:scale-125 transition-transform" />
                        <span className="font-black text-red-500 uppercase tracking-widest">CÔNG</span>
                        <span className="text-[10px] text-red-500/60 font-bold">Tụt 2 bậc đối thủ</span>
                      </button>
                      <button 
                        onClick={() => executeDapSonHaAction('defend')}
                        className="flex-1 group bg-blue-500/10 border-2 border-blue-500/30 p-6 rounded-2xl hover:bg-blue-500/20 hover:border-blue-500 transition-all flex flex-col items-center gap-3"
                      >
                        <Shield size={32} className="text-blue-500 group-hover:scale-125 transition-transform" />
                        <span className="font-black text-blue-500 uppercase tracking-widest">THỦ</span>
                        <span className="text-[10px] text-blue-500/60 font-bold">Tạo giáp bảo vệ</span>
                      </button>
                    </div>
                  </div>
                ) : renderQuestion(
                  quizQuestions[currentQuestionIndex], 
                  handleDapSonHaAnswer, 
                  selectedAnswer,
                  activeDapSonHaBuffs.includes('Thiên Nhãn')
                )}
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 h-32 overflow-y-auto font-mono text-[10px] text-gray-500 space-y-1">
              {battleLog.map((log, i) => (
                <div key={i} className={cn(
                  "py-0.5",
                  log.includes('SỰ KIỆN') ? "text-[#FF6321] font-bold" :
                  log.includes('Leo lên') ? "text-green-400" :
                  log.includes('Trượt chân') ? "text-red-400" : ""
                )}>
                  {`> ${log}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'ranked_mode_selection' && (
        <div className="max-w-4xl mx-auto space-y-8 py-12">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Đấu Hạng</h1>
            <p className="text-gray-500 font-medium">Chọn hình thức thi đấu để thăng hạng.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => startRankedBattle('solo')}
              className="group bg-[#1A1B1E] border border-white/10 p-8 rounded-[2.5rem] hover:border-green-500/50 transition-all text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30">
                <UserIcon className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">Đấu Đơn</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Tự mình vượt qua thử thách 10 phút liên tục.</p>
            </button>

            <button 
              onClick={() => startRankedBattle('machine')}
              className="group bg-[#1A1B1E] border border-white/10 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                <Cpu className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">Đấu Máy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Thi thố với AI trong 10 phút liên tục.</p>
            </button>

            <button 
              onClick={() => startRankedBattle('pvp')}
              className="group bg-[#1A1B1E] border border-white/10 p-8 rounded-[2.5rem] hover:border-[#FF6321]/50 transition-all text-left relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-[#FF6321]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#FF6321]/30">
                <Users className="text-[#FF6321]" size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2">Đấu Người</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Đối đầu trực tiếp với người chơi khác (Simulated PvP).</p>
            </button>
          </div>
          
          <button onClick={() => setGameState('mode_selection')} className="text-gray-500 hover:text-white transition-all flex items-center gap-2 mx-auto uppercase font-black text-xs tracking-widest">
            <ArrowRight className="rotate-180" size={16} /> Quay lại
          </button>
        </div>
      )}

      {gameState === 'ranked_battle' && currentQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex gap-6">
            {renderVerticalTrack()}
            <div className="flex-1 space-y-8">
              <div className="flex justify-between items-center bg-[#1A1B1E] p-8 rounded-3xl border border-[#FF6321]/30 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-3 bg-[#FF6321] text-black text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">Ranked Match</div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6321]/20 flex items-center justify-center border border-[#FF6321]/30 shadow-[0_0_15px_rgba(255,99,33,0.2)]">
                    <Trophy className="text-[#FF6321]" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase italic leading-none">Đấu Hạng</h2>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2">{gameType === 'solo' ? 'Đấu Đơn' : gameType === 'vs_machine' ? 'Đấu Máy' : 'Đấu Người'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12 relative z-10">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Thời Gian</p>
                    <div className="text-3xl font-mono font-black text-white">
                      {Math.floor(rankedTimeLeft / 60)}:{(rankedTimeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Chính Xác</p>
                    <div className="text-3xl font-mono font-black text-[#FF6321]">
                      {rankedCorrectAnswers}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1B1E] p-10 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF6321]/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <span className="px-5 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/10">{currentQuiz.period}</span>
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-[#FF6321]" />
                    <span className="text-lg font-mono font-bold text-white">{energy}/{maxEnergy}</span>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight min-h-[4rem]">{currentQuiz.question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuiz.options?.map((option, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-left transition-all relative group overflow-hidden",
                        selectedAnswer === i 
                          ? (i === currentQuiz.correctAnswer ? "border-green-500 bg-green-500/10 text-green-400" : "border-red-500 bg-red-500/10 text-red-400")
                          : "border-white/5 bg-white/5 hover:border-[#FF6321]/50 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-lg font-bold">{option}</span>
                      </div>
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6321] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Kỹ năng Tướng</h3>
                <div className="w-2 h-2 rounded-full bg-[#FF6321] animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {GENERALS.find(g => g.id === user.selectedGeneralId)?.skills.map((skill, i) => {
                  const cooldown = skillCooldowns[skill.name] || 0;
                  const isPassive = skill.type === 'passive';
                  const canUse = !isPassive && energy >= 30 && cooldown === 0 && selectedAnswer === null;
                  return (
                    <button
                      key={i}
                      onClick={() => useSkill(i)}
                      disabled={!canUse && !isPassive}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group relative overflow-hidden",
                        isPassive 
                          ? "bg-blue-500/5 border-blue-500/20" 
                          : canUse
                            ? "bg-[#FF6321]/10 border-[#FF6321]/30 hover:border-[#FF6321] hover:bg-[#FF6321]/20"
                            : "bg-white/5 border-white/10 opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-transform group-hover:scale-110",
                        isPassive ? "bg-blue-500/20 text-blue-400" : "bg-[#FF6321]/20 text-[#FF6321]"
                      )}>
                        {isPassive ? <Shield size={20} /> : <Zap size={20} />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">{skill.name}</span>
                      {!isPassive && <span className="text-[8px] font-bold text-blue-400 mt-1">30 NL</span>}
                      {cooldown > 0 && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl font-mono font-bold text-[#FF6321]">
                          {cooldown}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl p-6 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> Nhật ký chiến trường
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {battleLog.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "text-[11px] leading-relaxed p-3 rounded-xl border border-transparent transition-colors",
                      log.includes('CHÍNH XÁC') ? "bg-green-500/5 border-green-500/10 text-green-400" : 
                      log.includes('SAI RỒI') ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-white/5 text-gray-400"
                    )}
                  >
                    <span className="text-gray-600 mr-2 font-mono">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}]</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {showBuffSelection && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1B1E] border border-[#FF6321]/30 rounded-[2.5rem] p-8 max-w-2xl w-full text-center"
          >
            <div className="w-20 h-20 bg-[#FF6321]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FF6321]">
              <Zap className="text-[#FF6321]" size={40} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic mb-2">Chọn Bùa Chú</h2>
            <p className="text-gray-500 mb-8">Sau 4 lượt, bạn được chọn một bùa chú hỗ trợ.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Thần Tốc', desc: 'Leo nhanh gấp đôi trong lượt tới!', icon: Zap },
                { name: 'Thiên Nhãn', desc: 'Xoá toàn bộ đáp án sai ở câu kế tiếp!', icon: Search },
                { name: 'Phúc Lành', desc: 'Hồi phục 1 HP!', icon: Heart }
              ].map((buff, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveDapSonHaBuffs(prev => [...prev, buff.name]);
                    setShowBuffSelection(false);
                    setCurrentQuestionIndex(prev => (prev + 1) % quizQuestions.length);
                    setWrongAttempts(0);
                    setQuestionStartTime(Date.now());
                    setTimeLeft(300);
                    soundManager.play('success');
                  }}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-[#FF6321] transition-all text-left group"
                >
                  <buff.icon className="text-[#FF6321] mb-4 group-hover:scale-110 transition-transform" size={24} />
                  <h4 className="text-white font-bold mb-1">{buff.name}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{buff.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      {gameState === 'result' && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-10 py-12 max-w-2xl mx-auto px-4"
        >
          <div className="relative inline-block">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-[#FF6321] to-transparent blur-3xl opacity-20" 
            />
            <Trophy size={140} className="text-[#FF6321] relative z-10 mx-auto drop-shadow-[0_0_30px_rgba(255,99,33,0.4)]" />
          </div>
          
          <div>
            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              {gameType === 'vs_machine' || gameType === 'pvp'
                ? (lastMode === 'dap_son_ha' 
                    ? (mountainHeight >= targetHeight ? "CHIẾN THẮNG!" : "THẤT BẠI!")
                    : lastMode === 'ranked'
                      ? (rankedCorrectAnswers >= 10 ? "THÔNG THÁI!" : "CẦN CỐ GẮNG!")
                      : (hp > 0 && aiHp <= 0 ? "CHIẾN THẮNG!" : hp <= 0 ? "THẤT BẠI!" : 
                         (currentQuestionIndex >= aiQuestionIndex ? "CHIẾN THẮNG!" : "THẤT BẠI!")))
                : lastMode === 'dap_son_ha' ? (mountainHeight >= targetHeight ? "CHINH PHỤC THÀNH CÔNG!" : "DỪNG CHÂN GIỮA NÚI") : 
                  "Kết Quả"}
            </h2>
            {aiSummary && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-purple-500/10 border border-purple-500/30 p-4 rounded-2xl relative"
              >
                <div className="absolute -top-3 left-6 px-2 bg-[#1A1B1E] text-purple-500 text-[8px] font-black uppercase tracking-widest">Tổng kết từ Máy</div>
                <p className="text-gray-300 text-sm italic leading-relaxed">"{aiSummary}"</p>
              </motion.div>
            )}
            <p className="text-gray-500 mt-4 uppercase tracking-[0.4em] font-bold text-xs">
              {lastMode === 'ranked' ? `Bạn đã trả lời đúng ${rankedCorrectAnswers} câu hỏi trong 10 phút` :
               gameType === 'vs_machine' ? "Trận chiến đối đầu với Máy" : 
               lastMode === 'dap_son_ha' ? (mountainHeight >= targetHeight ? "Bạn đã đứng trên đỉnh cao nhất" : "Hành trình gian nan, hãy thử lại lần sau") : 
               "Trận chiến đã được ghi vào sử sách"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1A1B1E] p-6 rounded-3xl border border-white/10">
              <p className="text-3xl font-black text-[#FF6321] font-mono leading-none">
                {lastMode === 'dap_son_ha' ? mountainHeight : lastMode === 'ranked' ? rankedCorrectAnswers : score}
              </p>
              <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-2">
                {lastMode === 'dap_son_ha' ? 'Độ cao' : lastMode === 'ranked' ? 'Câu đúng' : 'Điểm số'}
              </p>
            </div>
            <div className="bg-[#1A1B1E] p-6 rounded-3xl border border-white/10">
              <p className="text-3xl font-black text-white font-mono leading-none">
                {lastMode === 'ranked' ? (rankedCorrectAnswers >= 10 ? '+1 Sao' : '-1 Sao') : 
                 lastMode === 'dap_son_ha' ? (mountainHeight >= targetHeight ? '+50 CP' : '-10 CP') : 
                 Math.floor(score / 100)}
              </p>
              <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-2">
                {lastMode === 'ranked' ? 'Kết quả Rank' : lastMode === 'dap_son_ha' ? 'Lực chiến' : 'Công trạng'}
              </p>
            </div>
            <div className="bg-[#1A1B1E] p-6 rounded-3xl border border-white/10">
              <p className="text-3xl font-black text-green-500 font-mono leading-none">
                {Math.floor(score / 50)}
              </p>
              <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-2">Vàng nhận</p>
            </div>
            <div className="bg-[#1A1B1E] p-6 rounded-3xl border border-white/10">
              <p className="text-3xl font-black text-blue-400 font-mono leading-none">
                {hp}%
              </p>
              <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-2">Sinh lực còn</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            {score >= 500 && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const achievement = `Đạt ${score} điểm trong chế độ Đấu Trường`;
                  const description = `Vinh danh Sử Gia ${user.name} đã thể hiện sự am hiểu sâu sắc về lịch sử dân tộc với số điểm ấn tượng ${score} trong một trận đấu kịch tính.`;
                  const rarity = score >= 1000 ? 'legendary' : score >= 800 ? 'epic' : score >= 600 ? 'rare' : 'common';
                  const type = 'battle';
                  
                  const certData: Partial<CertificateData> = {
                    achievement,
                    description,
                    rarity,
                    type,
                    date: new Date().toLocaleDateString('vi-VN')
                  };
                  
                  addCertificate(achievement, description, type, rarity);
                  onShowCertificate(certData);
                }}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#8B4513] text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg flex items-center justify-center gap-3"
              >
                <Award size={20} />
                Nhận Bằng Khen
              </motion.button>
            )}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlayAgain}
              className="w-full bg-[#FF6321] text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-[#FF7A45] transition-all shadow-[0_10px_20px_rgba(255,99,33,0.2)]"
            >
              Tái Đấu
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameState('mode_selection')}
              className="w-full bg-white/5 text-white font-bold uppercase tracking-widest py-5 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
            >
              Về Sảnh Chờ
            </motion.button>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {showInstructions && instructionMode && (
          <GameInstructionModal 
            mode={instructionMode} 
            onConfirm={confirmStart} 
            onCancel={() => setShowInstructions(false)} 
            customConfig={customConfig}
            setCustomConfig={setCustomConfig}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CampaignView = ({ user, completePhase }: any) => {
  const [activeCategory, setActiveCategory] = useState<'VN' | 'World'>('VN');
  const currentPhaseId = user.campaignProgress?.currentPhaseId || 'vn_phase1';
  const activeQuests = user.campaignProgress?.activeQuests || [];
  const allQuestsDone = activeQuests.length > 0 && activeQuests.every((q: any) => q.isCompleted);

  const filteredPhases = CAMPAIGN_DATA.filter(p => p.category === activeCategory);

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Chiến Dịch Lịch Sử</h1>
          <p className="text-gray-400 text-sm mt-2">Hành trình xuyên không qua các thời kỳ hào hùng của dân tộc và thế giới.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveCategory('VN')}
          className={cn(
            "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2",
            activeCategory === 'VN' ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
          )}
        >
          Sử Việt
        </button>
        <button 
          onClick={() => setActiveCategory('World')}
          className={cn(
            "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2",
            activeCategory === 'World' ? "bg-[#FF6321] text-black border-[#FF6321]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
          )}
        >
          Sử Thế Giới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPhases.map((phase, idx) => {
          const isCompleted = user.campaignProgress?.completedPhases.includes(phase.id);
          const isCurrent = phase.id === currentPhaseId;
          const isLocked = !isCompleted && !isCurrent && user.level < phase.requiredLevel;

          return (
            <div 
              key={phase.id}
              className={cn(
                "relative overflow-hidden rounded-3xl border transition-all p-6",
                isCompleted ? "bg-green-500/5 border-green-500/20" : 
                isCurrent ? "bg-[#FF6321]/5 border-[#FF6321]/30 shadow-lg shadow-[#FF6321]/5" : 
                "bg-[#1A1B1E] border-white/5 opacity-60"
              )}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                  <Lock className="text-gray-500 mb-2" size={32} />
                  <p className="text-white font-bold uppercase text-xs">Yêu cầu Cấp độ {phase.requiredLevel}</p>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6321]">Chương {idx + 1}</span>
                    {isCompleted && <CheckCircle2 size={14} className="text-green-500" />}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic">{phase.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{phase.era}</p>
                </div>
                {isCurrent && (
                  <span className="px-3 py-1 bg-[#FF6321] text-black text-[10px] font-black rounded-full uppercase">Đang diễn ra</span>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-6 leading-relaxed">{phase.description}</p>

              {isCurrent && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nhiệm vụ hiện tại:</h4>
                  {phase.quests.map(quest => {
                    const progress = activeQuests.find((q: any) => q.id === quest.id);
                    const percent = progress ? (progress.progress / quest.target) * 100 : 0;
                    
                    return (
                      <div key={quest.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-white">{quest.title}</span>
                          <span className="text-[10px] font-mono text-[#FF6321]">{progress?.progress || 0}/{quest.target}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-3">{quest.description}</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className="h-full bg-[#FF6321]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-600 uppercase font-bold">Phần thưởng</span>
                    <span className="text-xs font-bold text-white">+{phase.rewards?.points || 0} Điểm</span>
                  </div>
                  {phase.rewards.title && (
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 uppercase font-bold">Danh hiệu</span>
                      <span className="text-xs font-bold text-[#FF6321]">{phase.rewards.title}</span>
                    </div>
                  )}
                </div>
                
                {isCurrent && (
                  <button 
                    onClick={() => {
                      soundManager.play('levelUp');
                      completePhase();
                    }}
                    disabled={!allQuestsDone}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] transition-all",
                      allQuestsDone ? "bg-[#FF6321] text-black hover:scale-105" : "bg-white/5 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    {allQuestsDone ? 'Hoàn Thành Chương' : 'Chưa Hoàn Thành'}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const SocialView = ({ user, joinGuild, leaveGuild, selectTitle, sendFriendRequest, acceptFriendRequest, updateFriendRelationship, useIntimacyItem }: any) => {
  const [tab, setTab] = useState<'friends' | 'guilds' | 'feedback' | 'titles' | 'relationships' | 'chat'>('friends');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guildNameInput, setGuildNameInput] = useState('');
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [selectedFriendForRel, setSelectedFriendForRel] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [globalChatMessages, setGlobalChatMessages] = useState<any[]>([]);
  const [globalChatMessage, setGlobalChatMessage] = useState('');
  const [showChatInput, setShowChatInput] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem('mock_global_chat');
    if (storedMessages) {
      setGlobalChatMessages(JSON.parse(storedMessages));
    } else {
      const initialMessages = [
        { id: '1', senderName: 'Hệ thống', content: 'Chào mừng đến với kênh chat thế giới!', timestamp: Date.now() }
      ];
      setGlobalChatMessages(initialMessages);
      localStorage.setItem('mock_global_chat', JSON.stringify(initialMessages));
    }
  }, []);

  const sendGlobalMessage = () => {
    if (!globalChatMessage.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      senderName: user.name || 'Bạn',
      content: globalChatMessage,
      timestamp: Date.now()
    };
    const updatedMessages = [...globalChatMessages, newMsg];
    setGlobalChatMessages(updatedMessages);
    localStorage.setItem('mock_global_chat', JSON.stringify(updatedMessages));
    setGlobalChatMessage('');
  };

  const relationshipTypes = ['Tri kỷ', 'Cố nhân', 'Tỷ muội', 'Huynh đệ', 'Túc địch', 'Nghịch lân'] as const;

  const guilds = [
    { id: 'g1', name: 'Hào Kiệt Việt', leader: 'Trần Hưng Đạo', members: 45, level: 10 },
    { id: 'g2', name: 'Sử Việt Kiêu Hùng', leader: 'Lê Lợi', members: 32, level: 8 },
    { id: 'g3', name: 'Đại Việt Thần Võ', leader: 'Quang Trung', members: 48, level: 12 }
  ];

  const handleCreateGuild = () => {
    if (!guildNameInput.trim()) return;
    const newGuild = {
      id: `g${Date.now()}`,
      name: guildNameInput,
      leader: user.name,
      members: 1,
      level: 1
    };
    joinGuild(newGuild.id);
    setGuildNameInput('');
    setShowCreateGuild(false);
  };

  const handleAddFriend = () => {
    if (!friendNameInput.trim()) return;
    sendFriendRequest(friendNameInput);
    setFriendNameInput('');
    setShowAddFriend(false);
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      // Create a mock system notification
      const systemMsg = {
        id: Date.now().toString(),
        senderName: 'Hệ thống',
        content: `Cảm ơn sử gia ${user.name}! Ý kiến về "${feedback.substring(0, 20)}..." đã được ghi nhận vào sử ký cộng đồng.`,
        timestamp: Date.now()
      };
      setGlobalChatMessages(prev => [...prev, systemMsg]);
      localStorage.setItem('mock_global_chat', JSON.stringify([...globalChatMessages, systemMsg]));
      
      setFeedback('');
      setIsSubmitting(false);
      soundManager.play('success');
    }, 1000);
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Xã Hội</h1>
        <div className="flex bg-white/5 rounded-xl p-1 overflow-x-auto">
          <button 
            onClick={() => setTab('friends')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap", tab === 'friends' ? "bg-[#FF6321] text-black" : "text-gray-500")}
          >
            Bạn Bè
          </button>
          <button 
            onClick={() => setTab('guilds')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap", tab === 'guilds' ? "bg-[#FF6321] text-black" : "text-gray-500")}
          >
            Bang Hội
          </button>
          <button 
            onClick={() => setTab('chat')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap", tab === 'chat' ? "bg-[#FF6321] text-black" : "text-gray-500")}
          >
            Thế Giới
          </button>
          <button 
            onClick={() => setTab('relationships')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap", tab === 'relationships' ? "bg-[#FF6321] text-black" : "text-gray-500")}
          >
            Cố Nhân
          </button>
          <button 
            onClick={() => setTab('titles')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap", tab === 'titles' ? "bg-[#FF6321] text-black" : "text-gray-500")}
          >
            Danh Hiệu
          </button>
          <button 
            onClick={() => setTab('feedback')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap", tab === 'feedback' ? "bg-[#FF6321] text-black" : "text-gray-500")}
          >
            Góp Ý
          </button>
        </div>
      </div>

      {tab === 'friends' && (
        <div className="space-y-4">
          {/* Friend Requests */}
          {user.friendRequests && user.friendRequests.length > 0 && (
            <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-4 rounded-2xl mb-6">
              <h3 className="text-[10px] font-black text-[#FF6321] uppercase tracking-widest mb-3">Lời mời kết bạn ({user.friendRequests.length})</h3>
              <div className="space-y-2">
                {user.friendRequests.map((req: any) => (
                  <div key={req.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-white">{req.name}</p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold">{req.rank} • LVL {req.level}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => acceptFriendRequest(req.id)}
                        className="px-3 py-1 bg-[#FF6321] text-black text-[9px] font-black rounded-lg uppercase"
                      >
                        Chấp nhận
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowAddFriend(true)}
            className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 text-xs font-bold uppercase hover:border-[#FF6321] hover:text-[#FF6321] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            Thêm Bạn Bè
          </button>

          {showAddFriend && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-[#1A1B1E] border border-[#FF6321]/30 p-6 rounded-3xl overflow-hidden"
            >
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Tìm Kiếm Bằng Hữu</h4>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  value={friendNameInput}
                  onChange={(e) => setFriendNameInput(e.target.value)}
                  placeholder="Nhập tên người chơi..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#FF6321] outline-none"
                />
                <button 
                  onClick={handleAddFriend}
                  className="px-6 bg-[#FF6321] text-black font-bold uppercase text-[10px] rounded-xl"
                >
                  Gửi
                </button>
              </div>
              <button 
                onClick={() => setShowAddFriend(false)}
                className="w-full py-2 text-gray-500 text-[10px] font-bold uppercase"
              >
                Hủy
              </button>
            </motion.div>
          )}

          <div className="space-y-3">
            {user.friends.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                <Users className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 text-sm italic">Bạn chưa có bằng hữu nào.</p>
                <p className="text-gray-600 text-[10px] uppercase font-bold mt-2">Hãy kết bạn để cùng nhau chinh phục sử Việt.</p>
              </div>
            ) : (
              user.friends.map((f: any, i: number) => (
                <div key={i} className="bg-[#1A1B1E] border border-white/10 p-4 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", f.isOnline ? "bg-green-500" : "bg-gray-700")} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{f.name}</h4>
                          {f.id === 'system' && (
                            <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase border border-blue-500/30">
                              SYSTEM
                            </span>
                          )}
                          {f.relationshipType && (
                            <span className="text-[8px] bg-[#FF6321]/20 text-[#FF6321] px-1.5 py-0.5 rounded font-black uppercase border border-[#FF6321]/30">
                              {f.relationshipType}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{f.rank} • LVL {f.level}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-pink-500 uppercase">
                        <Heart size={10} /> Thân mật: {f.intimacy || 0} (Cấp {f.intimacyLevel || 1})
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-pink-500" 
                            style={{ width: `${Math.min(100, ((f.intimacy || 0) / ([250, 500, 1000, 2000, 3000][(f.intimacyLevel || 1) - 1] || 3000)) * 100)}%` }} 
                          />
                        </div>
                        {user.inventory.some((item: any) => item.id.startsWith('intimacy_')) && (
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-pink-500"
                          >
                            <ChevronUp size={14} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Intimacy Item Usage Section */}
                  <div className="mt-4 p-4 bg-pink-500/5 border border-pink-500/10 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ArrowUpCircle size={16} className="text-pink-500" />
                        <span className="text-xs font-black text-white uppercase italic tracking-tighter">Tăng cấp thân mật</span>
                      </div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold px-2 py-0.5 bg-white/5 rounded-full border border-white/5">Dùng vật phẩm</span>
                    </div>
                    
                    <div className="space-y-2">
                      {user.inventory.filter((item: any) => item.id.startsWith('intimacy_')).map((invItem: any) => {
                        const shopItem = SHOP_ITEMS.find(si => si.id === invItem.id);
                        if (!shopItem) return null;
                        return (
                          <div 
                            key={invItem.id} 
                            className="bg-[#1A1B1E]/60 border border-white/5 p-3 rounded-2xl flex items-center justify-between group hover:border-pink-500/30 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-all">
                                <shopItem.icon size={20} className="text-pink-500" />
                              </div>
                              <div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-tighter">{shopItem.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] text-gray-500 uppercase font-bold">Số lượng: {invItem.quantity}</span>
                                  <span className="text-[9px] text-pink-500 font-bold">+{shopItem.stats?.intimacy} Điểm</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                useIntimacyItem(f.id, invItem.id);
                                soundManager.play('success');
                              }}
                              className="w-10 h-10 bg-pink-500/20 border border-pink-500/30 rounded-xl flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all"
                              title="Sử dụng"
                            >
                              <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                          </div>
                        );
                      })}
                      {user.inventory.filter((item: any) => item.id.startsWith('intimacy_')).length === 0 && (
                        <div className="text-center py-6 px-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                          <p className="text-[10px] text-gray-500 italic leading-relaxed">
                            Bạn chưa có vật phẩm thân mật nào.<br/>
                            Hãy ghé <span className="text-[#FF6321] font-bold">Cửa Hàng</span> để mua thêm!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedFriendForRel(f.id)}
                      className="flex-1 py-2 bg-white/5 text-gray-400 text-[10px] font-bold uppercase rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Mối quan hệ
                    </button>
                    <button 
                      onClick={() => setActiveChat(f.name)}
                      className="flex-1 py-2 bg-[#FF6321] text-black text-[10px] font-black uppercase rounded-xl hover:bg-[#FF7A45] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={14} /> Trò chuyện
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Relationship Selector Modal */}
          <AnimatePresence>
            {selectedFriendForRel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#1A1B1E] border border-[#FF6321]/30 p-8 rounded-3xl max-w-md w-full"
                >
                  <h3 className="text-xl font-black text-white uppercase italic mb-6 text-center">Thiết Lập Quan Hệ</h3>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {relationshipTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          updateFriendRelationship(selectedFriendForRel, type);
                          setSelectedFriendForRel(null);
                        }}
                        className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase hover:bg-[#FF6321] hover:text-black transition-all"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedFriendForRel(null)}
                    className="w-full py-3 text-gray-500 font-bold uppercase text-xs"
                  >
                    Đóng
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Chat Interface */}
          <AnimatePresence>
            {activeChat && (
              <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0B]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6321]/10 flex items-center justify-center font-black text-[#FF6321]">
                      {activeChat[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{activeChat}</h3>
                      <p className="text-[10px] text-green-500 uppercase font-bold">Đang trực tuyến</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="p-2 text-gray-500 hover:text-white"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-sm text-gray-300">
                        {activeChat === 'Hệ thống' 
                          ? 'Chào mừng bạn đến với Đấu Trường Sử Việt! Tôi là Hệ Thống, luôn sẵn sàng hỗ trợ bạn trên con đường chinh phục lịch sử.' 
                          : 'Chào bạn! Rất vui được kết giao bằng hữu.'}
                      </p>
                      <span className="text-[8px] text-gray-600 uppercase font-bold mt-2 block">10:30 AM</span>
                    </div>
                  </div>
                  {activeChat === 'Hệ thống' && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                        <p className="text-sm text-gray-300">Bạn có thể hỏi tôi bất cứ điều gì về cách chơi hoặc các sự kiện lịch sử nhé!</p>
                        <span className="text-[8px] text-gray-600 uppercase font-bold mt-2 block">10:31 AM</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <div className="bg-[#FF6321]/10 border border-[#FF6321]/30 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                      <p className="text-sm text-white">Chào bạn! Cùng nhau leo rank nhé.</p>
                      <span className="text-[8px] text-[#FF6321]/60 uppercase font-bold mt-2 block">10:32 AM</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex gap-3">
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#FF6321] outline-none"
                  />
                  <button 
                    onClick={() => setChatMessage('')}
                    className="w-14 h-14 bg-[#FF6321] text-black rounded-xl flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {tab === 'chat' && (
        <div className="flex flex-col h-[60vh] bg-[#1A1B1E] border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={16} className="text-[#FF6321]" />
              Kênh Thế Giới
            </h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {globalChatMessages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.senderName === user.name ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm",
                  msg.senderName === user.name ? "bg-[#FF6321]/20 border border-[#FF6321]/30 text-white rounded-tr-none" : "bg-white/5 text-gray-300 rounded-tl-none"
                )}>
                  {msg.senderName !== user.name && (
                    <span className={cn("text-[10px] font-bold uppercase block mb-1", msg.senderName === 'Hệ thống' ? "text-blue-400" : "text-[#FF6321]")}>
                      {msg.senderName}
                    </span>
                  )}
                  <p>{msg.content}</p>
                  <span className="text-[8px] text-gray-500 uppercase font-bold mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2 items-center">
            {!showChatInput ? (
              <button 
                onClick={() => setShowChatInput(true)}
                className="w-12 h-12 bg-[#FF6321] text-black rounded-xl flex items-center justify-center hover:bg-[#FF7A45] transition-all mx-auto"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setShowChatInput(false)}
                  className="p-2 text-gray-500 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
                <input 
                  autoFocus
                  type="text"
                  value={globalChatMessage}
                  onChange={(e) => setGlobalChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendGlobalMessage();
                      setShowChatInput(false);
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#FF6321] outline-none"
                />
                <button 
                  onClick={() => {
                    sendGlobalMessage();
                    setShowChatInput(false);
                  }}
                  className="w-12 h-12 bg-[#FF6321] text-black rounded-xl flex items-center justify-center hover:bg-[#FF7A45] transition-all"
                >
                  <Send size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'guilds' && (
        <div className="space-y-4">
          {user.guildId ? (
            <div className="bg-[#FF6321]/10 border border-[#FF6321]/30 p-6 rounded-3xl text-center">
              <Shield className="mx-auto text-[#FF6321] mb-2" size={32} />
              <h3 className="text-xl font-black text-white uppercase italic">Bạn đã có Bang Hội</h3>
              <p className="text-gray-400 text-xs mt-1 mb-6">Bạn đang là thành viên của bang {guilds.find(g => g.id === user.guildId)?.name || 'nào đó'}.</p>
              <button 
                onClick={leaveGuild}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-red-500 uppercase hover:bg-red-500/10 transition-all"
              >
                Rời Bang Hội
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowCreateGuild(true)}
                  className="py-4 bg-[#FF6321] text-black font-bold uppercase text-xs rounded-2xl"
                >
                  Tạo Bang Hội
                </button>
                <button className="py-4 bg-white/5 border border-white/10 text-white font-bold uppercase text-xs rounded-2xl">Tìm Bang Hội</button>
              </div>

              {showCreateGuild && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-[#1A1B1E] border border-[#FF6321]/30 p-6 rounded-3xl overflow-hidden"
                >
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Tên Bang Hội Mới</h4>
                  <input 
                    type="text"
                    value={guildNameInput}
                    onChange={(e) => setGuildNameInput(e.target.value)}
                    placeholder="Nhập tên bang hội..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm mb-4 focus:border-[#FF6321] outline-none"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCreateGuild}
                      className="flex-1 py-3 bg-[#FF6321] text-black font-bold uppercase text-[10px] rounded-xl"
                    >
                      Xác Nhận Tạo
                    </button>
                    <button 
                      onClick={() => setShowCreateGuild(false)}
                      className="flex-1 py-3 bg-white/5 text-white font-bold uppercase text-[10px] rounded-xl"
                    >
                      Hủy
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {guilds.map((g, i) => (
            <div key={i} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic">{g.name}</h3>
                  <p className="text-[10px] text-[#FF6321] font-bold uppercase tracking-widest">Chủ bang: {g.leader}</p>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-500">LVL {g.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{g.members}/50 Thành viên</span>
                {!user.guildId && (
                  <button 
                    onClick={() => joinGuild(g.id)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/10"
                  >
                    Gia nhập
                  </button>
                )}
                {user.guildId === g.id && (
                  <span className="text-[10px] text-[#FF6321] font-bold uppercase tracking-widest">Đã gia nhập</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'relationships' && (
        <div className="space-y-4">
          <div className="bg-[#FF6321]/10 border border-[#FF6321]/30 p-6 rounded-3xl text-center mb-6">
            <Heart className="mx-auto text-[#FF6321] mb-2" size={32} />
            <h2 className="text-xl font-black text-white uppercase italic">Mối Quan Hệ Cố Nhân</h2>
            <p className="text-gray-400 text-xs mt-1">Nơi lưu giữ những mối liên kết tâm linh với các tiền nhân.</p>
          </div>

          {(!user.relationships || Object.keys(user.relationships).length === 0) ? (
            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 text-sm italic">Bạn chưa thiết lập mối quan hệ nào.</p>
              <p className="text-gray-600 text-[10px] uppercase font-bold mt-2">Hãy trò chuyện với Sử Gia AI để bắt đầu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(user.relationships).map(([ancestorId, rel]: [string, any]) => {
                const ancestor = GENERALS.find(a => a.id === ancestorId);
                return (
                  <div key={ancestorId} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 flex items-center justify-center font-black text-[#FF6321]">
                        {ancestor?.name[0]}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{ancestor?.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-[#FF6321] text-black px-1.5 py-0.5 rounded font-black uppercase">
                            {rel.type}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">
                            Từ: {rel.anniversary}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#FF6321] font-bold uppercase tracking-widest">Độ thân mật</p>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Heart key={s} size={10} className="text-[#FF6321]" fill="#FF6321" />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'titles' && (
        <div className="space-y-3">
          <p className="text-gray-500 text-xs font-bold uppercase mb-4">Danh hiệu đã sở hữu</p>
          {user.titles.map((title: string, i: number) => (
            <button
              key={i}
              onClick={() => selectTitle(title)}
              className={cn(
                "w-full bg-[#1A1B1E] border p-4 rounded-2xl flex justify-between items-center transition-all",
                user.selectedTitle === title ? "border-[#FF6321] bg-[#FF6321]/5" : "border-white/10"
              )}
            >
              <span className={cn("font-bold", user.selectedTitle === title ? "text-[#FF6321]" : "text-white")}>
                {title}
              </span>
              {user.selectedTitle === title && (
                <span className="text-[10px] bg-[#FF6321] text-black px-2 py-0.5 rounded font-black uppercase">Đang dùng</span>
              )}
            </button>
          ))}
        </div>
      )}

      {tab === 'feedback' && (
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <h3 className="text-xl font-black text-white uppercase italic mb-4">Góp Ý Phát Triển</h3>
          <p className="text-gray-400 text-sm mb-6">Chúng tôi luôn lắng nghe ý kiến của bạn để hoàn thiện Đấu Trường Sử Việt.</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Nhập góp ý của bạn tại đây..."
            className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#FF6321] outline-none transition-all mb-4 resize-none"
          />
          <button
            onClick={handleFeedbackSubmit}
            disabled={isSubmitting || !feedback.trim()}
            className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF7A45] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi Góp Ý'}
          </button>
        </div>
      )}
    </div>
  );
};

const LeaderboardView = ({ user, onStartRanked }: any) => {
  const [type, setType] = useState<'solo' | 'machine' | 'pvp' | 'dapSonHa' | 'hallOfFame'>('solo');
  const [dapSonHaType, setDapSonHaType] = useState<'solo' | 'machine' | 'pvp'>('solo');
  
  const romanize = (num: number) => {
    if (num > 5) return num.toString(); // For high ranks with 50 divisions
    const lookup: any = { V: 5, IV: 4, III: 3, II: 2, I: 1 };
    return Object.keys(lookup).find(key => lookup[key] === num) || num.toString();
  };

  const getRankedData = (mode: 'solo' | 'machine' | 'pvp') => {
    const stats = user.rankedStats?.[mode] || { tier: 'Đồng', division: 5, stars: 0 };
    return [
      { name: 'SửGiaVĩĐại', tier: 'Chiến Thần', division: 1, stars: 50 },
      { name: 'HàoKiệt99', tier: 'Chiến Tướng', division: 10, stars: 5 },
      { name: 'LạcHồng_Sử', tier: 'Cao Thủ', division: 1, stars: 5 },
      { name: user.name, ...stats, isMe: true },
    ].sort((a, b) => {
      const tiers = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Chiến Tướng', 'Chiến Thần'];
      const tierA = tiers.indexOf(a.tier);
      const tierB = tiers.indexOf(b.tier);
      if (tierB !== tierA) return tierB - tierA;
      if (a.division !== b.division) return a.division - b.division;
      return b.stars - a.stars;
    });
  };

  const mockSolo = [
    { name: 'SửGiaVĩĐại', rank: 'Chiến Thần', tier: 'Chiến Thần', division: 1, stars: 50, points: 15000 },
    { name: 'HàoKiệt99', rank: 'Chiến Tướng', tier: 'Chiến Tướng', division: 10, stars: 5, points: 12000 },
    { name: 'LạcHồng_Sử', rank: 'Cao Thủ', tier: 'Cao Thủ', division: 1, stars: 5, points: 10000 },
    { name: user.name, rank: user.rank, ...user.rankedStats?.solo, points: user.points, isMe: true },
  ].sort((a, b) => {
    const tiers = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Chiến Tướng', 'Chiến Thần'];
    const tierA = tiers.indexOf(a.tier || 'Đồng');
    const tierB = tiers.indexOf(b.tier || 'Đồng');
    if (tierB !== tierA) return tierB - tierA;
    if ((a.division || 5) !== (b.division || 5)) return (a.division || 5) - (b.division || 5);
    return (b.stars || 0) - (a.stars || 0);
  });

  const currentRankedData = (type === 'solo' || type === 'machine' || type === 'pvp') ? getRankedData(type) : [];

  const mockDapSonHa = [
    { name: 'SơnHàBảnKỷ', points: 5000, time: 120, tier: 'Vàng' },
    { name: 'ĐạiViệtSửKý', points: 4800, time: 135, tier: 'Vàng' },
    { name: 'KhâmĐịnhSử', points: 4800, time: 150, tier: 'Bạc' },
    { name: 'ViệtNamSửLược', points: 4200, time: 180, tier: 'Bạc' },
    { name: 'ĐạiNamThựcLục', points: 3500, time: 200, tier: 'Đồng' },
    { name: user.name, points: user.dapSonHaStats?.[dapSonHaType]?.points || 0, time: user.dapSonHaStats?.[dapSonHaType]?.time || 0, isMe: true }
  ].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return a.time - b.time; // Faster time wins tie
  }).map((p, i, arr) => {
    // Assign tiers based on position relative to total players
    const total = arr.length;
    let tier = 'Đồng';
    if (i < total * 0.2) tier = 'Vàng';
    else if (i < total * 0.5) tier = 'Bạc';
    return { ...p, tier };
  });

  const mockHallOfFame = [
    { name: 'TrầnHưngĐạo_Fan', achievement: 'Vô Địch Mùa 0', date: '2025-12-31', points: 99999 },
    { name: 'LêLợi_SửGia', achievement: 'Đệ Nhất Bang Hội', date: '2026-01-15', points: 88888 },
    { name: 'QuangTrung_Hero', achievement: 'Kỷ Lục Chuỗi Thắng (100)', date: '2026-02-20', points: 77777 },
  ];

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic mb-8">Bảng Xếp Hạng</h1>
      
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {(['solo', 'machine', 'pvp', 'dapSonHa', 'hallOfFame'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap transition-all",
              type === t ? "bg-[#FF6321] border-[#FF6321] text-black" : "border-white/10 text-gray-500"
            )}
          >
            {t === 'solo' ? 'Rank Đơn' : t === 'machine' ? 'Rank Máy' : t === 'pvp' ? 'Rank Người' : t === 'dapSonHa' ? 'Đạp Sơn Hà' : 'Bảng Vàng'}
          </button>
        ))}
      </div>

      {type === 'dapSonHa' && (
        <div className="flex gap-2 mb-6">
          {(['solo', 'machine', 'pvp'] as const).map(m => (
            <button
              key={m}
              onClick={() => setDapSonHaType(m)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                dapSonHaType === m ? "bg-white/10 border-white/20 text-white" : "border-transparent text-gray-500"
              )}
            >
              {m === 'solo' ? 'Đấu Đơn' : m === 'machine' ? 'Đấu Máy' : 'Đấu Người'}
            </button>
          ))}
        </div>
      )}

      {(type === 'solo' || type === 'machine' || type === 'pvp') && (
        <div className="mb-8">
          <button 
            onClick={onStartRanked}
            className="w-full py-4 bg-gradient-to-r from-[#FF6321] to-[#FF8C00] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <Trophy size={20} />
            Bắt đầu đấu Rank
          </button>
          <div className="mt-4 bg-[#1A1B1E] border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Thứ hạng</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sử gia</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bậc Rank</span>
            </div>
            <div className="divide-y divide-white/5">
              {currentRankedData.map((p, i) => (
                <div key={i} className={cn("p-4 flex justify-between items-center transition-all", p.isMe && "bg-[#FF6321]/10")}>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-lg font-black italic w-6", i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                      {i + 1}
                    </span>
                    <span className={cn("font-bold", p.isMe ? "text-[#FF6321]" : "text-white")}>{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-black text-white uppercase italic leading-none">{p.tier} {romanize(p.division)}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, idx) => (
                          <div key={idx} className={cn("w-2 h-2 rounded-full", idx < p.stars ? "bg-[#FF6321]" : "bg-white/10")} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'hallOfFame' ? (
        <div className="space-y-4">
          <div className="bg-[#FF6321]/10 border border-[#FF6321]/30 p-6 rounded-3xl text-center mb-8">
            <Trophy className="mx-auto text-[#FF6321] mb-2" size={32} />
            <h2 className="text-2xl font-black text-white uppercase italic">Bảng Vàng Thiên Cổ</h2>
            <p className="text-gray-400 text-xs mt-1">Nơi lưu danh những Sử Gia vĩ đại nhất mọi thời đại.</p>
          </div>
          {mockHallOfFame.map((item, i) => (
            <div key={i} className="bg-[#1A1B1E] border border-yellow-500/20 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <Shield className="text-yellow-500/20" size={48} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-yellow-500 uppercase italic">{item.name}</h3>
                  <span className="text-[10px] font-mono text-gray-500">{item.date}</span>
                </div>
                <p className="text-white font-bold text-sm mb-4">{item.achievement}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Điểm Kỷ Lục</span>
                  <span className="font-mono font-bold text-yellow-500">{(item.points || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : type === 'dapSonHa' ? (
        <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl overflow-hidden">
          {mockDapSonHa.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between p-4 border-b border-white/5",
                item.isMe ? "bg-[#FF6321]/10" : ""
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  "w-6 text-center font-black italic",
                  i === 0 ? "text-yellow-500 text-xl" : i === 1 ? "text-gray-400 text-lg" : i === 2 ? "text-orange-600" : "text-gray-600"
                )}>
                  {i + 1}
                </span>
                <div>
                  <h4 className={cn("font-bold", item.isMe ? "text-[#FF6321]" : "text-white")}>{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                      item.tier === 'Vàng' ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500" :
                      item.tier === 'Bạc' ? "bg-gray-400/20 border-gray-400/50 text-gray-400" :
                      "bg-orange-600/20 border-orange-600/50 text-orange-600"
                    )}>
                      Hạng {item.tier}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">{item.time}s</span>
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-white">{(item.points || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1A1B1E] border border-white/10 rounded-3xl overflow-hidden">
          {mockSolo.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between p-4 border-b border-white/5",
                item.isMe ? "bg-[#FF6321]/10" : ""
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  "w-6 text-center font-black italic",
                  i === 0 ? "text-yellow-500 text-xl" : i === 1 ? "text-gray-400 text-lg" : i === 2 ? "text-orange-600" : "text-gray-600"
                )}>
                  {i + 1}
                </span>
                <div>
                  <h4 className={cn("font-bold", item.isMe ? "text-[#FF6321]" : "text-white")}>{item.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">{item.rank}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-white">{(item.points || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const EventsView = ({ user, claimDailyLogin, spinWheel, addGold, addRuby }: any) => {
  const [activeTab, setActiveTab] = useState<'login' | 'spin' | 'entertainment'>('login');
  const [spinResult, setSpinResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const loginRewards = [
    { day: 1, type: 'gold', amount: 100 },
    { day: 2, type: 'ruby', amount: 10 },
    { day: 3, type: 'gold', amount: 300 },
    { day: 4, type: 'ruby', amount: 20 },
    { day: 5, type: 'gold', amount: 500 },
    { day: 6, type: 'ruby', amount: 50 },
    { day: 7, type: 'buff', amount: 1, name: 'x2 Vàng (10 trận)' },
  ];

  const handleSpin = () => {
    if (user.dailySpinUsed || isSpinning) return;
    setIsSpinning(true);
    soundManager.play('click');
    
    setTimeout(() => {
      const result = spinWheel();
      setSpinResult(result);
      setIsSpinning(false);
      soundManager.play('success');
    }, 2000);
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Sự Kiện</h1>
        <p className="text-gray-400 text-sm mt-2">Tham gia sự kiện để nhận nhiều phần quà hấp dẫn.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('login')}
          className={cn(
            "px-6 py-3 rounded-xl font-bold transition-all",
            activeTab === 'login' ? "bg-[#FF6321] text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          )}
        >
          Đăng Nhập Hàng Ngày
        </button>
        <button
          onClick={() => setActiveTab('spin')}
          className={cn(
            "px-6 py-3 rounded-xl font-bold transition-all",
            activeTab === 'spin' ? "bg-[#FF6321] text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          )}
        >
          Vòng Quay May Mắn
        </button>
        <button
          onClick={() => setActiveTab('entertainment')}
          className={cn(
            "px-6 py-3 rounded-xl font-bold transition-all",
            activeTab === 'entertainment' ? "bg-[#FF6321] text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
          )}
        >
          Lật Thẻ Nhận Quà
        </button>
      </div>

      {activeTab === 'entertainment' && (
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <EntertainmentView 
            user={user} 
            addGold={addGold} 
            addRuby={addRuby} 
            onBack={() => setActiveTab('login')} 
          />
        </div>
      )}

      {activeTab === 'login' && (
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6">Quà Đăng Nhập 7 Ngày</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loginRewards.map((reward, idx) => {
              const currentStreak = user.loginStreak || 1;
              const isClaimed = currentStreak > reward.day || (currentStreak === reward.day && user.lastLoginDate === new Date().toDateString());
              const isCurrent = currentStreak === reward.day && user.lastLoginDate !== new Date().toDateString();
              const isFuture = currentStreak < reward.day;

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 relative overflow-hidden",
                    isClaimed ? "bg-green-500/10 border-green-500/30 opacity-50" :
                    isCurrent ? "bg-[#FF6321]/10 border-[#FF6321] shadow-[0_0_15px_rgba(255,99,33,0.2)]" :
                    "bg-white/5 border-white/10"
                  )}
                >
                  {isClaimed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-gray-400">Ngày {reward.day}</span>
                  {reward.type === 'gold' && <Coins size={32} className="text-yellow-500" />}
                  {reward.type === 'ruby' && <Gem size={32} className="text-rose-500" />}
                  {reward.type === 'buff' && <Zap size={32} className="text-blue-400" />}
                  <span className={cn(
                    "font-bold",
                    reward.type === 'gold' ? "text-yellow-500" :
                    reward.type === 'ruby' ? "text-rose-500" : "text-blue-400"
                  )}>
                    {reward.type === 'buff' ? reward.name : `+${reward.amount}`}
                  </span>
                  
                  {isCurrent && (
                    <button 
                      onClick={claimDailyLogin}
                      className="mt-2 w-full py-1.5 bg-[#FF6321] text-black text-xs font-bold rounded-lg hover:bg-[#ff7a45] transition-colors"
                    >
                      Nhận
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'spin' && (
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-bold text-white mb-8">Vòng Quay Nhân Phẩm</h2>
          
          <div className="relative w-64 h-64 mb-8">
            <div className={cn(
              "w-full h-full rounded-full border-4 border-[#FF6321] flex items-center justify-center bg-[#151619] relative overflow-hidden transition-transform duration-[2000ms] ease-out",
              isSpinning ? "rotate-[1440deg]" : ""
            )}>
              {/* Simple wheel visual */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_45deg,rgba(255,255,255,0.05)_45deg_90deg,transparent_90deg_135deg,rgba(255,255,255,0.05)_135deg_180deg,transparent_180deg_225deg,rgba(255,255,255,0.05)_225deg_270deg,transparent_270deg_315deg,rgba(255,255,255,0.05)_315deg_360deg)]" />
              <Gift size={64} className={cn("text-[#FF6321]", isSpinning && "animate-pulse")} />
            </div>
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-[#FF6321] drop-shadow-[0_0_8px_rgba(255,99,33,0.8)]">
              ▼
            </div>
          </div>

          {!spinResult ? (
            <button 
              onClick={handleSpin}
              disabled={user.dailySpinUsed || isSpinning}
              className="px-8 py-3 bg-[#FF6321] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[#ff7a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user.dailySpinUsed ? 'Đã quay hôm nay' : 'Quay Ngay (Miễn phí)'}
            </button>
          ) : (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4">
              <p className="text-gray-400 mb-2">Chúc mừng bạn nhận được:</p>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                {spinResult.type === 'gold' && <Coins className="text-yellow-500" />}
                {spinResult.type === 'ruby' && <Gem className="text-rose-500" />}
                {spinResult.type === 'buff' && <Zap className="text-blue-400" />}
                <span className={cn(
                  spinResult.type === 'gold' ? "text-yellow-500" :
                  spinResult.type === 'ruby' ? "text-rose-500" : "text-blue-400"
                )}>
                  {spinResult.type === 'buff' ? spinResult.name : `+${spinResult.amount}`}
                </span>
              </div>
              <button 
                onClick={() => setSpinResult(null)}
                className="mt-6 text-sm text-gray-500 hover:text-white underline"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MailboxView = ({ user, readMail, claimMail }: any) => {
  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Hộp Thư</h1>
        <p className="text-gray-400 text-sm mt-2">Kiểm tra thông báo và nhận phần thưởng.</p>
      </div>

      <div className="space-y-4">
        {user.mailbox?.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic">Không có thư nào.</div>
        ) : (
          user.mailbox?.map((mail: any) => (
            <div key={mail.id} className={cn(
              "bg-[#1A1B1E] border p-6 rounded-3xl transition-all",
              mail.isRead ? "border-white/5 opacity-70" : "border-[#FF6321]/50 shadow-[0_0_15px_rgba(255,99,33,0.1)]"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    mail.isRead ? "bg-white/5 text-gray-500" : 
                    mail.type === 'justice' ? "bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" :
                    mail.type === 'reward' ? "bg-yellow-500/20 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" :
                    "bg-[#FF6321]/20 text-[#FF6321]"
                  )}>
                    {mail.type === 'justice' ? <ShieldCheck size={20} /> : 
                     mail.type === 'reward' ? <Trophy size={20} /> : <Mail size={20} />}
                  </div>
                  <div>
                    <h3 className={cn("text-lg font-bold", mail.isRead ? "text-gray-300" : "text-white")}>{mail.title}</h3>
                    <p className="text-xs text-gray-500">Từ: {mail.sender} • {mail.date}</p>
                  </div>
                </div>
                {!mail.isRead && (
                  <span className="px-2 py-1 bg-[#FF6321]/20 text-[#FF6321] text-[10px] font-bold uppercase tracking-widest rounded">Mới</span>
                )}
              </div>
              
              <p className="text-sm text-gray-300 mb-6">{mail.content}</p>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {mail.rewards?.map((reward: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      {reward.type === 'gold' ? (
                        <Coins size={14} className="text-yellow-500" />
                      ) : (
                        <Package size={14} className="text-blue-400" />
                      )}
                      <span className="text-xs font-bold text-white">
                        {reward.type === 'gold' ? `${reward.amount} Vàng` : `Vật phẩm x${reward.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {!mail.isRead && !mail.rewards && (
                    <button
                      onClick={() => readMail(mail.id)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all text-sm"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                  {mail.rewards && !mail.isClaimed && (
                    <button
                      onClick={() => claimMail(mail.id)}
                      className="px-4 py-2 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#FF7A45] transition-all text-sm"
                    >
                      Nhận Thưởng
                    </button>
                  )}
                  {mail.isClaimed && (
                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-500 font-bold text-sm">
                      Đã nhận
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ShopView = ({ user, purchaseItems, useItem, equipItem, unequipItem }: any) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const totalGold = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return item?.currency === 'gold' ? total + item.price * qty : total;
  }, 0);

  const totalRuby = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return item?.currency === 'ruby' ? total + item.price * qty : total;
  }, 0);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;

    if (user.gold < totalGold) {
      alert("Bạn không đủ vàng!");
      return;
    }
    if (user.ruby < totalRuby) {
      alert("Bạn không đủ Ruby!");
      return;
    }

    if (purchaseItems(cart, totalGold, totalRuby)) {
      alert("Thanh toán thành công!");
      setCart({});
    } else {
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  const handleUseItem = (itemId: string, name: string) => {
    if (useItem(itemId, 1)) {
      alert(`Bạn đã sử dụng ${name}`);
    }
  };

  const handleEquip = (item: Item) => {
    if (item.slot) {
      equipItem(item.id, item.slot);
      alert(`Đã trang bị ${item.name}`);
    }
  };

  const handleUnequip = (slot: any, item: Item) => {
    unequipItem(slot);
    alert(`Đã tháo ${item.name}`);
  };

  return (
    <div className="pt-24 pb-32 px-4 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
            {activeTab === 'shop' ? 'Cửa Hàng' : 'Túi Đồ'}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {activeTab === 'shop' ? 'Dùng vàng để mua các vật phẩm quý hiếm.' : 'Quản lý các vật phẩm bạn đang sở hữu.'}
          </p>
        </div>
        <div className="flex bg-[#1A1B1E] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('shop')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'shop' ? "bg-[#FF6321] text-black" : "text-gray-400 hover:text-white"
            )}
          >
            Cửa Hàng
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'inventory' ? "bg-[#FF6321] text-black" : "text-gray-400 hover:text-white"
            )}
          >
            Túi Đồ
          </button>
        </div>
      </div>

      {activeTab === 'shop' ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 gap-4">
            {SHOP_ITEMS.map(item => (
              <div key={item.id} className="bg-[#1A1B1E] border border-white/10 p-4 rounded-3xl flex items-center justify-between group hover:border-[#FF6321] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FF6321]/10 transition-all">
                    <item.icon size={24} className="text-gray-500 group-hover:text-[#FF6321]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <p className="text-[10px] text-gray-500">{item.description}</p>
                    <div className={cn(
                      "text-xs font-bold mt-1 flex items-center gap-1",
                      item.currency === 'ruby' ? "text-rose-500" : "text-yellow-500"
                    )}>
                      {item.price} {item.currency === 'ruby' ? <Gem size={12} /> : <Coins size={12} />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cart[item.id] ? (
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 text-white hover:bg-[#FF6321] hover:text-black transition-all"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-white">{cart[item.id]}</span>
                      <button 
                        onClick={() => addToCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 text-white hover:bg-[#FF6321] hover:text-black transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-[#FF6321] hover:text-black hover:border-[#FF6321] transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {Object.keys(cart).length > 0 && (
            <div className="w-full md:w-80 shrink-0">
              <div className="bg-[#1A1B1E] border border-[#FF6321]/30 p-6 rounded-3xl sticky top-24">
                <h3 className="text-lg font-black text-white uppercase italic mb-4">Giỏ Hàng</h3>
                <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = SHOP_ITEMS.find(i => i.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{qty}x</span>
                          <span className="text-white font-bold">{item.name}</span>
                        </div>
                        <div className={cn(
                          "font-bold flex items-center gap-1",
                          item.currency === 'ruby' ? "text-rose-500" : "text-yellow-500"
                        )}>
                          {item.price * qty} {item.currency === 'ruby' ? <Gem size={12} /> : <Coins size={12} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                  {totalGold > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Tổng Vàng:</span>
                      <span className="text-yellow-500 font-bold flex items-center gap-1">
                        {totalGold} <Coins size={14} />
                      </span>
                    </div>
                  )}
                  {totalRuby > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Tổng Ruby:</span>
                      <span className="text-rose-500 font-bold flex items-center gap-1">
                        {totalRuby} <Gem size={14} />
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF7A45] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Thanh Toán
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(!user.inventory || user.inventory.length === 0) ? (
            <div className="col-span-full text-center py-12 text-gray-500 italic">Túi đồ trống.</div>
          ) : (
            user.inventory.map((invItem: any) => {
              const itemDef = SHOP_ITEMS.find(i => i.id === invItem.id) || { name: 'Vật phẩm không xác định', description: '', icon: Package, category: 'consumable' };
              const isEquipped = Object.values(user.equippedItems || {}).includes(invItem.id);
              
              return (
                <div key={invItem.id} className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#FF6321] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FF6321]/10 transition-all relative">
                      <itemDef.icon size={32} className="text-gray-500 group-hover:text-[#FF6321]" />
                      <span className="absolute -top-2 -right-2 bg-[#FF6321] text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#1A1B1E]">
                        {invItem.quantity}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {itemDef.name}
                        {isEquipped && <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/30">Đang mặc</span>}
                      </h3>
                      <p className="text-xs text-gray-500">{itemDef.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {itemDef.category === 'equipment' ? (
                      isEquipped ? (
                        <button
                          onClick={() => handleUnequip(itemDef.slot, itemDef)}
                          className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 font-bold hover:bg-rose-500 hover:text-black transition-all"
                        >
                          Tháo
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEquip(itemDef)}
                          className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 font-bold hover:bg-green-500 hover:text-black transition-all"
                        >
                          Mặc
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleUseItem(invItem.id, itemDef.name)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-[#FF6321] hover:text-black hover:border-[#FF6321] transition-all"
                      >
                        Sử dụng
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const SeasonalEffect = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#FF6321]/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: -20,
            opacity: 0 
          }}
          animate={{ 
            y: "110%",
            opacity: [0, 1, 1, 0],
            x: (Math.random() * 100) + "%"
          }}
          transition={{ 
            duration: Math.random() * 15 + 15, 
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
        />
      ))}
    </div>
  );
};

const EntertainmentView = ({ user, addGold, addRuby, onBack }: any) => {
  const [cards, setCards] = useState(() => Array(9).fill(null).map((_, i) => ({ id: i, revealed: false, value: Math.random() < 0.3 ? 'Ruby' : 'Gold' })));
  const [revealedCount, setRevealedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleReveal = (id: number) => {
    if (isGameOver || cards[id].revealed) return;
    
    const newCards = [...cards];
    newCards[id].revealed = true;
    setCards(newCards);
    setRevealedCount(prev => prev + 1);
    
    soundManager.play('click');

    if (newCards[id].value === 'Ruby') {
      addRuby(5, true);
    } else {
      addGold(50, true);
    }

    if (revealedCount + 1 === 3) {
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setCards(Array(9).fill(null).map((_, i) => ({ id: i, revealed: false, value: Math.random() < 0.3 ? 'Ruby' : 'Gold' })));
    setRevealedCount(0);
    setIsGameOver(false);
  };

  return (
    <div className="py-12 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white uppercase italic">Lật Thẻ Nhận Quà</h2>
        <button onClick={onBack} className="text-gray-500 uppercase font-bold text-xs">Thoát</button>
      </div>

      <p className="text-center text-gray-400 text-sm mb-8 uppercase font-bold tracking-widest">Bạn được lật tối đa 3 thẻ!</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={!card.revealed && !isGameOver ? { scale: 1.05 } : {}}
            whileTap={!card.revealed && !isGameOver ? { scale: 0.95 } : {}}
            onClick={() => handleReveal(card.id)}
            className={cn(
              "aspect-square rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all relative overflow-hidden",
              card.revealed ? (card.value === 'Ruby' ? "bg-red-500/20 border-red-500" : "bg-yellow-500/20 border-yellow-500") : "bg-[#1A1B1E] border-white/10 hover:border-[#FF6321]"
            )}
          >
            {card.revealed ? (
              <div className="flex flex-col items-center">
                {card.value === 'Ruby' ? <Gem className="text-red-500 mb-1" size={24} /> : <Coins className="text-yellow-500 mb-1" size={24} />}
                <span className={cn("text-[10px] font-black uppercase", card.value === 'Ruby' ? "text-red-500" : "text-yellow-500")}>
                  {card.value === 'Ruby' ? '+5' : '+50'}
                </span>
              </div>
            ) : (
              <div className="text-white/20 font-black text-2xl">?</div>
            )}
          </motion.div>
        ))}
      </div>

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-white font-bold uppercase tracking-widest">Bạn đã hết lượt lật!</p>
          <button
            onClick={resetGame}
            className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#FF7A45] transition-all"
          >
            Chơi Lại
          </button>
        </motion.div>
      )}
    </div>
  );
};

const ProjectInfoModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto"
    >
      <div className="bg-[#1A1B1E] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-2xl relative my-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-all">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[#FF6321]/20 rounded-3xl text-[#FF6321]">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Báo Cáo Dự Án</h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Đấu Trường Sử Việt</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#FF6321]/20">
          <section>
            <h3 className="text-[#FF6321] font-black uppercase italic mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6321] rounded-full" />
              Mục tiêu dự án
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Hiện đại hóa giáo dục: Chuyển đổi cách học lịch sử từ ghi nhớ thụ động sang tương tác chủ động.</li>
              <li>Hỗ trợ ôn thi trọng tâm: Tập trung vào chương trình lịch sử lớp 11 & 12, bám sát đề thi THPT Quốc gia.</li>
              <li>Kích thích tinh thần tự học: Sử dụng cơ chế Gamification để tạo động lực học tập thông qua thi đấu.</li>
              <li>Kết nối thế hệ: Sử dụng AI để đưa những câu chuyện lịch sử đến gần hơn với giới trẻ.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-[#FF6321] font-black uppercase italic mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6321] rounded-full" />
              Các chế độ chơi & Hướng dẫn
            </h3>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-tighter flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-500" /> Đấu Hạng (Ranked Mode)
                </h4>
                <p className="text-xs text-gray-400">Người chơi có 10 phút để trả lời liên tục các câu hỏi. Thắng nhận 1 Sao, thua rớt 1 Sao. Tích lũy Tinh túy để kích hoạt Giáp bảo hộ.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-tighter flex items-center gap-2">
                  <Mountain size={14} className="text-green-500" /> Đạp Sơn Hà (Adventure)
                </h4>
                <p className="text-xs text-gray-400">Leo núi bằng cách trả lời đúng. Sử dụng Bùa hộ thân (Thần Tốc, Thiên Nhãn, Kim Cang) để tấn công đối thủ hoặc phòng thủ bản thân.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-tighter flex items-center gap-2">
                  <MessageSquare size={14} className="text-blue-500" /> Trò chuyện cùng Tiền nhân
                </h4>
                <p className="text-xs text-gray-400">Đối thoại trực tiếp với các vị anh hùng dân tộc qua công nghệ Gemini AI để hiểu sâu về bối cảnh và tư tưởng thời đại.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[#FF6321] font-black uppercase italic mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6321] rounded-full" />
              Tính năng hệ thống
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Hệ thống Thân mật: Kết bạn, tặng quà và thăng cấp mối quan hệ với hiệu ứng mũi tên đi lên trực quan.</li>
              <li>Kinh tế & Lực chiến: Shop vật phẩm, túi đồ và chỉ số sức mạnh tổng hợp (Combat Power).</li>
              <li>Uy tín & Tố cáo: Hệ thống đánh giá thái độ người chơi, vinh danh Hiền Nhân và xử lý vi phạm.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-[#FF6321] font-black uppercase italic mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6321] rounded-full" />
              Hướng phát triển thực tế
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Chuẩn hóa ngân hàng câu hỏi bám sát cấu trúc đề thi THPT Quốc gia hàng năm.</li>
              <li>Phát triển phiên bản Mobile App (iOS/Android) để ôn tập mọi lúc mọi nơi.</li>
              <li>Tính năng Phòng học nhóm cho giáo viên tổ chức thi đấu nội bộ.</li>
              <li>AI Adaptive Learning: Tự động nhận diện và gợi ý ôn tập phần kiến thức còn yếu.</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-2xl font-black text-[#FF6321] italic uppercase tracking-tighter mb-2">
            "Sống Lại Hào Khí – Chinh Phục Sử Việt"
          </p>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">© 2026 Đấu Trường Sử Việt Team</p>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsView = ({ user, updateSettings, setLevel, onShowReport, onShowSupport, updateReputation, upgradeReputationLevel, repairData, setShowProfile, setProfileInitialTab, isFocusMode, setIsFocusMode, setShowAdminDashboard, createTicket, theme, toggleTheme }: any) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const isAdmin = user.email === 'hamngutan@gmail.com' || user.name === 'Admin' || user.uid === 'admin_uid';
  const settings = { animationsEnabled: true, seasonalThemeEnabled: true, soundEnabled: true, ...(user.settings || {}) };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    
    // Use the support ticket system for formal feedback
    createTicket('Ý kiến đóng góp', 'other', feedback);
    
    setTimeout(() => {
      alert(`Cảm ơn ${user.name} (UID: ${user.uid}) đã đóng góp ý kiến! Admin sẽ phản hồi sớm.`);
      setFeedback('');
      setIsSubmitting(false);
      soundManager.play('success');
    }, 1000);
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-2xl mx-auto">
      {showProjectInfo && <ProjectInfoModal onClose={() => setShowProjectInfo(false)} />}
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Cài Đặt</h1>
        <p className="text-gray-400 text-sm mt-2">Tùy chỉnh trải nghiệm và hiệu năng ứng dụng.</p>
      </div>

      <div className="space-y-6">
        {isAdmin && (
          <button
            onClick={() => setShowAdminDashboard(true)}
            className="w-full bg-red-500/10 border border-red-500/30 p-6 rounded-3xl flex items-center justify-between group hover:bg-red-500/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-2xl text-red-500">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">Admin Dashboard</h3>
                <p className="text-xs text-gray-500">Truy cập hệ thống quản trị.</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-red-500 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
        {/* UID Section */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#FF6321]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl text-[#FF6321]">
              <Fingerprint size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mã định danh (UID)</h3>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{user.uid}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(user.uid || '');
              soundManager.play('success');
            }}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-[#FF6321] transition-all"
            title="Sao chép UID"
          >
            <Copy size={18} />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Chế độ giao diện</h3>
              <p className="text-xs text-gray-500">Chuyển đổi giữa chế độ Sáng và Tối.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-[#FF6321] text-black font-bold rounded-xl text-xs uppercase"
            >
              {theme === 'dark' ? 'Chuyển sang Sáng' : 'Chuyển sang Tối'}
            </button>
          </div>
        </div>

        {/* Focus Mode Toggle */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Chế độ tập trung (Focus Mode)</h3>
              <p className="text-xs text-gray-500">Ẩn các thành phần không thiết yếu để tập trung hơn.</p>
            </div>
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={cn(
                "w-14 h-8 rounded-full transition-all flex items-center p-1",
                isFocusMode ? "bg-[#FF6321] justify-end" : "bg-gray-700 justify-start"
              )}
            >
              <div className="w-6 h-6 bg-white rounded-full" />
            </button>
          </div>
        </div>

        {/* Project Info Button */}
        <button
          onClick={() => setShowProjectInfo(true)}
          className="w-full bg-[#FF6321]/10 border border-[#FF6321]/30 p-6 rounded-3xl flex items-center justify-between group hover:bg-[#FF6321]/20 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FF6321]/20 rounded-2xl text-[#FF6321]">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-white">Thông tin dự án</h3>
              <p className="text-xs text-gray-500">Xem báo cáo, mục tiêu và hướng phát triển của trò chơi.</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#FF6321] group-hover:translate-x-1 transition-transform" />
        </button>
        {/* Profile Section */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#FF6321]/20 rounded-full flex items-center justify-center border-2 border-[#FF6321]">
              <UserIcon size={32} className="text-[#FF6321]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-gray-400">Cấp độ: {user.level}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm italic">"{user.bio || 'Chưa có tiểu sử'}"</p>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37]">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chứng chỉ của tôi</h3>
              <p className="text-xs text-gray-500">Xem và quản lý các thành tựu đã đạt được.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setProfileInitialTab('certificates');
              setShowProfile(true);
            }}
            className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] font-bold rounded-lg text-xs uppercase hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Xem chứng chỉ
          </button>
        </div>

        {/* Reputation Section */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-[#FF6321]" />
            Uy tín: {user.reputation || 0}
          </h3>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Cấp độ: {user.reputationLevel || 1} {(user.reputationLevel || 1) === 5 ? '(Hiền Nhân)' : ''}</span>
            <span>XP: {user.reputationXP || 0}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-[#FF6321] h-2 rounded-full" 
              style={{ width: `${((user.reputationXP || 0) / ([312, 625, 1250, 2500, 5000][(user.reputationLevel || 1) - 1] || 312)) * 100}%` }}
            />
          </div>
          <button
            onClick={upgradeReputationLevel}
            disabled={(user.reputation || 0) < 100 || (user.reputationLevel || 1) >= 5}
            className="w-full py-2 bg-[#FF6321] text-white font-bold rounded-lg text-xs uppercase hover:bg-[#FF6321]/80 transition-all disabled:opacity-50"
          >
            Nâng cấp cấp độ (100 Rep)
          </button>
        </div>

        {/* Combat Power Section */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <Sword size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Lực chiến</h3>
              <p className="text-xs text-gray-500">Sức mạnh tổng hợp từ trang bị và kỹ năng của bạn.</p>
            </div>
          </div>
          <div className="text-2xl font-black text-yellow-500 italic">
            {user.combatPower || 0}
          </div>
        </div>

        {/* Match History Section */}
        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Lịch sử đấu</h3>
              <p className="text-xs text-gray-500">Xem lại kết quả các trận đấu gần đây.</p>
            </div>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {user.matchHistory && user.matchHistory.length > 0 ? (
              user.matchHistory.map((match: any) => (
                <div key={match.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{match.opponentName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">{new Date(match.date).toLocaleDateString('vi-VN')}</span>
                      {match.mode && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded text-gray-400 uppercase font-black tracking-tighter">
                          {match.mode === 'solo' ? 'Đấu Đơn' : match.mode === 'machine' ? 'Đấu Máy' : 'Đấu Người'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-black uppercase italic",
                      match.result === 'win' ? 'text-green-500' : match.result === 'loss' ? 'text-red-500' : 'text-gray-500'
                    )}>
                      {match.result === 'win' ? 'Thắng' : match.result === 'loss' ? 'Thua' : 'Hòa'}
                    </span>
                    <p className="text-[10px] text-gray-400 font-mono">{match.score}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500 text-xs italic">Chưa có dữ liệu trận đấu nào.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#FF6321]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl text-[#FF6321]">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hiệu ứng chuyển động</h3>
              <p className="text-xs text-gray-500">Bật/tắt các hiệu ứng animation để tăng hiệu năng.</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
            className={cn(
              "w-14 h-7 rounded-full transition-all relative p-1",
              settings.animationsEnabled ? "bg-[#FF6321]" : "bg-gray-800"
            )}
          >
            <motion.div 
              animate={{ x: settings.animationsEnabled ? 28 : 0 }}
              className="w-5 h-5 bg-white rounded-full shadow-lg"
            />
          </button>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#FF6321]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl text-[#FF6321]">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chủ đề theo mùa</h3>
              <p className="text-xs text-gray-500">Thay đổi màu sắc giao diện theo các sự kiện lịch sử.</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ seasonalThemeEnabled: !settings.seasonalThemeEnabled })}
            className={cn(
              "w-14 h-7 rounded-full transition-all relative p-1",
              settings.seasonalThemeEnabled ? "bg-[#FF6321]" : "bg-gray-800"
            )}
          >
            <motion.div 
              animate={{ x: settings.seasonalThemeEnabled ? 28 : 0 }}
              className="w-5 h-5 bg-white rounded-full shadow-lg"
            />
          </button>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <LifeBuoy size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Trung tâm hỗ trợ</h3>
              <p className="text-xs text-gray-500">Gửi yêu cầu, xem Justice Report & Chatbot.</p>
            </div>
          </div>
          <button
            onClick={onShowSupport}
            className="px-4 py-2 bg-blue-500/20 text-blue-500 font-bold rounded-lg text-xs uppercase hover:bg-blue-500 hover:text-white transition-all"
          >
            Mở hỗ trợ
          </button>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37]">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chứng chỉ của tôi</h3>
              <p className="text-xs text-gray-500">Xem và quản lý các thành tựu đã đạt được.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setProfileInitialTab('certificates');
              setShowProfile(true);
            }}
            className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] font-bold rounded-lg text-xs uppercase hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Xem chứng chỉ
          </button>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tố cáo vi phạm</h3>
              <p className="text-xs text-gray-500">Báo cáo hành vi không phù hợp hoặc gian lận.</p>
            </div>
          </div>
          <button
            onClick={onShowReport}
            className="px-4 py-2 bg-red-500/20 text-red-500 font-bold rounded-lg text-xs uppercase hover:bg-red-500 hover:text-white transition-all"
          >
            Tố cáo
          </button>
        </div>

        {/* Feedback Section */}
        <div className="bg-[#1A1B1E] border border-white/10 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6321] rounded-lg text-black">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic">Đánh giá & Ý tưởng</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Chúng tôi luôn lắng nghe ý kiến từ người chơi để hoàn thiện trò chơi hơn. Hãy chia sẻ cảm nhận hoặc ý tưởng mới của bạn!
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block">Người gửi</label>
                <span className="text-xs text-white font-bold">{user.name}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block">UID</label>
                <span className="text-[10px] text-[#FF6321] font-mono">{user.uid}</span>
              </div>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập đánh giá hoặc ý tưởng của bạn tại đây..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#FF6321] transition-all min-h-[120px] resize-none"
            />
            <button
              onClick={handleSendFeedback}
              disabled={!feedback.trim() || isSubmitting}
              className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF7A45] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              {isSubmitting ? 'Đang gửi...' : 'Gửi đóng góp'}
            </button>
          </div>
        </div>

        {/* Developer Settings */}
        <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6321] rounded-lg text-black">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic">Cài đặt Nhà phát triển</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => {
                soundManager.play('click');
                setLevel(100);
                alert('Đã kích hoạt Cấp độ 100 cho tài khoản của bạn!');
              }}
              className="w-full py-4 bg-[#FF6321] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF7A45] transition-all flex items-center justify-center gap-2"
            >
              <Trophy size={20} />
              Kích hoạt Cấp độ 100
            </button>
            <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">
              Lưu ý: Chế độ này chỉ dành cho mục đích kiểm thử tính năng.
            </p>
          </div>
        </div>

        <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6321] rounded-lg text-black">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic">Chia sẻ & Chỉnh sửa</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Để chỉnh sửa ứng dụng này trên máy tính hoặc chia sẻ với bạn bè, bạn có thể sử dụng các tính năng của <span className="text-[#FF6321] font-bold">Google AI Studio</span>:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6321] mt-1.5" />
              <p className="text-xs text-gray-300"><span className="text-white font-bold">Nút Share:</span> Ở góc trên bên phải của AI Studio để lấy link chia sẻ.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6321] mt-1.5" />
              <p className="text-xs text-gray-300"><span className="text-white font-bold">Export Code:</span> Vào menu Settings (biểu tượng bánh răng) trong AI Studio để tải mã nguồn về máy tính.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6321] mt-1.5" />
              <p className="text-xs text-gray-300"><span className="text-white font-bold">Đăng nhập:</span> Sử dụng cùng một tài khoản Google trên máy tính để truy cập vào AI Studio Build.</p>
            </li>
          </ul>
        </div>

        <div className="bg-[#1A1B1E] border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-[#FF6321]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl text-[#FF6321]">
              <Volume2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Âm thanh</h3>
              <p className="text-xs text-gray-500">Bật/tắt hiệu ứng âm thanh khi tương tác.</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={cn(
              "w-14 h-7 rounded-full transition-all relative p-1",
              settings.soundEnabled ? "bg-[#FF6321]" : "bg-gray-800"
            )}
          >
            <motion.div 
              animate={{ x: settings.soundEnabled ? 28 : 0 }}
              className="w-5 h-5 bg-white rounded-full shadow-lg"
            />
          </button>
        </div>

        <div className="p-8 border border-dashed border-white/10 rounded-3xl bg-black/20 text-center">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Hệ thống</h4>
          <div className="space-y-1">
            <p className="text-sm font-mono text-gray-400">VERSION 1.2.5-STABLE</p>
            <p className="text-[10px] font-mono text-gray-600">BUILD_ID: 20260329_771048</p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
            <button 
              onClick={() => repairData()}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Zap size={14} /> Tối ưu & Sửa lỗi dữ liệu
            </button>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic">© 2026 Sử Việt Gamify Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { 
    user, login, logout, addPoints, setLevel, setPoints, selectGeneral, 
    completeTutorial, selectTitle, updateSettings, updateWeaknesses, 
    updateRelationship, joinGuild, leaveGuild, updateQuestProgress, completePhase,
    sendFriendRequest, acceptFriendRequest, updateFriendRelationship, updateReputation, upgradeReputationLevel,
    addGold, spendGold, addRuby, spendRuby, addItem, useItem, purchaseItems, equipItem, unequipItem, readMail, claimMail,
    claimDailyLogin, spinWheel, consumeBuffs, changeName, recordMatch, updateDapSonHaStats, useIntimacyItem, updateRankedStats,
    addPet, selectPet, addCertificate, toggleShowcaseCertificate, repairData,
    updateReputationWithReason, createSupportTicket, addTicketReply, addMail
  } = useUserProgress();
  const [activeTab, setActiveTab] = useState('arena');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'info' | 'certificates' | 'history'>('info');
  const [showReport, setShowReport] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [reportedUid, setReportedUid] = useState('');
  const [arenaConfig, setArenaConfig] = useState<any>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<Partial<CertificateData>>({ achievement: '', date: '' });
  const [showStory, setShowStory] = useState(false);
  const [showPetSystem, setShowPetSystem] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (user && !user.certificates?.some(c => c.achievement === 'Chiến binh đời đầu')) {
      addCertificate(
        'Chiến binh đời đầu', 
        'Ghi nhận những người chơi tham gia từ giai đoạn Alpha/Beta hoặc ngày đầu ra mắt.',
        'event',
        'rare',
        'sparkles'
      );
    }

    // Skill: Bậc thầy Chiến thuật (Win 10 matches)
    if (user && (user.matchHistory?.filter(m => m.result === 'win').length || 0) >= 10 && !user.certificates?.some(c => c.achievement === 'Bậc thầy Chiến thuật')) {
      addCertificate(
        'Bậc thầy Chiến thuật',
        'Đạt được 10 trận thắng vang dội trong Đấu Trường Sử Việt.',
        'skill',
        'rare',
        'zap'
      );
    }

    // Social: Đại sứ Văn minh (Reputation 110)
    if (user && user.reputation >= 110 && !user.certificates?.some(c => c.achievement === 'Đại sứ Văn minh')) {
      addCertificate(
        'Đại sứ Văn minh',
        'Duy trì điểm uy tín ở mức tối đa và thái độ chuẩn mực trong cộng đồng.',
        'social',
        'epic',
        '🕊️'
      );
    }

    // Collection: Sử Gia Uyên Bác (Level 100)
    if (user && user.level >= 100 && !user.certificates?.some(c => c.achievement === 'Sử Gia Uyên Bác')) {
      addCertificate(
        'Sử Gia Uyên Bác',
        'Đạt đến cấp độ tối cao trong hành trình tìm hiểu lịch sử.',
        'collection',
        'legendary',
        'book-open'
      );
    }
  }, [user?.uid, user?.matchHistory?.length, user?.reputation, user?.level]);

  const handleViewCertificate = (cert: CertificateData) => {
    setCertificateData(cert);
    setShowCertificate(true);
  };

  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      setActiveTab(e.detail);
    };
    const handleOpenStory = () => setShowStory(true);
    const handleOpenPet = () => setShowPetSystem(true);

    window.addEventListener('switchTab', handleSwitchTab);
    window.addEventListener('openStory', handleOpenStory);
    window.addEventListener('openPet', handleOpenPet);
    return () => {
      window.removeEventListener('switchTab', handleSwitchTab);
      window.removeEventListener('openStory', handleOpenStory);
      window.removeEventListener('openPet', handleOpenPet);
    };
  }, []);

  useEffect(() => {
    if (user) {
      soundManager.setEnabled(user.settings?.soundEnabled ?? true);
    }
  }, [user?.settings?.soundEnabled]);

  // Auto-level up to 100 as requested by user
  useEffect(() => {
    if (user && user.level < 100) {
      setLevel(100);
    }
  }, [user?.name, user?.level, setLevel]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-white italic leading-none">
              Đấu Trường<br />
              <span className="text-[#FF6321]">Sử Việt</span>
            </h1>
            <p className="text-gray-500 mt-4 font-medium">Học lịch sử theo phong cách đối kháng.</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setLoginError(''); }}
              placeholder="Nhập tên của bạn..."
              className="w-full bg-[#1A1B1E] border-2 border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-[#FF6321] transition-all"
            />
            <input
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setLoginError(''); }}
              placeholder="Nhập mật khẩu (tùy chọn nếu tạo mới)..."
              className="w-full bg-[#1A1B1E] border-2 border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-[#FF6321] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && nameInput.trim()) {
                  soundManager.play('click');
                  const success = login(nameInput.trim(), passwordInput);
                  if (!success) setLoginError('Sai mật khẩu!');
                }
              }}
            />
            {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
            <button
              onClick={() => {
                soundManager.play('click');
                if (nameInput.trim()) {
                  const success = login(nameInput.trim(), passwordInput);
                  if (!success) setLoginError('Sai mật khẩu!');
                }
              }}
              className="w-full bg-[#FF6321] text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-[#FF7A45] transition-all disabled:opacity-50"
              disabled={!nameInput.trim()}
            >
              Bắt Đầu Hành Trình
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0A0A0B] px-2 text-gray-500">Hoặc</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.play('click');
                // TODO: Implement Google Login
                alert('Chức năng đăng nhập Google đang được phát triển.');
              }}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Đăng nhập với Google
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                login('Admin', 'admin_password_mock');
              }}
              className="w-full bg-red-500/10 border border-red-500/30 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} />
              Đăng nhập nhanh (Admin)
            </button>
          </div>
          <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
            Nội dung dựa trên chương trình Lịch sử 11 & 12
          </p>
        </motion.div>
      </div>
    );
  }

  const settings = { animationsEnabled: true, seasonalThemeEnabled: true, soundEnabled: true, ...(user.settings || {}) };

  return (
    <MotionConfig reducedMotion={settings.animationsEnabled ? "never" : "always"}>
      <div className={cn(
        "min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[#FF6321] selection:text-black",
        !settings.seasonalThemeEnabled && "grayscale-[0.2] contrast-[1.1]"
      )}>
        {(user.isNewbie || showTutorial) && (
          <TutorialOverlay onComplete={() => {
            completeTutorial();
            setShowTutorial(false);
          }} />
        )}
        <Header 
          user={user} 
          logout={logout} 
          onShowTutorial={() => setShowTutorial(true)} 
          setActiveTab={setActiveTab} 
          setLevel={setLevel} 
          onShowProfile={() => setShowProfile(true)}
          setShowStory={setShowStory}
          setShowPetSystem={setShowPetSystem}
          isFocusMode={isFocusMode}
        />
        {showProfile && user && (
          <Profile 
            user={user} 
            onClose={() => setShowProfile(false)} 
            logout={logout} 
            toggleShowcaseCertificate={toggleShowcaseCertificate}
            onViewCertificate={handleViewCertificate}
            initialTab={profileInitialTab}
          />
        )}
        {showReport && (
          <Report 
            reportedUid={reportedUid} 
            onClose={() => setShowReport(false)} 
            updateReputation={updateReputationWithReason} 
            friends={user.friends || []} 
          />
        )}
        
        <SeasonalEffect enabled={settings.seasonalThemeEnabled} />

        <main className="pb-20 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'arena' && (
              <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ArenaView 
                  user={user} 
                  addPoints={addPoints} 
                  addGold={addGold}
                  addRuby={addRuby}
                  consumeBuffs={consumeBuffs}
                  selectGeneral={selectGeneral} 
                  updateWeaknesses={updateWeaknesses} 
                  initialConfig={arenaConfig}
                  onClearConfig={() => setArenaConfig(null)}
                  updateQuestProgress={updateQuestProgress}
                  recordMatch={recordMatch}
                  updateDapSonHaStats={updateDapSonHaStats}
                  updateRankedStats={updateRankedStats}
                  setActiveTab={setActiveTab}
                  showCertificate={showCertificate}
                  setShowCertificate={setShowCertificate}
                  certificateData={certificateData}
                  setCertificateData={setCertificateData}
                  addCertificate={addCertificate}
                  onShowCertificate={(data: any) => {
                    setCertificateData(data);
                    setShowCertificate(true);
                  }}
                  updateReputation={updateReputationWithReason}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              </motion.div>
            )}
            {activeTab === 'campaign' && (
              <motion.div key="campaign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CampaignView user={user} completePhase={completePhase} />
              </motion.div>
            )}
            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SocialView 
                  user={user} 
                  selectTitle={selectTitle} 
                  joinGuild={joinGuild}
                  leaveGuild={leaveGuild}
                  sendFriendRequest={sendFriendRequest}
                  acceptFriendRequest={acceptFriendRequest}
                  updateFriendRelationship={updateFriendRelationship}
                  useIntimacyItem={useIntimacyItem}
                />
              </motion.div>
            )}
            {activeTab === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LeaderboardView 
                  user={user} 
                  onStartRanked={() => {
                    setArenaConfig({ isRanked: true, startInRankedSelection: true });
                    setActiveTab('arena');
                  }}
                />
              </motion.div>
            )}
            {activeTab === 'su_ha' && (
              <motion.div key="su_ha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SuHaView 
                  user={user} 
                  updateWeaknesses={updateWeaknesses} 
                  updateRelationship={updateRelationship}
                  updateQuestProgress={updateQuestProgress}
                  onStartPractice={(category: string, periods: string[]) => {
                    setArenaConfig({ category, periods });
                    setActiveTab('arena');
                  }}
                />
              </motion.div>
            )}
            {activeTab === 'timeline' && (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TimelineView 
                  onClose={() => setActiveTab('arena')} 
                  onStartPractice={(category: string, periods: string[]) => {
                    setArenaConfig({ category, periods });
                    setActiveTab('arena');
                  }}
                />
              </motion.div>
            )}
            {activeTab === 'shop' && (
              <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ShopView user={user} purchaseItems={purchaseItems} useItem={useItem} equipItem={equipItem} unequipItem={unequipItem} />
              </motion.div>
            )}
            {activeTab === 'events' && (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EventsView 
                  user={user} 
                  claimDailyLogin={claimDailyLogin} 
                  spinWheel={spinWheel} 
                  addGold={addGold}
                  addRuby={addRuby}
                />
              </motion.div>
            )}
            {activeTab === 'mailbox' && (
              <motion.div key="mailbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MailboxView user={user} readMail={readMail} claimMail={claimMail} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SettingsView 
                  user={user} 
                  updateSettings={updateSettings} 
                  setLevel={setLevel} 
                  onShowReport={() => setShowReport(true)} 
                  onShowSupport={() => setShowSupport(true)}
                  updateReputation={updateReputationWithReason} 
                  upgradeReputationLevel={upgradeReputationLevel} 
                  repairData={repairData}
                  setShowProfile={setShowProfile}
                  setProfileInitialTab={setProfileInitialTab}
                  isFocusMode={isFocusMode}
                  setIsFocusMode={setIsFocusMode}
                  setShowAdminDashboard={setShowAdminDashboard}
                  createTicket={createSupportTicket}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <SmartHub activeTab={activeTab} setActiveTab={setActiveTab} />
        <AIChat />
        <AnimatePresence>
          {showStory && <StoryIntro onClose={() => setShowStory(false)} />}
          {showPetSystem && (
            <PetSystem 
              user={user} 
              addPet={addPet} 
              selectPet={selectPet} 
              spendGold={spendGold}
              onClose={() => setShowPetSystem(false)} 
            />
          )}
          {showSupport && (
            <SupportCenter 
              user={user}
              onClose={() => setShowSupport(false)}
              createTicket={createSupportTicket}
              addReply={addTicketReply}
            />
          )}
          {showCertificate && (
            <Certificate 
              user={user}
              certificate={certificateData}
              onClose={() => setShowCertificate(false)}
            />
          )}
          {showAdminDashboard && (
            <AdminDashboard 
              user={user}
              onClose={() => setShowAdminDashboard(false)}
              addTicketReply={addTicketReply}
              addMail={addMail}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
