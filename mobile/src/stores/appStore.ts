import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, AIInsight } from '../types';

interface AppState {
  projects: Project[];
  insights: AIInsight[];
  isOffline: boolean;
  isLoading: boolean;
  notificationsEnabled: boolean;
  initApp: () => Promise<void>;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addInsight: (insight: AIInsight) => void;
  setOffline: (offline: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  cacheData: (key: string, data: any) => Promise<void>;
  getCachedData: (key: string) => Promise<any | null>;
}

export const useAppStore = create<AppState>((set, get) => ({
  projects: [],
  insights: [],
  isOffline: false,
  isLoading: false,
  notificationsEnabled: true,

  initApp: async () => {
    try {
      const projects = await AsyncStorage.getItem('projects');
      const insights = await AsyncStorage.getItem('insights');
      if (projects) set({ projects: JSON.parse(projects) });
      if (insights) set({ insights: JSON.parse(insights) });
    } catch (e) {
      console.error('Init app error:', e);
    }
  },

  addProject: (project) => {
    const { projects } = get();
    const updated = [project, ...projects];
    AsyncStorage.setItem('projects', JSON.stringify(updated));
    set({ projects: updated });
  },

  updateProject: (id, updates) => {
    const { projects } = get();
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    AsyncStorage.setItem('projects', JSON.stringify(updated));
    set({ projects: updated });
  },

  addInsight: (insight) => {
    const { insights } = get();
    const updated = [insight, ...insights].slice(0, 50);
    AsyncStorage.setItem('insights', JSON.stringify(updated));
    set({ insights: updated });
  },

  setOffline: (offline) => set({ isOffline: offline }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

  cacheData: async (key, data) => {
    await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  },

  getCachedData: async (key) => {
    const raw = await AsyncStorage.getItem(`cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cache valid for 1 hour
    if (Date.now() - parsed.timestamp > 3600000) return null;
    return parsed.data;
  },
}));
