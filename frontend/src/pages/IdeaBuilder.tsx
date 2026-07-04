import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowUp, Sparkles, Target, Clock, Wallet, Heart, RefreshCw, Bot, Wrench, TrendingUp, Check,
} from "lucide-react";
import NavBar from "../components/NavBar";
import QBot from "../components/QBot";

type Passion =
  | "Cooking & Food" | "Crafts & Handmade" | "Beauty & Hair" | "Fitness & Wellness"
  | "Teaching & Tutoring" | "Childcare & Family" | "Cleaning & Home" | "Writing & Content"
  | "Reselling & Thrift" | "Tech & Digital";

interface Answers {
  idea: string;
  passion: Passion | "";
  hours: string;
  goal: number; // monthly $
  budget: string;
}

interface Pitch {
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

const PASSIONS: Passion[] = [
  "Cooking & Food", "Crafts & Handmade", "Beauty & Hair", "Fitness & Wellness",
  "Teaching & Tutoring", "Childcare & Family", "Cleaning & Home", "Writing & Content",
  "Reselling & Thrift", "Tech & Digital",
];

const HOURS = ["Under 5 hrs/wk", "5–10 hrs/wk", "10–20 hrs/wk", "20+ hrs/wk"];
const BUDGETS = ["$0 to start", "Under $500", "$500–$2,000", "$2,000+"];
const GOALS = [10000, 25000, 50000];

const money = (n: number) => "$" + n.toLocaleString();

// Deterministic pitch generator — turns answers into a concrete business plan.
function buildPitch(a: Answers): Pitch {
  const templates: Record<Passion, Omit<Pitch, "monthlyLow" | "monthlyHigh" | "plan">> = {
    "Cooking & Food": {
      name: "Coastal Kitchen Co.",
      tagline: "Ready-to-cook meal kits & recipes for busy families.",
      model: "Digital recipe bundles + local meal-prep subscription",
      audience: "Working parents who want home-cooked meals without the planning",
      offer: "A weekly meal-plan membership plus a downloadable recipe vault",
      channels: ["TikTok & Reels food videos", "Local Facebook groups", "SEO recipe blog"],
      automations: ["Lead capture chatbot", "Email welcome sequence", "Subscription billing", "Social auto-posting"],
    },
    "Crafts & Handmade": {
      name: "Deep Reef Makers",
      tagline: "Handmade goods turned into a scalable online shop.",
      model: "E-commerce store + print-on-demand + digital patterns",
      audience: "Gift shoppers and craft lovers who value one-of-a-kind items",
      offer: "A branded storefront with signature products and digital patterns",
      channels: ["Etsy + Shopify", "Pinterest & Instagram", "Craft marketplaces"],
      automations: ["Storefront + payments", "Order fulfillment flow", "Email follow-up", "Review requests"],
    },
    "Beauty & Hair": {
      name: "Crown & Coral Beauty",
      tagline: "A booked-out beauty brand with products that sell overnight.",
      model: "Booking-based services + product line + tutorials",
      audience: "Clients who want a signature look and at-home routines",
      offer: "Online booking, a product bundle, and a paid tutorial library",
      channels: ["Instagram & TikTok", "Local search / Google", "Referral program"],
      automations: ["Appointment scheduling", "Payment reminders", "Client onboarding flow", "Social auto-posting"],
    },
    "Fitness & Wellness": {
      name: "Tidewell Coaching",
      tagline: "Online coaching that runs while you train your own clients.",
      model: "Group coaching membership + digital programs",
      audience: "Busy people who want structure and accountability",
      offer: "A monthly coaching membership and self-paced program library",
      channels: ["Short-form video", "Free challenge funnel", "Email list"],
      automations: ["Lead capture chatbot", "Email welcome sequence", "Membership billing", "Monthly reporting"],
    },
    "Teaching & Tutoring": {
      name: "Lumen Learning Lab",
      tagline: "Turn what you know into courses and tutoring income.",
      model: "1:1 tutoring + self-paced online courses",
      audience: "Parents & students seeking results-driven help",
      offer: "Bookable tutoring plus an evergreen course catalog",
      channels: ["YouTube & TikTok explainers", "School & parent groups", "SEO"],
      automations: ["Appointment scheduling", "Course delivery", "Email follow-up", "Invoice automation"],
    },
    "Childcare & Family": {
      name: "Little Harbor Co.",
      tagline: "Family services and digital resources parents actually pay for.",
      model: "Local service + digital planners & guides",
      audience: "New and busy parents in your area and online",
      offer: "A booked service plus a shop of printable planners and guides",
      channels: ["Local Facebook groups", "Instagram", "Pinterest"],
      automations: ["Lead capture chatbot", "Booking + reminders", "Digital product delivery", "Client onboarding"],
    },
    "Cleaning & Home": {
      name: "Blue Depth Home",
      tagline: "A cleaning brand that books and bills itself.",
      model: "Recurring home-service subscriptions",
      audience: "Homeowners and renters who want reliable recurring cleaning",
      offer: "Recurring cleaning plans with instant online booking",
      channels: ["Google Local", "Nextdoor & FB groups", "Referral program"],
      automations: ["Online booking", "Recurring billing", "Payment reminders", "Review requests"],
    },
    "Writing & Content": {
      name: "Ink & Current Studio",
      tagline: "Your words, packaged into products and client work.",
      model: "Freelance service + digital templates & ebooks",
      audience: "Small businesses and creators who need content",
      offer: "A productized writing service plus a template & ebook shop",
      channels: ["LinkedIn & X", "Cold outreach", "SEO portfolio"],
      automations: ["Lead capture", "Proposal automation", "Invoice automation", "Email sequences"],
    },
    "Reselling & Thrift": {
      name: "Pearl Trade Co.",
      tagline: "Flip inventory into a real, automated storefront.",
      model: "Multi-channel resale + dropship line",
      audience: "Deal-seekers and collectors online",
      offer: "A branded resale shop across marketplaces with automated listing",
      channels: ["eBay / Poshmark / Whatnot", "Instagram", "TikTok live"],
      automations: ["Listing automation", "Order fulfillment", "Email follow-up", "Reporting dashboard"],
    },
    "Tech & Digital": {
      name: "Q-Current Digital",
      tagline: "Sell digital products and automation setups on autopilot.",
      model: "Digital products + done-for-you automation setups",
      audience: "Small businesses that want to automate but don't know how",
      offer: "A digital toolkit plus paid automation setup packages",
      channels: ["YouTube & TikTok", "Cold email", "Communities"],
      automations: ["Lead capture chatbot", "Checkout + delivery", "CRM pipeline", "Email sequences"],
    },
  };

  const base = a.passion ? templates[a.passion] : templates["Tech & Digital"];
  const low = Math.round(a.goal * 0.6);
  const high = Math.round(a.goal * 1.1);

  return {
    ...base,
    monthlyLow: low,
    monthlyHigh: high,
    plan: [
      { day: "Days 1–7", text: `Q-Bot builds your brand, ${base.name}, and a live website with your offer.` },
      { day: "Days 8–21", text: "The swarm launches content, ads and outreach to fill your pipeline." },
      { day: "Days 22–45", text: "Automations close and deliver — bookings, payments and follow-ups run themselves." },
      { day: "Days 46–90", text: `Scale toward ${money(low)}–${money(high)}/mo as the swarm optimizes what converts.` },
    ],
  };
}

type Msg = { from: "bot" | "user"; text: string };

export default function IdeaBuilder() {
  const [, navigate] = useLocation();
  const initialIdea =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") || "" : "";

  const [answers, setAnswers] = useState<Answers>({
    idea: initialIdea,
    passion: "",
    hours: "",
    goal: 25000,
    budget: "",
  });
  const [step, setStep] = useState(initialIdea ? 1 : 0);
  const [ideaDraft, setIdeaDraft] = useState(initialIdea);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi, I'm Q-Bot 👑 Let's turn your spark into a real, automated business. First — what's your idea, or just the skills and time you have?" },
  ]);
  const [thinking, setThinking] = useState(false);
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, pitch]);

  // If arriving with a prefilled idea, seed the conversation.
  useEffect(() => {
    if (initialIdea) {
      setMessages((m) => [
        ...m,
        { from: "user", text: initialIdea },
        { from: "bot", text: "Love it. What are you naturally good at or drawn to? Pick the closest." },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const say = (msg: Msg) => setMessages((m) => [...m, msg]);

  const submitIdea = () => {
    const v = ideaDraft.trim();
    if (!v) return;
    setAnswers((a) => ({ ...a, idea: v }));
    say({ from: "user", text: v });
    say({ from: "bot", text: "Love it. What are you naturally good at or drawn to? Pick the closest." });
    setStep(1);
  };

  const pickPassion = (p: Passion) => {
    setAnswers((a) => ({ ...a, passion: p }));
    say({ from: "user", text: p });
    say({ from: "bot", text: "Perfect. How much time can you give this each week? Be honest — the swarm covers the rest." });
    setStep(2);
  };

  const pickHours = (h: string) => {
    setAnswers((a) => ({ ...a, hours: h }));
    say({ from: "user", text: h });
    say({ from: "bot", text: "Got it. What monthly income would change your life?" });
    setStep(3);
  };

  const pickGoal = (g: number) => {
    setAnswers((a) => ({ ...a, goal: g }));
    say({ from: "user", text: `${money(g)}/mo` });
    say({ from: "bot", text: "Last one — how much can you invest to get started?" });
    setStep(4);
  };

  const pickBudget = (b: string) => {
    const next = { ...answers, budget: b };
    setAnswers(next);
    say({ from: "user", text: b });
    setStep(5);
    setThinking(true);
    say({ from: "bot", text: "Give me a moment — researching your market and drafting your pitch…" });
    window.setTimeout(() => {
      setThinking(false);
      setPitch(buildPitch(next));
      setStep(6);
    }, 1900);
  };

  const restart = () => {
    setAnswers({ idea: "", passion: "", hours: "", goal: 25000, budget: "" });
    setIdeaDraft("");
    setPitch(null);
    setStep(0);
    setMessages([
      { from: "bot", text: "Fresh start! What's your idea, or the skills and time you have?" },
    ]);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-24">
        {/* progress */}
        <div className="mb-6 flex items-center gap-2">
          {["Idea", "Skills", "Time", "Goal", "Budget", "Pitch"].map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${
                  step > i ? "btn-brand text-white" : step === i ? "glow-cyan bg-white/5 text-cyan" : "glass text-mist"
                }`}
              >
                {step > i ? <Check size={12} /> : i + 1}
              </div>
              {i < 5 && <div className={`h-px flex-1 ${step > i ? "bg-cyan/40" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* conversation */}
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end gap-2.5 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
              {m.from === "bot" ? (
                <QBot size={34} className="shrink-0" />
              ) : (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs">You</div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "bot" ? "glass rounded-bl-sm text-ink" : "btn-brand rounded-br-sm text-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex items-end gap-2.5">
              <QBot size={34} className="shrink-0 animate-float" />
              <div className="glass flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-purple" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-magenta [animation-delay:0.2s]" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* interactive controls */}
        <div className="mt-6">
          {step === 0 && (
            <div className="glass-strong rounded-3xl p-2.5">
              <div className="flex items-end gap-2">
                <textarea
                  value={ideaDraft}
                  onChange={(e) => setIdeaDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitIdea();
                    }
                  }}
                  rows={1}
                  autoFocus
                  placeholder="e.g. I love baking and have 2 hours a night after the kids sleep…"
                  className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-ink placeholder:text-mist/60 focus:outline-none"
                />
                <button
                  onClick={submitIdea}
                  disabled={!ideaDraft.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl btn-brand text-white disabled:opacity-40"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <Choices icon={<Heart size={14} className="text-magenta" />} label="Your strength">
              {PASSIONS.map((p) => (
                <Chip key={p} onClick={() => pickPassion(p)}>{p}</Chip>
              ))}
            </Choices>
          )}

          {step === 2 && (
            <Choices icon={<Clock size={14} className="text-cyan" />} label="Time you can give">
              {HOURS.map((h) => (
                <Chip key={h} onClick={() => pickHours(h)}>{h}</Chip>
              ))}
            </Choices>
          )}

          {step === 3 && (
            <Choices icon={<Target size={14} className="text-gold" />} label="Monthly income goal">
              {GOALS.map((g) => (
                <Chip key={g} onClick={() => pickGoal(g)}>{money(g)}/mo</Chip>
              ))}
            </Choices>
          )}

          {step === 4 && (
            <Choices icon={<Wallet size={14} className="text-purple" />} label="Startup budget">
              {BUDGETS.map((b) => (
                <Chip key={b} onClick={() => pickBudget(b)}>{b}</Chip>
              ))}
            </Choices>
          )}
        </div>

        {/* pitch result */}
        {pitch && (
          <div className="mt-8 overflow-hidden rounded-3xl glass-strong glow-purple">
            <div className="bg-gradient-to-r from-purple/20 to-magenta/15 px-6 py-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan">
                <Sparkles size={14} /> Your business pitch
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-gradient-gold">{pitch.name}</h2>
              <p className="mt-1 text-sm text-ink/90">{pitch.tagline}</p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Business model" value={pitch.model} />
              <Field label="Who it serves" value={pitch.audience} />
              <Field label="Your offer" value={pitch.offer} />
              <Field label="Where customers come from" value={pitch.channels.join(" · ")} />
            </div>

            <div className="px-6">
              <div className="rounded-2xl bg-gradient-to-br from-cyan/10 to-purple/10 p-5 text-center">
                <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-mist">
                  <TrendingUp size={14} className="text-cyan" /> Projected monthly income
                </div>
                <div className="mt-1 font-display text-3xl font-bold text-gradient-gold">
                  {money(pitch.monthlyLow)} – {money(pitch.monthlyHigh)}
                </div>
                <div className="text-xs text-mist">within 90 days, once automations are live</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">Your 90-day build plan</h3>
              <div className="space-y-2">
                {pitch.plan.map((p) => (
                  <div key={p.day} className="flex gap-3 rounded-xl glass px-4 py-3">
                    <span className="shrink-0 text-xs font-semibold text-cyan">{p.day}</span>
                    <span className="text-sm text-ink/90">{p.text}</span>
                  </div>
                ))}
              </div>

              <h3 className="mb-2 mt-5 text-sm font-semibold text-ink">Automations that will run it</h3>
              <div className="flex flex-wrap gap-1.5">
                {pitch.automations.map((a) => (
                  <span key={a} className="rounded-full border hairline bg-white/[0.03] px-3 py-1 text-xs text-ink/85">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 border-t hairline p-6 sm:grid-cols-2">
              <button
                onClick={() => navigate("/checkout/empire-pro")}
                className="flex items-center justify-center gap-2 rounded-xl btn-brand py-3 text-sm font-semibold text-white"
              >
                <Bot size={16} /> Build this for me
              </button>
              <button
                onClick={() => navigate(`/command?q=${encodeURIComponent("Build " + pitch.name + ": " + pitch.tagline)}`)}
                className="flex items-center justify-center gap-2 rounded-xl glass py-3 text-sm font-semibold text-ink hover:border-white/25"
              >
                <Wrench size={16} /> I'll build it with Q-Bot
              </button>
            </div>

            <button
              onClick={restart}
              className="mx-auto mb-6 flex items-center gap-1.5 text-xs text-mist hover:text-ink"
            >
              <RefreshCw size={12} /> Try a different idea
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Choices({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-widest text-mist">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border hairline bg-white/[0.03] px-4 py-2 text-sm text-ink/90 transition hover:border-cyan/40 hover:bg-cyan/10 hover:text-white"
    >
      {children}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-mist">{label}</div>
      <div className="mt-1 text-sm text-ink/90">{value}</div>
    </div>
  );
}
