import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Palette, Workflow, Megaphone, HandCoins, PackageCheck, Rocket,
  Check, ChevronDown, Clock, ArrowRight, Crown, Sparkles,
} from "lucide-react";
import NavBar from "../components/NavBar";
import QBot from "../components/QBot";

interface Step {
  icon: typeof Lightbulb;
  title: string;
  goal: string;
  autopilot: string;     // what runs 24/7
  apps: string[];
  suggestion: string;    // Q-Bot suggestion (different from Manus, same idea)
  cta: { label: string; href: string };
  accent: string;
}

const STEPS: Step[] = [
  {
    icon: Lightbulb, accent: "text-gold",
    title: "Find your money idea",
    goal: "Turn your skill + free time into a business with real demand.",
    autopilot: "Q-Bot researches your market and picks the offer most likely to sell.",
    apps: ["Q-Bot Idea Builder", "Semrush", "Explorium"],
    suggestion: "Busy parent? Start with a digital product or a done-for-you service — no inventory, sells while you sleep.",
    cta: { label: "Open the Idea Builder", href: "/idea" },
  },
  {
    icon: Palette, accent: "text-magenta",
    title: "Build your brand & website",
    goal: "A professional look and a live site that turns visitors into buyers.",
    autopilot: "Your site is generated, branded and deployed — then A/B-optimized automatically.",
    apps: ["Webflow", "Canva", "Cloudflare"],
    suggestion: "Keep it to one irresistible offer and one big button. Q-Bot writes the copy for you.",
    cta: { label: "See how Q-Bot builds it", href: "/command" },
  },
  {
    icon: Workflow, accent: "text-cyan",
    title: "Wire your money machine",
    goal: "Connect the apps that capture, follow up and bill customers for you.",
    autopilot: "Lead capture, email sequences, CRM and invoicing run 24/7 — no manual work.",
    apps: ["HubSpot", "Stripe", "Make", "Twilio"],
    suggestion: "Automate follow-up first — most sales are lost in the follow-up, and robots never forget.",
    cta: { label: "Browse 224 connectors", href: "/connectors" },
  },
  {
    icon: Megaphone, accent: "text-purple",
    title: "Turn on the traffic",
    goal: "A steady stream of the right people finding your offer every day.",
    autopilot: "Q-Bot posts content, runs ads and does SEO on a schedule — hands-off.",
    apps: ["TikTok Ads", "Buffer", "Metricool", "YouTube"],
    suggestion: "Post one short video a day about a problem you solve. Q-Bot can generate and schedule them.",
    cta: { label: "Let Q-Bot run it", href: "/command" },
  },
  {
    icon: HandCoins, accent: "text-gold",
    title: "Auto-close the sales",
    goal: "Leads get answered, nurtured and closed without you on the phone.",
    autopilot: "Chatbot qualifies, proposals send in minutes, and payments collect themselves.",
    apps: ["Q-Bot Chat", "PandaDoc", "Stripe", "PayPal"],
    suggestion: "Add urgency + a simple guarantee. Q-Bot handles objections by text and email.",
    cta: { label: "See the sales flow", href: "/command" },
  },
  {
    icon: PackageCheck, accent: "text-cyan",
    title: "Deliver on autopilot",
    goal: "Happy customers, delivered fast, so they buy again and refer.",
    autopilot: "Onboarding, delivery and progress updates are automatic — reviews get requested too.",
    apps: ["Dropbox", "Notion", "Airtable", "Gmail"],
    suggestion: "Systematize delivery once, then let it repeat forever. That's how you scale without burning out.",
    cta: { label: "Set up delivery", href: "/connectors" },
  },
  {
    icon: Rocket, accent: "text-magenta",
    title: "Scale toward $1M",
    goal: "Compound what works: more traffic, upsells, and new offers.",
    autopilot: "Q-Bot upsells at day 21, pitches retainers, and reinvests into what converts — 24/7.",
    apps: ["RevenueCat", "HubSpot", "MotherDuck"],
    suggestion: "Once one offer prints, clone the formula for a second audience. Two engines beat one.",
    cta: { label: "Model my path to $1M", href: "/simulator" },
  },
];

export default function Formula() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggleDone = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };
  const pct = Math.round((done.size / STEPS.length) * 100);

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-24">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-gold">
            <Crown size={13} /> The step-by-step formula
          </motion.div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            The <span className="text-gradient-gold">Millionaire</span> Formula
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-mist">
            Seven steps from idea to a business that runs itself. Q-Bot guides you and turns on
            the automations — you follow along and watch it grow.
          </p>
        </div>

        {/* progress */}
        <div className="mt-8 rounded-2xl glass p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-mist">
            <span>Your progress</span><span className="text-cyan">{done.size}/{STEPS.length} steps</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan via-purple to-magenta" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </div>
        </div>

        {/* steps */}
        <div className="mt-6 space-y-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isOpen = open === i;
            const isDone = done.has(i);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`overflow-hidden rounded-2xl border ${isOpen ? "glass-strong glow-cyan" : "glass hairline"}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-3 p-4 text-left">
                  <div className="relative">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-tide/70 to-purple/20 ${s.accent}`}>
                      <Icon size={20} />
                    </div>
                    <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-abyss text-[10px] font-bold text-mist">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${isDone ? "text-ink/60 line-through" : "text-ink"}`}>{s.title}</div>
                    <div className="truncate text-xs text-mist">{s.goal}</div>
                  </div>
                  <span onClick={(e) => { e.stopPropagation(); toggleDone(i); }} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${isDone ? "bg-cyan text-abyss" : "border hairline text-mist"}`} title="Mark done">
                    <Check size={13} />
                  </span>
                  <ChevronDown size={16} className={`shrink-0 text-mist transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className="border-t hairline p-4">
                        <div className="flex items-center gap-2 rounded-xl bg-cyan/[0.06] px-3 py-2 text-xs text-cyan">
                          <Clock size={13} /> Runs 24/7: <span className="text-ink/90">{s.autopilot}</span>
                        </div>
                        <p className="mt-3 flex items-start gap-2 text-sm text-ink/90">
                          <Sparkles size={15} className="mt-0.5 shrink-0 text-gold" /> <span><span className="text-mist">Q-Bot suggests:</span> {s.suggestion}</span>
                        </p>
                        <div className="mt-3">
                          <div className="mb-1.5 text-[11px] uppercase tracking-widest text-mist">Apps that run this step</div>
                          <div className="flex flex-wrap gap-1.5">
                            {s.apps.map((a) => (
                              <span key={a} className="rounded-full border hairline bg-white/[0.03] px-3 py-1 text-xs text-ink/85">{a}</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => navigate(s.cta.href)} className="mt-4 inline-flex items-center gap-1.5 rounded-full btn-brand px-4 py-2 text-sm font-semibold text-white">
                          {s.cta.label} <ArrowRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* finale */}
        <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl glass-strong p-8 text-center">
          <QBot size={56} className="animate-float" />
          <h2 className="font-display text-2xl font-bold">Ready to start step 1?</h2>
          <p className="max-w-md text-sm text-mist">Tell Q-Bot your idea and it'll walk you through the whole formula — turning on each automation as you go.</p>
          <button onClick={() => navigate("/idea")} className="inline-flex items-center gap-1.5 rounded-full btn-gold px-6 py-3 text-sm font-bold">
            <Rocket size={16} /> Begin my empire
          </button>
        </div>
      </div>
    </div>
  );
}
