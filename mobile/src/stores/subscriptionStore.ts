import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionTier } from '../types';
import { SUBSCRIPTION_TIERS } from '../constants';

interface SubscriptionState {
  tier: SubscriptionTier;
  isAdFree: boolean;
  aiRequestsToday: number;
  lastResetDate: string;
  canUseFeature: (feature: string) => boolean;
  getTierLimits: () => typeof SUBSCRIPTION_TIERS.free;
  incrementAIRequest: () => void;
  resetDailyCounters: () => void;
  initSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  tier: 'free',
  isAdFree: false,
  aiRequestsToday: 0,
  lastResetDate: new Date().toDateString(),

  initSubscription: async () => {
    const stored = await AsyncStorage.getItem('subscription');
    if (stored) {
      const data = JSON.parse(stored);
      set(data);
    }
  },

  getTierLimits: () => {
    return SUBSCRIPTION_TIERS[get().tier] || SUBSCRIPTION_TIERS.free;
  },

  canUseFeature: (feature) => {
    const limits = get().getTierLimits();
    switch (feature) {
      case 'ai_requests':
        return get().aiRequestsToday < limits.aiRequestsPerDay;
      case 'ads':
        return limits.adsEnabled;
      case 'api_access':
        return get().tier === 'elite';
      default:
        return true;
    }
  },

  incrementAIRequest: () => {
    const today = new Date().toDateString();
    if (get().lastResetDate !== today) {
      set({ aiRequestsToday: 1, lastResetDate: today });
    } else {
      set({ aiRequestsToday: get().aiRequestsToday + 1 });
    }
    AsyncStorage.setItem('subscription', JSON.stringify(get()));
  },

  resetDailyCounters: () => {
    set({ aiRequestsToday: 0, lastResetDate: new Date().toDateString() });
  },
}));
