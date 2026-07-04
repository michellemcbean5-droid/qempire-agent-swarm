import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "Portal", path: "/client-portal" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A1A]/90 backdrop-blur-xl border-b border-[#4169E1]/20">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#BF00FF] flex items-center justify-center font-black text-lg">Q</div>
          <div className="text-left">
            <div className="font-black text-sm tracking-wider">Q-EMPIRE</div>
            <div className="text-[10px] text-[#00FFFF] tracking-widest">AUTOMATION</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => navigate("/checkout/empire-pro")}
            className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] hover:from-[#3158D0] hover:to-[#A600DD] text-white font-bold text-sm px-5 py-2 rounded-lg transition-all"
          >
            Get Started
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A1A] border-b border-[#4169E1]/20 px-4 py-4 space-y-3">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMobileOpen(false);
              }}
              className="block w-full text-left text-white/70 hover:text-white py-2"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigate("/checkout/empire-pro");
              setMobileOpen(false);
            }}
            className="w-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-2 rounded-lg"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
