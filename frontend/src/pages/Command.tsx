import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Terminal, Grid3x3, FileText, RotateCcw, Check, ChevronLeft, Circle,
  Sparkles, PlugZap, AlertTriangle, X,
} from "lucide-react";
import QBot from "../components/QBot";
import { DIVISIONS, AGENT_VERSIONS } from "../data/swarm";
import { useAccount } from "../lib/account";
import { startBuild, getBuild, API_BASE, type BuildState } from "../lib/api";

type Tab = "computer" | "swarm" | "files";
type Status = "connecting" | "running" | "completed" | "failed" | "offline" | "nocredits";

const accentDot: Record<string, string> = {
  cyan: "bg-cyan", purple: "bg-purple", magenta: "bg-magenta", gold: "bg-gold", blue: "bg-[#5b9bff]",
};

// Colorize the leading [TAG] on a raw event line.
function tagColor(line: string): string {
  if (line.includes("FAILED") || line.includes("failed") || line.includes("ERROR")) return "text-magenta";
  if (line.startsWith("[Q-BOT]")) return "text-cyan";
  if (line.startsWith("[PLANNER]")) return "text-purple";
  if (line.startsWith("[VERIFIER]")) return "text-gold";
  if (line.startsWith("[MICHELLE]")) return "text-[#5b9bff]";
  return "text-ink/90";
}

