import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  KeyRound, Zap, Gauge, Check, ShieldCheck, CreditCard, Link2, Eye, EyeOff, Sparkles, Loader2,
} from "lucide-react";
import NavBar from "../components/NavBar";
import { AGENT_VERSIONS, DAILY_FREE_CREDITS, DIY_PLANS } from "../data/swarm";
import { useAccount } from "../lib/account";
import { createCheckout, getBillingStatus } from "../lib/api";

const PAID_PLANS = DIY_PLANS.filter((p) => p.price !== "$0");
const CREDIT_PACKS = [
  { id: "pack-5k", label: "5,000 credits", price: "$18" },
  { id: "pack-20k", label: "20,000 credits", price: "$70" },
];

export default function Account() {
  const [, navigate] = useLocation();
  const { account, update } = useAccount();
  const [showKey, setShowKey] = useState(false);
  const [draftKey, setDraftKey] = useState(account.apiKey);
  const [busy, setBusy] = useState<string | null>(null);
  const [billingMsg, setBillingMsg] = useState<string | null>(null);

  const plan = DIY_PLANS.find((p) => p.id === account.plan) || null;
  const pct = Math.min(100, Math.round((account.credits / (DAILY_FREE_CREDITS * 2)) * 100));

  // After returning from Stripe, sync the granted plan + credits by email.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success" && account.email) {
      getBillingStatus(account.email)
        .then((e) => {
          if (e.plan) update({ plan: e.plan });
          if (e.credits) update({ credits: Math.max(account.credits, e.credits) });
          setBillingMsg("Payment complete — your plan is active. 👑");
        })
        .catch(() => setBillingMsg("Payment received. It may take a moment to activate."));
      window.history.replaceState({}, "", "/account");
    } else if (params.get("checkout") === "cancel") {
      setBillingMsg("Checkout canceled — no charge was made.");
      window.history.replaceState({}, "", "/account");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCheckout = async (kind: "subscription" | "credits", itemId: string) => {
    if (!account.email) {
      setBillingMsg("Add your email first so we can send your receipt and activate your plan.");
      return;
    }
    setBusy(itemId);
    setBillingMsg(null);
    try {
      const url = await createCheckout(kind, itemId, account.email);
      window.location.href = url; // → Stripe Checkout
    } catch (e) {
      setBillingMsg(e instanceof Error ? e.message : "Could not start checkout.");
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-24">
        <h1 className="font-display text-3xl font-bold">Your account</h1>
        <p className="mt-1 text-mist">Credits, your Q-Bot version, your own API key, and connectors.</p>

        {/* Plan + pay-first (Stripe) */}
        <section className="mt-8 rounded-3xl glass-strong p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <CreditCard size={16} className="text-cyan" /> Plan &amp; billing
            </div>
            {plan ? (
              <span className="rounded-full bg-cyan/15 px-3 py-1 text-xs text-cyan">{plan.name} · {plan.price}{plan.period}</span>
            ) : (
              <span className="rounded-full bg-magenta/15 px-3 py-1 text-xs text-magenta">No active plan</span>
            )}
          </div>

          {/* billing email */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={account.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="Billing email (for receipt & activation)"
              className="glass flex-1 rounded-xl px-3 py-2.5 text-sm text-ink placeholder:text-mist/50 focus:outline-none"
            />
          </div>

          {billingMsg && (
            <p className="mt-3 rounded-xl bg-cyan/10 px-3 py-2 text-xs text-cyan">{billingMsg}</p>
          )}

          {!plan ? (
            <div className="mt-4 rounded-2xl border border-magenta/25 bg-magenta/[0.06] p-4">
              <p className="text-sm text-ink">Choose a plan to unlock full builds. <span className="text-mist">Payment comes first — your card is charged before any paid build runs.</span></p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {PAID_PLANS.map((p) => (
                  <button
                    key={p.id}
                    disabled={busy === p.id}
                    onClick={() => startCheckout("subscription", p.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl btn-brand px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {busy === p.id ? <Loader2 size={14} className="animate-spin" /> : null}
                    {p.name} · {p.price}{p.period}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-mist">
              {plan.credits}.{" "}
              <button onClick={() => update({ plan: null })} className="text-cyan hover:underline">Change plan</button>
            </p>
          )}

          {/* top-up credit packs */}
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-widest text-mist">Top up credits</div>
            <div className="flex flex-wrap gap-2">
              {CREDIT_PACKS.map((pk) => (
                <button
                  key={pk.id}
                  disabled={busy === pk.id}
                  onClick={() => startCheckout("credits", pk.id)}
                  className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-ink hover:border-white/25 disabled:opacity-60"
                >
                  {busy === pk.id ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} className="text-gold" />}
                  {pk.label} · {pk.price}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Credits */}
        <section className="mt-5 rounded-3xl glass-strong p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Zap size={16} className="text-gold" /> Credits
            </div>
            <span className="font-display text-lg font-bold text-gradient-gold">{account.credits.toLocaleString()}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan via-purple to-magenta transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-mist">
            <Sparkles size={12} className="text-cyan" /> Refills to {DAILY_FREE_CREDITS} free credits every day{plan && plan.id !== "diy-free" ? `, plus ${plan.credits} with your plan` : ""}.
          </p>
          <p className="mt-1 text-[11px] text-mist/70">
            Same credit value as the big agent tools, priced ~30% cheaper. Metered to real usage —
            e.g. a quick task ≈ 20 credits, a full website build ≈ 250 credits.
          </p>
        </section>

        {/* Q-Bot version */}
        <section className="mt-5 rounded-3xl glass-strong p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Gauge size={16} className="text-purple" /> Q-Bot version
          </div>
          <p className="mt-1 text-xs text-mist">Three versions, like the best agent frameworks — pick fast &amp; cheap or deep &amp; thorough.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {AGENT_VERSIONS.map((v) => {
              const active = account.version === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => update({ version: v.id })}
                  className={`relative rounded-2xl border p-4 text-left transition ${active ? "border-cyan/60 bg-cyan/[0.07] glow-cyan" : "hairline glass hover:border-white/25"}`}
                >
                  {v.recommended && <span className="absolute right-3 top-3 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase text-gold">Rec</span>}
                  <div className="text-sm font-semibold text-ink">{v.name}</div>
                  <div className="mt-0.5 text-[11px] text-cyan">{v.speed} · {v.cost} credits/run</div>
                  <p className="mt-2 text-xs text-mist">{v.blurb}</p>
                  {active && <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan"><Check size={12} /> Selected</div>}
                </button>
              );
            })}
          </div>
        </section>

        {/* BYO API key */}
        <section className="mt-5 rounded-3xl glass-strong p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <KeyRound size={16} className="text-cyan" /> Your model API key
          </div>
          <p className="mt-1 text-xs text-mist">
            Bring your own AI key so you're never rate-limited and you keep costs low. If you don't add one,
            Q-Empire runs on a shared low-cost <span className="text-ink">Kimi</span> model, metered in credits.
          </p>
          <div className="mt-4 flex gap-2">
            <div className="glass flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
              <input
                type={showKey ? "text" : "password"}
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                placeholder="sk-… (OpenAI, Anthropic, OpenRouter…)"
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-mist/50 focus:outline-none"
              />
              <button onClick={() => setShowKey((s) => !s)} className="text-mist hover:text-ink">
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button onClick={() => update({ apiKey: draftKey.trim() })} className="rounded-xl btn-brand px-4 text-sm font-semibold text-white">
              Save
            </button>
          </div>
          {account.apiKey && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-cyan"><ShieldCheck size={13} /> Key saved on this device only. Cleared anytime.</p>
          )}
        </section>

        {/* Connectors shortcut */}
        <section className="mt-5 flex items-center justify-between rounded-3xl glass-strong p-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Link2 size={16} className="text-magenta" /> Connectors</div>
            <p className="mt-1 text-xs text-mist">{account.connectors.length} connected · 224 available</p>
          </div>
          <button onClick={() => navigate("/connectors")} className="rounded-full btn-brand px-4 py-2 text-sm font-semibold text-white">
            Manage
          </button>
        </section>
      </div>
    </div>
  );
}
