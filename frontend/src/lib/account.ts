import { useCallback, useEffect, useState } from "react";
import { DAILY_FREE_CREDITS } from "../data/swarm";

// Lightweight client-side account state, persisted to localStorage.
// Real state (no mocks): plan, bring-your-own API key, chosen Q-Bot version,
// connected connectors, and a daily-refilling credit balance.

const KEY = "qe_account_v1";

export interface Account {
  plan: string | null;          // e.g. "diy-standard"
  email: string;                // billing email
  apiKey: string;               // customer's own model API key (BYOK)
  version: "lite" | "standard" | "pro";
  connectors: string[];         // connected connector names
  credits: number;              // current balance
  creditsDate: string;          // YYYY-MM-DD of last refill
  monthlyCredits: number;       // granted by plan
}

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT: Account = {
  plan: null,
  email: "",
  apiKey: "",
  version: "standard",
  connectors: [],
  credits: DAILY_FREE_CREDITS,
  creditsDate: today(),
  monthlyCredits: 0,
};

function read(): Account {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    const acc: Account = raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
    // Daily refill: top the balance back up to at least the daily allowance.
    if (acc.creditsDate !== today()) {
      acc.credits = Math.max(acc.credits, DAILY_FREE_CREDITS);
      acc.creditsDate = today();
    }
    return acc;
  } catch {
    return { ...DEFAULT };
  }
}

function write(acc: Account) {
  localStorage.setItem(KEY, JSON.stringify(acc));
  window.dispatchEvent(new CustomEvent("qe-account"));
}

/** React hook: subscribe to and mutate the account. */
export function useAccount() {
  const [acc, setAcc] = useState<Account>(read);

  useEffect(() => {
    const sync = () => setAcc(read());
    window.addEventListener("qe-account", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("qe-account", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<Account>) => {
    const next = { ...read(), ...patch };
    write(next);
    setAcc(next);
  }, []);

  const toggleConnector = useCallback((name: string) => {
    const cur = read();
    const connectors = cur.connectors.includes(name)
      ? cur.connectors.filter((c) => c !== name)
      : [...cur.connectors, name];
    write({ ...cur, connectors });
    setAcc({ ...cur, connectors });
  }, []);

  const spend = useCallback((n: number): boolean => {
    const cur = read();
    if (cur.credits < n) return false;
    write({ ...cur, credits: cur.credits - n });
    setAcc({ ...cur, credits: cur.credits - n });
    return true;
  }, []);

  return { account: acc, update, toggleConnector, spend };
}
