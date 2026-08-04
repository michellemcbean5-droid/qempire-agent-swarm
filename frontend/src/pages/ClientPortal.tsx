import { useState, useEffect, useCallback } from "react";
import { useRoute } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { getTaskStatus, type TaskStatus } from "../lib/api";
import { AUTOMATION_MODULES } from "../lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DeliverableProgress {
  label: string;
  icon: string;
  progress: number;
  status: string;
  taskType: string;
}

// ─── Helper: map task results to progress ─────────────────────────────────────

function deriveProgress(taskStatuses: TaskStatus[]): DeliverableProgress[] {
  const map: Record<string, DeliverableProgress> = {
    BUILD_BLUEPRINT: { label: "Business Blueprint", icon: "📋", progress: 0, status: "Waiting...", taskType: "BUILD_BLUEPRINT" },
    BUILD_WEBSITE: { label: "Digital Buildout", icon: "🌐", progress: 0, status: "Waiting...", taskType: "BUILD_WEBSITE" },
    SETUP_AUTOMATIONS: { label: "AI Automations", icon: "🤖", progress: 0, status: "Waiting...", taskType: "SETUP_AUTOMATIONS" },
    RESEARCH_FUNDING: { label: "Funding Strategy", icon: "💰", progress: 0, status: "Waiting...", taskType: "RESEARCH_FUNDING" },
    GENERATE_BRANDING: { label: "Brand Kit", icon: "🎨", progress: 0, status: "Waiting...", taskType: "GENERATE_BRANDING" },
    BUILD_PITCH_DECK: { label: "Pitch Deck", icon: "📊", progress: 0, status: "Waiting...", taskType: "BUILD_PITCH_DECK" },
  };

  for (const ts of taskStatuses) {
    const taskType = (ts as any).type as string | undefined;
    if (taskType && map[taskType]) {
      if (ts.status === "completed") {
        map[taskType].progress = 100;
        map[taskType].status = "Complete ✓";
      } else if (ts.status === "in_progress" || ts.status === "pending") {
        map[taskType].progress = ts.status === "in_progress" ? 60 : 10;
        map[taskType].status = ts.status === "in_progress" ? "In progress..." : "Queued";
      } else if (ts.status === "failed" || ts.status === "needs_clarification") {
        map[taskType].progress = 0;
        map[taskType].status = "Needs attention";
      }
    }
  }

  return Object.values(map).filter((d) =>
    taskStatuses.some((ts) => (ts as any).type === d.taskType)
  );
}

function getDeliverableUrl(taskStatuses: TaskStatus[], taskType: string): string | null {
  const ts = taskStatuses.find((t) => (t as any).type === taskType);
  if (!ts?.result?.deliverables) return null;
  const entries = Object.values(ts.result.deliverables);
  const urlEntry = entries.find((e) => e.type === "url");
  return urlEntry?.value || null;
}

