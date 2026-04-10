import { useState, useEffect } from 'react';
import { UserProgress, RANKS, CAMPAIGN_DATA, RankedModeStats, CertificateData, ReputationTier, SupportTicket, MatchStats, MatchEvent, MatchHistory, PetEvolution } from '../types';
import { soundManager } from '../lib/sounds';
import { SHOP_ITEMS, PET_DATA } from '../constants';

const STORAGE_KEY = 'dau_truong_su_viet_user';

const INITIAL_RANKED_STATS: RankedModeStats = {
  tier: 'Đồng',
  division: 5,
  stars: 0,
  essence: 0,
  starProtectionAvailable: false,
};

const INITIAL_USER: UserProgress = {
  name: '',
  points: 49500,
  gold: 1000,
  ruby: 50,
  rank: 'Đồng V',
  level: 1,
  inventory: [
    { id: 'item_exp_boost', quantity: 5 },
    { id: 'item_shield', quantity: 2 },
    { id: 'item_name_change', quantity: 1 }
  ],
  mailbox: [
    {
      id: 'mail_1',
      sender: 'Hệ thống',
      title: 'Chào mừng tân thủ',
      content: 'Chào mừng bạn đến với Đấu Trường Sử Việt! Tặng bạn một chút quà khởi nghiệp.',
      isRead: false,
      date: new Date().toISOString().split('T')[0],
      rewards: [{ type: 'gold', amount: 500 }, { type: 'ruby', amount: 10 }, { type: 'item', id: 'item_exp_boost', amount: 2 }],
      isClaimed: false
    }
  ],
  completedMissions: [],
  friends: [
    { 
      id: 'system', 
      name: 'Hệ thống', 
      rank: 'Thần Thoại', 
      level: 99, 
      isOnline: true,
      relationshipType: 'Tri kỷ',
      intimacy: 100
    }
  ],
  friendRequests: [
    { id: 'req1', name: 'SửGia01', rank: 'Vàng', level: 12 },
    { id: 'req2', name: 'HàoKiệtVN', rank: 'Bạch Kim', level: 25 }
  ],
  rankedStats: {
    solo: { ...INITIAL_RANKED_STATS },
    machine: { ...INITIAL_RANKED_STATS },
    pvp: { ...INITIAL_RANKED_STATS },
  },
  isNewbie: true,
  titles: ['Tân Binh'],
  selectedTitle: 'Tân Binh',
  pets: [],
  selectedPetId: undefined,
  certificates: [],
  settings: {
    animationsEnabled: true,
    seasonalThemeEnabled: true,
    soundEnabled: true,
  },
  weaknesses: ['Lịch sử thế giới'],
  reputation: 100,
  reputationLevel: 1,
  reputationXP: 0,
  reputationTier: 'Tích Cực',
  reputationHistory: [],
  supportTickets: [],
  uid: 'user_123',
  combatPower: 0,
  totalPlayTime: 0,
  matchHistory: [],
  campaignProgress: {
    currentPhaseId: 'phase1',
    completedPhases: [],
    activeQuests: [
      { id: 'q1_1', progress: 0, isCompleted: false },
      { id: 'q1_2', progress: 0, isCompleted: false },
      { id: 'q1_3', progress: 0, isCompleted: false }
    ]
  },
  activeBuffs: {
    x2GoldWins: 0,
    x2ExpWins: 0,
    x2GoldUntil: 0,
    x2ExpUntil: 0,
  },
  lastLoginDate: '',
  loginStreak: 1,
  dailySpinUsed: false,
  ideas: [],
  feedbacks: []
};

