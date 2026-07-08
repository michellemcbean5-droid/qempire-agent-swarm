import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SubscriptionTier } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradeTier: (tier: SubscriptionTier) => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  applyMasterCode: (code: string) => boolean;
  initAuth: () => Promise<void>;
}

const generateReferralCode = () => {
  return 'QEM' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initAuth: async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    // Mock auth - replace with real API
    const user: User = {
      id: 'usr_' + Date.now(),
      email,
      name: email.split('@')[0],
      tier: 'free',
      referralCode: generateReferralCode(),
      credits: 0,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  register: async (email, name, password) => {
    const user: User = {
      id: 'usr_' + Date.now(),
      email,
      name,
      tier: 'free',
      referralCode: generateReferralCode(),
      credits: 10,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  upgradeTier: (tier) => {
    const { user } = get();
    if (user) {
      const updated = { ...user, tier };
      AsyncStorage.setItem('user', JSON.stringify(updated));
      set({ user: updated });
    }
  },

  applyPromoCode: async (code) => {
    // Mock promo codes
    const validCodes: Record<string, { discount: number; tier?: SubscriptionTier }> = {
      'START50': { discount: 50 },
      'PROBOOST': { discount: 30, tier: 'pro' },
      'ELITEACCESS': { discount: 25, tier: 'elite' },
    };
    const promo = validCodes[code.toUpperCase()];
    if (!promo) return false;
    const { user } = get();
    if (user && promo.tier) {
      get().upgradeTier(promo.tier);
    }
    return true;
  },

  applyMasterCode: (code) => {
    if (code === 'QEMP2024ELITE') {
      get().upgradeTier('elite');
      return true;
    }
    return false;
  },
}));
