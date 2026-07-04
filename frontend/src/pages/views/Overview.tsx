import { motion } from "framer-motion";
import ProgressCircle from "../../components/ProgressCircle";
import { useAuth } from "../../contexts/AuthContext";
import { PACKAGES } from "../../lib/constants";

const deliverables = [
  { name: "Business Blueprint", progress: 100, status: "Complete", icon: "📋" },
  { name: "Digital Buildout", progress: 85, status: "Building website...", icon: "🌐" },
  { name: "AI Automations", progress: 60, status: "Configuring automations", icon: "🤖" },
  { name: "Funding Strategy", progress: 40, status: "Researching grants...", icon: "💰" },
];

const activity = [
  { time: "2 min ago", action: "Business plan PDF generated", status: "done" },
  { time: "5 min ago", action: "Market research completed", status: "done" },
  { time: "8 min ago", action: "Pitch deck created (12 slides)", status: "done" },
  { time: "Now", action: "Generating website HTML...", status: "active" },
];

export default function Overview() {
  const { session } = useAuth();
  const pkg = PACKAGES.find((p) => p.id === session?.packageId) || PACKAGES[2];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{session?.businessName ? `, ${session.businessName}` : ""}!
        </h1>
        <p className="text-white/60">
          Your <span className="text-[#00FFFF] font-bold">{pkg.name}</span> empire is being built. Here's the progress:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {deliverables.map((d, index) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 flex items-center gap-6"
          >
            <ProgressCircle progress={d.progress} size={80} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{d.icon}</span>
                <h3 className="font-bold text-lg">{d.name}</h3>
              </div>
              <p className="text-sm text-white/50">{d.status}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-4 glass-card rounded-lg px-4 py-3">
              <div className={`w-2 h-2 rounded-full ${a.status === "active" ? "bg-[#00FFFF] animate-pulse" : "bg-[#00C853]"}`} />
              <span className="text-sm flex-1">{a.action}</span>
              <span className="text-xs text-white/40">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
