import { create } from 'zustand';

export interface AgentSchedule {
  timezone: string;
  work_days: number[];
  work_start: string;
  work_end: string;
  max_tasks_per_day: number;
}

export interface AgentProfile {
  id: string;
  name: string;
  specialty: string;
  personality: string;
  attitude: string;
  schedule: AgentSchedule;
  active: boolean;
  tasks_completed: number;
  current_task_id: string | null;
  emoji?: string;
}

interface AgentStore {
  agents: AgentProfile[];
  loading: boolean;
  fetchAgents: (apiBase: string) => Promise<void>;
  updateAgent: (agentId: string, updates: Partial<AgentProfile>, apiBase: string) => Promise<void>;
  setAgents: (agents: AgentProfile[]) => void;
}

const DEFAULT_AGENTS: AgentProfile[] = [
  { id: 'qbot', name: 'Q-Bot', specialty: 'general', personality: 'professional', attitude: 'motivating', schedule: { timezone: 'America/New_York', work_days: [0,1,2,3,4,5,6], work_start: '00:00', work_end: '23:59', max_tasks_per_day: 999 }, active: true, tasks_completed: 0, current_task_id: null, emoji: '👑' },
  { id: 'marketing-agent', name: 'Maya', specialty: 'marketing', personality: 'creative', attitude: 'motivating', schedule: { timezone: 'America/New_York', work_days: [0,1,2,3,4], work_start: '09:00', work_end: '17:00', max_tasks_per_day: 20 }, active: true, tasks_completed: 0, current_task_id: null, emoji: '🎨' },
  { id: 'finance-agent', name: 'Fiona', specialty: 'finance', personality: 'analytical', attitude: 'strict', schedule: { timezone: 'America/New_York', work_days: [0,1,2,3,4], work_start: '09:00', work_end: '17:00', max_tasks_per_day: 20 }, active: true, tasks_completed: 0, current_task_id: null, emoji: '💰' },
  { id: 'tech-agent', name: 'Theo', specialty: 'tech', personality: 'professional', attitude: 'balanced', schedule: { timezone: 'America/New_York', work_days: [0,1,2,3,4], work_start: '09:00', work_end: '17:00', max_tasks_per_day: 20 }, active: true, tasks_completed: 0, current_task_id: null, emoji: '⚡' },
  { id: 'legal-agent', name: 'Lexi', specialty: 'legal', personality: 'professional', attitude: 'strict', schedule: { timezone: 'America/New_York', work_days: [0,1,2,3,4], work_start: '09:00', work_end: '17:00', max_tasks_per_day: 20 }, active: true, tasks_completed: 0, current_task_id: null, emoji: '⚖️' },
  { id: 'sales-agent', name: 'Sam', specialty: 'sales', personality: 'aggressive', attitude: 'urgent', schedule: { timezone: 'America/New_York', work_days: [0,1,2,3,4], work_start: '09:00', work_end: '17:00', max_tasks_per_day: 20 }, active: true, tasks_completed: 0, current_task_id: null, emoji: '🎯' },
];

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: DEFAULT_AGENTS,
  loading: false,

  fetchAgents: async (apiBase: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${apiBase}/agents`);
      if (res.ok) {
        const data = await res.json();
        set({ agents: data.agents || DEFAULT_AGENTS });
      }
    } catch {
      // Keep defaults if API is unreachable
    } finally {
      set({ loading: false });
    }
  },

  updateAgent: async (agentId: string, updates: Partial<AgentProfile>, apiBase: string) => {
    // Optimistic local update
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agentId ? { ...a, ...updates } : a)),
    }));
    try {
      await fetch(`${apiBase}/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Best-effort sync
    }
  },

  setAgents: (agents: AgentProfile[]) => set({ agents }),
}));
