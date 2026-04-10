export interface General {
  id: string;
  name: string;
  title: string;
  description: string;
  skills: {
    name: string;
    description: string;
    effect: string;
    type: 'active' | 'passive';
    battleEffect: {
      type: 'time_slow' | 'score_boost' | 'skip_wrong' | 'heal' | 'damage_boost' | 'bonus_reward' | 'xp_boost' | 'change_question';
      value: number;
    };
    cooldown?: number; // in turns or seconds
  }[];
  image: string;
  suggestedQuestions?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: any;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  targetId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  timestamp: any;
}

export interface Milestone {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'VN' | 'World';
  details?: string;
}

export interface QuizQuestion {
  id: string;
  type?: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: number | boolean | string;
  explanation: string;
  hint?: string;
  grade: 10 | 11 | 12;
  category: 'VN' | 'World';
  period: string;
}

export interface CharacterQuizQuestion {
  id: string;
  quote: string;
  description: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  hint?: string;
  category: 'VN' | 'World';
}

export interface EpithetQuizQuestion {
  id: string;
  epithet: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  hint?: string;
  category: 'VN' | 'World';
}

export interface EventGuessingQuestion {
  id: string;
  location: string;
  year: string | number;
  correctAnswer: string;
  options: string[];
  explanation: string;
  hint?: string;
  category: 'VN' | 'World';
}

export interface ChronologicalQuestion {
  id: string;
  events: {
    id: string;
    text: string;
    year: number;
  }[];
  explanation: string;
  hint?: string;
  category: 'VN' | 'World';
}

export interface DynastyQuestion {
  id: string;
  subject: string;
  correctDynasty: string;
  options: string[];
  explanation: string;
  hint?: string;
  category: 'VN' | 'World';
}

export interface Item {
  id: string;
  name: string;
  price: number;
  currency: 'gold' | 'ruby';
  description: string;
  icon: any;
  category: 'consumable' | 'equipment' | 'decoration';
  slot?: 'head' | 'armor' | 'weapon' | 'mount';
  stats?: {
    combatPower?: number;
    expBonus?: number;
    goldBonus?: number;
    damageReduction?: number;
    damageBonus?: number;
    intimacy?: number;
  };
}

export interface RankedModeStats {
  tier: string; // Đồng, Bạc, Vàng, Bạch Kim, Kim Cương, Tinh Anh, Cao Thủ, Chiến Tướng, Chiến Thần
  division: number; // 1-5 (or 1-50 for higher ranks)
  stars: number; // 0-5
  essence: number; // Tinh túy
  starProtectionAvailable: boolean; // For the "first time reaching 5 stars" protection
}

export type PetClass = 'combat' | 'support' | 'wise';
export type PetEvolution = 'normal' | 'aura' | 'gloom';

export interface Pet {
  id: string;
  name: string;
  type: 'dragon' | 'phoenix' | 'tiger' | 'horse' | 'turtle' | 'slime';
  level: number;
  xp: number;
  buff: {
    type: 'exp' | 'gold' | 'combatPower' | 'time';
    value: number;
  };
  description: string;
  // Mới
  petClass: PetClass;
  evolution: PetEvolution;
  skinId: string;
  accessories: string[];
}

export interface CertificateData {
  id: string;
  achievement: string;
  description: string;
  date: string;
  type: 'skill' | 'social' | 'event' | 'collection' | 'battle' | 'rank';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon?: string;
}

export type ReputationTier = 'Vinh Quang' | 'Tích Cực' | 'Ổn Định' | 'Cảnh Cáo' | 'Vi Phạm';

export interface ReputationHistory {
  id: string;
  change: number;
  reason: string;
  date: string;
}

export interface MatchStats {
  kda: number;
  goldPerMinute: number;
  damageDealt: number;
  mapControl: number;
}

export interface MatchEvent {
  timestamp: string;
  type: 'fight' | 'objective';
  description: string;
}

export interface MatchHistory {
  id: string;
  opponentName: string;
  result: 'win' | 'loss' | 'draw';
  score: number;
  date: string;
  mode?: string;
  stats?: MatchStats;
  timeline?: MatchEvent[];
  hasJusticeAction?: boolean;
}

export interface SupportTicket {
  id: string;
  uid: string;
  username: string;
  title: string;
  category: 'bug' | 'payment' | 'account' | 'other';
  status: 'pending' | 'investigating' | 'resolved';
  content: string;
  createdAt: string;
  updatedAt: string;
  replies: {
    sender: 'system' | 'user';
    content: string;
    date: string;
  }[];
}

export interface UserProgress {
  name: string;
  uid: string;
  email?: string;
  password?: string;
  combatPower: number;
  reputation: number;
  reputationLevel: number;
  reputationXP: number;
  reputationTier: ReputationTier;
  reputationHistory: ReputationHistory[];
  supportTickets: SupportTicket[];
  totalPlayTime: number;
  matchHistory: MatchHistory[];
  points: number;
  gold: number;
  ruby: number;
  rank: string;
  level: number;
  inventory: { id: string; quantity: number }[];
  pets?: Pet[];
  selectedPetId?: string;
  certificates?: CertificateData[];
  showcaseCertificateIds?: string[];
  avatarFrame?: string;
  nameColor?: string;
  equippedItems?: {
    head?: string;
    armor?: string;
    weapon?: string;
    mount?: string;
  };
  mailbox: { 
    id: string; 
    sender: string; 
    title: string; 
    content: string; 
    isRead: boolean; 
    date: string; 
    type?: 'system' | 'justice' | 'reward';
    rewards?: { type: 'gold' | 'ruby' | 'item'; id?: string; amount: number }[];
    isClaimed?: boolean;
  }[];
  completedMissions: string[];
  selectedGeneralId?: string;
  ideas: Idea[];
  feedbacks: Feedback[];
  friends: Friend[];
  friendRequests: FriendRequest[];
  guildId?: string;
  rankedStats: {
    solo: RankedModeStats;
    machine: RankedModeStats;
    pvp: RankedModeStats;
  };
  isNewbie: boolean;
  titles: string[];
  selectedTitle?: string;
  settings: {
    animationsEnabled: boolean;
    seasonalThemeEnabled: boolean;
    soundEnabled: boolean;
  };
  weaknesses?: string[];
  dapSonHaStats?: {
    solo: { points: number; time: number };
    machine: { points: number; time: number };
    pvp: { points: number; time: number };
  };
  activeBuffs?: {
    x2GoldWins: number;
    x2ExpWins: number;
    x2GoldUntil: number;
    x2ExpUntil: number;
  };
  lastLoginDate?: string;
  loginStreak?: number;
  dailySpinUsed?: boolean;
  relationships?: {
    [ancestorId: string]: {
      type: string;
      anniversary: string;
      isConfirmed: boolean;
    }
  };
  campaignProgress?: {
    currentPhaseId: string;
    completedPhases: string[];
    activeQuests: {
      id: string;
      progress: number;
      isCompleted: boolean;
    }[];
  };
}

