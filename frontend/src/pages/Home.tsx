import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import Navigation from "../components/Navigation";
import PackageCard from "../components/PackageCard";
import AIChatAssistant from "../components/AIChatAssistant";
import { PACKAGES } from "../lib/constants";

export default function Home() {
  const [, navigate] = useLocation();

  const features = [
    { icon: Sparkles, title: "AI Business Builder", description: "Q-Bot plans, builds, and verifies every deliverable automatically." },
    { icon: Zap, title: "24/7 Automations", description: "Lead capture, email sequences, scheduling, invoicing, and more." },
    { icon: Shield, title: "Subscription Simplicity", description: "Monthly tiers like Manus. Scale up, down, or cancel anytime." },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A1A]">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#BF00FF]/10 border border-[#BF00FF]/30 rounded-full px-4 py-2 text-sm text-[#00FFFF] mb-6">
            AI-POWERED BUSINESS AUTOMATION
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-tight mb-6">
            Build Your<br />
            <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF007F] bg-clip-text text-transparent">Empire on Autopilot.</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            A Manus-style app for your customers. They subscribe, fill out a wizard, and Q-Bot builds their entire automated business — website, branding, automations, and funding strategy.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold px-8 py-4 rounded-lg text-lg flex items-center gap-2 hover:from-[#3158D0] hover:to-[#A600DD] transition-all"
            >
              View Plans <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/checkout/empire-pro")}
              className="border border-[#4169E1]/50 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#4169E1]/10 transition-all"
            >
              Start Free Trial
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center"><div className="text-3xl font-black text-[#00FFFF]">90</div><div className="text-xs text-white/50">Min Buildout</div></div>
            <div className="text-center"><div className="text-3xl font-black text-[#00FFFF]">15+</div><div className="text-xs text-white/50">Hours Saved/Week</div></div>
            <div className="text-center"><div className="text-3xl font-black text-[#00FFFF]">3.7x</div><div className="text-xs text-white/50">ROI Average</div></div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4169E1]/20 to-[#BF00FF]/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-[#00FFFF]" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold mb-4">Subscription Tiers</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Aligned with the Q-Empire blueprint. Every tier includes the self-service builder and client portal.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={index}
              onSelect={() => navigate(`/checkout/${pkg.id}`)}
            />
          ))}
        </div>
      </section>

      <AIChatAssistant context="general" />
    </div>
  );
}
