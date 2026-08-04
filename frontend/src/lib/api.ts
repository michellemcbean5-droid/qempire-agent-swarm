import { WEBHOOK_URL } from "./constants";

export interface TaskStatus {
  task_id: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "needs_clarification";
  result?: {
    status: string;
    deliverables?: Record<string, { type: string; value: string }>;
    event_log?: string[];
  };
  error?: string;
}

export interface TasksOverview {
  pending: number;
  needs_clarification: number;
  completed: number;
  tasks: {
    pending: TaskStatus[];
    completed: TaskStatus[];
  };
}

export interface OnboardPayload {
  business_name: string;
  industry: string;
  target_audience: string;
  elevator_pitch: string;
  current_revenue: string;
  brand_tone: string;
  colors: string;
  tagline?: string;
  inspiration_urls?: string[];
  pages: string;
  website_features: string[];
  domain?: string;
  automations_selected: string[];
  funding_amount: string;
  funding_types: string[];
  funding_timeline: string;
  email: string;
  package_id: string;
}

export interface OnboardResponse {
  status: string;
  package: string;
  tasks_created: Array<{ id: string; type: string }>;
  message: string;
}

export async function submitOnboarding(data: OnboardPayload): Promise<OnboardResponse> {
  const response = await fetch(`${WEBHOOK_URL}/onboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Onboarding failed: ${response.status}`);
  }
  return response.json();
}

export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  const response = await fetch(`${WEBHOOK_URL}/task/${taskId}`);
  if (!response.ok) {
    throw new Error(`Task ${taskId} not found`);
  }
  return response.json();
}

export async function getAllTasks(): Promise<TasksOverview> {
  const response = await fetch(`${WEBHOOK_URL}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}