export interface CampaignPhase {
  id: string;
  title: string;
  description: string;
  category: 'VN' | 'World' | 'Mixed';
  era: string;
  requiredLevel: number;
  rewards: {
    points: number;
    title?: string;
    item?: string;
  };
  quests: Quest[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  type: 'battle_win' | 'ai_chat' | 'perfect_score';
  category?: 'VN' | 'World';
}

export const CAMPAIGN_DATA: CampaignPhase[] = [
  // --- VIETNAM HISTORY PATH ---
  {
    id: 'vn_phase1',
    title: 'Bình Minh Đất Việt (Tiền sử)',
    description: 'Khám phá những dấu chân đầu tiên của người tiền sử trên đất nước Việt Nam.',
    category: 'VN',
    era: 'Tiền sử',
    requiredLevel: 1,
    rewards: { points: 500, title: 'Người Khai Sáng' },
    quests: [
      { id: 'vn_q1_1', title: 'Dấu vết người xưa', description: 'Thắng 2 trận đấu ở chủ đề Tiền sử VN.', target: 2, type: 'battle_win', category: 'VN' },
      { id: 'vn_q1_2', title: 'Vấn đáp tiền nhân', description: 'Trò chuyện với một vị tướng về thời kỳ sơ khai.', target: 1, type: 'ai_chat' }
    ]
  },
  {
    id: 'vn_phase2',
    title: 'Hùng Vương Dựng Nước (Văn Lang - Âu Lạc)',
    description: 'Thời đại các vua Hùng và vua Thục, đặt nền móng cho bản sắc dân tộc.',
    category: 'VN',
    era: 'Văn Lang - Âu Lạc',
    requiredLevel: 3,
    rewards: { points: 800, title: 'Con Rồng Cháu Tiên' },
    quests: [
      { id: 'vn_q2_1', title: 'Hào khí Hồng Bàng', description: 'Thắng 3 trận đấu ở chủ đề Văn Lang - Âu Lạc.', target: 3, type: 'battle_win', category: 'VN' },
      { id: 'vn_q2_2', title: 'Trí tuệ Cổ Loa', description: 'Đạt điểm tuyệt đối trong một trận đấu thời Âu Lạc.', target: 1, type: 'perfect_score', category: 'VN' }
    ]
  },
  {
    id: 'vn_phase3',
    title: 'Ngàn Năm Bão Táp (Bắc thuộc)',
    description: 'Thời kỳ đấu tranh kiên cường chống lại ách đô hộ phương Bắc.',
    category: 'VN',
    era: 'Bắc thuộc',
    requiredLevel: 6,
    rewards: { points: 1200, title: 'Ngọn Lửa Độc Lập' },
    quests: [
      { id: 'vn_q3_1', title: 'Tiếng trống Mê Linh', description: 'Thắng 5 trận đấu thời kỳ Bắc thuộc.', target: 5, type: 'battle_win', category: 'VN' },
      { id: 'vn_q3_2', title: 'Hào khí Vạn Xuân', description: 'Sử dụng kỹ năng tướng 5 lần.', target: 5, type: 'battle_win' }
    ]
  },
  {
    id: 'vn_phase4',
    title: 'Đại Việt Huy Hoàng (Phong kiến)',
    description: 'Thời kỳ rực rỡ của các triều đại Đinh, Lê, Lý, Trần, Lê, Nguyễn...',
    category: 'VN',
    era: 'Phong kiến (Đại Việt)',
    requiredLevel: 10,
    rewards: { points: 2000, item: 'Kiếm Thuận Thiên' },
    quests: [
      { id: 'vn_q4_1', title: 'Triều đại huy hoàng', description: 'Thắng 10 trận đấu thời kỳ Phong kiến.', target: 10, type: 'battle_win', category: 'VN' },
      { id: 'vn_q4_2', title: 'Ánh sáng Đại Việt', description: 'Đạt cấp độ 15.', target: 15, type: 'battle_win' }
    ]
  },
  {
    id: 'vn_phase5',
    title: 'Lửa Thiêng Cận Đại',
    description: 'Giai đoạn đấu tranh chống thực dân Pháp và con đường cứu nước mới.',
    category: 'VN',
    era: 'Cận đại',
    requiredLevel: 15,
    rewards: { points: 3000, title: 'Sử Gia Uyên Bác' },
    quests: [
      { id: 'vn_q5_1', title: 'Lửa cách mạng', description: 'Thắng 10 trận đấu thời kỳ Cận đại VN.', target: 10, type: 'battle_win', category: 'VN' },
      { id: 'vn_q5_2', title: 'Con đường cứu nước', description: 'Sử dụng AI phân tích 5 lần.', target: 5, type: 'ai_chat' }
    ]
  },
  {
    id: 'vn_phase6',
    title: 'Việt Nam Đổi Mới (Hiện đại)',
    description: 'Từ Cách mạng tháng Tám 1945 đến nay, bảo vệ và phát triển đất nước.',
    category: 'VN',
    era: 'Hiện đại',
    requiredLevel: 20,
    rewards: { points: 5000, title: 'Bậc Thầy Thời Đại' },
    quests: [
      { id: 'vn_q6_1', title: 'Thống nhất non sông', description: 'Thắng 10 trận đấu thời kỳ Hiện đại VN.', target: 10, type: 'battle_win', category: 'VN' }
    ]
  },

  // --- WORLD HISTORY PATH ---
  {
    id: 'world_phase1',
    title: 'Bình Minh Nhân Loại (Tiền sử)',
    description: 'Khám phá sự tiến hóa của loài người và những phát minh đầu tiên trên thế giới.',
    category: 'World',
    era: 'Tiền sử Thế giới',
    requiredLevel: 1,
    rewards: { points: 500, title: 'Nhà Thám Hiểm' },
    quests: [
      { id: 'world_q1_1', title: 'Lửa thiêng nhân loại', description: 'Thắng 2 trận đấu Tiền sử thế giới.', target: 2, type: 'battle_win', category: 'World' }
    ]
  },
  {
    id: 'world_phase2',
    title: 'Văn Minh Cổ Đại',
    description: 'Khám phá Ai Cập, Hy Lạp, La Mã và những kỳ quan thế giới cổ đại.',
    category: 'World',
    era: 'Cổ đại Thế giới',
    requiredLevel: 5,
    rewards: { points: 1000, title: 'Học Giả Thế Giới' },
    quests: [
      { id: 'world_q2_1', title: 'Kỳ quan cổ đại', description: 'Thắng 5 trận đấu Cổ đại thế giới.', target: 5, type: 'battle_win', category: 'World' }
    ]
  },
  {
    id: 'world_phase3',
    title: 'Đêm Trường Trung Cổ',
    description: 'Thời kỳ phong kiến phương Tây và những cuộc thập tự chinh.',
    category: 'World',
    era: 'Trung đại Thế giới',
    requiredLevel: 10,
    rewards: { points: 1500, title: 'Hiệp Sĩ Tri Thức' },
    quests: [
      { id: 'world_q3_1', title: 'Hào khí hiệp sĩ', description: 'Thắng 5 trận đấu Trung đại thế giới.', target: 5, type: 'battle_win', category: 'World' }
    ]
  },
  {
    id: 'world_phase4',
    title: 'Phục Hưng & Đại Phát Kiến',
    description: 'Sự bùng nổ của nghệ thuật, khoa học và những chuyến hải hành thay đổi thế giới.',
    category: 'World',
    era: 'Phục hưng & Khám phá',
    requiredLevel: 15,
    rewards: { points: 2500, title: 'Nhà Khám Phá' },
    quests: [
      { id: 'world_q4_1', title: 'Ánh sáng Phục hưng', description: 'Thắng 8 trận đấu thời kỳ này.', target: 8, type: 'battle_win', category: 'World' }
    ]
  },
  {
    id: 'world_phase5',
    title: 'Kỷ Nguyên Cách Mạng (Cận đại)',
    description: 'Cách mạng công nghiệp và sự hình thành thế giới hiện đại.',
    category: 'World',
    era: 'Cận đại Thế giới',
    requiredLevel: 20,
    rewards: { points: 4000, title: 'Sử Gia Quốc Tế' },
    quests: [
      { id: 'world_q5_1', title: 'Máy hơi nước', description: 'Thắng 10 trận đấu Cận đại thế giới.', target: 10, type: 'battle_win', category: 'World' }
    ]
  },
  {
    id: 'world_phase6',
    title: 'Thế Giới Hiện Đại',
    description: 'Từ hai cuộc đại chiến đến kỷ nguyên số và hội nhập toàn cầu.',
    category: 'World',
    era: 'Hiện đại Thế giới',
    requiredLevel: 25,
    rewards: { points: 6000, title: 'Bậc Thầy Thế Giới' },
    quests: [
      { id: 'world_q6_1', title: 'Thế giới phẳng', description: 'Thắng 10 trận đấu Hiện đại thế giới.', target: 10, type: 'battle_win', category: 'World' }
    ]
  }
];

export type IdeaStatus = 'received' | 'reviewing' | 'testing' | 'released';

export interface Idea {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  status: IdeaStatus;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
  rating: number; // 1-5
  category: 'graphics' | 'balance' | 'server';
}

export interface HallOfFameEntry {
  id: string;
  userName: string;
  achievement: string;
  date: string;
  points: number;
}

export interface Guild {
  id: string;
  name: string;
  leader: string;
  members: string[];
  description: string;
  level: number;
}

export interface Friend {
  id: string;
  name: string;
  rank: string;
  level: number;
  isOnline: boolean;
  relationshipType?: 'Tri kỷ' | 'Cố nhân' | 'Tỷ muội' | 'Huynh đệ' | 'Túc địch' | 'Nghịch lân';
  intimacy?: number;
  intimacyLevel?: number;
}

export interface FriendRequest {
  id: string;
  name: string;
  rank: string;
  level: number;
}

export interface ServerRaid {
  id: string;
  title: string;
  bossName: string;
  totalHp: number;
  currentHp: number;
  rewards: string;
  endTime: string;
}

export interface SpeedModeConfig {
  questionCount: 10 | 20;
  mode: 'fast' | 'blitz' | 'super_blitz';
  duration: number; // in minutes
}

export const RANKS = ['Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Cao Thủ', 'Thách Đấu'];

export type Difficulty = 'Sơ' | 'Trung' | 'Cao';
export type GameMode = 'battle' | 'character_battle' | 'epithet_battle' | 'raid' | 'true_false' | 'fill_blank' | 'speed_history' | 'ranked' | 'event_guessing';

export const GENERALS: General[] = [
  {
    id: 'quang-trung',
    name: 'Quang Trung',
    title: 'Bắc Bình Vương',
    description: 'Vị hoàng đế thiên tài quân sự, bách chiến bách thắng, nổi tiếng with cuộc hành quân thần tốc đại phá quân Thanh.',
    skills: [
      { 
        name: 'Thần tốc', 
        description: 'Mô phỏng cuộc hành quân thần tốc từ Phú Xuân ra Thăng Long năm 1789.', 
        effect: 'Làm chậm tốc độ trôi của thời gian đếm ngược đi 30%, giúp người chơi có thêm thời gian suy nghĩ và phản xạ trong các trận đấu căng thẳng.',
        type: 'passive',
        battleEffect: { type: 'time_slow', value: 0.3 }
      },
      { 
        name: 'Voi chiến', 
        description: 'Sử dụng đội quân voi chiến dũng mãnh để áp đảo tinh thần và sức mạnh đối phương.', 
        effect: 'Nhân đôi (x2) số điểm nhận được cho câu hỏi hiện tại. Đây là kỹ năng xoay chuyển cục diện trận đấu khi gặp câu hỏi quan trọng.',
        type: 'active',
        battleEffect: { type: 'score_boost', value: 2 },
        cooldown: 3
      }
    ],
    image: 'https://picsum.photos/seed/quangtrung/400/600',
    suggestedQuestions: [
      'Đánh giá về chiến thuật thần tốc của Quang Trung?',
      'Những cải cách của Quang Trung sau khi lên ngôi?',
      'Ý nghĩa của chiến thắng Ngọc Hồi - Đống Đa?'
    ]
  },
  {
    id: 'tran-hung-dao',
    name: 'Trần Hưng Đạo',
    title: 'Hưng Đạo Đại Vương',
    description: 'Vị anh hùng dân tộc, nhà quân sự kiệt xuất 3 lần đánh thắng quân Nguyên Mông xâm lược.',
    skills: [
      { 
        name: 'Vườn không nhà trống', 
        description: 'Chiến thuật tiêu hao sinh lực địch bằng cách rút lui chiến lược, bỏ lại thành trống.', 
        effect: 'Kích hoạt một lớp bảo vệ, cho phép người chơi chọn sai một lần mà không bị trừ điểm hoặc mất HP. Một kỹ năng phòng thủ tuyệt đối.',
        type: 'active',
        battleEffect: { type: 'skip_wrong', value: 1 },
        cooldown: 5
      },
      { 
        name: 'Hịch Tướng Sĩ', 
        description: 'Bài hịch hào hùng khơi dậy lòng yêu nước và ý chí chiến đấu mãnh liệt của quân dân.', 
        effect: 'Hồi phục ngay lập tức 1 đơn vị sinh lực (HP) đã mất. Giúp người chơi bền bỉ hơn trong các cuộc đối đầu kéo dài.',
        type: 'active',
        battleEffect: { type: 'heal', value: 1 },
        cooldown: 4
      }
    ],
    image: 'https://picsum.photos/seed/tranhungdao/400/600',
    suggestedQuestions: [
      'Nội dung chính của Hịch Tướng Sĩ?',
      'Chiến thuật "Vườn không nhà trống" được áp dụng như thế nào?',
      'Tư tưởng "Khoan thư sức dân" của Trần Hưng Đạo?'
    ]
  },
  {
    id: 'le-loi',
    name: 'Lê Lợi',
    title: 'Bình Định Vương',
    description: 'Người lãnh đạo cuộc khởi nghĩa Lam Sơn ròng rã 10 năm chống quân Minh, giành lại độc lập cho dân tộc.',
    skills: [
      { 
        name: 'Khởi nghĩa Lam Sơn', 
        description: 'Tập hợp sức mạnh đoàn kết của toàn dân tộc, từ miền núi đến đồng bằng để đánh đuổi ngoại xâm.', 
        effect: 'Tăng 30% sức mạnh tấn công (sát thương gây ra cho đối thủ) khi trả lời đúng, giúp kết thúc trận đấu nhanh hơn.',
        type: 'passive',
        battleEffect: { type: 'damage_boost', value: 1.3 }
      },
      { 
        name: 'Hồ Gươm', 
        description: 'Sự tích trả gươm thần cho Rùa Vàng sau khi đất nước thanh bình, biểu tượng của hòa bình.', 
        effect: 'Tăng 20% lượng vàng và kinh nghiệm (XP) nhận được sau mỗi trận thắng, giúp phát triển tài nguyên nhanh chóng.',
        type: 'passive',
        battleEffect: { type: 'bonus_reward', value: 1.2 }
      }
    ],
    image: 'https://picsum.photos/seed/leloi/400/600',
    suggestedQuestions: [
      'Nguyên nhân thắng lợi của khởi nghĩa Lam Sơn?',
      'Vai trò của Nguyễn Trãi trong khởi nghĩa Lam Sơn?',
      'Sự tích trả gươm thần ở Hồ Hoàn Kiếm?'
    ]
  },
  {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    title: 'Chủ tịch Hồ Chí Minh',
    description: 'Vị lãnh tụ vĩ đại, anh hùng giải phóng dân tộc, danh nhân văn hóa thế giới.',
    skills: [
      { 
        name: 'Đoàn kết', 
        description: 'Tư tưởng "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công" - sức mạnh vô địch.', 
        effect: 'Tăng 20% hiệu quả của tất cả các chỉ số hỗ trợ (thời gian, điểm số, sát thương) trong suốt quá trình thi đấu.',
        type: 'passive',
        battleEffect: { type: 'damage_boost', value: 1.2 }
      },
      { 
        name: 'Cứu quốc', 
        description: 'Hành trình 30 năm tìm đường cứu nước đầy gian khổ, từ bến cảng Nhà Rồng đi khắp thế giới.', 
        effect: 'Tăng mạnh 50% lượng kinh nghiệm (XP) nhận được từ các hoạt động, giúp người chơi thăng cấp thần tốc.',
        type: 'passive',
        battleEffect: { type: 'xp_boost', value: 1.5 }
      }
    ],
    image: 'https://picsum.photos/seed/hochiminh/400/600',
    suggestedQuestions: [
      'Hành trình tìm đường cứu nước của Bác Hồ?',
      'Nội dung bản Tuyên ngôn Độc lập 1945?',
      'Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc?'
    ]
  },
  {
    id: 'mac-cuu',
    name: 'Mạc Cửu',
    title: 'Tổng trấn Hà Tiên',
    description: 'Người có công khai phá và phát triển vùng đất Hà Tiên, góp phần mở mang bờ cõi phương Nam.',
    skills: [
      { 
        name: 'Khẩn hoang', 
        description: 'Công cuộc khai phá đất hoang, lập làng định cư vùng đất Hà Tiên và Nam Bộ xưa.', 
        effect: 'Nhận thêm 50% điểm thưởng cho mỗi chuỗi trả lời đúng liên tiếp (combo), tối ưu hóa điểm số đạt được.',
        type: 'passive',
        battleEffect: { type: 'score_boost', value: 1.5 }
      },
      { 
        name: 'Ngoại giao', 
        description: 'Sử dụng sự khéo léo, tầm nhìn xa trông rộng để duy trì hòa bình và bảo vệ vùng đất mới.', 
        effect: 'Cho phép đổi câu hỏi hiện tại sang một câu hỏi khác cùng độ khó. Một giải pháp an toàn khi gặp câu hỏi quá khó.',
        type: 'active',
        battleEffect: { type: 'change_question', value: 1 },
        cooldown: 2
      }
    ],
    image: 'https://picsum.photos/seed/maccuu/400/600',
    suggestedQuestions: [
      'Công lao của Mạc Cửu đối với vùng đất Hà Tiên?',
      'Tại sao Mạc Cửu lại quyết định thần phục nhà Nguyễn?',
      'Lịch sử hình thành vùng đất Nam Bộ thời Mạc Cửu?'
    ]
  }
];

export const MILESTONES: Milestone[] = [
  { id: '1', year: 1930, title: 'Thành lập Đảng Cộng sản Việt Nam', description: 'Sự kiện bước ngoặt của cách mạng Việt Nam.', category: 'VN' },
  { id: '2', year: 1945, title: 'Cách mạng Tháng Tám thành công', description: 'Khai sinh nước Việt Nam Dân chủ Cộng hòa.', category: 'VN' },
  { id: '3', year: 1954, title: 'Chiến thắng Điện Biên Phủ', description: 'Lừng lẫy năm châu, chấn động địa cầu.', category: 'VN' },
  { id: '4', year: 1975, title: 'Giải phóng miền Nam, thống nhất đất nước', description: 'Kết thúc cuộc kháng chiến chống Mỹ cứu nước.', category: 'VN' },
  { id: '5', year: 1945, title: 'Kết thúc Thế chiến II', description: 'Sự sụp đổ của chủ nghĩa phát xít.', category: 'World' },
  { id: '6', year: 1917, title: 'Cách mạng Tháng Mười Nga', description: 'Mở ra thời đại mới cho lịch sử nhân loại.', category: 'World' },
  { id: '7', year: -2560, title: 'Xây dựng Kim tự tháp Giza', description: 'Kỳ quan vĩ đại của văn minh Ai Cập cổ đại.', category: 'World' },
  { id: '8', year: -508, title: 'Thiết lập dân chủ tại Athens', description: 'Cái nôi của nền dân chủ phương Tây.', category: 'World' },
  { id: '9', year: 476, title: 'Đế quốc Tây La Mã sụp đổ', description: 'Đánh dấu sự kết thúc thời kỳ Cổ đại.', category: 'World' },
  { id: '10', year: 1096, title: 'Cuộc Thập tự chinh lần thứ nhất', description: 'Khởi đầu chuỗi các cuộc chiến tranh tôn giáo.', category: 'World' },
  { id: '11', year: 1492, title: 'Columbus tìm ra châu Mỹ', description: 'Mở đầu kỷ nguyên Đại phát kiến địa lý.', category: 'World' }
];


export const EVENT_GUESSING_DATA: EventGuessingQuestion[] = [
  {
    id: 'eg1',
    location: 'Thăng Long (Hà Nội)',
    year: 1010,
    correctAnswer: 'Lý Thái Tổ dời đô',
    options: ['Lý Thái Tổ dời đô', 'Chiến thắng quân Tống', 'Xây dựng Văn Miếu', 'Thành lập nhà Trần'],
    explanation: 'Năm 1010, Lý Công Uẩn (Lý Thái Tổ) quyết định dời đô từ Hoa Lư về thành Đại La và đổi tên thành Thăng Long.',
    category: 'VN'
  },
  {
    id: 'eg2',
    location: 'Sông Bạch Đằng',
    year: 938,
    correctAnswer: 'Ngô Quyền đại phá quân Nam Hán',
    options: ['Ngô Quyền đại phá quân Nam Hán', 'Lê Hoàn đánh quân Tống', 'Trần Hưng Đạo đánh quân Nguyên', 'Lý Thường Kiệt đánh quân Tống'],
    explanation: 'Năm 938, Ngô Quyền sử dụng trận địa cọc gỗ trên sông Bạch Đằng để tiêu diệt quân Nam Hán, kết thúc 1000 năm Bắc thuộc.',
    category: 'VN'
  },
  {
    id: 'eg3',
    location: 'Điện Biên Phủ',
    year: 1954,
    correctAnswer: 'Chiến thắng Điện Biên Phủ',
    options: ['Chiến thắng Điện Biên Phủ', 'Ký hiệp định Geneve', 'Chiến dịch Biên giới', 'Chiến dịch Việt Bắc'],
    explanation: 'Ngày 7/5/1954, quân đội Việt Nam giành thắng lợi hoàn toàn tại cứ điểm Điện Biên Phủ, buộc Pháp phải ký Hiệp định Geneve.',
    category: 'VN'
  },
  {
    id: 'eg4',
    location: 'Quảng trường Ba Đình',
    year: 1945,
    correctAnswer: 'Bác Hồ đọc Tuyên ngôn Độc lập',
    options: ['Bác Hồ đọc Tuyên ngôn Độc lập', 'Thành lập Đảng', 'Cách mạng Tháng Tám', 'Đại hội Đảng lần thứ nhất'],
    explanation: 'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
    category: 'VN'
  },
  {
    id: 'eg5',
    location: 'Berlin, Đức',
    year: 1989,
    correctAnswer: 'Sụp đổ bức tường Berlin',
    options: ['Sụp đổ bức tường Berlin', 'Thống nhất nước Đức', 'Kết thúc Thế chiến II', 'Thành lập EU'],
    explanation: 'Năm 1989, bức tường Berlin sụp đổ, đánh dấu sự kết thúc của Chiến tranh Lạnh và tiến tới thống nhất nước Đức.',
    category: 'World'
  },
  {
    id: 'eg6',
    location: 'Hiroshima, Nhật Bản',
    year: 1945,
    correctAnswer: 'Mỹ ném bom nguyên tử',
    options: ['Mỹ ném bom nguyên tử', 'Nhật Bản đầu hàng', 'Trận Trân Châu Cảng', 'Kết thúc chiến tranh Thái Bình Dương'],
    explanation: 'Ngày 6/8/1945, Mỹ ném quả bom nguyên tử đầu tiên xuống Hiroshima, gây ra thiệt hại khủng khiếp và dẫn đến sự đầu hàng của Nhật Bản.',
    category: 'World'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 'q0_1',
    question: 'Dấu tích của Người tối cổ ở Việt Nam được tìm thấy sớm nhất tại đâu?',
    options: ['Thẩm Khuyên, Thẩm Hai (Lạng Sơn)', 'Núi Đọ (Thanh Hóa)', 'Xuân Lộc (Đồng Nai)', 'An Khê (Gia Lai)'],
    correctAnswer: 3,
    explanation: 'Các công cụ đá của Người tối cổ có niên đại khoảng 80 vạn năm trước đã được tìm thấy tại An Khê (Gia Lai).',
    hint: 'Một địa danh thuộc vùng Tây Nguyên.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q0_2',
    question: 'Nền văn hóa nào được coi là đỉnh cao của thời kỳ đồ đá mới ở Việt Nam?',
    options: ['Văn hóa Hòa Bình', 'Văn hóa Bắc Sơn', 'Văn hóa Quỳnh Văn', 'Văn hóa Hạ Long'],
    correctAnswer: 0,
    explanation: 'Văn hóa Hòa Bình là nền văn hóa tiêu biểu cho thời kỳ đồ đá mới với kỹ thuật mài đá phát triển.',
    hint: 'Tên một tỉnh thuộc vùng Tây Bắc.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q0_3',
    question: 'Sự kiện nào được coi là bước ngoặt quan trọng nhất giúp Người tối cổ tiến hóa thành Người tinh khôn?',
    options: ['Biết chế tạo công cụ bằng đá', 'Biết cách tạo ra lửa và sử dụng lửa', 'Biết săn bắt và hái lượm', 'Biết vẽ tranh trên vách đá'],
    correctAnswer: 1,
    explanation: 'Việc phát minh ra lửa giúp con người cải thiện thức ăn, sưởi ấm và xua đuổi thú dữ, thúc đẩy quá trình tiến hóa.',
    hint: 'Một phát minh giúp thay đổi hoàn toàn đời sống sinh hoạt và dinh dưỡng.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'q0_4',
    question: 'Cuộc cách mạng nào đánh dấu sự chuyển biến từ nền kinh tế săn bắt, hái lượm sang nền kinh tế trồng trọt, chăn nuôi?',
    options: ['Cách mạng đồ đá cũ', 'Cách mạng đồ đá mới', 'Cách mạng đồ đồng', 'Cách mạng công nghiệp'],
    correctAnswer: 1,
    explanation: 'Cách mạng đồ đá mới (Neolithic Revolution) là giai đoạn con người bắt đầu biết định cư, trồng trọt và thuần dưỡng gia súc.',
    hint: 'Giai đoạn sau của thời kỳ đồ đá.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'q1',
    question: 'Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn?',
    options: ['Lê Lợi', 'Nguyễn Trãi', 'Trần Hưng Đạo', 'Quang Trung'],
    correctAnswer: 0,
    explanation: 'Lê Lợi là người khởi xướng và lãnh đạo cuộc khởi nghĩa Lam Sơn chống quân Minh.',
    hint: 'Ông là người lập ra nhà Hậu Lê.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q2',
    question: 'Chiến dịch Điện Biên Phủ kết thúc vào ngày tháng năm nào?',
    options: ['07/05/1954', '30/04/1975', '02/09/1945', '19/12/1946'],
    correctAnswer: 0,
    explanation: 'Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào ngày 7/5/1954.',
    hint: 'Sự kiện lừng lẫy năm châu, chấn động địa cầu năm 1954.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q3',
    question: 'Vị vua nào đã ban chiếu dời đô từ Hoa Lư về Thăng Long?',
    options: ['Lý Thái Tổ', 'Lý Thái Tông', 'Lý Thánh Tông', 'Lý Nhân Tông'],
    correctAnswer: 0,
    explanation: 'Năm 1010, Lý Thái Tổ (Lý Công Uẩn) đã ban chiếu dời đô từ Hoa Lư về Đại La và đổi tên thành Thăng Long.',
    hint: 'Ông là người sáng lập ra vương triều nhà Lý.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q4',
    question: 'Ai là người đã đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa?',
    options: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Phạm Văn Đồng', 'Trường Chinh'],
    correctAnswer: 0,
    explanation: 'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập.',
    hint: 'Vị lãnh tụ vĩ đại của dân tộc Việt Nam.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q5',
    question: 'Cuộc cách mạng công nghiệp lần thứ nhất bắt đầu tại quốc gia nào?',
    options: ['Anh', 'Pháp', 'Đức', 'Mỹ'],
    correctAnswer: 0,
    explanation: 'Cách mạng công nghiệp lần thứ nhất bắt đầu từ nước Anh vào nửa sau thế kỷ XVIII.',
    hint: 'Quốc gia được mệnh danh là "Xứ sở sương mù".',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q6',
    question: 'Sự kiện nào đánh dấu sự kết thúc của Chiến tranh thế giới thứ hai tại châu Âu?',
    options: ['Đức ký văn bản đầu hàng không điều kiện', 'Nhật Bản ký văn bản đầu hàng', 'Hội nghị Yalta', 'Hội nghị Potsdam'],
    correctAnswer: 0,
    explanation: 'Ngày 8/5/1945, Đức ký văn bản đầu hàng không điều kiện, kết thúc chiến tranh ở châu Âu.',
    hint: 'Sự kiện diễn ra vào tháng 5 năm 1945.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q7',
    question: 'Ai là người đầu tiên tìm ra châu Mỹ?',
    options: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Amerigo Vespucci'],
    correctAnswer: 0,
    explanation: 'Christopher Columbus là người dẫn đầu đoàn thám hiểm tìm ra châu Mỹ vào năm 1492.',
    hint: 'Một nhà thám hiểm người Ý phục vụ cho triều đình Tây Ban Nha.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'q8',
    question: 'Bức tường Berlin sụp đổ vào năm nào?',
    options: ['1989', '1990', '1991', '1988'],
    correctAnswer: 0,
    explanation: 'Bức tường Berlin sụp đổ vào ngày 9/11/1989, đánh dấu sự kết thúc của Chiến tranh Lạnh.',
    hint: 'Cuối thập niên 80 của thế kỷ XX.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q9',
    question: 'Chiến thắng Bạch Đằng năm 938 do ai lãnh đạo?',
    options: ['Ngô Quyền', 'Lê Hoàn', 'Trần Hưng Đạo', 'Dương Đình Nghệ'],
    correctAnswer: 0,
    explanation: 'Ngô Quyền đã lãnh đạo quân dân ta đánh tan quân Nam Hán trên sông Bạch Đằng năm 938.',
    hint: 'Ông là người kết thúc hơn 1000 năm Bắc thuộc.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q10',
    question: 'Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?',
    options: ['Năm 40', 'Năm 43', 'Năm 248', 'Năm 542'],
    correctAnswer: 0,
    explanation: 'Cuộc khởi nghĩa Hai Bà Trưng bùng nổ vào mùa xuân năm 40 tại Hát Môn.',
    hint: 'Cuộc khởi nghĩa đầu tiên của nhân dân ta chống lại ách đô hộ của nhà Hán.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q11',
    question: 'Chiến dịch cuối cùng trong cuộc Tổng tiến công và nổi dậy mùa Xuân 1975 là?',
    options: ['Chiến dịch Hồ Chí Minh', 'Chiến dịch Tây Nguyên', 'Chiến dịch Huế - Đà Nẵng', 'Chiến dịch Đường 14 - Phước Long'],
    correctAnswer: 0,
    explanation: 'Chiến dịch Hồ Chí Minh (từ 26/4 đến 30/4/1975) là chiến dịch cuối cùng giải phóng hoàn toàn miền Nam.',
    hint: 'Chiến dịch mang tên vị lãnh tụ vĩ đại của dân tộc.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q12',
    question: 'Hiệp định Giơ-ne-vơ về Đông Dương được ký kết vào năm nào?',
    options: ['1954', '1946', '1973', '1945'],
    correctAnswer: 0,
    explanation: 'Hiệp định Giơ-ne-vơ được ký kết ngày 21/7/1954 sau chiến thắng Điện Biên Phủ.',
    hint: 'Sự kiện diễn ra ngay sau khi thực dân Pháp thất bại tại Điện Biên Phủ.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q13',
    question: 'Hiệp định Pa-ri về Việt Nam được ký kết vào ngày tháng năm nào?',
    options: ['27/01/1973', '30/04/1975', '21/07/1954', '02/09/1945'],
    correctAnswer: 0,
    explanation: 'Hiệp định Pa-ri về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký chính thức ngày 27/01/1973.',
    hint: 'Hiệp định buộc Mỹ phải rút quân về nước.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q14',
    question: 'Phong trào Cần Vương bùng nổ sau sự kiện nào?',
    options: ['Cuộc phản công tại kinh thành Huế thất bại', 'Vua Hàm Nghi bị bắt', 'Pháp đánh chiếm Bắc Kỳ lần thứ nhất', 'Hiệp ước Patenốt được ký kết'],
    correctAnswer: 0,
    explanation: 'Sau thất bại của cuộc phản công tại kinh thành Huế, Tôn Thất Thuyết đưa vua Hàm Nghi ra Tân Sở và xuống chiếu Cần Vương.',
    hint: 'Sự kiện liên quan đến vua Hàm Nghi và Tôn Thất Thuyết.',
    grade: 11,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q15',
    question: 'Hội nghị I-an-ta (2/1945) có sự tham gia của các quốc gia nào?',
    options: ['Liên Xô, Mỹ, Anh', 'Mỹ, Anh, Pháp', 'Liên Xô, Mỹ, Trung Quốc', 'Liên Xô, Anh, Pháp'],
    correctAnswer: 0,
    explanation: 'Hội nghị I-an-ta có sự tham gia của nguyên thủ ba cường quốc: Liên Xô (Xta-lin), Mỹ (Ru-dơ-ven), Anh (Sớc-xin).',
    hint: 'Ba cường quốc trụ cột trong phe Đồng minh.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q16',
    question: 'Cách mạng tháng Mười Nga năm 1917 do ai lãnh đạo?',
    options: ['V.I. Lê-nin', 'Xta-lin', 'Mác', 'Ăng-ghen'],
    correctAnswer: 0,
    explanation: 'Cách mạng tháng Mười Nga năm 1917 do Đảng Bôn-sê-vích và V.I. Lê-nin lãnh đạo.',
    hint: 'Vị lãnh tụ vĩ đại của giai cấp vô sản thế giới.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q17',
    question: 'Tổ chức Liên hợp quốc chính thức thành lập vào năm nào?',
    options: ['1945', '1944', '1946', '1950'],
    correctAnswer: 0,
    explanation: 'Ngày 24/10/1945, Hiến chương Liên hợp quốc chính thức có hiệu lực, đánh dấu sự thành lập tổ chức này.',
    hint: 'Năm kết thúc Chiến tranh thế giới thứ hai.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q18',
    question: 'Sự kiện nào khởi đầu cho "Chiến tranh lạnh"?',
    options: ['Thông điệp của Tổng thống Mỹ Truman', 'Kế hoạch Mác-san', 'Sự thành lập NATO', 'Sự thành lập tổ chức Vac-sa-va'],
    correctAnswer: 0,
    explanation: 'Thông điệp của Tổng thống Truman tại Quốc hội Mỹ ngày 12/3/1947 được xem là sự khởi đầu cho Chiến tranh lạnh.',
    hint: 'Một bài phát biểu của Tổng thống Mỹ năm 1947.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q19',
    question: 'Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập tại đâu?',
    options: ['Băng Cốc (Thái Lan)', 'Jakarta (Indonesia)', 'Manila (Philippines)', 'Kuala Lumpur (Malaysia)'],
    correctAnswer: 0,
    explanation: 'ASEAN được thành lập ngày 8/8/1967 tại Băng Cốc, Thái Lan.',
    hint: 'Thủ đô của Thái Lan.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q20',
    question: 'Cuộc cải cách Minh Trị ở Nhật Bản diễn ra vào năm nào?',
    options: ['1868', '1886', '1858', '1898'],
    correctAnswer: 0,
    explanation: 'Cuộc cải cách Minh Trị bắt đầu từ tháng 1/1868 sau khi Thiên hoàng Minh Trị lên ngôi.',
    hint: 'Nửa sau thế kỷ XIX tại Nhật Bản.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q21',
    question: 'Sự kiện mở đầu cho Cách mạng Pháp năm 1789 là?',
    options: ['Quần chúng tấn công ngục Ba-xti', 'Vua Lu-i XVI bị xử tử', 'Tuyên ngôn Nhân quyền và Dân quyền', 'Thành lập nền Cộng hòa'],
    correctAnswer: 0,
    explanation: 'Ngày 14/7/1789, quần chúng nhân dân Pa-ri tấn công ngục Ba-xti, mở đầu cho cuộc cách mạng.',
    hint: 'Cuộc tấn công vào biểu tượng của chế độ phong kiến chuyên chế Pháp.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q22',
    question: 'Chiến tranh thế giới thứ nhất diễn ra trong khoảng thời gian nào?',
    options: ['1914 - 1918', '1939 - 1945', '1917 - 1919', '1911 - 1913'],
    correctAnswer: 0,
    explanation: 'Chiến tranh thế giới thứ nhất diễn ra từ năm 1914 đến năm 1918.',
    hint: 'Cuộc chiến tranh đế quốc đầu tiên có quy mô toàn cầu.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q23',
    question: 'Khởi nghĩa Yên Bái (2/1930) do tổ chức nào lãnh đạo?',
    options: ['Việt Nam Quốc dân đảng', 'Đảng Cộng sản Việt Nam', 'Việt Nam Cách mạng Đồng chí hội', 'Tân Việt Cách mạng đảng'],
    correctAnswer: 0,
    explanation: 'Khởi nghĩa Yên Bái do Việt Nam Quốc dân đảng lãnh đạo với khẩu hiệu "Không thành công cũng thành nhân".',
    hint: 'Tổ chức do Nguyễn Thái Học đứng đầu.',
    grade: 12,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q24',
    question: 'Phong trào Xô viết Nghệ - Tĩnh diễn ra trong khoảng thời gian nào?',
    options: ['1930 - 1931', '1936 - 1939', '1939 - 1945', '1945 - 1946'],
    correctAnswer: 0,
    explanation: 'Phong trào Xô viết Nghệ - Tĩnh là đỉnh cao của phong trào cách mạng 1930 - 1931.',
    hint: 'Phong trào cách mạng đầu tiên do Đảng Cộng sản lãnh đạo.',
    grade: 12,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q25',
    question: 'Nguyễn Ái Quốc ra đi tìm đường cứu nước vào ngày tháng năm nào?',
    options: ['05/06/1911', '19/05/1890', '03/02/1930', '02/09/1945'],
    correctAnswer: 0,
    explanation: 'Ngày 5/6/1911, từ bến cảng Nhà Rồng, Nguyễn Tất Thành ra đi tìm đường cứu nước.',
    hint: 'Sự kiện diễn ra tại bến cảng Nhà Rồng.',
    grade: 12,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q26',
    question: 'Trận Rạch Gầm - Xoài Mút (1785) đánh tan quân xâm lược nào?',
    options: ['Quân Xiêm', 'Quân Thanh', 'Quân Minh', 'Quân Nguyên'],
    correctAnswer: 0,
    explanation: 'Năm 1785, Nguyễn Huệ đã lãnh đạo quân Tây Sơn đánh tan 5 vạn quân Xiêm tại Rạch Gầm - Xoài Mút.',
    hint: 'Quân xâm lược đến từ phương Nam (Thái Lan ngày nay).',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q27',
    question: 'Trống đồng Đông Sơn là biểu tượng của nền văn hóa nào?',
    options: ['Văn hóa Đông Sơn', 'Văn hóa Hòa Bình', 'Văn hóa Sa Huỳnh', 'Văn hóa Đồng Nai'],
    correctAnswer: 0,
    explanation: 'Trống đồng Đông Sơn là thành tựu tiêu biểu nhất của cư dân văn hóa Đông Sơn thời kỳ Hùng Vương.',
    hint: 'Nền văn hóa gắn liền với sự ra đời của nhà nước đầu tiên ở Việt Nam.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q28',
    question: 'Nhà nước đầu tiên trong lịch sử Việt Nam là?',
    options: ['Văn Lang', 'Âu Lạc', 'Vạn Xuân', 'Đại Cồ Việt'],
    correctAnswer: 0,
    explanation: 'Văn Lang là nhà nước đầu tiên trong lịch sử Việt Nam, do các vua Hùng đứng đầu.',
    hint: 'Nhà nước gắn liền với truyền thuyết 18 đời vua Hùng.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q29',
    question: 'Hội nghị Diên Hồng thể hiện tinh thần gì của quân dân nhà Trần?',
    options: ['Quyết tâm đánh giặc', 'Hòa hoãn với giặc', 'Đầu hàng giặc', 'Chạy giặc'],
    correctAnswer: 0,
    explanation: 'Hội nghị Diên Hồng do vua Trần Thánh Tông triệu tập các bô lão để hỏi ý kiến đánh hay hòa, thể hiện sự đoàn kết quyết tâm đánh giặc.',
    hint: 'Tinh thần "Sát Thát" của quân dân nhà Trần.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q30',
    question: 'Tác giả của bản "Bình Ngô Đại Cáo" là ai?',
    options: ['Nguyễn Trãi', 'Lê Lợi', 'Trần Hưng Đạo', 'Lý Thường Kiệt'],
    correctAnswer: 0,
    explanation: 'Nguyễn Trãi là người thừa lệnh Lê Lợi viết bản Bình Ngô Đại Cáo tuyên bố kết thúc kháng chiến chống Minh.',
    hint: 'Vị quân sư tài ba của Lê Lợi.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q31',
    question: 'Kinh đô của nước Âu Lạc thời An Dương Vương đóng tại đâu?',
    options: ['Cổ Loa (Đông Anh, Hà Nội)', 'Hoa Lư (Ninh Bình)', 'Phong Châu (Phú Thọ)', 'Bạch Hạc (Phú Thọ)'],
    correctAnswer: 0,
    explanation: 'An Dương Vương đã cho xây thành Cổ Loa làm kinh đô của nước Âu Lạc.',
    hint: 'Nơi có truyền thuyết về nỏ thần và Mỵ Châu - Trọng Thủy.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q32',
    question: 'Cuộc khởi nghĩa của Lý Nam Đế (Lý Bí) đã thành lập nên nhà nước nào?',
    options: ['Vạn Xuân', 'Đại Cồ Việt', 'Đại Việt', 'Âu Lạc'],
    correctAnswer: 0,
    explanation: 'Năm 544, sau khi đánh đuổi quân Lương, Lý Bí lên ngôi hoàng đế và đặt tên nước là Vạn Xuân.',
    hint: 'Tên nước có ý nghĩa là mong muốn đất nước hòa bình mãi mãi.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q33',
    question: 'Ai là người có công dẹp loạn 12 sứ quân, thống nhất đất nước năm 968?',
    options: ['Đinh Bộ Lĩnh', 'Lê Hoàn', 'Ngô Quyền', 'Lý Công Uẩn'],
    correctAnswer: 0,
    explanation: 'Đinh Bộ Lĩnh đã dẹp loạn 12 sứ quân, lên ngôi hoàng đế (Đinh Tiên Hoàng) và đặt tên nước là Đại Cồ Việt.',
    hint: 'Ông được gọi là Vạn Thắng Vương.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q34',
    question: 'Vị vua nào đã thực hiện cải cách tài chính, lần đầu tiên phát hành tiền giấy ở Việt Nam?',
    options: ['Hồ Quý Ly', 'Trần Nhân Tông', 'Lê Thánh Tông', 'Minh Mạng'],
    correctAnswer: 0,
    explanation: 'Năm 1396, Hồ Quý Ly cho phát hành tiền giấy "Thông bảo hội sao", thay thế tiền đồng.',
    hint: 'Vị vua lập ra nhà Hồ.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q35',
    question: 'Sông nào được chọn làm ranh giới chia cắt Đàng Trong và Đàng Ngoài thời Trịnh - Nguyễn phân tranh?',
    options: ['Sông Gianh', 'Sông Bến Hải', 'Sông Hồng', 'Sông Mã'],
    correctAnswer: 0,
    explanation: 'Sông Gianh (Quảng Bình) là ranh giới chia cắt đất nước thành Đàng Trong và Đàng Ngoài trong hơn 200 năm.',
    hint: 'Một con sông thuộc tỉnh Quảng Bình.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q36',
    question: 'Vị vua nào được coi là vị vua anh minh nhất thời Lê sơ, đưa đất nước phát triển đến đỉnh cao?',
    options: ['Lê Thánh Tông', 'Lê Thái Tổ', 'Lê Thái Tông', 'Lê Nhân Tông'],
    correctAnswer: 0,
    explanation: 'Lê Thánh Tông với niên hiệu Hồng Đức đã thực hiện nhiều cải cách quan trọng về luật pháp, hành chính và văn hóa.',
    hint: 'Người ban hành bộ luật Hồng Đức.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q37',
    question: 'Phong trào Đông Du do ai khởi xướng và lãnh đạo?',
    options: ['Phan Bội Châu', 'Phan Châu Trinh', 'Huỳnh Thúc Kháng', 'Lương Văn Can'],
    correctAnswer: 0,
    explanation: 'Phan Bội Châu thành lập Duy Tân hội và phát động phong trào Đông Du đưa thanh niên sang Nhật Bản học tập.',
    hint: 'Vị chí sĩ cách mạng nổi tiếng với tác phẩm "Việt Nam vong quốc sử".',
    grade: 11,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q38',
    question: 'Sự kiện nào đánh dấu bước ngoặt vĩ đại của lịch sử cách mạng Việt Nam năm 1930?',
    options: ['Đảng Cộng sản Việt Nam ra đời', 'Khởi nghĩa Yên Bái', 'Phong trào Xô viết Nghệ - Tĩnh', 'Thành lập Mặt trận Việt Minh'],
    correctAnswer: 0,
    explanation: 'Ngày 3/2/1930, Đảng Cộng sản Việt Nam được thành lập, chấm dứt thời kỳ khủng hoảng về đường lối lãnh đạo.',
    hint: 'Sự kiện diễn ra tại Cửu Long (Hương Cảng, Trung Quốc).',
    grade: 12,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q39',
    question: 'Chiến dịch nào đã làm phá sản hoàn toàn kế hoạch "đánh nhanh thắng nhanh" của thực dân Pháp năm 1947?',
    options: ['Chiến dịch Việt Bắc thu - đông', 'Chiến dịch Biên giới thu - đông', 'Chiến dịch Điện Biên Phủ', 'Chiến dịch Hòa Bình'],
    correctAnswer: 0,
    explanation: 'Thắng lợi của chiến dịch Việt Bắc thu - đông 1947 buộc Pháp phải chuyển sang đánh lâu dài.',
    hint: 'Chiến dịch diễn ra tại căn cứ địa kháng chiến của ta.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q40',
    question: 'Đại hội lần thứ mấy của Đảng (12/1986) đã đề ra đường lối đổi mới đất nước?',
    options: ['Đại hội VI', 'Đại hội IV', 'Đại hội V', 'Đại hội VII'],
    correctAnswer: 0,
    explanation: 'Đại hội đại biểu toàn quốc lần thứ VI (1986) đã mở đầu công cuộc đổi mới toàn diện đất nước.',
    hint: 'Đại hội đánh dấu bước ngoặt chuyển sang kinh tế thị trường.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q41',
    question: 'Nền văn minh cổ đại nào đã xây dựng các Kim tự tháp hùng vĩ?',
    options: ['Ai Cập', 'Lưỡng Hà', 'Ấn Độ', 'Trung Hoa'],
    correctAnswer: 0,
    explanation: 'Các Kim tự tháp là thành tựu kiến trúc vĩ đại của cư dân Ai Cập cổ đại.',
    hint: 'Nền văn minh gắn liền với sông Nin.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'q42',
    question: 'Ai là người đã thống nhất các bộ lạc Mông Cổ và lập ra đế chế Mông Cổ hùng mạnh?',
    options: ['Thành Cát Tư Hãn', 'Hốt Tất Liệt', 'Oa Khoát Đài', 'Mông Kha'],
    correctAnswer: 0,
    explanation: 'Thiết Mộc Chân được tôn là Thành Cát Tư Hãn, người sáng lập đế chế Mông Cổ.',
    hint: 'Vị khả hãn vĩ đại của thảo nguyên.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'q43',
    question: 'Phong trào Văn hóa Phục hưng bắt đầu tại quốc gia nào?',
    options: ['I-ta-li-a', 'Pháp', 'Anh', 'Đức'],
    correctAnswer: 0,
    explanation: 'Phong trào Văn hóa Phục hưng bắt đầu từ I-ta-li-a vào thế kỷ XIV và lan rộng ra châu Âu.',
    hint: 'Quốc gia có hình chiếc ủng trên bản đồ.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'q44',
    question: 'Cuộc cách mạng nào được coi là cuộc cách mạng tư sản đầu tiên trên thế giới?',
    options: ['Cách mạng Hà Lan', 'Cách mạng Anh', 'Cách mạng Pháp', 'Chiến tranh giành độc lập ở Bắc Mỹ'],
    correctAnswer: 0,
    explanation: 'Cách mạng Hà Lan (thế kỷ XVI) được coi là cuộc cách mạng tư sản đầu tiên thắng lợi.',
    hint: 'Cuộc đấu tranh chống lại ách thống trị của Tây Ban Nha.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q45',
    question: 'Ai là tác giả của thuyết Tương đối nổi tiếng?',
    options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Stephen Hawking'],
    correctAnswer: 0,
    explanation: 'Albert Einstein đã công bố thuyết Tương đối hẹp (1905) và thuyết Tương đối tổng quát (1915).',
    hint: 'Nhà vật lý lý thuyết vĩ đại nhất thế kỷ XX.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q46',
    question: 'Sự kiện nào đánh dấu sự sụp đổ của hệ thống xã hội chủ nghĩa ở Liên Xô và Đông Âu?',
    options: ['Sự tan rã của Liên bang Xô viết (1991)', 'Bức tường Berlin sụp đổ', 'Hội nghị Malta', 'Cuộc đảo chính tại Moscow'],
    correctAnswer: 0,
    explanation: 'Sự tan rã của Liên Xô vào tháng 12/1991 đánh dấu sự kết thúc của trật tự thế giới hai cực I-an-ta.',
    hint: 'Sự kiện diễn ra vào cuối năm 1991.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q47',
    question: 'Tổ chức Thương mại Thế giới (WTO) được thành lập vào năm nào?',
    options: ['1995', '1990', '2000', '1945'],
    correctAnswer: 0,
    explanation: 'WTO chính thức đi vào hoạt động từ ngày 1/1/1995, thay thế cho GATT.',
    hint: 'Giữa thập niên 90 của thế kỷ XX.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q48',
    question: 'Cuộc cách mạng Tân Hợi (1911) ở Trung Quốc do ai lãnh đạo?',
    options: ['Tôn Trung Sơn', 'Mao Trạch Đông', 'Tưởng Giới Thạch', 'Khang Hữu Vi'],
    correctAnswer: 0,
    explanation: 'Tôn Trung Sơn là người lãnh đạo Trung Quốc Đồng minh hội thực hiện cách mạng Tân Hợi.',
    hint: 'Người đề xướng Học thuyết Tam dân.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q49',
    question: 'Phát minh nào được coi là quan trọng nhất của cuộc cách mạng công nghiệp lần thứ nhất?',
    options: ['Máy hơi nước', 'Máy dệt', 'Đầu máy xe lửa', 'Điện tín'],
    correctAnswer: 0,
    explanation: 'Máy hơi nước của James Watt (1784) đã tạo ra bước ngoặt cho sản xuất công nghiệp.',
    hint: 'Phát minh của James Watt.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q50',
    question: 'Sự kiện "Ngày thứ Năm đen tối" (1929) mở đầu cho cuộc khủng hoảng nào?',
    options: ['Khủng hoảng kinh tế thế giới 1929-1933', 'Khủng hoảng năng lượng 1973', 'Khủng hoảng tài chính 2008', 'Chiến tranh thế giới thứ hai'],
    correctAnswer: 0,
    explanation: 'Sự sụp đổ của thị trường chứng khoán New York năm 1929 mở đầu cho cuộc đại khủng hoảng kinh tế.',
    hint: 'Cuộc khủng hoảng thừa trầm trọng nhất lịch sử tư bản chủ nghĩa.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q51',
    question: 'Triều đại nào dài nhất trong lịch sử Việt Nam?',
    options: ['Nhà Hậu Lê', 'Nhà Lý', 'Nhà Trần', 'Nhà Nguyễn'],
    correctAnswer: 0,
    explanation: 'Nhà Hậu Lê (bao gồm Lê sơ và Lê Trung hưng) kéo dài từ năm 1428 đến 1789, tổng cộng 361 năm.',
    hint: 'Triều đại bắt đầu sau cuộc khởi nghĩa Lam Sơn.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q52',
    question: 'Vị vua nào đã đổi tên nước từ Đại Cồ Việt thành Đại Việt vào năm 1054?',
    options: ['Lý Thánh Tông', 'Lý Thái Tổ', 'Lý Thái Tông', 'Lý Nhân Tông'],
    correctAnswer: 0,
    explanation: 'Năm 1054, sau khi lên ngôi, vua Lý Thánh Tông đã đổi quốc hiệu thành Đại Việt.',
    hint: 'Vị vua thứ ba của nhà Lý.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q53',
    question: 'Ai là người soạn thảo "Hịch Tướng Sĩ" để khích lệ quân sĩ chống quân Nguyên Mông?',
    options: ['Trần Hưng Đạo', 'Trần Thủ Độ', 'Trần Quang Khải', 'Trần Nhật Duật'],
    correctAnswer: 0,
    explanation: 'Hưng Đạo Đại Vương Trần Quốc Tuấn đã viết Hịch Tướng Sĩ để kêu gọi tinh thần yêu nước của các tướng sĩ.',
    hint: 'Vị anh hùng gắn liền với chiến thắng Bạch Đằng năm 1288.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q54',
    question: 'Cuộc khởi nghĩa Tây Sơn bùng nổ đầu tiên tại địa phương nào?',
    options: ['Quy Nhơn (Bình Định)', 'Phú Xuân (Huế)', 'Gia Định', 'Thăng Long'],
    correctAnswer: 0,
    explanation: 'Ba anh em Tây Sơn (Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ) dựng cờ khởi nghĩa tại vùng Tây Sơn thượng đạo (nay thuộc Bình Định).',
    hint: 'Vùng đất võ nổi tiếng miền Trung.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q55',
    question: 'Vị trạng nguyên trẻ nhất trong lịch sử Việt Nam (đỗ năm 13 tuổi) là ai?',
    options: ['Nguyễn Hiền', 'Lê Văn Hưu', 'Mạc Đĩnh Chi', 'Nguyễn Bỉnh Khiêm'],
    correctAnswer: 0,
    explanation: 'Nguyễn Hiền đỗ Trạng nguyên năm 1247 khi mới 13 tuổi, dưới triều vua Trần Thái Tông.',
    hint: 'Ông quê ở Nam Định, nổi tiếng thông minh từ nhỏ.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q56',
    question: 'Thành phố nào được chọn làm thủ đô của nước Việt Nam Dân chủ Cộng hòa sau Cách mạng tháng Tám 1945?',
    options: ['Hà Nội', 'Huế', 'Sài Gòn', 'Đà Lạt'],
    correctAnswer: 0,
    explanation: 'Sau khi Cách mạng tháng Tám thành công, Hà Nội trở thành thủ đô của nước Việt Nam Dân chủ Cộng hòa.',
    hint: 'Nơi Bác Hồ đọc Tuyên ngôn Độc lập tại quảng trường Ba Đình.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q57',
    question: 'Ai là Tổng tư lệnh chỉ huy trực tiếp chiến dịch Điện Biên Phủ năm 1954?',
    options: ['Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Hoàng Văn Thái', 'Lê Trọng Tấn'],
    correctAnswer: 0,
    explanation: 'Đại tướng Võ Nguyên Giáp là người trực tiếp chỉ huy chiến dịch "lừng lẫy năm châu, chấn động địa cầu".',
    hint: 'Vị tướng được thế giới tôn vinh là một trong những nhà quân sự lỗi lạc nhất.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q58',
    question: 'Sự kiện Vịnh Bắc Bộ (Mỹ dựng lên để lấy cớ đánh phá miền Bắc) diễn ra vào năm nào?',
    options: ['1964', '1960', '1968', '1972'],
    correctAnswer: 0,
    explanation: 'Tháng 8/1964, Mỹ dựng lên sự kiện Vịnh Bắc Bộ để bắt đầu cuộc chiến tranh phá hoại miền Bắc bằng không quân và hải quân.',
    hint: 'Đầu thập niên 60 của thế kỷ XX.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q59',
    question: 'Vị vua cuối cùng của triều đại nhà Nguyễn và cũng là vị vua cuối cùng của chế độ phong kiến Việt Nam là ai?',
    options: ['Bảo Đại', 'Khải Định', 'Duy Tân', 'Hàm Nghi'],
    correctAnswer: 0,
    explanation: 'Vua Bảo Đại thoái vị vào tháng 8/1945, chấm dứt sự tồn tại của triều đại nhà Nguyễn.',
    hint: 'Ông có tên khai sinh là Nguyễn Phúc Vĩnh Thụy.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q60',
    question: 'Ai được tương truyền là tác giả của bài thơ thần "Nam quốc sơn hà"?',
    options: ['Lý Thường Kiệt', 'Lý Thái Tổ', 'Trần Hưng Đạo', 'Nguyễn Trãi'],
    correctAnswer: 0,
    explanation: 'Bài thơ "Nam quốc sơn hà" được tương truyền do Lý Thường Kiệt đọc trên sông Như Nguyệt để khích lệ quân sĩ.',
    hint: 'Vị tướng lãnh đạo cuộc kháng chiến chống Tống thời Lý.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q61',
    question: 'Nền văn minh Hy Lạp cổ đại nổi tiếng với hình thức tổ chức chính trị nào?',
    options: ['Dân chủ chủ nô', 'Quân chủ chuyên chế', 'Phong kiến tập quyền', 'Cộng hòa quý tộc'],
    correctAnswer: 0,
    explanation: 'A-ten (Hy Lạp) là nơi khai sinh ra hình thức dân chủ sơ khai nhất trong lịch sử nhân loại.',
    hint: 'Quyền lực thuộc về đại hội công dân.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'q62',
    question: 'Đế quốc Tây La Mã chính thức sụp đổ vào năm nào, đánh dấu sự kết thúc của thời kỳ cổ đại?',
    options: ['476', '395', '1453', '410'],
    correctAnswer: 0,
    explanation: 'Năm 476, người Giéc-man lật đổ hoàng đế cuối cùng của Tây La Mã, mở đầu thời kỳ Trung đại ở châu Âu.',
    hint: 'Thế kỷ thứ V sau Công nguyên.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'q63',
    question: 'Ai là người đầu tiên thực hiện chuyến bay vào vũ trụ trên con tàu Phương Đông 1 năm 1961?',
    options: ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin', 'Phạm Tuân'],
    correctAnswer: 0,
    explanation: 'Yuri Gagarin (Liên Xô) là người đầu tiên bay vào không gian, mở ra kỷ nguyên chinh phục vũ trụ.',
    hint: 'Một phi công vũ trụ người Liên Xô.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q64',
    question: 'Cuộc "Cách mạng văn hóa" (1966-1976) diễn ra tại quốc gia nào?',
    options: ['Trung Quốc', 'Liên Xô', 'Triều Tiên', 'Việt Nam'],
    correctAnswer: 0,
    explanation: 'Cuộc Cách mạng văn hóa vô sản là một giai đoạn biến động chính trị xã hội lớn tại Trung Quốc.',
    hint: 'Quốc gia đông dân nhất thế giới thời điểm đó.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q65',
    question: 'Liên minh châu Âu (EU) có tiền thân là tổ chức nào được thành lập năm 1951?',
    options: ['Cộng đồng Than Thép châu Âu', 'Cộng đồng Kinh tế châu Âu', 'Cộng đồng Năng lượng nguyên tử châu Âu', 'Liên minh Tây Âu'],
    correctAnswer: 0,
    explanation: 'Cộng đồng Than Thép châu Âu (ECSC) là bước đi đầu tiên trong quá trình nhất thể hóa châu Âu.',
    hint: 'Tổ chức hợp tác về hai ngành công nghiệp cơ bản.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q66',
    question: 'Chiến tranh Lạnh chính thức kết thúc vào năm nào sau cuộc gặp gỡ giữa Bush và Gorbachev?',
    options: ['1989', '1991', '1985', '1995'],
    correctAnswer: 0,
    explanation: 'Tháng 12/1989, tại đảo Malta, lãnh đạo hai siêu cường Mỹ và Liên Xô tuyên bỏ chấm dứt Chiến tranh Lạnh.',
    hint: 'Năm bức tường Berlin sụp đổ.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q67',
    question: 'Ai là người đã phát minh ra bóng đèn sợi đốt thương mại đầu tiên vào năm 1879?',
    options: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'James Watt'],
    correctAnswer: 0,
    explanation: 'Thomas Alva Edison là nhà phát minh vĩ đại với hơn 1000 bằng sáng chế, trong đó có bóng đèn điện.',
    hint: 'Người được mệnh danh là "Phù thủy ở Menlo Park".',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q68',
    question: 'Kênh đào Suez nối liền hai vùng biển nào, đóng vai trò huyết mạch trong giao thương hàng hải thế giới?',
    options: ['Địa Trung Hải và Biển Đỏ', 'Đại Tây Dương và Thái Bình Dương', 'Biển Đen và Địa Trung Hải', 'Biển Bắc và Biển Baltic'],
    correctAnswer: 0,
    explanation: 'Kênh đào Suez cắt ngang eo đất Suez của Ai Cập, nối Địa Trung Hải với Biển Đỏ.',
    hint: 'Nằm ở Ai Cập, giúp rút ngắn đường biển từ châu Âu sang châu Á.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q69',
    question: 'Sự kiện Trân Châu Cảng (Nhật Bản tấn công Mỹ) diễn ra vào năm nào, khiến Mỹ chính thức tham gia Thế chiến II?',
    options: ['1941', '1939', '1942', '1945'],
    correctAnswer: 0,
    explanation: 'Ngày 7/12/1941, không quân Nhật Bản bất ngờ tấn công căn cứ hải quân Mỹ tại Trân Châu Cảng (Hawaii).',
    hint: 'Đầu thập niên 40 của thế kỷ XX.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q70',
    question: 'Ai là người lãnh đạo cuộc đấu tranh chống chế độ phân biệt chủng tộc (Apartheid) và trở thành Tổng thống da đen đầu tiên của Nam Phi?',
    options: ['Nelson Mandela', 'Martin Luther King', 'Desmond Tutu', 'Kofi Annan'],
    correctAnswer: 0,
    explanation: 'Nelson Mandela dành cả cuộc đời đấu tranh cho sự bình đẳng và hòa hợp dân tộc tại Nam Phi.',
    hint: 'Người đoạt giải Nobel Hòa bình năm 1993.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'q70_1',
    question: 'Ai là người đã phát minh ra máy in chữ rời vào khoảng năm 1450, tạo nên cuộc cách mạng trong việc truyền bá tri thức?',
    options: ['Johannes Gutenberg', 'Leonardo da Vinci', 'Isaac Newton', 'Galileo Galilei'],
    correctAnswer: 0,
    explanation: 'Johannes Gutenberg là người phát minh ra máy in chữ rời tại Đức, giúp sách trở nên phổ biến và rẻ hơn.',
    hint: 'Một thợ kim hoàn người Đức ở thế kỷ XV.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'q70_2',
    question: 'Đoàn thám hiểm của ai đã thực hiện chuyến đi vòng quanh thế giới đầu tiên bằng đường biển (1519-1522)?',
    options: ['Ferdinand Magellan', 'Christopher Columbus', 'Vasco da Gama', 'James Cook'],
    correctAnswer: 0,
    explanation: 'Ferdinand Magellan là người chỉ huy đoàn thám hiểm đầu tiên đi vòng quanh trái đất, chứng minh trái đất hình cầu.',
    hint: 'Một nhà thám hiểm người Bồ Đào Nha phục vụ cho Tây Ban Nha.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'q71',
    question: 'Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết vào năm nào?',
    options: ['1973', '1972', '1975', '1954'],
    correctAnswer: 0,
    explanation: 'Hiệp định Paris được ký kết ngày 27/01/1973 tại Pháp.',
    hint: 'Đầu thập niên 70 của thế kỷ XX.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q72',
    question: 'Vị vua nào đã thực hiện cuộc cải cách hành chính lớn nhất trong lịch sử phong kiến Việt Nam (chia cả nước thành 13 đạo thừa tuyên)?',
    options: ['Lê Thánh Tông', 'Lê Thái Tổ', 'Lê Nhân Tông', 'Lê Hiến Tông'],
    correctAnswer: 0,
    explanation: 'Vua Lê Thánh Tông đã thực hiện những cải cách toàn diện, đưa quốc gia Đại Việt đạt đến đỉnh cao của chế độ quân chủ chuyên chế.',
    hint: 'Vị vua nổi tiếng với bộ luật Hồng Đức.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q73',
    question: 'Cuộc cách mạng công nghiệp lần thứ hai (cuối thế kỷ XIX - đầu thế kỷ XX) gắn liền với phát minh nào?',
    options: ['Điện và động cơ đốt trong', 'Máy hơi nước', 'Máy tính điện tử', 'Trí tuệ nhân tạo'],
    correctAnswer: 0,
    explanation: 'Cách mạng công nghiệp lần 2 đặc trưng bởi việc sử dụng năng lượng điện và sản xuất dây chuyền.',
    hint: 'Năng lượng thay thế cho than đá và hơi nước.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q73_1',
    question: 'Cuộc cách mạng công nghiệp lần thứ nhất bắt đầu sớm nhất tại quốc gia nào?',
    options: ['Anh', 'Pháp', 'Đức', 'Mỹ'],
    correctAnswer: 0,
    explanation: 'Cách mạng công nghiệp bắt đầu từ Anh vào những năm 60 của thế kỷ XVIII, sau đó lan rộng ra các nước khác.',
    hint: 'Quốc gia được mệnh danh là "công xưởng của thế giới" vào thế kỷ XIX.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q74',
    question: 'Ai là người đã tìm ra định luật vạn vật hấp dẫn?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nicolaus Copernicus'],
    correctAnswer: 0,
    explanation: 'Isaac Newton là nhà vật lý, toán học người Anh nổi tiếng với định luật vạn vật hấp dẫn.',
    hint: 'Câu chuyện về quả táo rơi trúng đầu.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'q75',
    question: 'Trận "Điện Biên Phủ trên không" diễn ra trong bao nhiêu ngày đêm?',
    options: ['12 ngày đêm', '10 ngày đêm', '56 ngày đêm', '81 ngày đêm'],
    correctAnswer: 0,
    explanation: 'Cuộc tập kích bằng máy bay B-52 của Mỹ vào Hà Nội, Hải Phòng diễn ra trong 12 ngày đêm cuối năm 1972.',
    hint: 'Cuối tháng 12 năm 1972.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q76',
    question: 'Ai là người lãnh đạo cuộc khởi nghĩa Tây Sơn?',
    options: ['Nguyễn Huệ', 'Nguyễn Nhạc', 'Nguyễn Lữ', 'Cả 3 anh em Tây Sơn'],
    correctAnswer: 3,
    explanation: 'Ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ cùng lãnh đạo cuộc khởi nghĩa Tây Sơn, trong đó Nguyễn Huệ là người kiệt xuất nhất.',
    hint: 'Ba anh em họ Nguyễn ở vùng Tây Sơn.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q77',
    question: 'Chiến thắng nào đã đánh tan 29 vạn quân Thanh xâm lược vào mùa xuân năm 1789?',
    options: ['Chiến thắng Ngọc Hồi - Đống Đa', 'Chiến thắng Rạch Gầm - Xoài Mút', 'Chiến thắng Bạch Đằng', 'Chiến thắng Chi Lăng'],
    correctAnswer: 0,
    explanation: 'Vua Quang Trung đã chỉ huy quân Tây Sơn thần tốc tiến ra Bắc, đại phá quân Thanh vào tết Kỷ Dậu 1789.',
    hint: 'Gắn liền với gò Đống Đa lịch sử.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q78',
    question: 'Vị vua nào đã cho xây dựng Kinh thành Huế?',
    options: ['Gia Long', 'Minh Mạng', 'Thiệu Trị', 'Tự Đức'],
    correctAnswer: 0,
    explanation: 'Vua Gia Long (Nguyễn Ánh) đã chọn Huế làm kinh đô và bắt đầu xây dựng Kinh thành từ năm 1805.',
    hint: 'Vị vua đầu tiên của triều Nguyễn.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q79',
    question: 'Ai là người lãnh đạo cuộc khởi nghĩa Yên Thế kéo dài gần 30 năm chống Pháp?',
    options: ['Hoàng Hoa Thám', 'Phan Đình Phùng', 'Nguyễn Thiện Thuật', 'Đinh Công Tráng'],
    correctAnswer: 0,
    explanation: 'Hoàng Hoa Thám (Đề Thám) là thủ lĩnh tối cao của cuộc khởi nghĩa Yên Thế (1884-1913).',
    hint: 'Ông được mệnh danh là "Hùm xám Yên Thế".',
    grade: 11,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q80',
    question: 'Sự kiện nào đánh dấu sự sụp đổ hoàn toàn của chế độ phong kiến Việt Nam?',
    options: ['Vua Bảo Đại thoái vị', 'Cách mạng tháng Tám thành công', 'Thành lập nước Việt Nam Dân chủ Cộng hòa', 'Chiến dịch Hồ Chí Minh thắng lợi'],
    correctAnswer: 0,
    explanation: 'Ngày 30/8/1945, vua Bảo Đại trao ấn kiếm cho phái đoàn chính phủ lâm thời, chính thức thoái vị.',
    hint: 'Sự kiện diễn ra tại Ngọ Môn, Huế.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q81',
    type: 'true-false',
    question: 'Chiến thắng Điện Biên Phủ diễn ra vào năm 1954. Đúng hay Sai?',
    options: ['Đúng', 'Sai'],
    correctAnswer: 0,
    explanation: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào ngày 7/5/1954.',
    hint: 'Sự kiện kết thúc kháng chiến chống Pháp.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q82',
    type: 'true-false',
    question: 'Nguyễn Huệ và Quang Trung là hai người khác nhau. Đúng hay Sai?',
    options: ['Đúng', 'Sai'],
    correctAnswer: 1,
    explanation: 'Nguyễn Huệ chính là hoàng đế Quang Trung.',
    hint: 'Vị hoàng đế áo vải cờ đào.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q83',
    type: 'true-false',
    question: 'Bản Tuyên ngôn Độc lập được đọc vào ngày 2/9/1945. Đúng hay Sai?',
    options: ['Đúng', 'Sai'],
    correctAnswer: 0,
    explanation: 'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập.',
    hint: 'Ngày Quốc khánh Việt Nam.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'q84',
    type: 'true-false',
    question: 'Triều đại nhà Trần đã 3 lần đánh thắng quân Nguyên Mông. Đúng hay Sai?',
    options: ['Đúng', 'Sai'],
    correctAnswer: 0,
    explanation: 'Quân dân nhà Trần dưới sự lãnh đạo của các vua Trần và Hưng Đạo Vương đã 3 lần đại thắng quân Nguyên Mông (1258, 1285, 1288).',
    hint: 'Hào khí Đông A.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q85',
    type: 'true-false',
    question: 'Thành Cổ Loa được xây dựng bởi vua Hùng. Đúng hay Sai?',
    options: ['Đúng', 'Sai'],
    correctAnswer: 1,
    explanation: 'Thành Cổ Loa được xây dựng bởi Thục Phán An Dương Vương.',
    hint: 'Vị vua của nước Âu Lạc.',
    grade: 11,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'q86',
    type: 'fill-blank',
    question: 'Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn chống quân Minh?',
    correctAnswer: 'Lê Lợi',
    explanation: 'Lê Lợi là người khởi xướng và lãnh đạo cuộc khởi nghĩa Lam Sơn (1418 - 1427) đánh tan quân Minh, lập ra nhà Hậu Lê.',
    hint: 'Vị vua đầu tiên của nhà Hậu Lê.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q87',
    type: 'fill-blank',
    question: 'Tên thật của Bác Hồ khi ra đi tìm đường cứu nước là gì?',
    correctAnswer: 'Nguyễn Tất Thành',
    explanation: 'Ngày 5/6/1911, Nguyễn Tất Thành ra đi tìm đường cứu nước từ bến cảng Nhà Rồng.',
    hint: 'Ông sinh ra ở làng Sen, Nghệ An.',
    grade: 12,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q88',
    type: 'fill-blank',
    question: 'Vị tướng nào được mệnh danh là "Hùm xám Yên Thế"?',
    correctAnswer: 'Hoàng Hoa Thám',
    explanation: 'Hoàng Hoa Thám (Đề Thám) là thủ lĩnh cuộc khởi nghĩa Yên Thế chống Pháp.',
    hint: 'Tên thật của ông là Trương Văn Thám.',
    grade: 11,
    category: 'VN',
    period: 'Cận đại'
  },
  {
    id: 'q89',
    type: 'fill-blank',
    question: 'Quốc hiệu của nước ta dưới thời vua Đinh Tiên Hoàng là gì?',
    correctAnswer: 'Đại Cồ Việt',
    explanation: 'Sau khi dẹp loạn 12 sứ quân, Đinh Bộ Lĩnh lên ngôi và đặt tên nước là Đại Cồ Việt.',
    hint: 'Tên nước có nghĩa là nước Việt lớn.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'q90',
    type: 'fill-blank',
    question: 'Ai là tác giả của "Hịch Tướng Sĩ"?',
    correctAnswer: 'Trần Hưng Đạo',
    explanation: 'Trần Hưng Đạo viết Hịch Tướng Sĩ để khích lệ quân sĩ trước cuộc kháng chiến chống Nguyên Mông lần thứ hai.',
    hint: 'Hưng Đạo Đại Vương.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'world_q_anc_1',
    question: 'Công trình kiến trúc nào được coi là biểu tượng vĩ đại nhất của văn minh Ai Cập cổ đại?',
    options: ['Vạn Lý Trường Thành', 'Kim tự tháp Giza', 'Đấu trường La Mã', 'Vườn treo Babylon'],
    correctAnswer: 1,
    explanation: 'Kim tự tháp Giza là kỳ quan duy nhất trong số 7 kỳ quan thế giới cổ đại còn tồn tại đến ngày nay.',
    hint: 'Những công trình hình chóp khổng lồ bên sông Nile.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_anc_2',
    question: 'Ai là vị tướng lừng danh của La Mã, người đã chinh phục xứ Gaul và trở thành nhà độc tài vĩnh viễn?',
    options: ['Augustus', 'Julius Caesar', 'Nero', 'Constantine'],
    correctAnswer: 1,
    explanation: 'Julius Caesar là một nhà quân sự và chính trị gia kiệt xuất, người đã đặt nền móng cho sự chuyển đổi từ Cộng hòa sang Đế chế La Mã.',
    hint: 'Tên ông gắn liền với câu nói "Veni, Vidi, Vici".',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_anc_3',
    question: 'Nơi nào được coi là "cái nôi" của nền dân chủ phương Tây?',
    options: ['Sparta', 'Athens', 'Rome', 'Alexandria'],
    correctAnswer: 1,
    explanation: 'Athens (Hy Lạp cổ đại) là nơi đầu tiên phát triển hệ thống dân chủ, nơi công dân có quyền tham gia vào việc quản lý nhà nước.',
    hint: 'Thành bang nổi tiếng với các triết gia và đền Parthenon.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_med_1',
    question: 'Hệ thống kinh tế - xã hội đặc trưng của châu Âu thời Trung cổ là gì?',
    options: ['Chủ nghĩa tư bản', 'Chế độ chiếm hữu nô lệ', 'Chế độ phong kiến', 'Chủ nghĩa xã hội'],
    correctAnswer: 2,
    explanation: 'Chế độ phong kiến (Feudalism) dựa trên mối quan hệ giữa lãnh chúa và chư hầu, cùng với hệ thống nông nô làm việc trên các lãnh địa.',
    hint: 'Hệ thống dựa trên việc ban cấp đất đai và lòng trung thành.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_med_2',
    question: 'Các cuộc chiến tranh tôn giáo giữa Kitô giáo và Hồi giáo diễn ra từ thế kỷ XI đến XIII được gọi là gì?',
    options: ['Chiến tranh Trăm năm', 'Chiến tranh Hoa hồng', 'Các cuộc Thập tự chinh', 'Chiến tranh Ba mươi năm'],
    correctAnswer: 2,
    explanation: 'Các cuộc Thập tự chinh (Crusades) là chuỗi các cuộc chiến tranh nhằm giành lại quyền kiểm soát vùng Đất Thánh (Jerusalem).',
    hint: 'Những cuộc viễn chinh mang biểu tượng chữ thập.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_med_3',
    question: 'Văn kiện pháp lý nào được ký kết năm 1215 tại Anh, đặt nền móng cho việc hạn chế quyền lực của nhà vua?',
    options: ['Hiến pháp Mỹ', 'Đại Hiến chương (Magna Carta)', 'Tuyên ngôn Nhân quyền', 'Luật 12 bảng'],
    correctAnswer: 1,
    explanation: 'Magna Carta là một trong những văn kiện quan trọng nhất trong lịch sử hiến pháp, bảo vệ quyền lợi của các quý tộc và hạn chế quyền lực chuyên chế.',
    hint: 'Bản "Đại Hiến chương" nổi tiếng của vua John.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_anc_4',
    question: 'Bộ luật thành văn cổ nhất thế giới được tìm thấy ở Lưỡng Hà có tên là gì?',
    options: ['Luật 12 bảng', 'Bộ luật Hammurabi', 'Luật Manu', 'Luật Napoleon'],
    correctAnswer: 1,
    explanation: 'Bộ luật Hammurabi (khoảng năm 1750 TCN) là bộ luật thành văn cổ nhất thế giới còn được bảo tồn khá nguyên vẹn.',
    hint: 'Gắn liền với tên một vị vua nổi tiếng của Babylon.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_anc_5',
    question: 'Vị vua nào đã thống nhất Trung Quốc lần đầu tiên và cho xây dựng Vạn Lý Trường Thành?',
    options: ['Hán Vũ Đế', 'Tần Thủy Hoàng', 'Đường Thái Tông', 'Chu Nguyên Chương'],
    correctAnswer: 1,
    explanation: 'Tần Thủy Hoàng là vị hoàng đế đầu tiên thống nhất Trung Quốc, ông đã nối các đoạn tường thành cũ để tạo nên Vạn Lý Trường Thành.',
    hint: 'Vị vua lập ra nhà Tần.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_anc_6',
    question: 'Ai là nhà quân sự kiệt xuất người Macedonia đã chinh phục đế chế Ba Tư và mở rộng văn hóa Hy Lạp sang phương Đông?',
    options: ['Alexander Đại đế', 'Pericles', 'Leonidas', 'Hannibal'],
    correctAnswer: 0,
    explanation: 'Alexander Đại đế đã xây dựng một đế chế khổng lồ trải dài từ Hy Lạp đến Ấn Độ, thúc đẩy sự giao thoa văn hóa Hy Lạp - phương Đông.',
    hint: 'Học trò của triết gia Aristotle.',
    grade: 11,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_med_4',
    question: 'Vị vua nào được coi là "Cha đẻ của châu Âu", người đã thống nhất phần lớn Tây Âu và được phong làm Hoàng đế La Mã thần thánh năm 800?',
    options: ['Charlemagne', 'Clovis', 'William người Chinh phạt', 'Richard Tim Sư tử'],
    correctAnswer: 0,
    explanation: 'Charlemagne (Sác-lơ-ma-nhơ) là vua của người Frank, người đã thúc đẩy sự phục hưng văn hóa và tôn giáo ở Tây Âu.',
    hint: 'Vua của vương quốc Frank.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_med_5',
    question: 'Đại dịch kinh hoàng nào đã quét sạch khoảng 1/3 dân số châu Âu vào thế kỷ XIV?',
    options: ['Cúm Tây Ban Nha', 'Cái chết Đen (Dịch hạch)', 'Bệnh đậu mùa', 'Dịch tả'],
    correctAnswer: 1,
    explanation: 'Cái chết Đen (Black Death) bùng phát từ năm 1347 đến 1351, gây ra những thay đổi sâu sắc về xã hội và kinh tế ở châu Âu.',
    hint: 'Một căn bệnh do vi khuẩn Yersinia pestis gây ra, lây truyền qua bọ chét.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_med_6',
    question: 'Con đường thương mại huyền thoại nối liền Trung Hoa với các nước phương Tây thời Trung đại có tên là gì?',
    options: ['Con đường Gia vị', 'Con đường Tơ lụa', 'Con đường Hổ phách', 'Con đường Trà mã'],
    correctAnswer: 1,
    explanation: 'Con đường Tơ lụa (Silk Road) không chỉ là con đường thương mại mà còn là cầu nối trao đổi văn hóa, tôn giáo giữa Á và Âu.',
    hint: 'Gắn liền với mặt hàng quý giá nhất của Trung Quốc thời bấy giờ.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_med_7',
    question: 'Đế chế nào tồn tại hơn 1000 năm với kinh đô là Constantinople, đóng vai trò bảo tồn văn hóa Hy - La cổ đại?',
    options: ['Đế quốc Ottoman', 'Đế quốc Byzantine (Đông La Mã)', 'Đế quốc Holy Roman', 'Đế quốc Ba Tư'],
    correctAnswer: 1,
    explanation: 'Đế quốc Byzantine là phần phía Đông của Đế quốc La Mã còn tồn tại sau khi Tây La Mã sụp đổ năm 476.',
    hint: 'Còn được gọi là Đế quốc Đông La Mã.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_ren_1',
    question: 'Ai là tác giả của bức họa nổi tiếng "Mona Lisa" và "Bữa ăn tối cuối cùng"?',
    options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'],
    correctAnswer: 2,
    explanation: 'Leonardo da Vinci là thiên tài toàn năng thời Phục hưng, nổi tiếng with các tác phẩm hội họa và những ý tưởng khoa học đi trước thời đại.',
    hint: 'Một người con của vùng Florence, Ý.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_ren_2',
    question: 'Nhà thiên văn học nào đã đưa ra thuyết Nhật tâm, khẳng định Trái Đất quay quanh Mặt Trời?',
    options: ['Nicolaus Copernicus', 'Johannes Kepler', 'Galileo Galilei', 'Giordano Bruno'],
    correctAnswer: 0,
    explanation: 'Nicolaus Copernicus là người đầu tiên đưa ra mô hình toán học về hệ Mặt Trời với Mặt Trời ở trung tâm.',
    hint: 'Một linh mục và nhà thiên văn học người Ba Lan.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_mod_1',
    question: 'Cuộc Cách mạng công nghiệp lần thứ nhất bắt đầu từ quốc gia nào?',
    options: ['Pháp', 'Đức', 'Anh', 'Mỹ'],
    correctAnswer: 2,
    explanation: 'Cách mạng công nghiệp bắt đầu từ Anh vào giữa thế kỷ XVIII với những phát minh trong ngành dệt và động cơ hơi nước.',
    hint: 'Quốc gia được mệnh danh là "công xưởng của thế giới".',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'world_q_mod_2',
    question: 'Ai là người soạn thảo bản Tuyên ngôn Độc lập của Mỹ năm 1776?',
    options: ['George Washington', 'Thomas Jefferson', 'Benjamin Franklin', 'John Adams'],
    correctAnswer: 1,
    explanation: 'Thomas Jefferson là tác giả chính của bản Tuyên ngôn Độc lập, khẳng định các quyền tự do cơ bản của con người.',
    hint: 'Vị tổng thống thứ 3 của Hoa Kỳ.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'world_q_cont_1',
    question: 'Sự kiện nào được coi là ngòi nổ trực tiếp dẫn đến Thế chiến thứ nhất?',
    options: ['Đức xâm lược Ba Lan', 'Vụ ám sát Thái tử Áo - Hung', 'Trận Trân Châu Cảng', 'Cách mạng tháng Mười Nga'],
    correctAnswer: 1,
    explanation: 'Vụ ám sát Thái tử Franz Ferdinand tại Sarajevo năm 1914 đã kích hoạt hệ thống liên minh quân sự, dẫn đến chiến tranh.',
    hint: 'Xảy ra tại Sarajevo, Bosnia.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'world_q_cont_2',
    question: 'Tổ chức quốc tế nào được thành lập sau Thế chiến thứ hai nhằm duy trì hòa bình và an ninh thế giới?',
    options: ['Hội Quốc liên', 'Liên hợp quốc (UN)', 'NATO', 'ASEAN'],
    correctAnswer: 1,
    explanation: 'Liên hợp quốc được thành lập năm 1945 để thay thế Hội Quốc liên đã thất bại trong việc ngăn chặn Thế chiến II.',
    hint: 'Trụ sở chính đặt tại New York, Mỹ.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'world_q_anc_3',
    question: 'Văn minh nào đã phát minh ra hệ thống chữ viết hình nêm (Cuneiform) đầu tiên trên thế giới?',
    options: ['Ai Cập', 'Sumer (Lưỡng Hà)', 'Ấn Độ', 'Trung Hoa'],
    correctAnswer: 1,
    explanation: 'Người Sumer ở vùng Lưỡng Hà đã phát minh ra chữ hình nêm vào khoảng thiên niên kỷ thứ 4 TCN.',
    hint: 'Nằm giữa hai con sông Tigris và Euphrates.',
    grade: 10,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_anc_4',
    question: 'Bộ luật thành văn cổ nhất thế giới còn được bảo tồn khá nguyên vẹn là bộ luật nào?',
    options: ['Luật 12 bảng', 'Luật Hammurabi', 'Luật Manu', 'Luật Hồng Đức'],
    correctAnswer: 1,
    explanation: 'Bộ luật Hammurabi của vương quốc Babylon nổi tiếng với nguyên tắc "Mắt đền mắt, răng đền răng".',
    hint: 'Gắn liền với tên tuổi một vị vua Babylon.',
    grade: 10,
    category: 'World',
    period: 'Cổ đại'
  },
  {
    id: 'world_q_med_8',
    question: 'Trận chiến nào năm 1066 đã thay đổi lịch sử nước Anh, đưa William Kẻ Chinh Phục lên ngôi?',
    options: ['Trận Hastings', 'Trận Agincourt', 'Trận Waterloo', 'Trận Crecy'],
    correctAnswer: 0,
    explanation: 'Trận Hastings đánh dấu sự khởi đầu của cuộc chinh phạt Anh của người Norman.',
    hint: 'Xảy ra vào thế kỷ XI.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_ren_3',
    question: 'Ai là người đã thực hiện chuyến hành trình vòng quanh thế giới đầu tiên trong lịch sử (dù ông đã hy sinh giữa chừng)?',
    options: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Amerigo Vespucci'],
    correctAnswer: 2,
    explanation: 'Đoàn thám hiểm của Magellan đã chứng minh bằng thực tế rằng Trái Đất hình cầu.',
    hint: 'Tên ông được đặt cho một eo biển ở Nam Mỹ.',
    grade: 11,
    category: 'World',
    period: 'Trung đại'
  },
  {
    id: 'world_q_mod_3',
    question: 'Cuộc Cách mạng Pháp năm 1789 bắt đầu bằng sự kiện nhân dân tấn công vào địa điểm nào?',
    options: ['Cung điện Versailles', 'Nhà tù Bastille', 'Nhà thờ Đức Bà', 'Điện Invalides'],
    correctAnswer: 1,
    explanation: 'Sự kiện phá bỏ nhà tù Bastille ngày 14/7/1789 là biểu tượng cho sự sụp đổ của chế độ phong kiến chuyên chế.',
    hint: 'Một pháo đài và nhà tù nổi tiếng ở Paris.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'world_q_cont_3',
    question: 'Sự sụp đổ của bức tường nào năm 1989 đánh dấu sự kết thúc của Chiến tranh Lạnh ở châu Âu?',
    options: ['Bức tường Vạn Lý', 'Bức tường Berlin', 'Bức tường Than khóc', 'Bức tường Hadrian'],
    correctAnswer: 1,
    explanation: 'Bức tường Berlin sụp đổ dẫn đến sự thống nhất nước Đức và chấm dứt sự chia rẽ Đông - Tây.',
    hint: 'Nằm ở thủ đô nước Đức.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'vn_q_anc_1',
    question: 'Vị vua nào được coi là thủy tổ của dân tộc Việt Nam, lập ra nước Xích Quỷ?',
    options: ['Kinh Dương Vương', 'Lạc Long Quân', 'Hùng Vương', 'An Dương Vương'],
    correctAnswer: 0,
    explanation: 'Theo truyền thuyết, Kinh Dương Vương là người đầu tiên xưng vương, đặt nền móng cho lịch sử dân tộc.',
    hint: 'Cha của Lạc Long Quân.',
    grade: 10,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'vn_q_med_1',
    question: 'Vị tướng nào đã lãnh đạo quân dân nhà Trần đánh tan quân Nguyên Mông trên sông Bạch Đằng năm 1288?',
    options: ['Trần Quang Khải', 'Trần Nhật Duật', 'Trần Hưng Đạo', 'Trần Quốc Toản'],
    correctAnswer: 2,
    explanation: 'Trần Hưng Đạo đã vận dụng kế cắm cọc trên sông Bạch Đằng để tiêu diệt thủy quân địch.',
    hint: 'Người viết Hịch Tướng Sĩ.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'vn_q_mod_1',
    question: 'Bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa được đọc tại đâu?',
    options: ['Quảng trường Ba Đình', 'Dinh Độc Lập', 'Nhà hát Lớn', 'Bắc Bộ Phủ'],
    correctAnswer: 0,
    explanation: 'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập.',
    hint: 'Nằm ở trung tâm thủ đô Hà Nội.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'vn_q_anc_2',
    question: 'Thành Cổ Loa là kinh đô của nhà nước nào trong lịch sử Việt Nam?',
    options: ['Văn Lang', 'Âu Lạc', 'Vạn Xuân', 'Đại Cồ Việt'],
    correctAnswer: 1,
    explanation: 'Thành Cổ Loa được Thục Phán An Dương Vương xây dựng làm kinh đô nước Âu Lạc.',
    hint: 'Gắn liền với truyền thuyết nỏ thần.',
    grade: 10,
    category: 'VN',
    period: 'Cổ đại'
  },
  {
    id: 'vn_q_med_2',
    question: 'Ai là vị vua đầu tiên của nhà Lý, người đã quyết định dời đô về Thăng Long?',
    options: ['Lý Thái Tổ', 'Lý Thái Tông', 'Lý Thánh Tông', 'Lý Nhân Tông'],
    correctAnswer: 0,
    explanation: 'Lý Công Uẩn (Lý Thái Tổ) dời đô từ Hoa Lư về Đại La (Thăng Long) năm 1010.',
    hint: 'Người viết Chiếu dời đô.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'vn_q_med_3',
    question: 'Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo để đánh đuổi quân Minh xâm lược?',
    options: ['Lê Lợi', 'Nguyễn Trãi', 'Lê Lai', 'Trần Nguyên Hãn'],
    correctAnswer: 0,
    explanation: 'Lê Lợi xưng là Bình Định Vương, khởi nghĩa tại Lam Sơn (Thanh Hóa) năm 1418.',
    hint: 'Vị vua sáng lập nhà Hậu Lê.',
    grade: 11,
    category: 'VN',
    period: 'Trung đại'
  },
  {
    id: 'vn_q_mod_2',
    question: 'Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào ngày tháng năm nào?',
    options: ['7/5/1954', '30/4/1975', '19/8/1945', '2/9/1945'],
    correctAnswer: 0,
    explanation: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" kết thúc vào ngày 7/5/1954.',
    hint: 'Kết thúc cuộc kháng chiến chống Pháp.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'vn_q_mod_3',
    question: 'Người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước tại bến cảng nào?',
    options: ['Cảng Hải Phòng', 'Cảng Nhà Rồng', 'Cảng Đà Nẵng', 'Cảng Quy Nhơn'],
    correctAnswer: 1,
    explanation: 'Ngày 5/6/1911, Nguyễn Tất Thành rời bến cảng Nhà Rồng trên con tàu Amiral Latouche-Tréville.',
    hint: 'Nằm ở Sài Gòn (nay là TP. Hồ Chí Minh).',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'vn_q_mod_4',
    question: 'Chiến dịch Hồ Chí Minh lịch sử giải phóng hoàn toàn miền Nam kết thúc vào ngày nào?',
    options: ['30/4/1975', '26/3/1975', '10/3/1975', '2/9/1945'],
    correctAnswer: 0,
    explanation: 'Ngày 30/4/1975, xe tăng quân giải phóng húc đổ cổng Dinh Độc Lập, đánh dấu sự toàn thắng của chiến dịch Hồ Chí Minh.',
    hint: 'Ngày giải phóng miền Nam, thống nhất đất nước.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'vn_q_mod_5',
    question: 'Đại hội Đảng lần thứ VI (1986) đã đề ra đường lối gì quan trọng?',
    options: ['Đường lối Đổi mới', 'Đường lối Công nghiệp hóa', 'Đường lối Hợp tác hóa', 'Đường lối Kinh tế tập trung'],
    correctAnswer: 0,
    explanation: 'Đại hội VI đánh dấu bước ngoặt lịch sử với đường lối Đổi mới toàn diện đất nước.',
    hint: 'Sự thay đổi căn bản về tư duy kinh tế từ năm 1986.',
    grade: 12,
    category: 'VN',
    period: 'Hiện đại'
  },
  {
    id: 'world_q_mod_4',
    question: 'Ai là người phát minh ra bóng đèn sợi đốt thương mại thành công đầu tiên?',
    options: ['Nikola Tesla', 'Thomas Edison', 'Alexander Graham Bell', 'James Watt'],
    correctAnswer: 1,
    explanation: 'Thomas Edison đã hoàn thiện bóng đèn sợi đốt và xây dựng hệ thống phân phối điện năng.',
    hint: 'Vị phù thủy ở Menlo Park.',
    grade: 11,
    category: 'World',
    period: 'Cận đại'
  },
  {
    id: 'world_q_cont_4',
    question: 'Sự kiện "Ngày D" (D-Day) trong Thế chiến thứ hai diễn ra tại đâu?',
    options: ['Normandy, Pháp', 'Trân Châu Cảng, Mỹ', 'Stalingrad, Nga', 'Berlin, Đức'],
    correctAnswer: 0,
    explanation: 'Cuộc đổ bộ lên Normandy ngày 6/6/1944 là chiến dịch đổ bộ đường biển lớn nhất lịch sử, mở ra mặt trận thứ hai ở châu Âu.',
    hint: 'Bờ biển phía Bắc nước Pháp.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  },
  {
    id: 'world_q_cont_5',
    question: 'Quốc gia nào là quốc gia đầu tiên đưa con người lên Mặt Trăng?',
    options: ['Liên Xô', 'Mỹ', 'Trung Quốc', 'Đức'],
    correctAnswer: 1,
    explanation: 'Năm 1969, tàu Apollo 11 của Mỹ đã đưa Neil Armstrong và Buzz Aldrin đặt chân lên Mặt Trăng.',
    hint: 'Sứ mệnh Apollo 11.',
    grade: 12,
    category: 'World',
    period: 'Hiện đại'
  }
];

