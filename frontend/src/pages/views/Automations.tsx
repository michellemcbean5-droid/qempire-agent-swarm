import { Play, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AUTOMATION_MODULES, PACKAGES } from "../../lib/constants";

const automationStatus: Record<string, "active" | "pending" | "inactive"> = {
  "lead-chatbot": "active",
  "email-welcome": "active",
  "email-followup": "pending",
  "crm-pipeline": "active",
  "scheduling": "pending",
  "invoice": "inactive",
  "payment-reminders": "inactive",
  "reporting": "inactive",
  "social-posting": "inactive",
  "client-onboarding": "inactive",
};

export default function Automations() {
  const { session } = useAuth();
  const pkg = PACKAGES.find((p) => p.id === session?.packageId) || PACKAGES[2];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Automations</h1>
        <p className="text-white/60">
          Your {pkg.maxAutomations === 999 ? "unlimited" : pkg.maxAutomations} included automations. Active automations run 24/7.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {AUTOMATION_MODULES.map((module) => {
          const status = automationStatus[module.id];
          return (
            <div key={module.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold">{module.name}</h3>
                {status === "active" && <CheckCircle size={18} className="text-[#00C853]" />}
                {status === "pending" && <Clock size={18} className="text-[#D4AF37]" />}
                {status === "inactive" && <XCircle size={18} className="text-white/30" />}
              </div>
              <p className="text-sm text-white/60 mb-4">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  status === "active" ? "bg-[#00C853]/20 text-[#00C853]" :
                  status === "pending" ? "bg-[#D4AF37]/20 text-[#D4AF37]" :
                  "bg-white/10 text-white/40"
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <button className="text-xs flex items-center gap-1 text-[#00FFFF] hover:text-white transition-colors">
                  <Play size={12} /> Test
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
