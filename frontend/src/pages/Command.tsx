import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Terminal, Globe, Grid3x3, FileText, Play, Pause, RotateCcw, Check, ChevronLeft,
  Circle, Sparkles,
} from "lucide-react";
import QBot from "../components/QBot";
import { DIVISIONS } from "../data/swarm";

type Tab = "computer" | "website" | "swarm" | "files";

interface RunEvent {
  phase: string;
  agent: string;
  connector: string;
  text: string;
  tab?: Tab;
  file?: { name: string; kind: string };
}

const PHASES = ["Research", "Brand & Website", "Automations", "Funding", "Launch"];

const EVENTS: RunEvent[] = [
  { phase: "Research", agent: "Competitor Spy", connector: "Semrush", text: "Scraped 12 competitors in the niche. Found pricing gaps." },
  { phase: "Research", agent: "Prospector", connector: "Explorium", text: "Pulled 500 target contacts matching the ideal customer." },
  { phase: "Research", agent: "Blueprint Builder", connector: "Kimi", text: "Drafted market research + positioning.", tab: "files", file: { name: "Market_Research.pdf", kind: "Doc" } },
  { phase: "Brand & Website", agent: "Blueprint Builder", connector: "OpenRouter", text: "Generated business plan & 12-slide pitch deck.", tab: "files", file: { name: "Business_Plan.pdf", kind: "Doc" } },
  { phase: "Brand & Website", agent: "Webflow Weaver", connector: "Canva", text: "Designed logo, palette and brand kit.", file: { name: "Brand_Kit.zip", kind: "Assets" } },
  { phase: "Brand & Website", agent: "Webflow Weaver", connector: "Webflow", text: "Building homepage, about & services…", tab: "website" },
  { phase: "Brand & Website", agent: "QA Enforcer", connector: "Playwright", text: "Tested site on mobile + desktop. All checks passed.", tab: "website", file: { name: "yoursite.qempire.app", kind: "Live site" } },
  { phase: "Automations", agent: "Workflow Engineer", connector: "Make", text: "Wired lead-capture chatbot to the CRM." },
  { phase: "Automations", agent: "Workflow Engineer", connector: "HubSpot", text: "Built 3-email welcome sequence + follow-ups." },
  { phase: "Automations", agent: "Cash Collector", connector: "Stripe", text: "Connected checkout + subscription billing.", tab: "files", file: { name: "Automations_Live.txt", kind: "Config" } },
  { phase: "Funding", agent: "Funding Activator", connector: "Parallel", text: "Found 7 matching grants. Auto-filled 3 applications.", tab: "files", file: { name: "Funding_Applications.pdf", kind: "Doc" } },
  { phase: "Launch", agent: "Social Poster", connector: "Buffer", text: "Scheduled 10 launch posts across platforms." },
  { phase: "Launch", agent: "Ad Sniper", connector: "TikTok Ads", text: "Launched targeted ad set. Pipeline is filling.", tab: "swarm" },
  { phase: "Launch", agent: "Delivery Courier", connector: "Dropbox", text: "Packaged everything. Your empire is live. 👑", tab: "files", file: { name: "Empire_Delivery.zip", kind: "Bundle" } },
];

const accentDot: Record<string, string> = {
  cyan: "bg-cyan", purple: "bg-purple", magenta: "bg-magenta", gold: "bg-gold", blue: "bg-[#5b9bff]",
};