export const CHARACTER_QUIZ_DATA: CharacterQuizQuestion[] = [
  {
    id: 'cq1',
    quote: '"Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây."',
    description: 'Một vị anh hùng dân tộc trong cuộc kháng chiến chống Pháp ở Nam Bộ.',
    correctAnswer: 'Nguyễn Trung Trực',
    options: ['Nguyễn Trung Trực', 'Trương Định', 'Nguyễn Hữu Huân', 'Võ Duy Dương'],
    explanation: 'Đây là câu nói nổi tiếng của Nguyễn Trung Trực trước khi bị thực dân Pháp hành hình.',
    hint: 'Ông là người đã lãnh đạo trận đốt cháy tàu Hy Vọng của Pháp trên sông Nhật Tảo.',
    category: 'VN'
  },
  {
    id: 'cq2',
    quote: '"Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi quân Ngô, giành lại giang sơn, cởi ách nô lệ, chứ không chịu khom lưng làm tì thiếp cho người!"',
    description: 'Một vị nữ anh hùng dân tộc lãnh đạo cuộc khởi nghĩa chống quân Ngô.',
    correctAnswer: 'Bà Triệu',
    options: ['Hai Bà Trưng', 'Bà Triệu', 'Lê Chân', 'Nguyên Phi Ỷ Lan'],
    explanation: 'Câu nói này thể hiện ý chí quật cường của Bà Triệu (Triệu Thị Trinh) trong cuộc khởi nghĩa năm 248.',
    hint: 'Bà còn được gọi là Lệ Hải Bà Vương.',
    category: 'VN'
  },
  {
    id: 'cq3',
    quote: '"Thà làm quỷ nước Nam còn hơn làm vương đất Bắc."',
    description: 'Một danh tướng nhà Trần bị quân Nguyên Mông bắt nhưng không chịu đầu hàng.',
    correctAnswer: 'Trần Bình Trọng',
    options: ['Trần Quốc Toản', 'Trần Bình Trọng', 'Trần Quang Khải', 'Trần Nhật Duật'],
    explanation: 'Trần Bình Trọng đã khẳng khái trả lời quân Nguyên khi chúng dụ dỗ ông đầu hàng để làm vương.',
    hint: 'Ông bị bắt trong trận Thiên Mạc.',
    category: 'VN'
  },
  {
    id: 'cq4',
    quote: '"Thần không sợ chết, chỉ sợ không đánh thắng được giặc."',
    description: 'Vị tướng tài ba của nhà Trần, người có công lớn trong 3 lần kháng chiến chống Nguyên Mông.',
    correctAnswer: 'Trần Hưng Đạo',
    options: ['Trần Hưng Đạo', 'Phạm Ngũ Lão', 'Yết Kiêu', 'Dã Tượng'],
    explanation: 'Câu nói thể hiện tinh thần quyết chiến quyết thắng của Hưng Đạo Đại Vương.',
    hint: 'Tác giả của Hịch Tướng Sĩ.',
    category: 'VN'
  },
  {
    id: 'cq5',
    quote: '"Đầu thần chưa rơi xuống đất, xin bệ hạ đừng lo."',
    description: 'Vị thái sư có công lớn trong việc thành lập nhà Trần.',
    correctAnswer: 'Trần Thủ Độ',
    options: ['Trần Thủ Độ', 'Trần Thừa', 'Trần Cảnh', 'Trần Liễu'],
    explanation: 'Đây là câu nói nổi tiếng của Trần Thủ Độ khi quân Nguyên Mông xâm lược lần thứ nhất.',
    hint: 'Ông là người đạo diễn cuộc chuyển giao quyền lực từ nhà Lý sang nhà Trần.',
    category: 'VN'
  },
  {
    id: 'cq6',
    quote: '"Không có gì quý hơn độc lập, tự do."',
    description: 'Lời kêu gọi toàn quốc kháng chiến chống Mỹ cứu nước.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Lê Duẩn', 'Phạm Văn Đồng'],
    explanation: 'Câu nói bất hủ của Chủ tịch Hồ Chí Minh khẳng định ý chí giành độc lập của dân tộc.',
    hint: 'Vị lãnh tụ vĩ đại của dân tộc Việt Nam.',
    category: 'VN'
  },
  {
    id: 'cq7',
    quote: '"Nhằm thẳng quân thù mà bắn!"',
    description: 'Lời hô vang trên trận địa pháo cao xạ chống máy bay Mỹ.',
    correctAnswer: 'Nguyễn Viết Xuân',
    options: ['Nguyễn Viết Xuân', 'Cù Chính Lan', 'Phan Đình Giót', 'Bế Văn Đàn'],
    explanation: 'Nguyễn Viết Xuân đã hô vang khẩu hiệu này để khích lệ đồng đội chiến đấu.',
    hint: 'Anh hùng lực lượng vũ trang nhân dân thời kỳ chống Mỹ.',
    category: 'VN'
  },
  {
    id: 'cq8',
    quote: '"Đánh cho để dài tóc, đánh cho để đen răng, đánh cho nó chích luân bất phản, đánh cho nó phiến giáp bất hoàn..."',
    description: 'Lời dụ quân sĩ trước khi tiến quân ra Bắc đại phá quân Thanh.',
    correctAnswer: 'Quang Trung',
    options: ['Quang Trung', 'Nguyễn Nhạc', 'Nguyễn Lữ', 'Ngô Văn Sở'],
    explanation: 'Lời hịch hào hùng của vua Quang Trung khẳng định quyết tâm bảo vệ bản sắc và chủ quyền dân tộc.',
    hint: 'Vị hoàng đế áo vải cờ đào.',
    category: 'VN'
  },
  {
    id: 'cq9',
    quote: '"Vận nước như mây quấn, trời Nam mở thái bình. Vô vi trên điện các, xứ xứ hết đao binh."',
    description: 'Bài thơ trả lời vua Lê Đại Hành về vận nước.',
    correctAnswer: 'Thiền sư Pháp Thuận',
    options: ['Thiền sư Pháp Thuận', 'Thiền sư Vạn Hạnh', 'Mãn Giác Thiền sư', 'Trần Nhân Tông'],
    explanation: 'Đây là bài thơ "Quốc tộ" của thiền sư Pháp Thuận, thể hiện tư tưởng trị quốc an dân.',
    hint: 'Một vị cao tăng thời nhà Lê sớm.',
    category: 'VN'
  },
  {
    id: 'cq10',
    quote: '"Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."',
    description: 'Lời mở đầu cho tác phẩm "Lịch sử nước ta".',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Phan Bội Châu', 'Phan Châu Trinh', 'Trần Trọng Kim'],
    explanation: 'Chủ tịch Hồ Chí Minh luôn đề cao việc học lịch sử để hiểu về cội nguồn dân tộc.',
    hint: 'Người viết tác phẩm diễn ca lịch sử năm 1942.',
    category: 'VN'
  },
  {
    id: 'cq11',
    quote: '"Một tấc đất của tiền nhân để lại, cũng không được để lọt vào tay kẻ khác."',
    description: 'Lời căn dặn của vị vua anh minh về việc bảo vệ chủ quyền biên giới.',
    correctAnswer: 'Lê Thánh Tông',
    options: ['Lê Thánh Tông', 'Lê Thái Tổ', 'Trần Nhân Tông', 'Lý Thánh Tông'],
    explanation: 'Vua Lê Thánh Tông luôn kiên quyết trong việc giữ gìn từng tấc đất biên cương của Tổ quốc.',
    hint: 'Vị vua ban hành bộ luật Hồng Đức.',
    category: 'VN'
  },
  {
    id: 'cq12',
    quote: '"Nếu nước Nam không còn ai đánh Tây thì tôi mới thôi."',
    description: 'Lời khẳng định của vị Bình Tây Đại Nguyên Soái.',
    correctAnswer: 'Trương Định',
    options: ['Trương Định', 'Nguyễn Trung Trực', 'Thủ Khoa Huân', 'Phan Phan Tòng'],
    explanation: 'Trương Định đã từ chối lệnh bãi binh của triều đình để tiếp tục cùng nhân dân đánh Pháp.',
    hint: 'Lãnh đạo kháng chiến ở Gò Công.',
    category: 'VN'
  },
  {
    id: 'cq13',
    quote: '"Chương Dương cướp giáo giặc, Hàm Tử bắt quân thù. Thái bình nên gắng sức, Non nước ấy nghìn thu."',
    description: 'Bài thơ "Tụng giá hoàn kinh sư" của vị danh tướng nhà Trần.',
    correctAnswer: 'Trần Quang Khải',
    options: ['Trần Quang Khải', 'Trần Hưng Đạo', 'Trần Nhật Duật', 'Trần Khánh Dư'],
    explanation: 'Đây là bài thơ hào hùng của Thượng tướng Thái sư Trần Quang Khải sau chiến thắng quân Nguyên Mông.',
    hint: 'Vị tướng chỉ huy trận Chương Dương và Hàm Tử.',
    category: 'VN'
  },
  {
    id: 'cq14',
    quote: '"Phá cường địch, báo hoàng ân."',
    description: 'Dòng chữ trên lá cờ thêu sáu chữ vàng.',
    correctAnswer: 'Trần Quốc Toản',
    options: ['Trần Quốc Toản', 'Trần Hưng Đạo', 'Trần Quang Khải', 'Trần Nhật Duật'],
    explanation: 'Vì còn nhỏ không được dự hội nghị Bình Than, Trần Quốc Toản đã tự huy động quân đội chiến đấu.',
    hint: 'Vị tướng trẻ tuổi bóp nát quả cam.',
    category: 'VN'
  },
  {
    id: 'cq15',
    quote: '"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa..."',
    description: 'Mệnh lệnh nổi tiếng trong chiến dịch giải phóng miền Nam năm 1975.',
    correctAnswer: 'Võ Nguyên Giáp',
    options: ['Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Trần Văn Trà', 'Lê Trọng Tấn'],
    explanation: 'Đây là bức điện khẩn của Đại tướng Võ Nguyên Giáp gửi các đơn vị tiến quân vào Sài Gòn.',
    hint: 'Vị Đại tướng đầu tiên của Quân đội Nhân dân Việt Nam.',
    category: 'VN'
  },
  {
    id: 'cq16',
    quote: '"Lý tưởng của tôi là đánh đuổi thực dân Pháp, giải phóng dân tộc. Tôi không sợ chết."',
    description: 'Người anh hùng nhỏ tuổi, liên lạc viên dũng cảm.',
    correctAnswer: 'Kim Đồng',
    options: ['Kim Đồng', 'Vừa A Dính', 'Lê Văn Tám', 'Phạm Ngọc Đa'],
    explanation: 'Kim Đồng (Nông Văn Dền) là đội trưởng đầu tiên của Đội Nhi đồng Cứu quốc.',
    hint: 'Anh hy sinh khi đang làm nhiệm vụ bảo vệ cán bộ cách mạng.',
    category: 'VN'
  },
  {
    id: 'cq17',
    quote: '"Tôi không có tội. Chỉ có kẻ đi xâm lược nước tôi mới là kẻ có tội."',
    description: 'Người con gái Đất Đỏ kiên cường trước họng súng quân thù.',
    correctAnswer: 'Võ Thị Sáu',
    options: ['Võ Thị Sáu', 'Nguyễn Thị Minh Khai', 'Lê Thị Hồng Gấm', 'Mạc Thị Bưởi'],
    explanation: 'Võ Thị Sáu hy sinh tại Côn Đảo khi mới 19 tuổi, trở thành biểu tượng của tuổi trẻ anh hùng.',
    hint: 'Chị hy sinh tại nhà tù Côn Đảo.',
    category: 'VN'
  },
  {
    id: 'cq18',
    quote: '"Không thành công cũng thành nhân."',
    description: 'Khẩu hiệu của cuộc khởi nghĩa Yên Bái năm 1930.',
    correctAnswer: 'Nguyễn Thái Học',
    options: ['Nguyễn Thái Học', 'Phó Đức Chính', 'Nguyễn Khắc Nhu', 'Cô Giang'],
    explanation: 'Nguyễn Thái Học đã khẳng định ý chí chiến đấu dù biết trước khả năng thất bại.',
    hint: 'Lãnh đạo Việt Nam Quốc dân đảng.',
    category: 'VN'
  },
  {
    id: 'cq19',
    quote: '"Nam quốc sơn hà Nam đế cư, Tiệt nhiên định phận tại thiên thư..."',
    description: 'Bài thơ được coi là bản Tuyên ngôn Độc lập đầu tiên của Việt Nam.',
    correctAnswer: 'Lý Thường Kiệt',
    options: ['Lý Thường Kiệt', 'Lý Thái Tổ', 'Trần Hưng Đạo', 'Nguyễn Trãi'],
    explanation: 'Bài thơ vang lên trên sông Như Nguyệt trong cuộc kháng chiến chống Tống lần thứ hai.',
    hint: 'Vị tướng lãnh đạo cuộc kháng chiến chống Tống thời Lý.',
    category: 'VN'
  },
  {
    id: 'cq20',
    quote: '"Việc nhân nghĩa cốt ở yên dân, Quân điếu phạt trước lo trừ bạo."',
    description: 'Những dòng mở đầu của bản "Bình Ngô Đại Cáo".',
    correctAnswer: 'Nguyễn Trãi',
    options: ['Nguyễn Trãi', 'Lê Lợi', 'Trần Nguyên Hãn', 'Nguyễn Xí'],
    explanation: 'Nguyễn Trãi đã nêu cao tư tưởng nhân nghĩa trong cuộc kháng chiến chống quân Minh.',
    hint: 'Hiệu là Ức Trai, Danh nhân văn hóa thế giới.',
    category: 'VN'
  },
  {
    id: 'cq21',
    quote: '"Lòng dân là thành trì vững chắc nhất."',
    description: 'Tư tưởng lấy dân làm gốc của vị anh hùng dân tộc.',
    correctAnswer: 'Trần Hưng Đạo',
    options: ['Trần Hưng Đạo', 'Nguyễn Trãi', 'Lê Lợi', 'Quang Trung'],
    explanation: 'Trần Hưng Đạo luôn đề cao sức mạnh của nhân dân trong việc bảo vệ đất nước.',
    hint: 'Vị tướng lãnh đạo 3 lần kháng chiến chống Nguyên Mông.',
    category: 'VN'
  },
  {
    id: 'cq22',
    quote: '"Khai dân trí, chấn dân khí, hậu dân sinh."',
    description: 'Chủ trương cứu nước của vị chí sĩ lãnh đạo phong trào Duy Tân.',
    correctAnswer: 'Phan Châu Trinh',
    options: ['Phan Châu Trinh', 'Phan Bội Châu', 'Huỳnh Thúc Kháng', 'Trần Quý Cáp'],
    explanation: 'Phan Châu Trinh đề xướng con đường canh tân đất nước bằng cách nâng cao trình độ dân trí và dân khí.',
    hint: 'Vị chí sĩ có tư tưởng dân chủ nổi tiếng đầu thế kỷ XX.',
    category: 'VN'
  },
  {
    id: 'cq23',
    quote: '"Thắng bại là chuyện thường của nhà binh."',
    description: 'Câu nói của vị hoàng đế áo vải cờ đào.',
    correctAnswer: 'Quang Trung',
    options: ['Quang Trung', 'Nguyễn Nhạc', 'Nguyễn Lữ', 'Bùi Thị Xuân'],
    explanation: 'Quang Trung (Nguyễn Huệ) luôn giữ vững tinh thần lạc quan và quyết đoán trong quân sự.',
    hint: 'Đại phá quân Thanh năm 1789.',
    category: 'VN'
  },
  {
    id: 'cq24',
    quote: '"Hiền tài là nguyên khí của quốc gia."',
    description: 'Câu nói nổi tiếng khắc trên bia Tiến sĩ ở Văn Miếu.',
    correctAnswer: 'Thân Nhân Trung',
    options: ['Thân Nhân Trung', 'Lê Thánh Tông', 'Chu Văn An', 'Nguyễn Bỉnh Khiêm'],
    explanation: 'Thân Nhân Trung đã soạn bài văn bia đề cao vai trò của người tài đối với vận mệnh đất nước.',
    hint: 'Một danh sĩ thời Lê Thánh Tông.',
    category: 'VN'
  },
  {
    id: 'cq25',
    quote: '"Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người."',
    description: 'Lời dạy nổi tiếng về tầm quan trọng của giáo dục và đào tạo con người.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Phạm Văn Đồng', 'Lê Duẩn'],
    explanation: 'Câu nói này được Bác Hồ nêu ra trong bài nói chuyện tại lớp học tiếp quản Thủ đô năm 1958.',
    hint: 'Vị lãnh tụ kính yêu của dân tộc Việt Nam.',
    category: 'VN'
  },
  {
    id: 'cq26',
    quote: '"Thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ."',
    description: 'Lời khẳng định đanh thép trong Lời kêu gọi toàn quốc kháng chiến năm 1946.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Trường Chinh', 'Lê Duẩn', 'Võ Nguyên Giáp'],
    explanation: 'Đây là trích đoạn nổi tiếng trong Lời kêu gọi toàn quốc kháng chiến ngày 19/12/1946.',
    hint: 'Người viết bản Tuyên ngôn Độc lập năm 1945.',
    category: 'VN'
  },
  {
    id: 'cq27',
    quote: '"Quân đội ta trung với Đảng, hiếu với dân, sẵn sàng chiến đấu hy sinh vì độc lập, tự do của Tổ quốc, vì chủ nghĩa xã hội. Nhiệm vụ nào cũng hoàn thành, khó khăn nào cũng vượt qua, kẻ thù nào cũng đánh thắng."',
    description: 'Lời khen ngợi dành cho Quân đội Nhân dân Việt Nam nhân kỷ niệm 20 năm thành lập.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Nguyễn Chí Thanh'],
    explanation: 'Bác Hồ đã dành những lời tâm huyết này để định nghĩa bản chất cách mạng của quân đội ta.',
    hint: 'Người sáng lập Đội Việt Nam Tuyên truyền Giải phóng quân.',
    category: 'VN'
  },
  {
    id: 'cq28',
    quote: '"Tiếng súng ở Nam Bộ là tiếng súng của cả nước."',
    description: 'Lời khẳng định tinh thần đoàn kết Bắc - Nam trong những ngày đầu kháng chiến chống Pháp.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Tôn Đức Thắng', 'Phạm Hùng', 'Võ Văn Kiệt'],
    explanation: 'Bác Hồ luôn khẳng định "Miền Nam là máu của máu Việt Nam, là thịt của thịt Việt Nam".',
    hint: 'Vị lãnh tụ luôn đau đáu về miền Nam ruột thịt.',
    category: 'VN'
  },
  {
    id: 'cq29',
    quote: '"Dân tộc ta có một lòng nồng nàn yêu nước. Đó là một truyền thống quý báu của ta. Từ xưa đến nay, mỗi khi Tổ quốc bị xâm lăng, thì tinh thần ấy lại sôi nổi, nó kết thành một làn sóng vô cùng mạnh mẽ, to lớn..."',
    description: 'Trích đoạn trong Báo cáo Chính trị tại Đại hội Đảng lần thứ II (1951).',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Trường Chinh', 'Phạm Văn Đồng', 'Lê Duẩn'],
    explanation: 'Bác Hồ đã tổng kết sức mạnh to lớn của lòng yêu nước Việt Nam qua các thời kỳ lịch sử.',
    hint: 'Tác giả của "Đường Kách mệnh".',
    category: 'VN'
  },
  {
    id: 'cq30',
    quote: '"Hãy giữ vững chí khí chiến đấu."',
    description: 'Lời dặn cuối cùng của đồng chí Tổng Bí thư đầu tiên của Đảng trước khi hy sinh.',
    correctAnswer: 'Trần Phú',
    options: ['Trần Phú', 'Lê Hồng Phong', 'Nguyễn Văn Cừ', 'Hà Huy Tập'],
    explanation: 'Đồng chí Trần Phú đã hy sinh tại nhà thương Chợ Quán năm 1931 với lời nhắn nhủ bất hủ.',
    hint: 'Người soạn thảo Luận cương Chính trị tháng 10/1930.',
    category: 'VN'
  },
  {
    id: 'cq31',
    quote: '"Con đường của thanh niên chỉ có thể là con đường cách mạng, không thể có con đường nào khác."',
    description: 'Lời khẳng định chí khí của người đoàn viên thanh niên cộng sản đầu tiên.',
    correctAnswer: 'Lý Tự Trọng',
    options: ['Lý Tự Trọng', 'Võ Thị Sáu', 'Nguyễn Văn Trỗi', 'Trần Văn Ơn'],
    explanation: 'Lý Tự Trọng đã hiên ngang khẳng định lý tưởng của mình trước tòa án thực dân Pháp.',
    hint: 'Anh hy sinh khi mới 17 tuổi.',
    category: 'VN'
  },
  {
    id: 'cq32',
    quote: '"Tôi chỉ có một ham muốn, ham muốn tột bậc là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành."',
    description: 'Lời tâm sự chân thành về mục đích sống và chiến đấu của vị lãnh tụ dân tộc.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Tôn Đức Thắng', 'Phạm Văn Đồng', 'Võ Nguyên Giáp'],
    explanation: 'Đây là câu trả lời của Bác Hồ với các phóng viên nước ngoài vào tháng 1/1946.',
    hint: 'Người cha già kính yêu của dân tộc.',
    category: 'VN'
  },
  {
    id: 'cq33',
    quote: '"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công."',
    description: 'Lời đúc kết về sức mạnh của sự đoàn kết trong sự nghiệp cách mạng.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Lê Duẩn', 'Trường Chinh', 'Nguyễn Hữu Thọ'],
    explanation: 'Bác Hồ luôn nhấn mạnh đoàn kết là chìa khóa của mọi thắng lợi.',
    hint: 'Vị lãnh tụ sáng lập Mặt trận Việt Minh.',
    category: 'VN'
  },
  {
    id: 'cq34',
    quote: '"Cần, kiệm, liêm, chính, chí công vô tư."',
    description: 'Tám chữ vàng về đạo đức cách mạng mà mỗi cán bộ, đảng viên cần rèn luyện.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Nguyễn Văn Linh', 'Đỗ Mười', 'Lê Khả Phiêu'],
    explanation: 'Bác Hồ coi đây là những phẩm chất đạo đức cơ bản của con người mới xã hội chủ nghĩa.',
    hint: 'Người viết tác phẩm "Sửa đổi lối làm việc".',
    category: 'VN'
  },
  {
    id: 'cq35',
    quote: '"Thanh niên là chủ nhân tương lai của nước nhà. Thật vậy, nước nhà thịnh hay suy, yếu hay mạnh một phần lớn là do các thanh niên."',
    description: 'Lời nhắn nhủ về vai trò và trách nhiệm của thế hệ trẻ đối với Tổ quốc.',
    correctAnswer: 'Hồ Chí Minh',
    options: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Nguyễn Chí Thanh', 'Lê Trọng Tấn'],
    explanation: 'Bác Hồ luôn dành sự quan tâm đặc biệt và đặt niềm tin lớn lao vào thế hệ trẻ.',
    hint: 'Người sáng lập tổ chức Thanh niên Cách mạng Đồng chí Hội.',
    category: 'VN'
  }
];