export default function Command() {
  const [, navigate] = useLocation();
  const task =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("q") || "Build my business blueprint, brand and website."
      : "Build my business.";

  const { account, update, spend } = useAccount();
  const version = AGENT_VERSIONS.find((v) => v.id === account.version) || AGENT_VERSIONS[1];
  const [status, setStatus] = useState<Status>("connecting");
  const [build, setBuild] = useState<BuildState | null>(null);
  const [tab, setTab] = useState<Tab>("computer");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const logRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const begin = useCallback(async () => {
    stopPolling();
    setBuild(null);
    setErrorMsg("");
    // Credits are spent per run, based on the chosen Q-Bot version.
    if (!spend(version.cost)) {
      setStatus("nocredits");
      return;
    }
    setStatus("connecting");
    try {
      const id = await startBuild("BUILD_BLUEPRINT", {
        business_name: task.replace(/^Build\s+/i, "").slice(0, 80),
        description: task,
        industry: "",
        target_audience: "",
        elevator_pitch: task,
        client_email: "",
        version: version.id,
        api_key: account.apiKey || undefined,
      });
      setStatus("running");
      pollRef.current = window.setInterval(async () => {
        try {
          const state = await getBuild(id);
          setBuild(state);
          if (state.status === "completed" || state.status === "failed") {
            setStatus(state.status);
            stopPolling();
          }
        } catch {
          /* transient poll error — keep trying */
        }
      }, 1200);
    } catch (e) {
      setStatus("offline");
      setErrorMsg(e instanceof Error ? e.message : "Could not reach the engine.");
    }
  }, [task, spend, version.cost, version.id, account.apiKey]);

  useEffect(() => {
    void begin();
    return stopPolling;
  }, [begin]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [build?.events?.length]);

  const events = build?.events ?? [];
  const plan = build?.plan ?? [];
  const done = status === "completed" || status === "failed";
  const completedSteps = plan.filter((s) => s.status === "completed").length;
  const progress = plan.length ? Math.round((completedSteps / plan.length) * 100) : status === "completed" ? 100 : 8;

  const statusLabel =
    status === "connecting" ? "Connecting…" :
    status === "running" ? "Working…" :
    status === "completed" ? "Task complete" :
    status === "failed" ? "Needs attention" :
    status === "nocredits" ? "Out of credits" : "Engine offline";

  return (
    <div className="flex h-screen flex-col">
      {/* top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b hairline bg-abyss/70 px-4 backdrop-blur-xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-mist hover:text-ink">
          <ChevronLeft size={16} /> <QBot size={26} /> <span className="hidden sm:inline">Q-Bot's Computer</span>
        </button>
        <div className="flex items-center gap-2">
          {/* Q-Bot version picker */}
          <select
            value={account.version}
            onChange={(e) => update({ version: e.target.value as "lite" | "standard" | "pro" })}
            className="hidden rounded-full glass px-3 py-1.5 text-xs text-ink focus:outline-none sm:block"
            title="Q-Bot version"
          >
            {AGENT_VERSIONS.map((v) => (
              <option key={v.id} value={v.id} className="bg-abyss">{v.name} · {v.cost}cr</option>
            ))}
          </select>
          <button onClick={() => navigate("/account")} className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-ink" title="Credits">
            <span className="text-gold">⚡</span> {account.credits.toLocaleString()}
          </button>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${status === "completed" ? "bg-cyan/15 text-cyan" : status === "offline" || status === "failed" || status === "nocredits" ? "bg-magenta/15 text-magenta" : "glass text-ink"}`}>
            <span className={`h-2 w-2 rounded-full ${status === "completed" ? "bg-cyan" : status === "offline" || status === "failed" || status === "nocredits" ? "bg-magenta" : "bg-gold animate-pulse-ring"}`} />
            {statusLabel}
          </span>
          <button onClick={() => navigate("/client-portal")} className="hidden rounded-full btn-brand px-4 py-1.5 text-xs font-semibold text-white sm:block">
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
                {status === "offline"
                  ? "I can't reach my engine yet — start the Q-Empire API and I'll begin."
                  : "On it. I'm planning the work and executing it step by step. Watch the panel →"}
              </div>
            </div>

            {/* real plan checklist */}
            {plan.length > 0 && (
              <div className="ml-11 space-y-1.5">
                {plan.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-xl glass px-3 py-2 text-sm">
                    {s.status === "completed" ? (
                      <Check size={15} className="text-cyan" />
                    ) : s.status === "failed" ? (
                      <X size={15} className="text-magenta" />
                    ) : s.status === "in_progress" ? (
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                    ) : (
                      <Circle size={13} className="text-mist/50" />
                    )}
                    <span className={s.status === "completed" ? "text-ink/70" : s.status === "in_progress" ? "text-ink" : "text-mist"}>
                      {s.description || s.action}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {status === "completed" && (
              <div className="flex items-end gap-2.5">
                <QBot size={34} className="shrink-0" />
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm glass glow-cyan px-4 py-3 text-sm text-ink">
                  Done 👑 The build finished. Deliverables are in the Files tab and your portal.
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t hairline p-3">
            <div className="flex items-center gap-2 rounded-xl glass px-3 py-2 text-xs text-mist">
              <Sparkles size={13} className="text-cyan" />
              {status === "running" ? "Q-Bot is executing your plan…"
                : status === "completed" ? "Build complete."
                : status === "connecting" ? "Reaching the engine…"
                : "Engine offline."}
            </div>
          </div>
        </div>

        {/* right: computer panel */}
        <div className="flex min-h-0 flex-col bg-black/20">
          <div className="flex items-center gap-2 border-b hairline px-3 py-2">
            <div className="flex gap-1.5 pl-1 pr-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex gap-1">
              <TabBtn active={tab === "computer"} onClick={() => setTab("computer")} icon={<Terminal size={14} />} label="Computer" />
              <TabBtn active={tab === "swarm"} onClick={() => setTab("swarm")} icon={<Grid3x3 size={14} />} label="Swarm" />
              <TabBtn active={tab === "files"} onClick={() => setTab("files")} icon={<FileText size={14} />} label="Files" />
            </div>
          </div>

          <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto p-4">
            {/* out of credits */}
            {status === "nocredits" && (
              <div className="mx-auto mt-10 max-w-md rounded-2xl glass-strong p-6 text-center">
                <span className="text-3xl">⚡</span>
                <h3 className="mt-2 font-display text-lg font-bold">Out of credits</h3>
                <p className="mt-2 text-sm text-mist">
                  {version.name} costs {version.cost} credits per run. You have {account.credits.toLocaleString()}.
                  Credits refill to 500 free every day, or upgrade your plan for more.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={() => navigate("/account")} className="rounded-full btn-brand px-4 py-2 text-xs font-semibold text-white">Manage credits</button>
                  <button onClick={() => update({ version: "lite" })} className="rounded-full glass px-4 py-2 text-xs font-semibold text-ink">Use Q-Bot Lite (1cr)</button>
                </div>
              </div>
            )}

            {/* offline state — honest, actionable, no fake output */}
            {status === "offline" && (
              <div className="mx-auto mt-10 max-w-md rounded-2xl glass-strong p-6 text-center">
                <PlugZap size={26} className="mx-auto text-gold" />
                <h3 className="mt-3 font-display text-lg font-bold">Q-Bot's engine isn't running</h3>
                <p className="mt-2 text-sm text-mist">
                  This workspace runs real builds against the Q-Empire API — nothing here is faked.
                  Start the backend, then reconnect.
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-3 text-left text-[11px] text-cyan">docker compose up  ·  or  ·  uvicorn bridge.webhook_receiver:app --port 8080</pre>
                <p className="mt-2 text-[11px] text-mist/70">Expected at <code className="text-ink/80">{API_BASE}</code>{errorMsg ? ` — ${errorMsg}` : ""}</p>
                <button onClick={() => void begin()} className="mt-4 inline-flex items-center gap-1.5 rounded-full btn-brand px-4 py-2 text-xs font-semibold text-white">
                  <RotateCcw size={13} /> Reconnect
                </button>
              </div>
            )}

            {tab === "computer" && status !== "offline" && status !== "nocredits" && (
              <div className="font-mono text-[12.5px] leading-relaxed">
                <div className="text-mist/60">q-empire@swarm ~ % run --task "{task.slice(0, 48)}{task.length > 48 ? "…" : ""}"</div>
                {events.map((e, i) => (
                  <div key={i} className={`mt-1 ${tagColor(e)}`}>{e}</div>
                ))}
                {status === "connecting" && <div className="mt-1 text-gold">connecting to engine…</div>}
                {status === "running" && <div className="mt-1 text-gold">▌<span className="animate-blink">_</span></div>}
                {status === "completed" && <div className="mt-2 text-cyan">✓ build finished.</div>}
                {status === "failed" && (
                  <div className="mt-2 flex items-center gap-1.5 text-magenta"><AlertTriangle size={13} /> build needs attention — see log above.</div>
                )}
              </div>
            )}

            {tab === "swarm" && status !== "offline" && status !== "nocredits" && (
              <div className="space-y-4">
                <p className="text-xs text-mist">The 50-agent workforce Q-Bot can dispatch across your build.</p>
                {DIVISIONS.map((d) => (
                  <div key={d.id}>
                    <div className="mb-1.5 text-[11px] uppercase tracking-widest text-mist">{d.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {d.agents.map((a) => (
                        <span key={a.id} title={a.connectors.join(", ")} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-ink/75">
                          <span className={`h-1.5 w-1.5 rounded-full ${accentDot[d.accent]}`} />
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "files" && status !== "offline" && status !== "nocredits" && (
              <div>
                {status !== "completed" && <div className="text-sm text-mist">Deliverables appear here once the build completes.</div>}
                {status === "completed" && (
                  <div className="rounded-xl glass p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Check size={15} className="text-cyan" /> Build result</div>
                    <pre className="mt-2 max-h-[50vh] overflow-auto whitespace-pre-wrap break-words text-[12px] text-mist">
                      {build?.result ? JSON.stringify(build.result, null, 2) : "Completed. Check your Client Portal for downloads."}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* progress bar */}
          <div className="shrink-0 border-t hairline px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => void begin()} className="grid h-8 w-8 place-items-center rounded-full btn-brand text-white" title="Restart build">
                <RotateCcw size={15} />
              </button>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan via-purple to-magenta transition-all duration-500 ${status === "running" && !plan.length ? "animate-pulse" : ""}`} style={{ width: `${progress}%` }} />
              </div>
              <span className="w-28 text-right text-[11px] tabular-nums text-mist">
                {plan.length ? `${completedSteps}/${plan.length} steps` : done ? "done" : "planning…"}
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
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${active ? "bg-white/10 text-ink" : "text-mist hover:text-ink"}`}>
      {icon} {label}
    </button>
  );
}
