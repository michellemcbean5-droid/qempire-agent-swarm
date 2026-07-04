import { useState } from "react";
import { useLocation } from "wouter";
import {
  Check, Crown, Zap, Waves, ArrowRight, Bot, Wrench, Sparkles, ShieldCheck,
} from "lucide-react";
import NavBar from "../components/NavBar";
import PromptBar from "../components/PromptBar";
import QBot from "../components/QBot";
import { DIVISIONS, PACKAGES, DIY_PLANS, CONNECTORS } from "../data/swarm";

const accentText: Record<string, string> = {
  cyan: "text-cyan",
  purple: "text-purple",
  magenta: "text-magenta",
  gold: "text-gold",
  blue: "text-[#5b9bff]",
};
const accentDot: Record<string, string> = {
  cyan: "bg-cyan",
  purple: "bg-purple",
  magenta: "bg-magenta",
  gold: "bg-gold",
  blue: "bg-[#5b9bff]",
};

export default function Home() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"dfy" | "diy">("dfy");

  const jumpToPricing = (m: "dfy" | "diy") => {
    setMode(m);
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  const startTask = (prompt: string) => {
    navigate(`/idea?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* ---------------- Hero ---------------- */}
      <section className="relative px-4 pt-32 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <QBot size={88} className="animate-float drop-shadow-[0_0_30px_rgba(34,224,255,0.35)]" />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-cyan">
            <Crown size={13} className="text-gold" />
            Built for parents &amp; single parents · from idea to profit
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-6xl">
            <span className="text-gradient-gold">From an idea</span>{" "}
            <span className="text-ink">to</span>{" "}
            <span className="text-gradient-brand">$10K–$50K/mo.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-mist sm:text-lg">
            Have a spark but no time? Tell Q-Bot your situation. We shape it into a real
            business, pitch it, build it from the ground up, and automate everything —
            so it earns while you raise your family.
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <PromptBar
              onSubmit={startTask}
              autoFocus
              placeholder="Describe your idea — or just your skills and free time…"
            />
          </div>

          <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4">
            {[
              { v: "50", l: "AI agents doing the work" },
              { v: "90 min", l: "Idea → live business" },
              { v: "$10–50K", l: "Monthly income target" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-3 py-4">
                <div className="font-display text-2xl font-bold text-gradient-gold">{s.v}</div>
                <div className="mt-1 text-[11px] leading-tight text-mist">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* connector marquee */}
        <div className="mx-auto mt-16 max-w-5xl overflow-hidden">
          <p className="mb-3 text-center text-[11px] uppercase tracking-[0.25em] text-mist/60">
            Wired into 30 live connectors
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CONNECTORS.map((c) => (
              <span key={c} className="rounded-full border hairline bg-white/[0.03] px-3 py-1 text-xs text-mist">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Two ways to build ---------------- */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Two ways to build</h2>
          <p className="mt-3 text-center text-mist">Let the swarm do it all for you — or drive Q-Bot yourself for a low monthly price.</p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="glass-strong rounded-3xl p-7 glow-purple">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple/15 px-3 py-1 text-xs font-semibold text-purple">
                <Bot size={14} /> Done-For-You
              </div>
              <h3 className="font-display text-2xl font-bold">The Swarm Builds It</h3>
              <p className="mt-2 text-sm text-mist">
                Pay once. The 50-agent war machine researches, designs, writes, deploys and
                funds your entire business. You approve — it ships.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink/90">
                {["Full business plan & pitch deck", "Branded website, live", "Automations wired & tested", "Grant & funding applications"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={15} className="text-cyan" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => jumpToPricing("dfy")} className="mt-6 inline-flex items-center gap-1.5 rounded-full btn-brand px-5 py-2.5 text-sm font-semibold text-white">
                See packages <ArrowRight size={15} />
              </button>
            </div>

            <div className="glass-strong rounded-3xl p-7 glow-cyan">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan/15 px-3 py-1 text-xs font-semibold text-cyan">
                <Wrench size={14} /> Do-It-Yourself
              </div>
              <h3 className="font-display text-2xl font-bold">You Drive Q-Bot</h3>
              <p className="mt-2 text-sm text-mist">
                Prefer to build your own automations? Get the same Q-Bot workspace on a simple
                monthly plan — priced below the big-name AI-agent tools.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink/90">
                {["Full Q-Bot command workspace", "Build your own automations", "Every connector template", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={15} className="text-cyan" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => jumpToPricing("diy")} className="mt-6 inline-flex items-center gap-1.5 rounded-full glass px-5 py-2.5 text-sm font-semibold text-ink hover:border-white/25">
                See self-serve plans <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- The Swarm ---------------- */}
      <section id="swarm" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-magenta">
              <Zap size={13} /> The 50-Agent War Machine
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Five divisions. One relentless empire.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-mist">
              Every agent has a job, a connector, and a schedule. Together they acquire,
              close, deliver, retain and even hire — with zero manual input.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DIVISIONS.map((d) => (
              <div key={d.id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-widest ${accentText[d.accent]}`}>{d.tag}</span>
                  <span className={`h-2 w-2 rounded-full ${accentDot[d.accent]} animate-pulse-ring`} />
                </div>
                <h3 className="mt-2 font-display text-xl font-bold">{d.name}</h3>
                <p className="mt-1 text-sm text-mist">{d.goal}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.agents.slice(0, 5).map((a) => (
                    <span key={a.id} className="rounded-md border hairline bg-white/[0.03] px-2 py-0.5 text-[11px] text-ink/80">
                      {a.name}
                    </span>
                  ))}
                  <span className="rounded-md px-2 py-0.5 text-[11px] text-mist">+5 more</span>
                </div>
              </div>
            ))}
            <div className="glass rounded-2xl p-5 flex flex-col justify-center items-start bg-gradient-to-br from-purple/10 to-magenta/10">
              <Sparkles className="text-gold" />
              <h3 className="mt-2 font-display text-xl font-bold">Watch it run live</h3>
              <p className="mt-1 text-sm text-mist">See Q-Bot's Computer execute the swarm in real time.</p>
              <button onClick={() => navigate("/command")} className="mt-4 inline-flex items-center gap-1.5 rounded-full btn-gold px-4 py-2 text-sm font-semibold">
                Open live demo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="scroll-mt-20 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Pricing that pays for itself</h2>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-full glass p-1">
              <button
                onClick={() => setMode("dfy")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${mode === "dfy" ? "btn-brand text-white" : "text-mist hover:text-ink"}`}
              >
                Done-For-You
              </button>
              <button
                onClick={() => setMode("diy")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${mode === "diy" ? "btn-brand text-white" : "text-mist hover:text-ink"}`}
              >
                Do-It-Yourself
              </button>
            </div>
          </div>

          {mode === "diy" && (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-cyan">
              <ShieldCheck size={15} /> Every self-serve plan is priced below the big-name AI-agent tools.
            </p>
          )}

          {mode === "dfy" ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PACKAGES.map((p) => (
                <div key={p.id} className={`relative flex flex-col rounded-2xl p-6 ${p.popular ? "glass-strong glow-purple" : "glass"}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-xs text-mist">{p.tagline}</p>
                  <div className="mt-4 font-display text-3xl font-bold text-gradient-gold">{p.price}</div>
                  <div className="text-xs text-mist">{p.billing}</div>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/90">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-cyan" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate(`/checkout/${p.id}`)} className="mt-6 w-full rounded-xl btn-brand py-2.5 text-sm font-semibold text-white">
                    Choose {p.name.split(" ")[0]}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {DIY_PLANS.map((p) => (
                <div key={p.id} className={`relative flex flex-col rounded-2xl p-6 ${p.popular ? "glass-strong glow-cyan" : "glass"}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      Best Value
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-xs text-mist">{p.tagline}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="font-display text-3xl font-bold text-gradient-gold">{p.price}</span>
                    <span className="pb-1 text-xs text-mist">{p.period}</span>
                  </div>
                  <div className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-cyan/10 px-2 py-0.5 text-[11px] text-cyan">
                    {p.save}
                  </div>
                  <div className="mt-2 text-xs text-mist">{p.credits}</div>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/90">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-cyan" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate("/command")} className="mt-6 w-full rounded-xl btn-brand py-2.5 text-sm font-semibold text-white">
                    Start with {p.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Brand story ---------------- */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl glass-strong p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-cyan">
                <Waves size={16} /> <span className="text-xs uppercase tracking-widest">Queen of the Deep</span>
              </div>
              <h2 className="font-display text-3xl font-bold">Guided by Michelle. Powered by Q-Bot.</h2>
              <p className="mt-4 text-mist">
                Michelle is the Black Mermaid Queen of the Deep — a symbol of creativity,
                resilience and transformation. With her companion Q-Bot, she helps founders
                turn ideas into thriving, automated empires.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink/85">
                <li className="flex items-center gap-2"><span className="text-cyan">🌊</span> Automation you can actually understand</li>
                <li className="flex items-center gap-2"><span className="text-cyan">🤖</span> Q-Bot handles the tech, you keep the vision</li>
                <li className="flex items-center gap-2"><span className="text-cyan">👑</span> Built for founders who want to dominate</li>
              </ul>
            </div>
            <div className="relative grid place-items-center rounded-2xl bg-gradient-to-br from-tide/60 to-purple/20 p-10">
              <QBot size={140} className="animate-float" />
              <div className="mt-4 text-center">
                <div className="font-display text-lg font-bold text-gradient-gold">Q-Bot</div>
                <div className="text-xs text-mist">Your AI automation companion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t hairline py-8 text-center text-xs text-mist">
        <div className="flex items-center justify-center gap-2">
          <QBot size={22} crown={false} /> Q-Empire Automation Division · Intelligent Automation. Limitless Possibilities.
        </div>
      </footer>
    </div>
  );
}