export const EPITHET_QUIZ_DATA: EpithetQuizQuestion[] = [
  {
    id: 'eq1',
    epithet: 'Hưng Đạo Đại Vương',
    correctAnswer: 'Trần Quốc Tuấn',
    options: ['Trần Quốc Tuấn', 'Trần Quang Khải', 'Trần Nhật Duật', 'Trần Khánh Dư'],
    explanation: 'Trần Quốc Tuấn được phong tước Hưng Đạo Đại Vương, là vị anh hùng dân tộc 3 lần đánh thắng quân Nguyên Mông.',
    hint: 'Vị tướng gắn liền với chiến thắng Bạch Đằng 1288.',
    category: 'VN'
  },
  {
    id: 'eq2',
    epithet: 'Bắc Bình Vương',
    correctAnswer: 'Nguyễn Huệ',
    options: ['Nguyễn Huệ', 'Nguyễn Nhạc', 'Nguyễn Lữ', 'Nguyễn Ánh'],
    explanation: 'Trước khi lên ngôi hoàng đế Quang Trung, Nguyễn Huệ được phong là Bắc Bình Vương.',
    hint: 'Vị hoàng đế áo vải cờ đào đại phá quân Thanh.',
    category: 'VN'
  },
  {
    id: 'eq3',
    epithet: 'Bình Định Vương',
    correctAnswer: 'Lê Lợi',
    options: ['Lê Lợi', 'Nguyễn Trãi', 'Lê Thánh Tông', 'Lê Thái Tông'],
    explanation: 'Lê Lợi xưng là Bình Định Vương khi lãnh đạo cuộc khởi nghĩa Lam Sơn chống quân Minh.',
    hint: 'Người sáng lập ra nhà Hậu Lê.',
    category: 'VN'
  },
  {
    id: 'eq4',
    epithet: 'Hùm xám Yên Thế',
    correctAnswer: 'Hoàng Hoa Thám',
    options: ['Hoàng Hoa Thám', 'Phan Đình Phùng', 'Nguyễn Thiện Thuật', 'Đinh Công Tráng'],
    explanation: 'Hoàng Hoa Thám (Đề Thám) được mệnh danh là Hùm xám Yên Thế nhờ lối đánh du kích tài ba.',
    hint: 'Lãnh đạo cuộc khởi nghĩa Yên Thế kéo dài gần 30 năm.',
    category: 'VN'
  },
  {
    id: 'eq5',
    epithet: 'Vạn Thắng Vương',
    correctAnswer: 'Đinh Bộ Lĩnh',
    options: ['Đinh Bộ Lĩnh', 'Lê Hoàn', 'Ngô Quyền', 'Lý Công Uẩn'],
    explanation: 'Đinh Bộ Lĩnh sau khi dẹp loạn 12 sứ quân được tôn là Vạn Thắng Vương.',
    hint: 'Người lập ra nhà Đinh và đặt tên nước là Đại Cồ Việt.',
    category: 'VN'
  },
  {
    id: 'eq6',
    epithet: 'Lệ Hải Bà Vương',
    correctAnswer: 'Bà Triệu',
    options: ['Bà Triệu', 'Trưng Trắc', 'Trưng Nhị', 'Lê Chân'],
    explanation: 'Bà Triệu (Triệu Thị Trinh) được nhân dân tôn xưng là Lệ Hải Bà Vương (Vua bà ở vùng biển mỹ lệ).',
    hint: 'Nữ anh hùng cưỡi voi đánh quân Ngô.',
    category: 'VN'
  },
  {
    id: 'eq7',
    epithet: 'Ức Trai',
    correctAnswer: 'Nguyễn Trãi',
    options: ['Nguyễn Trãi', 'Lê Lợi', 'Chu Văn An', 'Nguyễn Bỉnh Khiêm'],
    explanation: 'Ức Trai là hiệu của Nguyễn Trãi, vị quân sư tài ba and danh nhân văn hóa thế giới.',
    hint: 'Tác giả của Bình Ngô Đại Cáo.',
    category: 'VN'
  },
  {
    id: 'eq8',
    epithet: 'Trạng Trình',
    correctAnswer: 'Nguyễn Bỉnh Khiêm',
    options: ['Nguyễn Bỉnh Khiêm', 'Nguyễn Hiền', 'Mạc Đĩnh Chi', 'Lương Thế Vinh'],
    explanation: 'Nguyễn Bỉnh Khiêm được dân gian gọi là Trạng Trình vì khả năng tiên tri tài tình.',
    hint: 'Vị trạng nguyên nổi tiếng thời Mạc.',
    category: 'VN'
  },
  {
    id: 'eq9',
    epithet: 'Lưỡng quốc Trạng nguyên',
    correctAnswer: 'Mạc Đĩnh Chi',
    options: ['Mạc Đĩnh Chi', 'Nguyễn Hiền', 'Lương Thế Vinh', 'Nguyễn Trực'],
    explanation: 'Mạc Đĩnh Chi được vua nhà Nguyên phong là Lưỡng quốc Trạng nguyên nhờ tài ứng đối.',
    hint: 'Vị trạng nguyên có ngoại hình không mấy điển trai nhưng tài năng xuất chúng.',
    category: 'VN'
  },
  {
    id: 'eq10',
    epithet: 'Trạng Lường',
    correctAnswer: 'Lương Thế Vinh',
    options: ['Lương Thế Vinh', 'Nguyễn Hiền', 'Mạc Đĩnh Chi', 'Phùng Khắc Khoan'],
    explanation: 'Lương Thế Vinh được gọi là Trạng Lường vì giỏi toán học và đo lường.',
    hint: 'Tác giả của cuốn Đại thành toán pháp.',
    category: 'VN'
  },
  {
    id: 'eq11',
    epithet: 'Bà chúa thơ Nôm',
    correctAnswer: 'Hồ Xuân Hương',
    options: ['Hồ Xuân Hương', 'Đoàn Thị Điểm', 'Bà Huyện Thanh Quan', 'Nguyễn Thị Hinh'],
    explanation: 'Hồ Xuân Hương được mệnh danh là Bà chúa thơ Nôm với những bài thơ độc đáo, sắc sảo.',
    hint: 'Vị nữ sĩ nổi tiếng with những bài thơ mang tính trào phúng, nhân văn.',
    category: 'VN'
  },
  {
    id: 'eq12',
    epithet: 'Hải Thượng Lãn Ông',
    correctAnswer: 'Lê Hữu Trác',
    options: ['Lê Hữu Trác', 'Tuệ Tĩnh', 'Nguyễn Phan Chánh', 'Trương Vĩnh Ký'],
    explanation: 'Hải Thượng Lãn Ông là hiệu của Lê Hữu Trác, vị đại danh y của dân tộc.',
    hint: 'Tác giả của bộ Hải Thượng y tông tâm lĩnh.',
    category: 'VN'
  },
  {
    id: 'eq13',
    epithet: 'Thượng tướng Thái sư',
    correctAnswer: 'Trần Quang Khải',
    options: ['Trần Quang Khải', 'Trần Hưng Đạo', 'Trần Nhật Duật', 'Trần Thủ Độ'],
    explanation: 'Trần Quang Khải giữ chức Thượng tướng Thái sư, là danh tướng and nhà thơ lớn thời Trần.',
    hint: 'Tác giả bài thơ Tụng giá hoàn kinh sư.',
    category: 'VN'
  },
  {
    id: 'eq14',
    epithet: 'Bình Tây Đại Nguyên Soái',
    correctAnswer: 'Trương Định',
    options: ['Trương Định', 'Nguyễn Trung Trực', 'Thủ Khoa Huân', 'Võ Duy Dương'],
    explanation: 'Trương Định được nhân dân Gò Công tôn làm Bình Tây Đại Nguyên Soái khi ông quyết định ở lại đánh Pháp.',
    hint: 'Lãnh đạo kháng chiến ở Gò Công chống Pháp.',
    category: 'VN'
  },
  {
    id: 'eq15',
    epithet: 'Tả quân',
    correctAnswer: 'Lê Văn Duyệt',
    options: ['Lê Văn Duyệt', 'Nguyễn Văn Thành', 'Trần Quang Diệu', 'Võ Tánh'],
    explanation: 'Lê Văn Duyệt là một trong ngũ hổ tướng của nhà Nguyễn, giữ chức Tả quân Tổng trấn Gia Định thành.',
    hint: 'Vị tướng có công lớn in việc phát triển vùng đất Gia Định.',
    category: 'VN'
  }
];

