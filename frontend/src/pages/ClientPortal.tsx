import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, FileText, Globe, Workflow, Landmark, LifeBuoy, ExternalLink, Check, Crown,
} from "lucide-react";
import QBot from "../components/QBot";

const deliverables = [
  { name: "Business Blueprint", progress: 100, status: "Complete", icon: FileText },
  { name: "Digital Buildout", progress: 85, status: "Building website…", icon: Globe },
  { name: "AI Automations", progress: 60, status: "Configuring 3/5 automations", icon: Workflow },
  { name: "Funding Strategy", progress: 40, status: "Researching grants…", icon: Landmark },
];

const activity = [
  { time: "2 min ago", action: "Business plan PDF generated", done: true },
  { time: "5 min ago", action: "Market research completed", done: true },
  { time: "8 min ago", action: "Pitch deck created (12 slides)", done: true },
  { time: "Now", action: "Generating website homepage…", done: false },
];

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "blueprint", label: "Blueprint", icon: FileText },
  { id: "website", label: "Website", icon: Globe },
  { id: "automations", label: "Automations", icon: Workflow },
  { id: "funding", label: "Funding", icon: Landmark },
  { id: "support", label: "Support", icon: LifeBuoy },
];

export default function ClientPortal() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState("overview");
  const overall = Math.round(deliverables.reduce((s, d) => s + d.progress, 0) / deliverables.length);

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r hairline bg-abyss/60 p-5 md:flex">
        <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-2.5">
          <QBot size={34} />
          <div className="leading-tight">
            <div className="font-display text-sm font-bold text-gradient-gold">Q-EMPIRE</div>
            <div className="text-[9px] tracking-[0.25em] text-cyan/80">CLIENT PORTAL</div>
          </div>
        </button>
        <nav className="space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                  tab === n.id ? "bg-cyan/10 text-cyan glow-cyan" : "text-mist hover:bg-white/5 hover:text-ink"
                }`}
              >
                <Icon size={16} /> {n.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl glass p-4 text-center">
          <Crown size={18} className="mx-auto text-gold" />
          <div className="mt-1 text-xs text-mist">Empire Builder Pro</div>
          <button onClick={() => navigate("/command")} className="mt-3 w-full rounded-lg btn-brand py-1.5 text-xs font-semibold text-white">
            Watch it build
          </button>
        </div>
      </aside>

      {/* main */}
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <QBot size={44} className="animate-float" />
            <div>
              <h1 className="font-display text-2xl font-bold">Welcome back 👑</h1>
              <p className="text-sm text-mist">Michelle &amp; Q-Bot are building your empire — {overall}% done.</p>
            </div>
          </div>

          {/* overall bar */}
          <div className="mt-6 rounded-2xl glass p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-mist">
              <span>Overall progress</span>
              <span className="text-cyan">{overall}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan via-purple to-magenta transition-all duration-1000" style={{ width: `${overall}%` }} />
            </div>
          </div>

          {/* deliverable cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {deliverables.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.name} className="rounded-2xl glass p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 text-cyan">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{d.name}</h3>
                        <p className="text-xs text-mist">{d.status}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${d.progress === 100 ? "text-cyan" : "text-gold"}`}>{d.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan to-purple transition-all duration-1000" style={{ width: `${d.progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* recent activity */}
          <h2 className="mb-3 mt-8 text-sm font-semibold text-ink">Recent activity</h2>
          <div className="space-y-2">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl glass px-4 py-3">
                {a.done ? (
                  <Check size={15} className="text-cyan" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse-ring" />
                )}
                <span className="flex-1 text-sm text-ink/90">{a.action}</span>
                <span className="text-xs text-mist">{a.time}</span>
              </div>
            ))}
          </div>

          {tab === "website" && (
            <div className="mt-8 rounded-2xl glass p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Your live site</h3>
                <a href="#" className="inline-flex items-center gap-1 text-xs text-cyan hover:underline">
                  Visit <ExternalLink size={12} />
                </a>
              </div>
              <p className="mt-1 text-xs text-mist">yoursite.qempire.app — deploying now.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
