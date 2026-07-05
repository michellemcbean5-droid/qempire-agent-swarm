import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, Sparkles, ArrowRight, Save } from "lucide-react";
import { useAccount } from "../lib/account";

// Page-aware tips so Q-Bot feels present and helpful everywhere.
const TIPS: Record<string, { tip: string; action?: { label: string; href: string } }> = {
  "/": { tip: "New here? Tell me your idea and I'll shape a whole business around it.", action: { label: "Build my idea", href: "/idea" } },
  "/idea": { tip: "Answer honestly — even 'I just have 2 hours a night' helps me pick the right offer." },
  "/simulator": { tip: "Drag the sliders to YOUR real numbers. More automation = faster to $1M.", action: { label: "See the formula", href: "/formula" } },
  "/formula": { tip: "Do one step at a time. Tick it off and I'll turn on the automations for it." },
  "/connectors": { tip: "Connect the apps you already use — I act through them for you." },
  "/account": { tip: "Add your billing email, pick a plan, and set your Q-Bot version here." },
  "/command": { tip: "Watch me work in real time. Your files land in the Files tab." },
  "/legal": { tip: "Sign the NDA and you're cleared to build. It protects you too." },
};

const TONES = ["Friendly", "Professional", "Hype", "Calm & clear"];

export default function QBotAssistant() {
  const [location, navigate] = useLocation();
  const { account, update } = useAccount();
  const [open, setOpen] = useState(false);
  const [programming, setProgramming] = useState(false);

  const cfg = account.assistant || { name: "Q-Bot", tone: "Friendly", focus: "" };
  const [draft, setDraft] = useState(cfg);

  const ctx = TIPS[location] || { tip: "I'm your automation companion — ask me to build, connect, or automate anything." };
  const displayName = cfg.name || "Q-Bot";

  const saveProgram = () => {
    update({ assistant: { name: draft.name || "Q-Bot", tone: draft.tone, focus: draft.focus } });
    setProgramming(false);
  };

  return (
    <>
      {/* floating launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] grid place-items-center rounded-full"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open Q-Bot"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full" />
        <img src="/brand/qbot.webp" alt="Q-Bot" className="h-14 w-14 rounded-full object-cover ring-2 ring-cyan/40 shadow-lg shadow-cyan/20 animate-float" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-5 z-[60] w-[min(92vw,340px)] overflow-hidden rounded-3xl glass-strong shadow-2xl shadow-black/50"
          >
            {/* header with Michelle + Q-Bot art */}
            <div className="relative">
              <img src="/brand/michelle-hero.webp" alt="" className="h-24 w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss to-transparent" />
              <button onClick={() => setOpen(false)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/40 text-mist hover:text-ink">
                <X size={15} />
              </button>
              <div className="absolute -bottom-5 left-4 flex items-end gap-2">
                <img src="/brand/qbot.webp" alt="Q-Bot" className="h-12 w-12 rounded-full object-cover ring-2 ring-abyss" />
                <div className="pb-1">
                  <div className="font-display text-sm font-bold text-gradient-gold">{displayName}</div>
                  <div className="text-[10px] text-cyan">{cfg.tone} · your companion</div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-8">
              {!programming ? (
                <>
                  <div className="flex items-start gap-2 rounded-2xl glass px-3 py-2.5 text-sm text-ink">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-cyan" />
                    <span>{ctx.tip}</span>
                  </div>
                  {cfg.focus && (
                    <p className="mt-2 text-xs text-mist">Focused on: <span className="text-ink/90">{cfg.focus}</span></p>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {ctx.action && (
                      <button onClick={() => { navigate(ctx.action!.href); setOpen(false); }} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl btn-brand py-2 text-xs font-semibold text-white">
                        {ctx.action.label} <ArrowRight size={13} />
                      </button>
                    )}
                    <button onClick={() => { navigate("/idea"); setOpen(false); }} className="rounded-xl glass py-2 text-xs text-ink hover:border-white/25">💡 New idea</button>
                    <button onClick={() => { navigate("/formula"); setOpen(false); }} className="rounded-xl glass py-2 text-xs text-ink hover:border-white/25">🏆 Formula</button>
                  </div>
                  <button onClick={() => { setDraft(cfg); setProgramming(true); }} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl glass py-2 text-xs font-medium text-mist hover:text-ink">
                    <Settings2 size={13} /> Program Q-Bot
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-widest text-mist">Program your Q-Bot</div>
                  <div>
                    <label className="text-[11px] text-mist">Name</label>
                    <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Q-Bot" className="mt-1 w-full rounded-xl glass px-3 py-2 text-sm text-ink focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] text-mist">Tone</label>
                    <select value={draft.tone} onChange={(e) => setDraft({ ...draft, tone: e.target.value })} className="mt-1 w-full rounded-xl glass px-3 py-2 text-sm text-ink focus:outline-none">
                      {TONES.map((t) => <option key={t} value={t} className="bg-abyss">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-mist">What should Q-Bot focus on for you?</label>
                    <textarea value={draft.focus} onChange={(e) => setDraft({ ...draft, focus: e.target.value })} rows={2} placeholder="e.g. getting my first 10 sales, saving me time on follow-ups…" className="mt-1 w-full resize-none rounded-xl glass px-3 py-2 text-sm text-ink placeholder:text-mist/50 focus:outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setProgramming(false)} className="flex-1 rounded-xl glass py-2 text-xs text-mist hover:text-ink">Cancel</button>
                    <button onClick={saveProgram} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl btn-brand py-2 text-xs font-semibold text-white"><Save size={13} /> Save</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