function getEventLog(taskStatuses: TaskStatus[]): Array<{ time: string; action: string; status: string }> {
  const events: Array<{ time: string; action: string; status: string }> = [];
  for (const ts of taskStatuses) {
    if (ts.result?.event_log) {
      for (const log of ts.result.event_log.slice(-5)) {
        events.push({ time: "Recently", action: log, status: ts.status === "completed" ? "done" : "active" });
      }
    }
  }
  return events.slice(0, 8);
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function OverviewView({ taskStatuses, businessName, packageName }: { taskStatuses: TaskStatus[]; businessName: string; packageName: string }) {
  const deliverables = deriveProgress(taskStatuses);
  const activity = getEventLog(taskStatuses);

  const fallbackDeliverables: DeliverableProgress[] = [
    { label: "Business Blueprint", icon: "📋", progress: 100, status: "Complete ✓", taskType: "BUILD_BLUEPRINT" },
    { label: "Digital Buildout", icon: "🌐", progress: 85, status: "Building website...", taskType: "BUILD_WEBSITE" },
    { label: "AI Automations", icon: "🤖", progress: 60, status: "Configuring automations", taskType: "SETUP_AUTOMATIONS" },
    { label: "Funding Strategy", icon: "💰", progress: 40, status: "Researching grants...", taskType: "RESEARCH_FUNDING" },
  ];

  const shown = deliverables.length > 0 ? deliverables : fallbackDeliverables;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back{businessName ? `, ${businessName}` : ""}! 🧜🏾‍♀️</h1>
      <p className="text-white/60 mb-2">Michelle & Q-Bot are building your empire.</p>
      {packageName && <span className="inline-block bg-[#4169E1]/10 border border-[#4169E1]/30 rounded-full px-3 py-1 text-xs text-[#00FFFF] mb-6">{packageName}</span>}

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {shown.map((d) => (
          <div key={d.label} className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <h3 className="font-bold">{d.label}</h3>
                  <p className="text-xs text-white/50">{d.status}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${d.progress === 100 ? "text-[#00C853]" : "text-[#00FFFF]"}`}>{d.progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#0A0A1A] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] rounded-full transition-all duration-1000" style={{ width: `${d.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      {activity.length === 0 ? (
        <div className="space-y-3">
          {[
            { time: "2 min ago", action: "Business plan PDF generated", status: "done" },
            { time: "5 min ago", action: "Market research completed", status: "done" },
            { time: "8 min ago", action: "Pitch deck created (12 slides)", status: "done" },
            { time: "Now", action: "Generating website HTML...", status: "active" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#1a1a2e]/30 border border-[#4169E1]/10 rounded-lg px-4 py-3">
              <div className={`w-2 h-2 rounded-full ${a.status === "active" ? "bg-[#00FFFF] animate-pulse" : "bg-[#00C853]"}`} />
              <span className="text-sm flex-1">{a.action}</span>
              <span className="text-xs text-white/40">{a.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#1a1a2e]/30 border border-[#4169E1]/10 rounded-lg px-4 py-3">
              <div className={`w-2 h-2 rounded-full ${a.status === "active" ? "bg-[#00FFFF] animate-pulse" : "bg-[#00C853]"}`} />
              <span className="text-sm flex-1">{a.action}</span>
              <span className="text-xs text-white/40">{a.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlueprintView({ taskStatuses }: { taskStatuses: TaskStatus[] }) {
  const blueprintStatus = taskStatuses.find((t) => (t as any).type === "BUILD_BLUEPRINT");
  const pitchStatus = taskStatuses.find((t) => (t as any).type === "BUILD_PITCH_DECK");
  const bpUrl = getDeliverableUrl(taskStatuses, "BUILD_BLUEPRINT");
  const ptUrl = getDeliverableUrl(taskStatuses, "BUILD_PITCH_DECK");

  const docs = [
    { label: "Business Plan", desc: "Full 10-page business plan with market analysis", url: bpUrl, status: blueprintStatus?.status, icon: "📋" },
    { label: "Pitch Deck", desc: "12-slide investor pitch deck", url: ptUrl, status: pitchStatus?.status, icon: "📊" },
    { label: "Market Research", desc: "Competitor analysis and industry trends", url: bpUrl, status: blueprintStatus?.status, icon: "🔍" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Business Blueprint</h2>
      <div className="grid gap-4">
        {docs.map((doc) => (
          <div key={doc.label} className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{doc.icon}</span>
              <div>
                <h3 className="font-bold">{doc.label}</h3>
                <p className="text-sm text-white/50">{doc.desc}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${doc.status === "completed" ? "bg-[#00C853]/10 text-[#00C853]" : "bg-[#4169E1]/10 text-[#00FFFF]"}`}>
                  {doc.status === "completed" ? "Ready" : doc.status === "pending" ? "Queued" : "Building..."}
                </span>
              </div>
            </div>
            {doc.url ? (
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap">
                Download ↗
              </a>
            ) : (
              <button disabled className="bg-[#1a1a2e] border border-[#4169E1]/20 text-white/30 text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap cursor-not-allowed">
                Not ready
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WebsiteView({ taskStatuses }: { taskStatuses: TaskStatus[] }) {
  const websiteUrl = getDeliverableUrl(taskStatuses, "BUILD_WEBSITE");
  const websiteStatus = taskStatuses.find((t) => (t as any).type === "BUILD_WEBSITE");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Digital Buildout</h2>
      {websiteUrl ? (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold px-6 py-3 rounded-lg">
              Visit Live Site ↗
            </a>
            <button className="border border-[#4169E1]/30 text-white/70 font-bold px-4 py-3 rounded-lg text-sm">
              Request Changes
            </button>
          </div>
          <div className="bg-[#0A0A1A] border border-[#4169E1]/20 rounded-xl overflow-hidden">
            <div className="bg-[#1a1a2e] px-4 py-2 flex items-center gap-2 border-b border-[#4169E1]/20">
              <span className="w-3 h-3 rounded-full bg-[#FF007F]" />
              <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
              <span className="w-3 h-3 rounded-full bg-[#00C853]" />
              <span className="text-xs text-white/40 ml-2">{websiteUrl}</span>
            </div>
            <iframe src={websiteUrl} title="Generated Website" className="w-full h-96 border-0" />
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4 animate-pulse">🌐</div>
          <h3 className="text-xl font-bold mb-2">
            {websiteStatus?.status === "in_progress" ? "Q-Bot is building your website..." : "Website not started yet"}
          </h3>
          <p className="text-white/50 text-sm">Your live site will appear here once Q-Bot finishes building it.</p>
        </div>
      )}
    </div>
  );
}

function AutomationsView({ taskStatuses, selectedAutomations }: { taskStatuses: TaskStatus[]; selectedAutomations: string[] }) {
  const automationsStatus = taskStatuses.find((t) => (t as any).type === "SETUP_AUTOMATIONS");
  const isComplete = automationsStatus?.status === "completed";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">AI Automations</h2>
      <div className="grid gap-3">
        {AUTOMATION_MODULES.map((mod) => {
          const isSelected = selectedAutomations.includes(mod.id);
          const isActive = isSelected && isComplete;
          const isPending = isSelected && !isComplete;
          return (
            <div key={mod.id} className={`bg-[#1a1a2e]/50 border rounded-xl p-4 flex items-center justify-between ${isActive ? "border-[#00C853]/30" : isSelected ? "border-[#4169E1]/30" : "border-[#4169E1]/10 opacity-50"}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mod.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{mod.name}</div>
                  <div className="text-xs text-white/50">{mod.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isActive && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#00C853]" />
                    <span className="text-xs text-[#00C853] font-bold">Active</span>
                  </>
                )}
                {isPending && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span className="text-xs text-[#D4AF37] font-bold">Pending</span>
                  </>
                )}
                {!isSelected && (
                  <span className="text-xs text-white/30">Not included</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-[#1a1a2e]/30 border border-[#BF00FF]/20 rounded-xl p-4 text-center">
        <p className="text-sm text-white/60 mb-2">Need more automations?</p>
        <button className="bg-gradient-to-r from-[#BF00FF] to-[#4169E1] text-white text-sm font-bold px-4 py-2 rounded-lg">
          Add Pay-As-You-Go Modules
        </button>
      </div>
    </div>
  );
}

function FundingView({ taskStatuses }: { taskStatuses: TaskStatus[] }) {
  const fundingStatus = taskStatuses.find((t) => (t as any).type === "RESEARCH_FUNDING");
  const fundingUrl = getDeliverableUrl(taskStatuses, "RESEARCH_FUNDING");

  const demoGrants = [
    { name: "SBA 7(a) Loan Program", amount: "Up to $5M", deadline: "Rolling", status: "Not Started", type: "Loan" },
    { name: "SBIR Phase I Grant", amount: "$50K–$275K", deadline: "Oct 15, 2026", status: "Not Started", type: "Grant" },
    { name: "Minority Business Dev Agency Grant", amount: "Up to $350K", deadline: "Sep 30, 2026", status: "Not Started", type: "Grant" },
    { name: "Black Business Boost Fund", amount: "$10K–$100K", deadline: "Dec 1, 2026", status: "Not Started", type: "Grant" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Funding Strategy</h2>
      {fundingUrl && (
        <a href={fundingUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold px-4 py-2 rounded-lg text-sm mb-6">
          Download Full Funding Roadmap ↗
        </a>
      )}
      <div className="space-y-3">
        {demoGrants.map((grant) => (
          <div key={grant.name} className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${grant.type === "Grant" ? "bg-[#00C853]/10 text-[#00C853]" : "bg-[#4169E1]/10 text-[#00FFFF]"}`}>{grant.type}</span>
                  <h3 className="font-bold text-sm">{grant.name}</h3>
                </div>
                <div className="text-xs text-white/50">Amount: <span className="text-[#D4AF37]">{grant.amount}</span> · Deadline: {grant.deadline}</div>
              </div>
              <select className="bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-2 py-1 text-white text-xs focus:outline-none">
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Submitted</option>
                <option>Approved</option>
                <option>Denied</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      {!fundingStatus || fundingStatus.status === "pending" ? (
        <div className="mt-6 bg-[#1a1a2e]/30 border border-[#4169E1]/10 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2 animate-pulse">💰</div>
          <p className="text-white/50 text-sm">Q-Bot is researching funding opportunities specific to your industry. Grant list will update when complete.</p>
        </div>
      ) : null}
    </div>
  );
}

function SupportView() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "bot", text: "Hi! I'm Q-Bot 🤖. How can I help you with your empire today?" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage("");
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Michelle and I are working on that! For urgent issues, use the 'Schedule a Call' button below or email support@qempireai.com. 🧜🏾‍♀️",
        },
      ]);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Q-Bot Support</h2>
      <div className="bg-[#0A0A1A] border border-[#4169E1]/20 rounded-xl overflow-hidden mb-4">
        <div className="p-4 h-72 overflow-y-auto space-y-3">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs text-sm px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white" : "bg-[#1a1a2e] border border-[#4169E1]/20 text-white/80"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#4169E1]/20 p-3 flex gap-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 bg-[#1a1a2e] border border-[#4169E1]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Ask Q-Bot anything..." />
          <button onClick={sendMessage} className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white text-sm font-bold px-4 py-2 rounded-lg">Send</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a href="https://calendly.com/qempireai" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-xl p-4 text-center hover:border-[#4169E1]/50 transition-colors">
          <div className="text-2xl mb-1">📅</div>
          <div className="font-bold text-sm">Schedule a Call</div>
          <div className="text-xs text-white/40">Calendly</div>
        </a>
        <a href="mailto:support@qempireai.com" className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-xl p-4 text-center hover:border-[#4169E1]/50 transition-colors">
          <div className="text-2xl mb-1">📧</div>
          <div className="font-bold text-sm">Email Support</div>
          <div className="text-xs text-white/40">support@qempireai.com</div>
        </a>
      </div>
    </div>
  );
}

// ─── Main ClientPortal ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "blueprint", label: "Blueprint", icon: "📋" },
  { id: "website", label: "Website", icon: "🌐" },
  { id: "automations", label: "Automations", icon: "🤖" },
  { id: "funding", label: "Funding", icon: "💰" },
  { id: "support", label: "Support", icon: "💬" },
] as const;

type NavId = typeof NAV_ITEMS[number]["id"];

export default function ClientPortal() {
  const [, params] = useRoute("/client-portal/:view");
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<NavId>((params?.view as NavId) || "overview");
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [lastPolled, setLastPolled] = useState<Date | null>(null);

  const pollTasks = useCallback(async () => {
    if (!session?.taskIds?.length) return;
    try {
      const results = await Promise.all(
        session.taskIds.map((id) => getTaskStatus(id))
      );
      setTaskStatuses(results);
      setLastPolled(new Date());
    } catch {
      // Backend offline — keep existing data
    }
  }, [session?.taskIds]);

  useEffect(() => {
    pollTasks();
    const interval = setInterval(pollTasks, 30_000); // poll every 30s
    return () => clearInterval(interval);
  }, [pollTasks]);

  const packageName = session?.packageId
    ? { foundation: "Foundation Launchpad", "empire-pro": "Empire Builder Pro", enterprise: "Enterprise AI", payg: "Pay-As-You-Go" }[session.packageId] || ""
    : "";

  // Infer selected automations from session (if stored)
  const selectedAutomations: string[] = [];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0f] border-r border-[#4169E1]/20 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-2xl">🧜🏾‍♀️</div>
          <span className="font-bold text-sm">Client Portal</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${activeTab === id ? "bg-[#4169E1]/10 text-[#00FFFF] font-bold" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        {lastPolled && (
          <div className="text-xs text-white/20 mt-4">
            Last updated: {lastPolled.toLocaleTimeString()}
          </div>
        )}
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f] border-t border-[#4169E1]/20 flex z-50">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${activeTab === id ? "text-[#00FFFF]" : "text-white/40"}`}>
            <span className="text-base">{icon}</span>
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === "overview" && (
            <OverviewView taskStatuses={taskStatuses} businessName={session?.businessName || ""} packageName={packageName} />
          )}
          {activeTab === "blueprint" && <BlueprintView taskStatuses={taskStatuses} />}
          {activeTab === "website" && <WebsiteView taskStatuses={taskStatuses} />}
          {activeTab === "automations" && <AutomationsView taskStatuses={taskStatuses} selectedAutomations={selectedAutomations} />}
          {activeTab === "funding" && <FundingView taskStatuses={taskStatuses} />}
          {activeTab === "support" && <SupportView />}
        </div>
      </main>
    </div>
  );
}
