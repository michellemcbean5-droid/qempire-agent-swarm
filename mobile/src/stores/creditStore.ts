/**
 * Credit Wallet Store — AI credit tracking, spend caps, and alerts.
 *
 * Each subscription tier starts with a monthly credit allowance.
 * Every AI call costs credits based on the operation type.
 * When credits reach zero the feature is hard-blocked.
 * When credits fall below the alert threshold a warning is emitted.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionTier } from '../types';

// ─── Credit costs per operation ─────────────────────────────────────────────
export const CREDIT_COSTS: Record<string, number> = {
  chat_message: 1,          // Q-Bot chat turn
  generate_text: 2,         // AI text generation
  generate_plan: 5,         // Full business plan generation
  market_insight: 3,        // Market insight lookup
  competitor_insight: 3,    // Competitor analysis
  summarize: 1,             // Summarization
  sentiment: 1,             // Sentiment analysis
  agent_task: 10,           // Full agent task execution (via webhook)
};

// ─── Monthly credit allowances by tier ──────────────────────────────────────
export const TIER_CREDITS: Record<SubscriptionTier, number> = {
  free: 20,
  basic: 200,
  pro: 1000,
  elite: 9999,
};

// ─── Alert threshold (percent of monthly allotment remaining) ───────────────
const ALERT_THRESHOLD_PERCENT = 0.15; // Warn when ≤15% remain

export interface CreditTransaction {
  id: string;
  operation: string;
  cost: number;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: string;
  blocked: boolean;
}

interface CreditState {
  balance: number;
  monthlyAllotment: number;
  billingPeriodStart: string;   // ISO date string (1st of month)
  transactions: CreditTransaction[];
  alertFired: boolean;          // True once low-balance alert has been sent this cycle
  spendCapEnabled: boolean;     // Admin-level kill switch
  spendCapAmount: number;       // Hard cap on monthly spend (credits)

  // Actions
  initCredits: (tier: SubscriptionTier) => Promise<void>;
  resetMonthlyCredits: (tier: SubscriptionTier) => void;
  canAfford: (operation: string) => boolean;
  deductCredits: (operation: string) => CreditTransaction;
  grantCredits: (amount: number, reason?: string) => void;
  setSpendCap: (enabled: boolean, amount?: number) => void;
  getLowBalanceWarning: () => string | null;
  getUsagePercent: () => number;
  clearHistory: () => void;
}

const STORAGE_KEY = 'credit_wallet';

export const useCreditStore = create<CreditState>((set, get) => ({
  balance: 20,
  monthlyAllotment: 20,
  billingPeriodStart: _firstOfMonth(),
  transactions: [],
  alertFired: false,
  spendCapEnabled: false,
  spendCapAmount: 9999,

  // ── Init: restore persisted state ─────────────────────────────────────────
  initCredits: async (tier: SubscriptionTier) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if we need to reset for a new billing period
        const thisMonth = _firstOfMonth();
        if (data.billingPeriodStart !== thisMonth) {
          get().resetMonthlyCredits(tier);
          return;
        }
        set({
          balance: data.balance ?? TIER_CREDITS[tier],
          monthlyAllotment: data.monthlyAllotment ?? TIER_CREDITS[tier],
          billingPeriodStart: data.billingPeriodStart ?? thisMonth,
          transactions: data.transactions ?? [],
          alertFired: data.alertFired ?? false,
          spendCapEnabled: data.spendCapEnabled ?? false,
          spendCapAmount: data.spendCapAmount ?? 9999,
        });
      } else {
        get().resetMonthlyCredits(tier);
      }
    } catch {
      get().resetMonthlyCredits(tier);
    }
  },

  // ── Reset at start of each billing period ─────────────────────────────────
  resetMonthlyCredits: (tier: SubscriptionTier) => {
    const allotment = TIER_CREDITS[tier];
    const newState = {
      balance: allotment,
      monthlyAllotment: allotment,
      billingPeriodStart: _firstOfMonth(),
      transactions: [],
      alertFired: false,
    };
    set(newState);
    _persist(get());
  },

  // ── Check affordability (does NOT deduct) ─────────────────────────────────
  canAfford: (operation: string): boolean => {
    const { balance, spendCapEnabled, spendCapAmount, monthlyAllotment, transactions } = get();
    const cost = CREDIT_COSTS[operation] ?? 1;

    if (balance < cost) return false;

    // Check spend cap (total spent this month vs cap)
    if (spendCapEnabled) {
      const spent = monthlyAllotment - balance;
      if (spent + cost > spendCapAmount) return false;
    }

    return true;
  },

  // ── Deduct credits and record transaction ─────────────────────────────────
  deductCredits: (operation: string): CreditTransaction => {
    const state = get();
    const cost = CREDIT_COSTS[operation] ?? 1;
    const balanceBefore = state.balance;
    const blocked = !state.canAfford(operation);

    const tx: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      operation,
      cost,
      balanceBefore,
      balanceAfter: blocked ? balanceBefore : Math.max(0, balanceBefore - cost),
      timestamp: new Date().toISOString(),
      blocked,
    };

    if (!blocked) {
      const newBalance = Math.max(0, balanceBefore - cost);
      const newTransactions = [tx, ...state.transactions].slice(0, 100); // keep last 100

      // Check if we should fire a low-balance alert
      const alertThreshold = state.monthlyAllotment * ALERT_THRESHOLD_PERCENT;
      const shouldAlert = !state.alertFired && newBalance <= alertThreshold;

      set({
        balance: newBalance,
        transactions: newTransactions,
        alertFired: shouldAlert ? true : state.alertFired,
      });
      _persist(get());
    }

    return tx;
  },

  // ── Grant credits (admin grant, promo, referral reward) ───────────────────
  grantCredits: (amount: number, _reason?: string) => {
    const { balance, monthlyAllotment } = get();
    set({ balance: balance + amount, monthlyAllotment: monthlyAllotment + amount });
    _persist(get());
  },

  // ── Admin spend cap control ────────────────────────────────────────────────
  setSpendCap: (enabled: boolean, amount?: number) => {
    set({
      spendCapEnabled: enabled,
      spendCapAmount: amount ?? get().spendCapAmount,
    });
    _persist(get());
  },

  // ── Low balance warning text (null = no warning) ─────────────────────────
  getLowBalanceWarning: (): string | null => {
    const { balance, monthlyAllotment, alertFired } = get();
    if (!alertFired) return null;
    const pct = Math.round((balance / monthlyAllotment) * 100);
    if (balance === 0) return '⚠️ You have 0 AI credits remaining. Upgrade to continue.';
    return `⚠️ Low AI credits: ${balance} remaining (${pct}% of monthly allotment).`;
  },

  // ── Usage percentage (0–100) ──────────────────────────────────────────────
  getUsagePercent: (): number => {
    const { balance, monthlyAllotment } = get();
    if (monthlyAllotment === 0) return 100;
    return Math.round(((monthlyAllotment - balance) / monthlyAllotment) * 100);
  },

  clearHistory: () => {
    set({ transactions: [] });
    _persist(get());
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _firstOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

function _persist(state: CreditState) {
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      balance: state.balance,
      monthlyAllotment: state.monthlyAllotment,
      billingPeriodStart: state.billingPeriodStart,
      transactions: state.transactions,
      alertFired: state.alertFired,
      spendCapEnabled: state.spendCapEnabled,
      spendCapAmount: state.spendCapAmount,
    })
  ).catch(() => {});
}