export default function Command() {
  const [, navigate] = useLocation();
  const task =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("q") || "Build my entire business — brand, website, automations and funding."
      : "Build my business.";

  const [cursor, setCursor] = useState(0); // number of completed events
  const [running, setRunning] = useState(true);
  const [tab, setTab] = useState<Tab>("computer");
  const logRef = useRef<HTMLDivElement>(null);

  const done = cursor >= EVENTS.length;

  useEffect(() => {
    if (!running || done) return;
    const t = window.setTimeout(() => {
      const ev = EVENTS[cursor];
      if (ev?.tab) setTab(ev.tab);
      setCursor((c) => c + 1);
    }, cursor === 0 ? 700 : 1500);
    return () => window.clearTimeout(t);
  }, [running, cursor, done]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [cursor]);

  const shown = EVENTS.slice(0, cursor);
  const activeAgentName = !done && running ? EVENTS[cursor]?.agent : undefined;
  const files = shown.filter((e) => e.file).map((e) => e.file!);

  const phaseStatus = useMemo(() => {
    return PHASES.map((p) => {
      const evs = EVENTS.filter((e) => e.phase === p);
      const completed = shown.filter((e) => e.phase === p).length;
      const active = !done && EVENTS[cursor]?.phase === p;
      return { name: p, total: evs.length, completed, active, doneP: completed === evs.length };
    });
  }, [cursor, done, shown]);

  const progress = Math.round((cursor / EVENTS.length) * 100);

  const restart = () => {
    setCursor(0);
    setRunning(true);
    setTab("computer");
  };

  return (
    <div className="flex h-screen flex-col">
      {/* top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b hairline bg-abyss/70 px-4 backdrop-blur-xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-mist hover:text-ink">
          <ChevronLeft size={16} /> <QBot size={26} /> <span className="hidden sm:inline">Q-Bot's Computer</span>
        </button>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${done ? "bg-cyan/15 text-cyan" : "glass text-ink"}`}>
            <span className={`h-2 w-2 rounded-full ${done ? "bg-cyan" : "bg-gold animate-pulse-ring"}`} />
            {done ? "Task complete" : running ? "Working…" : "Paused"}
          </span>
          <button onClick={() => navigate("/client-portal")} className="rounded-full btn-brand px-4 py-1.5 text-xs font-semibold text-white">
            Open portal
          </button>
        </div>
      </div>

      {/* split view */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(320px,420px)_1fr]">
        {/* left: task thread */}
        <div className="flex min-h-0 flex-col border-r hairline">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            <div className="flex flex-row-reverse items-end gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs">You</div>
              <div className="max-w-[85%] rounded-2xl rounded-br-sm btn-brand px-4 py-2.5 text-sm text-white">{task}</div>
            </div>

            <div className="flex items-end gap-2.5">
              <QBot size={34} className="shrink-0" />
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm glass px-4 py-3 text-sm text-ink">
                On it. I'm dispatching the swarm across five phases. Watch it happen live →
              </div>
            </div>

            {/* plan checklist */}
            <div className="ml-11 space-y-1.5">
              {phaseStatus.map((p) => (
                <div key={p.name} className="flex items-center gap-2.5 rounded-xl glass px-3 py-2 text-sm">
                  {p.doneP ? (
                    <Check size={15} className="text-cyan" />
                  ) : p.active ? (
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                  ) : (
                    <Circle size={13} className="text-mist/50" />
                  )}
                  <span className={p.doneP ? "text-ink/70 line-through" : p.active ? "text-ink" : "text-mist"}>{p.name}</span>
                  <span className="ml-auto text-[11px] text-mist">{p.completed}/{p.total}</span>
                </div>
              ))}
            </div>

            {done && (
              <div className="flex items-end gap-2.5">
                <QBot size={34} className="shrink-0" />
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm glass glow-cyan px-4 py-3 text-sm text-ink">
                  Done 👑 Your business is built and automated. Everything's in the Files tab and your portal.
                </div>
              </div>
            )}
          </div>

          {/* live status line */}
          <div className="shrink-0 border-t hairline p-3">
            <div className="flex items-center gap-2 rounded-xl glass px-3 py-2 text-xs text-mist">
              <Sparkles size={13} className="text-cyan" />
              {done ? "All 50 agents idle. Empire running." : activeAgentName ? (
                <span><span className="text-ink">{activeAgentName}</span> is working…</span>
              ) : "Standing by…"}
            </div>
          </div>
        </div>

        {/* right: computer panel */}
        <div className="flex min-h-0 flex-col bg-black/20">
          {/* window chrome + tabs */}
          <div className="flex items-center gap-2 border-b hairline px-3 py-2">
            <div className="flex gap-1.5 pl-1 pr-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex gap-1">
              <TabBtn active={tab === "computer"} onClick={() => setTab("computer")} icon={<Terminal size={14} />} label="Computer" />
              <TabBtn active={tab === "website"} onClick={() => setTab("website")} icon={<Globe size={14} />} label="Website" />
              <TabBtn active={tab === "swarm"} onClick={() => setTab("swarm")} icon={<Grid3x3 size={14} />} label="Swarm" />
              <TabBtn active={tab === "files"} onClick={() => setTab("files")} icon={<FileText size={14} />} label={`Files${files.length ? ` · ${files.length}` : ""}`} />
            </div>
          </div>

          {/* tab body */}
          <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto p-4">
            {tab === "computer" && (
              <div className="font-mono text-[12.5px] leading-relaxed">
                <div className="text-mist/60">q-empire@swarm ~ % running war-machine --task "build-business"</div>
                {shown.map((e, i) => (
                  <div key={i} className="mt-1.5">
                    <span className="text-cyan">{e.agent}</span>
                    <span className="text-mist/50"> › {e.connector} › </span>
                    <span className="text-ink/90">{e.text}</span>
                  </div>
                ))}
                {!done && running && <div className="mt-1.5 text-gold">▌<span className="animate-blink">_</span></div>}
                {done && <div className="mt-2 text-cyan">✓ war-machine finished — 14 actions, 0 errors.</div>}
              </div>
            )}

            {tab === "website" && <WebsitePreview built={phaseStatus[1].doneP} building={phaseStatus[1].active} />}

            {tab === "swarm" && (
              <div className="space-y-4">
                {DIVISIONS.map((d) => (
                  <div key={d.id}>
                    <div className="mb-1.5 text-[11px] uppercase tracking-widest text-mist">{d.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {d.agents.map((a) => {
                        const active = a.name === activeAgentName;
                        const usedUp = shown.some((e) => e.agent === a.name);
                        return (
                          <span
                            key={a.id}
                            title={`${a.name} · ${a.connectors.join(", ")}`}
                            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition ${
                              active
                                ? "border-cyan/60 bg-cyan/15 text-white glow-cyan"
                                : usedUp
                                ? "border-white/10 bg-white/[0.04] text-ink/70"
                                : "border-white/5 bg-transparent text-mist/50"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-cyan animate-pulse" : accentDot[d.accent]}`} />
                            {a.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "files" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {files.length === 0 && <div className="text-sm text-mist">Deliverables will appear here as the swarm works…</div>}
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl glass px-3 py-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 text-cyan">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm text-ink">{f.name}</div>
                      <div className="text-[11px] text-mist">{f.kind}</div>
                    </div>
                    <Check size={15} className="ml-auto text-cyan" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* timeline scrubber */}
          <div className="shrink-0 border-t hairline px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={done ? restart : () => setRunning((r) => !r)} className="grid h-8 w-8 place-items-center rounded-full btn-brand text-white">
                {done ? <RotateCcw size={15} /> : running ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan via-purple to-magenta transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="w-24 text-right text-[11px] tabular-nums text-mist">
                step {Math.min(cursor, EVENTS.length)}/{EVENTS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
        active ? "bg-white/10 text-ink" : "text-mist hover:text-ink"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function WebsitePreview({ built, building }: { built: boolean; building: boolean }) {
  if (!built && !building) {
    return <div className="grid h-full place-items-center text-sm text-mist">The website preview appears once the build phase starts…</div>;
  }
  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-xl border hairline bg-abyss">
      <div className="flex items-center gap-1 border-b hairline px-3 py-1.5 text-[11px] text-mist">
        <Globe size={12} /> yoursite.qempire.app {building && <span className="ml-auto animate-blink text-gold">building…</span>}
      </div>
      <div className="bg-gradient-to-b from-tide/50 to-abyss p-6 text-center">
        <div className="mx-auto mb-3 h-8 w-8 rounded-lg bg-gradient-to-br from-cyan to-purple" />
        <div className="font-display text-lg font-bold text-gradient-gold">Your Brand</div>
        <div className="mx-auto mt-1 h-2 w-40 rounded bg-white/10" />
        <div className="mx-auto mt-1.5 h-2 w-28 rounded bg-white/10" />
        <div className="mx-auto mt-4 inline-block rounded-full btn-brand px-4 py-1.5 text-xs font-semibold text-white">Get Started</div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg glass p-3">
              <div className="mx-auto h-5 w-5 rounded bg-cyan/30" />
              <div className="mx-auto mt-2 h-1.5 w-full rounded bg-white/10" />
              <div className="mx-auto mt-1 h-1.5 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
