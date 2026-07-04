// Talks to the real Q-Empire backend (FastAPI). No mock data.
export const API_BASE = import.meta.env.VITE_WEBHOOK_URL || "http://localhost:8080";

export interface Pitch {
  name: string;
  tagline: string;
  model: string;
  audience: string;
  offer: string;
  channels: string[];
  automations: string[];
  monthlyLow: number;
  monthlyHigh: number;
  plan: { day: string; text: string }[];
}

export interface IdeaAnswers {
  idea: string;
  passion: string;
  hours: string;
  goal: number;
  budget: string;
}

/** Generate a real, Claude-written pitch. Throws with a readable message on failure. */
export async function generatePitch(answers: IdeaAnswers): Promise<Pitch> {
  const res = await fetch(`${API_BASE}/idea`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return (await res.json()).pitch as Pitch;
}

export interface BuildState {
  build_id: string;
  status: "running" | "completed" | "failed";
  events: string[];
  plan: { step: number; action: string; description: string; status: string }[];
  result: unknown;
}

/** Start a real build run on the agent swarm. Returns the build id to poll. */
export async function startBuild(type: string, payload: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${API_BASE}/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
  });
  if (!res.ok) throw new Error(`Could not start build (${res.status})`);
  return (await res.json()).build_id as string;
}

export async function getBuild(buildId: string): Promise<BuildState> {
  const res = await fetch(`${API_BASE}/build/${buildId}`);
  if (!res.ok) throw new Error(`Build not found (${res.status})`);
  return (await res.json()) as BuildState;
}

// ---- Billing (Stripe) ----

/** Start Stripe Checkout; returns the URL to redirect the customer to. */
export async function createCheckout(
  kind: "subscription" | "credits",
  itemId: string,
  email: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind,
      item_id: itemId,
      email,
      success_url: `${window.location.origin}/account?checkout=success`,
      cancel_url: `${window.location.origin}/account?checkout=cancel`,
    }),
  });
  if (!res.ok) {
    let detail = `Checkout failed (${res.status})`;
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return (await res.json()).url as string;
}

export interface Entitlement {
  plan: string | null;
  credits: number;
}

export async function getBillingStatus(email: string): Promise<Entitlement> {
  const res = await fetch(`${API_BASE}/billing/status?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`Status failed (${res.status})`);
  return (await res.json()) as Entitlement;
}
