import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credit costs per action (mirrors backend CREDIT_COSTS)
export const CREDIT_COSTS: Record<string, number> = {
  generate_content: 10,
  browser_navigate: 2,
  browser_search: 2,
  generate_website: 20,
  generate_document: 15,
  deploy_to_github: 5,
  send_email: 1,
  track_crm_entry: 1,
  create_invoice: 2,
  generate_social_post: 5,
  shell_exec: 1,
  file_write: 1,
  file_read: 0,
  ai_chat: 5,
  default: 5,
};

// Initial credits granted per tier
const TIER_INITIAL_CREDITS: Record<string, number> = {
  free: 50,
  basic: 500,
  pro: 2000,
  elite: 10000,
};

// Daily hard cap per tier
const TIER_DAILY_CAP: Record<string, number> = {
  free: 50,
  basic: 200,
  pro: 500,
  elite: 2000,
};

export interface CreditUsageEntry {
  action: string;
  cost: number;
  timestamp: string;
  taskId?: string;
}

interface CreditState {
  balance: number;
  spentToday: number;
  lastResetDate: string;
  dailyCap: number;
  usageLog: CreditUsageEntry[];
  lowCreditWarningShown: boolean;

  initCredits: (tier: string) => Promise<void>;
  canAfford: (action: string) => boolean;
  deduct: (action: string, taskId?: string) => boolean;
  topUp: (amount: number) => void;
  resetDailyCounter: () => void;
  getTierDailyCap: (tier: string) => number;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  balance: TIER_INITIAL_CREDITS.free,
  spentToday: 0,
  lastResetDate: new Date().toDateString(),
  dailyCap: TIER_DAILY_CAP.free,
  usageLog: [],
  lowCreditWarningShown: false,

  initCredits: async (tier: string) => {
    const today = new Date().toDateString();
    try {
      const stored = await AsyncStorage.getItem('credit_wallet');
      if (stored) {
        const data = JSON.parse(stored);
        // Reset daily counter if new day
        if (data.lastResetDate !== today) {
          data.spentToday = 0;
          data.lastResetDate = today;
        }
        set({
          ...data,
          dailyCap: TIER_DAILY_CAP[tier] ?? TIER_DAILY_CAP.free,
          lowCreditWarningShown: false,
        });
      } else {
        // First time — grant initial credits for tier
        const initial = TIER_INITIAL_CREDITS[tier] ?? TIER_INITIAL_CREDITS.free;
        set({
          balance: initial,
          spentToday: 0,
          lastResetDate: today,
          dailyCap: TIER_DAILY_CAP[tier] ?? TIER_DAILY_CAP.free,
          usageLog: [],
          lowCreditWarningShown: false,
        });
        await AsyncStorage.setItem('credit_wallet', JSON.stringify(get()));
      }
    } catch {
      // Use defaults on error
    }
  },

  canAfford: (action: string): boolean => {
    const cost = CREDIT_COSTS[action] ?? CREDIT_COSTS.default;
    const { balance, spentToday, dailyCap } = get();
    return balance >= cost && spentToday + cost <= dailyCap;
  },

  deduct: (action: string, taskId?: string): boolean => {
    const cost = CREDIT_COSTS[action] ?? CREDIT_COSTS.default;
    if (cost === 0) return true; // free actions

    const { balance, spentToday, dailyCap } = get();
    if (balance < cost || spentToday + cost > dailyCap) return false;

    const entry: CreditUsageEntry = {
      action,
      cost,
      timestamp: new Date().toISOString(),
      taskId,
    };
    const newLog = [entry, ...get().usageLog].slice(0, 200);
    const newBalance = balance - cost;
    const newSpentToday = spentToday + cost;

    set({
      balance: newBalance,
      spentToday: newSpentToday,
      usageLog: newLog,
      // Trigger low-credit warning at 10 credits remaining
      lowCreditWarningShown: newBalance <= 10 && !get().lowCreditWarningShown ? false : get().lowCreditWarningShown,
    });
    AsyncStorage.setItem('credit_wallet', JSON.stringify(get())).catch(() => {});
    return true;
  },

  topUp: (amount: number) => {
    set((state) => ({ balance: state.balance + amount, lowCreditWarningShown: false }));
    AsyncStorage.setItem('credit_wallet', JSON.stringify(get())).catch(() => {});
  },

  resetDailyCounter: () => {
    set({ spentToday: 0, lastResetDate: new Date().toDateString() });
    AsyncStorage.setItem('credit_wallet', JSON.stringify(get())).catch(() => {});
  },

  getTierDailyCap: (tier: string) => TIER_DAILY_CAP[tier] ?? TIER_DAILY_CAP.free,
}));
