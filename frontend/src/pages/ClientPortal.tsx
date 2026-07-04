import { useState } from "react";

const deliverables = [
  { name: "Business Blueprint", progress: 100, status: "Complete", icon: "📋" },
  { name: "Digital Buildout", progress: 85, status: "Building website...", icon: "🌐" },
  { name: "AI Automations", progress: 60, status: "Configuring 3/5 automations", icon: "🤖" },
  { name: "Funding Strategy", progress: 40, status: "Researching grants...", icon: "💰" },
];

const activity = [
  { time: "2 min ago", action: "Business plan PDF generated", status: "done" },
  { time: "5 min ago", action: "Market research completed", status: "done" },
  { time: "8 min ago", action: "Pitch deck created (12 slides)", status: "done" },
  { time: "Now", action: "Generating website HTML...", status: "active" },
];

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0f] border-r border-[#4169E1]/20 p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#BF00FF] flex items-center justify-center font-black text-sm">Q</div>
          <span className="font-bold text-sm">Client Portal</span>
        </div>
        <nav className="space-y-2">
          {["overview", "blueprint", "website", "automations", "funding"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize transition-colors ${activeTab === tab ? "bg-[#4169E1]/10 text-[#00FFFF] font-bold" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-white/60 mb-8">Your empire is being built. Here's the progress:</p>

          {/* Progress Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {deliverables.map((d) => (
              <div key={d.name} className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <h3 className="font-bold">{d.name}</h3>
                      <p className="text-xs text-white/50">{d.status}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${d.progress === 100 ? "text-[#00C853]" : "text-[#00FFFF]"}`}>
                    {d.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#0A0A1A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] rounded-full transition-all duration-1000" style={{ width: `${d.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 bg-[#1a1a2e]/30 border border-[#4169E1]/10 rounded-lg px-4 py-3">
                <div className={`w-2 h-2 rounded-full ${a.status === "active" ? "bg-[#00FFFF] animate-pulse" : "bg-[#00C853]"}`} />
                <span className="text-sm flex-1">{a.action}</span>
                <span className="text-xs text-white/40">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