export const CHRONOLOGICAL_DATA: ChronologicalQuestion[] = [
  {
    id: 'chron1',
    events: [
      { id: 'e1', text: 'Ngô Quyền đại phá quân Nam Hán', year: 938 },
      { id: 'e2', text: 'Lý Thái Tổ dời đô về Thăng Long', year: 1010 },
      { id: 'e3', text: 'Chiến thắng Điện Biên Phủ', year: 1954 },
      { id: 'e4', text: 'Cách mạng Tháng Tám thành công', year: 1945 }
    ],
    explanation: 'Thứ tự đúng: Ngô Quyền (938) -> Lý Thái Tổ (1010) -> Cách mạng Tháng Tám (1945) -> Điện Biên Phủ (1954).',
    category: 'VN'
  },
  {
    id: 'chron2',
    events: [
      { id: 'e1', text: 'Khởi nghĩa Hai Bà Trưng', year: 40 },
      { id: 'e2', text: 'Khởi nghĩa Bà Triệu', year: 248 },
      { id: 'e3', text: 'Khởi nghĩa Lý Bí', year: 542 },
      { id: 'e4', text: 'Khởi nghĩa Mai Thúc Loan', year: 713 }
    ],
    explanation: 'Thứ tự đúng: Hai Bà Trưng (40) -> Bà Triệu (248) -> Lý Bí (542) -> Mai Thúc Loan (713).',
    category: 'VN'
  }
];

export const DYNASTY_DATA: DynastyQuestion[] = [
  {
    id: 'dyn1',
    subject: 'Lý Công Uẩn',
    correctDynasty: 'Nhà Lý',
    options: ['Nhà Lý', 'Nhà Trần', 'Nhà Lê', 'Nhà Nguyễn'],
    explanation: 'Lý Công Uẩn (Lý Thái Tổ) là người sáng lập ra nhà Lý.',
    category: 'VN'
  },
  {
    id: 'dyn2',
    subject: 'Trần Hưng Đạo',
    correctDynasty: 'Nhà Trần',
    options: ['Nhà Lý', 'Nhà Trần', 'Nhà Lê', 'Nhà Nguyễn'],
    explanation: 'Trần Hưng Đạo là vị tướng kiệt xuất của nhà Trần.',
    category: 'VN'
  },
  {
    id: 'dyn3',
    subject: 'Nguyễn Trãi',
    correctDynasty: 'Nhà Hậu Lê',
    options: ['Nhà Lý', 'Nhà Trần', 'Nhà Hậu Lê', 'Nhà Nguyễn'],
    explanation: 'Nguyễn Trãi là công thần khai quốc nhà Hậu Lê.',
    category: 'VN'
  }
];