export function useUserProgress() {
  const [user, setUser] = useState<UserProgress | null>(null);

  useEffect(() => {
    // Bootstrap specific accounts for the user
    const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
    let updated = false;

    // Bootstrap 'tanhamngu' account
    const existingTan = Object.values(usersDb).find((u: any) => u.name === 'tanhamngu');
    if (!existingTan) {
      const tanUid = `user_tan_${Date.now()}`;
      usersDb[tanUid] = { 
        ...INITIAL_USER, 
        name: 'tanhamngu', 
        password: 'hocvn@2009', 
        uid: tanUid,
        gold: 5000,
        ruby: 100,
        level: 5
      };
      updated = true;
    }

    // Bootstrap 'Admin' account if it doesn't have a password
    const existingAdmin = Object.values(usersDb).find((u: any) => u.name === 'Admin') as any;
    if (!existingAdmin) {
      const adminUid = 'user_admin_system';
      usersDb[adminUid] = { 
        ...INITIAL_USER, 
        name: 'Admin', 
        password: 'admin_password_mock', 
        uid: adminUid,
        level: 100,
        gold: 999999,
        ruby: 99999
      };
      updated = true;
    } else if (!existingAdmin.password) {
      existingAdmin.password = 'admin_password_mock';
      usersDb[existingAdmin.uid] = existingAdmin;
      updated = true;
    }

    if (updated) {
      localStorage.setItem('dau_truong_su_viet_users_db', JSON.stringify(usersDb));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      let parsed = JSON.parse(saved);
      
      // Sync with global DB to get latest tickets/mails
      const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
      if (parsed.uid && usersDb[parsed.uid]) {
        const dbUser = usersDb[parsed.uid];
        parsed.supportTickets = dbUser.supportTickets || parsed.supportTickets;
        parsed.mailbox = dbUser.mailbox || parsed.mailbox;
      }

      // Deep merge for settings
      const merged: UserProgress = { 
        ...INITIAL_USER, 
        ...parsed,
        gold: parsed.gold ?? INITIAL_USER.gold,
        ruby: parsed.ruby ?? INITIAL_USER.ruby,
        inventory: parsed.inventory && Array.isArray(parsed.inventory) && typeof parsed.inventory[0] === 'object' ? parsed.inventory : INITIAL_USER.inventory,
        mailbox: (parsed.mailbox || INITIAL_USER.mailbox).filter((m: any, idx: number, self: any[]) => 
          idx === self.findIndex((t) => t.id === m.id)
        ),
        rankedStats: parsed.rankedStats || INITIAL_USER.rankedStats,
        friends: parsed.friends?.some((f: any) => f.id === 'system') 
          ? parsed.friends 
          : [...(parsed.friends || []), INITIAL_USER.friends[0]],
        settings: { ...INITIAL_USER.settings, ...(parsed.settings || {}) },
        weaknesses: parsed.weaknesses || INITIAL_USER.weaknesses,
        reputation: parsed.reputation || INITIAL_USER.reputation,
        reputationLevel: parsed.reputationLevel || INITIAL_USER.reputationLevel,
        reputationXP: parsed.reputationXP || INITIAL_USER.reputationXP,
        totalPlayTime: parsed.totalPlayTime || INITIAL_USER.totalPlayTime,
        campaignProgress: parsed.campaignProgress || INITIAL_USER.campaignProgress,
        activeBuffs: parsed.activeBuffs || INITIAL_USER.activeBuffs,
        lastLoginDate: parsed.lastLoginDate || INITIAL_USER.lastLoginDate,
        loginStreak: parsed.loginStreak || INITIAL_USER.loginStreak,
        dailySpinUsed: parsed.dailySpinUsed || INITIAL_USER.dailySpinUsed,
        reputationTier: parsed.reputationTier || 'Tích Cực',
        reputationHistory: parsed.reputationHistory || [],
        supportTickets: parsed.supportTickets || [],
        uid: parsed.uid || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      setUser(merged);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setUser(prev => prev ? { ...prev, totalPlayTime: prev.totalPlayTime + 1 } : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const calculateReputationTier = (score: number): ReputationTier => {
    if (score >= 110) return 'Vinh Quang';
    if (score >= 90) return 'Tích Cực';
    if (score >= 70) return 'Ổn Định';
    if (score >= 40) return 'Cảnh Cáo';
    return 'Vi Phạm';
  };

  const updateReputationWithReason = (change: number, xp: number = 0, reason: string = 'Hành động hệ thống') => {
    setUser(prev => {
      if (!prev) return null;
      const newScore = Math.max(0, Math.min(120, prev.reputation + change));
      const newXP = prev.reputationXP + xp;
      const newHistory: any = {
        id: `rep_${Date.now()}`,
        change,
        reason,
        date: new Date().toLocaleString('vi-VN')
      };
      const newTier = calculateReputationTier(newScore);
      
      const updatedUser = {
        ...prev,
        reputation: newScore,
        reputationXP: newXP,
        reputationTier: newTier,
        reputationHistory: [newHistory, ...(prev.reputationHistory || [])].slice(0, 50)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Justice Report Simulation: If reputation drops significantly, notify the system
      if (change < -5) {
        addMail('Hệ Thống', 'Cảnh báo hành vi', `Uy tín của bạn đã giảm do: ${reason}. Hãy chú ý cải thiện hành vi để tránh bị giới hạn tính năng.`, 'system');
      }
      
      return updatedUser;
    });
  };

  const createSupportTicket = (title: string, category: 'bug' | 'payment' | 'account' | 'other', content: string) => {
    setUser(prev => {
      if (!prev) return null;
      const newTicket: SupportTicket = {
        id: `ticket_${Date.now()}`,
        uid: prev.uid,
        username: prev.name,
        title,
        category,
        status: 'pending',
        content,
        createdAt: new Date().toLocaleString('vi-VN'),
        updatedAt: new Date().toLocaleString('vi-VN'),
        replies: []
      };
      const updatedUser = {
        ...prev,
        supportTickets: [newTicket, ...(prev.supportTickets || [])]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

      // Simulate system reply and send a thank you mail
      setTimeout(() => {
        addTicketReply(newTicket.id, 'Cảm ơn bạn đã gửi yêu cầu. Chúng tôi đã tiếp nhận và sẽ phản hồi trong vòng 24h.', 'system');
        addMail(
          'Hệ Thống', 
          'Cảm ơn bạn đã đóng góp ý kiến', 
          `Chào ${prev.name},\n\nChúng tôi đã nhận được phản hồi của bạn về vấn đề: "${title}".\n\nCảm ơn bạn đã dành thời gian đóng góp ý kiến để giúp Đấu Trường Sử Việt ngày càng hoàn thiện hơn. Đội ngũ Admin sẽ xem xét và xử lý trong thời gian sớm nhất.\n\nTrân trọng,\nĐội ngũ Admin`, 
          'system'
        );
      }, 2000);

      return updatedUser;
    });
  };

  const addTicketReply = (ticketId: string, content: string, sender: 'system' | 'user') => {
    setUser(prev => {
      if (!prev) return null;
      const updatedTickets = prev.supportTickets.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: sender === 'system' ? 'investigating' : t.status,
            updatedAt: new Date().toLocaleString('vi-VN'),
            replies: [...t.replies, { sender, content, date: new Date().toLocaleString('vi-VN') }]
          };
        }
        return t;
      });
      const updatedUser = { ...prev, supportTickets: updatedTickets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const addMail = (sender: string, title: string, content: string, type: 'system' | 'justice' | 'reward' = 'system', rewards?: any[]) => {
    setUser(prev => {
      if (!prev) return null;
      const newMail = {
        id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender,
        title,
        content,
        isRead: false,
        date: new Date().toLocaleDateString('vi-VN'),
        type,
        rewards
      };
      
      // Deduplicate by ID
      const filteredMailbox = prev.mailbox.filter(m => m.id !== newMail.id);
      const updatedUser = { ...prev, mailbox: [newMail, ...filteredMailbox] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    if (!user || !user.uid) return;

    const syncWithDb = () => {
      const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
      const dbUser = usersDb[user.uid];
      
      if (dbUser) {
        let needsUpdate = false;
        let mergedMailbox = [...user.mailbox];
        let mergedTickets = [...user.supportTickets];

        // Check for new mail
        if ((dbUser.mailbox?.length || 0) > (user.mailbox?.length || 0)) {
          // Deduplicate dbUser.mailbox to be safe
          const seen = new Set();
          const uniqueMailbox = (dbUser.mailbox || []).filter((m: any) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
          
          if (uniqueMailbox.length !== user.mailbox.length) {
            mergedMailbox = uniqueMailbox;
            needsUpdate = true;
          }
        }
        
        // Check for new replies in tickets
        const newTickets = user.supportTickets.map(t => {
          const dbT = dbUser.supportTickets?.find((dt: any) => dt.id === t.id);
          if (dbT && (dbT.replies?.length || 0) > (t.replies?.length || 0)) {
            needsUpdate = true;
            return dbT;
          }
          return t;
        });

        if (needsUpdate) {
          setUser(prev => prev ? { ...prev, mailbox: mergedMailbox, supportTickets: newTickets } : null);
        }
      }
    };

    const interval = setInterval(syncWithDb, 3000); // Sync every 3 seconds
    return () => clearInterval(interval);
  }, [user?.uid, user?.mailbox?.length, user?.supportTickets]);

  useEffect(() => {
    if (user && user.uid) {
      const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
      usersDb[user.uid] = user;
      localStorage.setItem('dau_truong_su_viet_users_db', JSON.stringify(usersDb));
    }
  }, [user]);

  const login = (name: string, password?: string): boolean => {
    const usersDb = JSON.parse(localStorage.getItem('dau_truong_su_viet_users_db') || '{}');
    const existingUser = Object.values(usersDb).find((u: any) => u.name === name) as any;
    
    if (existingUser) {
      // If user exists and has a password, verify it (skip for Admin quick login if no password provided)
      if (existingUser.password && password !== undefined && existingUser.password !== password) {
        return false; // Wrong password
      }
      
      // Deep merge to ensure all properties like settings are defined
      const mergedUser = {
        ...INITIAL_USER,
        ...existingUser,
        settings: { ...INITIAL_USER.settings, ...(existingUser.settings || {}) }
      };
      
      setUser(mergedUser as UserProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedUser));
      return true;
    } else {
      const newUid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = { ...INITIAL_USER, name, password, uid: newUid };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      
      usersDb[newUid] = newUser;
      localStorage.setItem('dau_truong_su_viet_users_db', JSON.stringify(usersDb));
      return true;
    }
  };

  const completeTutorial = () => {
    if (!user) return;
    const updatedUser = { ...user, isNewbie: false };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const updateSettings = (newSettings: Partial<UserProgress['settings']>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      settings: { ...(user.settings || INITIAL_USER.settings), ...newSettings }
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const updateWeaknesses = (weakness: string, action: 'add' | 'remove' = 'add') => {
    if (!user) return;
    let newWeaknesses = [...(user.weaknesses || [])];
    
    if (action === 'add') {
      if (newWeaknesses.includes(weakness)) return;
      newWeaknesses.push(weakness);
    } else {
      if (!newWeaknesses.includes(weakness)) return;
      newWeaknesses = newWeaknesses.filter(w => w !== weakness);
    }

    const updatedUser = {
      ...user,
      weaknesses: newWeaknesses
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const addGold = (amount: number, isBattleReward: boolean = false) => {
    if (!user) return;
    let finalAmount = amount;
    let updatedBuffs = { ...user.activeBuffs } as NonNullable<UserProgress['activeBuffs']>;
    
    if (isBattleReward) {
      const now = Date.now();
      let hasBuff = false;
      if (updatedBuffs.x2GoldUntil > now) {
        hasBuff = true;
      } else if (updatedBuffs.x2GoldWins > 0) {
        hasBuff = true;
      }
      if (hasBuff) finalAmount *= 2;
    }

    const updatedUser = { ...user, gold: user.gold + finalAmount, activeBuffs: updatedBuffs };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const addRuby = (amount: number) => {
    if (!user) return;
    const updatedUser = { ...user, ruby: user.ruby + amount };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const spendRuby = (amount: number) => {
    if (!user || user.ruby < amount) return false;
    const updatedUser = { ...user, ruby: user.ruby - amount };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const spendGold = (amount: number) => {
    if (!user || user.gold < amount) return false;
    const updatedUser = { ...user, gold: user.gold - amount };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const purchaseItems = (cart: Record<string, number>, totalGold: number, totalRuby: number) => {
    if (!user) return false;
    if (user.gold < totalGold || user.ruby < totalRuby) return false;

    const inventory = [...user.inventory];
    
    Object.entries(cart).forEach(([itemId, quantity]) => {
      const existingItem = inventory.find(i => i.id === itemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        inventory.push({ id: itemId, quantity });
      }
    });

    const updatedUser = { 
      ...user, 
      gold: user.gold - totalGold,
      ruby: user.ruby - totalRuby,
      inventory 
    };
    
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const addItem = (itemId: string, quantity: number = 1) => {
    if (!user) return;
    const inventory = [...user.inventory];
    const existingItem = inventory.find(i => i.id === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      inventory.push({ id: itemId, quantity });
    }
    const updatedUser = { ...user, inventory };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const useItem = (itemId: string, quantity: number = 1) => {
    if (!user) return false;
    const inventory = [...user.inventory];
    const itemIndex = inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1 || inventory[itemIndex].quantity < quantity) return false;
    
    inventory[itemIndex].quantity -= quantity;
    if (inventory[itemIndex].quantity <= 0) {
      inventory.splice(itemIndex, 1);
    }
    
    let newBuffs = { ...user.activeBuffs };
    if (itemId === 'buff_gold') {
      newBuffs.x2GoldWins = (newBuffs.x2GoldWins || 0) + 10;
    } else if (itemId === 'buff_exp') {
      newBuffs.x2ExpWins = (newBuffs.x2ExpWins || 0) + 10;
    }

    const updatedUser = { ...user, inventory, activeBuffs: newBuffs };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const equipItem = (itemId: string, slot: 'head' | 'armor' | 'weapon' | 'mount') => {
    if (!user) return;
    const equippedItems = { ...(user.equippedItems || {}) };
    const oldItemId = equippedItems[slot];
    
    let newCombatPower = user.combatPower || 100;

    // Remove stats of old item if it exists
    if (oldItemId) {
      const oldItem = SHOP_ITEMS.find(i => i.id === oldItemId);
      if (oldItem?.stats?.combatPower) {
        newCombatPower -= oldItem.stats.combatPower;
      }
    }

    // Add stats of new item
    const newItem = SHOP_ITEMS.find(i => i.id === itemId);
    if (newItem?.stats?.combatPower) {
      newCombatPower += newItem.stats.combatPower;
    }

    equippedItems[slot] = itemId;

    const updatedUser = { ...user, equippedItems, combatPower: newCombatPower };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const unequipItem = (slot: 'head' | 'armor' | 'weapon' | 'mount') => {
    if (!user || !user.equippedItems) return;
    const equippedItems = { ...user.equippedItems };
    const oldItemId = equippedItems[slot];
    
    if (!oldItemId) return;

    let newCombatPower = user.combatPower || 100;
    const oldItem = SHOP_ITEMS.find(i => i.id === oldItemId);
    if (oldItem?.stats?.combatPower) {
      newCombatPower -= oldItem.stats.combatPower;
    }

    delete equippedItems[slot];

    const updatedUser = { ...user, equippedItems, combatPower: newCombatPower };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const readMail = (mailId: string) => {
    if (!user) return;
    const mailbox = user.mailbox.map(m => m.id === mailId ? { ...m, isRead: true } : m);
    const updatedUser = { ...user, mailbox };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const claimDailyLogin = () => {
    if (!user) return;
    
    const today = new Date().toDateString();
    if (user.lastLoginDate === today) return; // Already claimed today

    const loginRewards = [
      { day: 1, type: 'gold', amount: 100 },
      { day: 2, type: 'ruby', amount: 10 },
      { day: 3, type: 'gold', amount: 300 },
      { day: 4, type: 'ruby', amount: 20 },
      { day: 5, type: 'gold', amount: 500 },
      { day: 6, type: 'ruby', amount: 50 },
      { day: 7, type: 'buff', amount: 1, name: 'x2 Vàng (10 trận)' },
    ];

    const currentDay = Math.max(1, Math.min(user.loginStreak || 1, 7));
    const reward = loginRewards.find(r => r.day === currentDay);
    
    if (!reward) return;

    let newGold = user.gold || 0;
    let newRuby = user.ruby || 0;
    let newBuffs = { ...user.activeBuffs };

    if (reward.type === 'gold') {
      newGold += reward.amount;
    } else if (reward.type === 'ruby') {
      newRuby += reward.amount;
    } else if (reward.type === 'buff') {
      newBuffs.x2GoldWins = (newBuffs.x2GoldWins || 0) + 10;
    }

    const nextStreak = currentDay === 7 ? 1 : currentDay + 1;

    const updatedUser = {
      ...user,
      gold: newGold,
      ruby: newRuby,
      activeBuffs: newBuffs,
      loginStreak: nextStreak,
      lastLoginDate: today
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const spinWheel = () => {
    if (!user || user.dailySpinUsed) return null;

    const rewards = [
      { type: 'gold', amount: 50, weight: 40 },
      { type: 'gold', amount: 200, weight: 30 },
      { type: 'ruby', amount: 5, weight: 15 },
      { type: 'ruby', amount: 20, weight: 10 },
      { type: 'buff', amount: 1, name: 'x2 Kinh nghiệm (5 trận)', weight: 5 },
    ];

    const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedReward = rewards[0];

    for (const reward of rewards) {
      if (random < reward.weight) {
        selectedReward = reward;
        break;
      }
      random -= reward.weight;
    }

    let newGold = user.gold || 0;
    let newRuby = user.ruby || 0;
    let newBuffs = { ...user.activeBuffs };

    if (selectedReward.type === 'gold') {
      newGold += selectedReward.amount;
    } else if (selectedReward.type === 'ruby') {
      newRuby += selectedReward.amount;
    } else if (selectedReward.type === 'buff') {
      newBuffs.x2ExpWins = (newBuffs.x2ExpWins || 0) + 5;
    }

    const updatedUser = {
      ...user,
      gold: newGold,
      ruby: newRuby,
      activeBuffs: newBuffs,
      dailySpinUsed: true
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    return selectedReward;
  };

  const claimMail = (mailId: string) => {
    if (!user) return;
    const mail = user.mailbox.find(m => m.id === mailId);
    if (!mail || mail.isClaimed || !mail.rewards) return;

    let newGold = user.gold;
    let newRuby = user.ruby;
    const newInventory = [...user.inventory];

    mail.rewards.forEach(reward => {
      if (reward.type === 'gold') {
        newGold += reward.amount;
      } else if (reward.type === 'ruby') {
        newRuby += reward.amount;
      } else if (reward.type === 'item' && reward.id) {
        const existingItem = newInventory.find(i => i.id === reward.id);
        if (existingItem) {
          existingItem.quantity += reward.amount;
        } else {
          newInventory.push({ id: reward.id, quantity: reward.amount });
        }
      }
    });

    const mailbox = user.mailbox.map(m => m.id === mailId ? { ...m, isClaimed: true, isRead: true } : m);
    const updatedUser = { ...user, gold: newGold, ruby: newRuby, inventory: newInventory, mailbox };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const consumeBuffs = () => {
    if (!user) return;
    let updatedBuffs = { ...user.activeBuffs } as NonNullable<UserProgress['activeBuffs']>;
    let changed = false;

    if (updatedBuffs.x2GoldWins > 0) {
      updatedBuffs.x2GoldWins -= 1;
      changed = true;
    }
    if (updatedBuffs.x2ExpWins > 0) {
      updatedBuffs.x2ExpWins -= 1;
      changed = true;
    }

    if (changed) {
      const updatedUser = { ...user, activeBuffs: updatedBuffs };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const addPoints = (amount: number, type: 'general' | 'solo' | 'team' | 'raid' = 'general', isBattleReward: boolean = false) => {
    if (!user) return;
    
    let finalAmount = amount;
    let updatedBuffs = { ...user.activeBuffs } as NonNullable<UserProgress['activeBuffs']>;
    
    if (isBattleReward) {
      const now = Date.now();
      let hasBuff = false;
      if (updatedBuffs.x2ExpUntil > now) {
        hasBuff = true;
      } else if (updatedBuffs.x2ExpWins > 0) {
        hasBuff = true;
      }
      if (hasBuff) finalAmount *= 2;
    }

    let updatedUser: UserProgress = { ...user, activeBuffs: updatedBuffs };
    updatedUser.points += finalAmount;

    // Reputation Logic
    if (isBattleReward) {
      const updatePetEvolution = (user: UserProgress): UserProgress => {
    const updatedPets = user.pets.map(pet => {
      let newEvolution: PetEvolution = 'normal';
      if (user.reputationTier === 'Vinh Quang') newEvolution = 'aura';
      else if (user.reputationTier === 'Cảnh Cáo' || user.reputationTier === 'Vi Phạm') newEvolution = 'gloom';
      return { ...pet, evolution: newEvolution };
    });
    return { ...user, pets: updatedPets };
  };
      const repXPEarned = Math.max(1, Math.floor(finalAmount * 0.1));
      updatedUser.reputationXP = (updatedUser.reputationXP || 0) + repXPEarned;
      
      // Level up reputation (e.g., 100 XP per level)
      const newRepLevel = Math.floor(updatedUser.reputationXP / 100) + 1;
      if (newRepLevel > (updatedUser.reputationLevel || 1)) {
        updatedUser.reputationLevel = newRepLevel;
        // Optional: Add a notification or reward for reputation level up
      }
      
      // Update Pet Evolution
      updatedUser = updatePetEvolution(updatedUser) as UserProgress;
    }

    // Simple rank logic based on total points
    const totalPoints = updatedUser.points;
    const rankIndex = Math.floor(totalPoints / 1000);
    if (rankIndex < RANKS.length) {
      updatedUser.rank = RANKS[rankIndex];
    } else {
      updatedUser.rank = RANKS[RANKS.length - 1];
    }
    updatedUser.level = Math.floor(totalPoints / 500) + 1;

    // Award titles based on level/points
    if (updatedUser.level >= 5 && !updatedUser.titles.includes('Sử Gia Tập Sự')) {
      updatedUser.titles.push('Sử Gia Tập Sự');
    }
    if (updatedUser.level >= 10 && !updatedUser.titles.includes('Hào Kiệt')) {
      updatedUser.titles.push('Hào Kiệt');
    }
    if (updatedUser.rank === 'Thách Đấu' && !updatedUser.titles.includes('Huyền Thoại Sử Việt')) {
      updatedUser.titles.push('Huyền Thoại Sử Việt');
    }

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const setLevel = (targetLevel: number) => {
    if (!user) return;
    const targetPoints = (targetLevel - 1) * 500;
    const updatedUser = { ...user, level: targetLevel, points: targetPoints };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const setPoints = (amount: number) => {
    if (!user) return;
    const updatedUser = { ...user, points: amount };
    updatedUser.level = Math.floor(amount / 500) + 1;
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const updateReputation = (pointsChange: number, xpGain: number) => {
    if (!user) return;
    let newRep = user.reputation + pointsChange;
    let newXP = user.reputationXP + xpGain;
    let newLevel = user.reputationLevel;

    const thresholds = [312, 625, 1250, 2500, 5000];
    if (newLevel < 5 && newXP >= thresholds[newLevel - 1]) {
      newLevel++;
      newXP -= thresholds[newLevel - 2];
    }

    const updatedUser = {
      ...user,
      reputation: Math.max(0, newRep),
      reputationLevel: newLevel,
      reputationXP: newXP
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const upgradeReputationLevel = () => {
    if (!user || user.reputation < 100 || user.reputationLevel >= 5) return;
    const updatedUser = {
      ...user,
      reputation: user.reputation - 100,
      reputationLevel: user.reputationLevel + 1
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const selectGeneral = (generalId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      selectedGeneralId: generalId
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const selectTitle = (title: string) => {
    if (!user) return;
    const updatedUser = { ...user, selectedTitle: title };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const joinGuild = (guildId: string) => {
    if (!user) return;
    const updatedUser = { ...user, guildId };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const leaveGuild = () => {
    if (!user) return;
    const updatedUser = { ...user, guildId: undefined };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateRelationship = (ancestorId: string, type: string, anniversary: string, isConfirmed: boolean) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      relationships: {
        ...(user.relationships || {}),
        [ancestorId]: { type, anniversary, isConfirmed }
      }
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Update campaign progress if it's an AI chat quest
    updateQuestProgress('ai_chat');
  };

  const updateQuestProgress = (type: string, amount: number = 1, category?: string) => {
    if (!user || !user.campaignProgress) return;

    const updatedQuests = user.campaignProgress.activeQuests.map(q => {
      const phase = CAMPAIGN_DATA.find(p => p.id === user.campaignProgress?.currentPhaseId);
      const questDef = phase?.quests.find(qd => qd.id === q.id);

      if (questDef && questDef.type === type && (!questDef.category || questDef.category === category)) {
        const newProgress = Math.min(q.progress + amount, questDef.target);
        return { ...q, progress: newProgress, isCompleted: newProgress >= questDef.target };
      }
      return q;
    });

    const updatedUser = {
      ...user,
      campaignProgress: {
        ...user.campaignProgress,
        activeQuests: updatedQuests
      }
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const completePhase = () => {
    if (!user || !user.campaignProgress) return;
    
    const currentPhase = CAMPAIGN_DATA.find(p => p.id === user.campaignProgress?.currentPhaseId);
    if (!currentPhase) return;

    const allQuestsDone = user.campaignProgress.activeQuests.every(q => q.isCompleted);
    if (!allQuestsDone) return;

    const nextPhaseIndex = CAMPAIGN_DATA.findIndex(p => p.id === currentPhase.id) + 1;
    const nextPhase = CAMPAIGN_DATA[nextPhaseIndex];

    let newInventory = [...user.inventory];
    if (currentPhase.rewards.item) {
      const existingItem = newInventory.find(i => i.id === currentPhase.rewards.item);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        newInventory.push({ id: currentPhase.rewards.item, quantity: 1 });
      }
    }

    const updatedUser: UserProgress = {
      ...user,
      points: user.points + (currentPhase.rewards?.points || 0),
      titles: currentPhase.rewards?.title && !user.titles.includes(currentPhase.rewards.title) 
        ? [...user.titles, currentPhase.rewards.title] 
        : user.titles,
      inventory: newInventory,
      campaignProgress: {
        currentPhaseId: nextPhase?.id || currentPhase.id,
        completedPhases: [...user.campaignProgress.completedPhases, currentPhase.id],
        activeQuests: nextPhase ? nextPhase.quests.map(q => ({ id: q.id, progress: 0, isCompleted: false })) : []
      }
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    soundManager.play('levelUp');
  };

  const sendFriendRequest = (friendName: string) => {
    if (!user) return;
    // Mock sending request
    alert(`Đã gửi lời mời kết bạn đến ${friendName}`);
  };

  const acceptFriendRequest = (requestId: string) => {
    if (!user) return;
    const request = user.friendRequests.find(r => r.id === requestId);
    if (!request) return;

    const newFriend = {
      id: request.id,
      name: request.name,
      rank: request.rank,
      level: request.level,
      isOnline: true,
      intimacy: 0
    };

    const updatedUser = {
      ...user,
      friends: [...user.friends, newFriend],
      friendRequests: user.friendRequests.filter(r => r.id !== requestId)
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const updateFriendRelationship = (friendId: string, type: any) => {
    if (!user) return;
    const updatedFriends = user.friends.map(f => 
      f.id === friendId ? { ...f, relationshipType: type } : f
    );
    const updatedUser = { ...user, friends: updatedFriends };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const useIntimacyItem = (friendId: string, itemId: string) => {
    if (!user) return;
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || !item.stats?.intimacy) return;

    const inventoryItem = user.inventory.find(i => i.id === itemId);
    if (!inventoryItem || inventoryItem.quantity <= 0) return;

    const updatedFriends = user.friends.map(f => {
      if (f.id === friendId) {
        const newIntimacy = (f.intimacy || 0) + item.stats!.intimacy!;
        let newLevel = f.intimacyLevel || 0;
        
        // Intimacy levels: 1: 250, 2: 500, 3: 1000, 4: 2000, 5: 3000
        if (newIntimacy >= 3000) newLevel = 5;
        else if (newIntimacy >= 2000) newLevel = 4;
        else if (newIntimacy >= 1000) newLevel = 3;
        else if (newIntimacy >= 500) newLevel = 2;
        else if (newIntimacy >= 250) newLevel = 1;

        return { ...f, intimacy: newIntimacy, intimacyLevel: newLevel };
      }
      return f;
    });

    const newInventory = user.inventory.map(i => 
      i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
    ).filter(i => i.quantity > 0);

    const updatedUser = { ...user, friends: updatedFriends, inventory: newInventory };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    soundManager.play('success');
  };

  const updateDapSonHaStats = (mode: 'solo' | 'machine' | 'pvp', points: number, time: number) => {
    if (!user) return;
    const stats = user.dapSonHaStats || {
      solo: { points: 0, time: 0 },
      machine: { points: 0, time: 0 },
      pvp: { points: 0, time: 0 }
    };

    const currentModeStats = stats[mode] || { points: 0, time: 0 };
    // Update if more points, or same points but faster
    if (points > currentModeStats.points || (points === currentModeStats.points && (time < currentModeStats.time || currentModeStats.time === 0))) {
      const updatedUser = {
        ...user,
        dapSonHaStats: {
          ...stats,
          [mode]: { points, time }
        }
      };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const changeName = (newName: string) => {
    if (!user) return false;
    const inventory = [...user.inventory];
    const itemIndex = inventory.findIndex(i => i.id === 'item_name_change');
    if (itemIndex === -1 || inventory[itemIndex].quantity < 1) return false;
    
    inventory[itemIndex].quantity -= 1;
    if (inventory[itemIndex].quantity <= 0) {
      inventory.splice(itemIndex, 1);
    }
    
    const updatedUser = { ...user, name: newName, inventory };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const romanize = (num: number) => {
    if (num <= 0) return '';
    const lookup: any = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    let n = num;
    for (let i in lookup) {
      while (n >= lookup[i]) {
        roman += i;
        n -= lookup[i];
      }
    }
    return roman;
  };

  const updateRankedStats = (mode: 'solo' | 'machine' | 'pvp', result: 'win' | 'loss' | 'draw') => {
    if (!user) return;

    const stats = { ...(user.rankedStats?.[mode] || INITIAL_RANKED_STATS) };
    const tiers = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Chiến Tướng', 'Chiến Thần'];
    const currentTierIndex = tiers.indexOf(stats.tier);

    if (result === 'win') {
      stats.stars += 1;
      stats.essence += 20;

      if (stats.stars === 5 && !stats.starProtectionAvailable) {
        stats.starProtectionAvailable = true;
      }

      if (stats.stars > 5) {
        if (stats.division > 1) {
          stats.division -= 1;
          stats.stars = 1;
        } else {
          if (currentTierIndex < tiers.length - 1) {
            stats.tier = tiers[currentTierIndex + 1];
            stats.division = (stats.tier === 'Cao Thủ' || stats.tier === 'Chiến Tướng' || stats.tier === 'Chiến Thần') ? 50 : 5;
            stats.stars = 1;
            stats.starProtectionAvailable = false;
          } else {
            stats.stars = 5;
          }
        }
      }
    } else if (result === 'loss') {
      if (stats.starProtectionAvailable) {
        stats.starProtectionAvailable = false;
      } else if (stats.essence >= 100) {
        stats.essence -= 100;
      } else {
        stats.stars -= 1;
        if (stats.stars < 0) {
          const maxDiv = (stats.tier === 'Cao Thủ' || stats.tier === 'Chiến Tướng' || stats.tier === 'Chiến Thần') ? 50 : 5;
          if (stats.division < maxDiv) {
            stats.division += 1;
            stats.stars = 4;
          } else {
            if (currentTierIndex > 0) {
              stats.tier = tiers[currentTierIndex - 1];
              stats.division = 1;
              stats.stars = 4;
            } else {
              stats.stars = 0;
            }
          }
        }
      }
    }

    const newUser = {
      ...user,
      rankedStats: {
        ...user.rankedStats,
        [mode]: stats
      },
      rank: `${stats.tier} ${stats.tier === 'Chiến Thần' ? '' : romanize(stats.division)}`
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const recordMatch = (
    opponentName: string, 
    result: 'win' | 'loss' | 'draw', 
    score: number, 
    mode?: 'solo' | 'machine' | 'pvp',
    stats?: MatchStats,
    timeline?: MatchEvent[],
    hasJusticeAction?: boolean
  ) => {
    if (!user) return;

    if (mode) {
      updateRankedStats(mode, result);
    }
    const newMatch: MatchHistory = {
      id: Math.random().toString(36).substr(2, 9),
      opponentName,
      result,
      score,
      mode,
      date: new Date().toISOString(),
      stats,
      timeline,
      hasJusticeAction
    };
    
    const matchHistory = [newMatch, ...(user.matchHistory || [])].slice(0, 20);
    
    let combatPowerChange = 0;
    if (result === 'win') combatPowerChange = 15;
    else if (result === 'loss') combatPowerChange = -5;
    else combatPowerChange = 5;
    
    const combatPower = Math.max(0, (user.combatPower || 0) + combatPowerChange);
    
    const updatedUser = { ...user, matchHistory, combatPower };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const addPet = (petId: string) => {
    if (!user) return;
    const petData = PET_DATA.find((p: any) => p.id === petId);
    if (!petData) return;

    const newPet = {
      id: petData.id,
      name: petData.name,
      type: petData.type as 'dragon' | 'phoenix' | 'tiger' | 'horse' | 'turtle' | 'slime',
      level: 1,
      xp: 0,
      buff: petData.buff,
      description: petData.description
    };

    const updatedUser: any = {
      ...user,
      pets: [...(user.pets || []), newPet]
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const addCertificate = (
    achievement: string, 
    description: string = '', 
    type: 'skill' | 'social' | 'event' | 'collection' | 'battle' | 'rank' = 'battle',
    rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common',
    icon?: string
  ) => {
    if (!user) return;
    const newCert: CertificateData = {
      id: `cert_${Date.now()}`,
      achievement,
      description,
      date: new Date().toLocaleDateString('vi-VN'),
      type,
      rarity,
      icon
    };
    const updatedUser = {
      ...user,
      certificates: [...(user.certificates || []), newCert]
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const toggleShowcaseCertificate = (certId: string) => {
    if (!user) return;
    const currentShowcase = user.showcaseCertificateIds || [];
    let newShowcase;
    if (currentShowcase.includes(certId)) {
      newShowcase = currentShowcase.filter(id => id !== certId);
    } else {
      if (currentShowcase.length >= 5) {
        alert('Bạn chỉ có thể trưng bày tối đa 5 chứng chỉ!');
        return;
      }
      newShowcase = [...currentShowcase, certId];
    }
    const updatedUser = { ...user, showcaseCertificateIds: newShowcase };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const selectPet = (petId: string) => {
    if (!user) return;
    const updatedUser = { ...user, selectedPetId: petId };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const repairData = () => {
    if (!user) return;
    // Reset corrupted fields but keep essential progress
    const repairedUser = {
      ...INITIAL_USER,
      ...user,
      gold: user.gold ?? INITIAL_USER.gold,
      ruby: user.ruby ?? INITIAL_USER.ruby,
      points: user.points ?? INITIAL_USER.points,
      level: user.level ?? INITIAL_USER.level,
      inventory: Array.isArray(user.inventory) ? user.inventory : INITIAL_USER.inventory,
      pets: Array.isArray(user.pets) ? user.pets : INITIAL_USER.pets,
      rankedStats: user.rankedStats || INITIAL_USER.rankedStats,
    };
    setUser(repairedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repairedUser));
    alert('Dữ liệu đã được tối ưu và sửa lỗi thành công!');
  };

  return { 
    user, login, logout, addPoints, setLevel, setPoints, selectGeneral, 
    completeTutorial, selectTitle, updateSettings, updateWeaknesses, 
    updateRelationship, joinGuild, leaveGuild, updateQuestProgress, completePhase,
    sendFriendRequest, acceptFriendRequest, updateFriendRelationship, updateReputation, upgradeReputationLevel,
    addGold, spendGold, addRuby, spendRuby, addItem, useItem, purchaseItems, equipItem, unequipItem, readMail, claimMail,
    claimDailyLogin, spinWheel, consumeBuffs, changeName, recordMatch, useIntimacyItem, updateDapSonHaStats, updateRankedStats,
    addPet, selectPet, addCertificate, toggleShowcaseCertificate, repairData,
    updateReputationWithReason, createSupportTicket, addTicketReply, addMail
  };
}
