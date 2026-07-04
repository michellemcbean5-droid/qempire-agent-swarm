import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import PackageCard from "../components/PackageCard";
import AIChatAssistant from "../components/AIChatAssistant";
import { PACKAGES } from "../lib/constants";

export default function Pricing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0A0A1A]">
      <Navigation />

      <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#BF00FF]/10 border border-[#BF00FF]/30 rounded-full px-4 py-2 text-sm text-[#00FFFF] mb-6">
            SUBSCRIPTION TIERS
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6">
            Choose Your Empire Plan
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Manus-style automation, aligned with the Q-Empire blueprint. Subscribe monthly and let Q-Bot build and automate your business.
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-white/40 text-sm"
        >
          <p>All plans include secure checkout, onboarding wizard, and real-time client portal.</p>
          <p className="mt-2">Cancel anytime. No setup fees.</p>
        </motion.div>
      </section>

      <AIChatAssistant context="general" />
    </div>
  );
}
