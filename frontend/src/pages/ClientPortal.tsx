import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { LayoutDashboard, FileText, Globe, Bot, DollarSign, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AIChatAssistant from "../components/AIChatAssistant";
import Overview from "./views/Overview";
import Blueprint from "./views/Blueprint";
import Website from "./views/Website";
import Automations from "./views/Automations";
import Funding from "./views/Funding";
import Support from "./views/Support";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, component: Overview },
  { id: "blueprint", label: "Blueprint", icon: FileText, component: Blueprint },
  { id: "website", label: "Website", icon: Globe, component: Website },
  { id: "automations", label: "Automations", icon: Bot, component: Automations },
  { id: "funding", label: "Funding", icon: DollarSign, component: Funding },
  { id: "support", label: "Support", icon: HelpCircle, component: Support },
];

export default function ClientPortal() {
  const [, params] = useRoute("/client-portal/:view?");
  const [, navigate] = useLocation();
  const { session, isAuthenticated, logout } = useAuth();

  const activeView = params?.view || "overview";
  const activeItem = navItems.find((item) => item.id === activeView) || navItems[0];
  const ActiveComponent = activeItem.component;

  useEffect(() => {
    if (!isAuthenticated) {
      // For demo purposes, allow viewing the portal without auth
      // In production, redirect to login
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex bg-[#0A0A1A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0f] border-r border-[#4169E1]/20 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#BF00FF] flex items-center justify-center font-black text-sm">Q</div>
          <span className="font-bold text-sm">Client Portal</span>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/client-portal/${item.id}`)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                activeView === item.id
                  ? "bg-[#4169E1]/10 text-[#00FFFF] font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-[#4169E1]/20">
          <div className="text-xs text-white/40 mb-3 truncate">
            {session?.email || "guest@qempire.ai"}
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full text-left px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f] border-t border-[#4169E1]/20 p-2 z-40 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/client-portal/${item.id}`)}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
              activeView === item.id ? "text-[#00FFFF]" : "text-white/40"
            }`}
          >
            <item.icon size={18} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <ActiveComponent />
        </div>
      </main>

      <AIChatAssistant context="portal" />
    </div>
  );
}
