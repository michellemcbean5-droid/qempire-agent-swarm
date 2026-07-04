import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, Shield, CreditCard } from "lucide-react";
import Navigation from "../components/Navigation";
import { PACKAGES } from "../lib/constants";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:packageId");
  const [, navigate] = useLocation();
  const packageId = params?.packageId || "empire-pro";
  const pkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[2];

  const handlePayment = () => {
    toast.success("Redirecting to secure checkout...");
    // In production: redirect to Stripe/PayPal payment link
    // For demo: simulate payment and go to onboarding
    setTimeout(() => {
      navigate(`/onboard?package=${packageId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A1A]">
      <Navigation />
      <div className="pt-32 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full glass-card rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4169E1] to-[#BF00FF] flex items-center justify-center font-black text-2xl mx-auto mb-4">Q</div>
            <h1 className="text-2xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-white/60 text-sm">You're about to unlock your automated empire</p>
          </div>

          <div className="bg-[#0A0A1A] border border-[#BF00FF]/30 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg text-[#00FFFF]">{pkg.name}</h2>
            <p className="text-white/60 text-sm mt-1">{pkg.description}</p>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-3xl font-black">{pkg.price}</span>
              <span className="text-sm text-white/40">{pkg.billing}</span>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-white/70">
              {pkg.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-[#00C853]" /> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold py-4 rounded-lg text-lg mb-4 flex items-center justify-center gap-2 hover:from-[#C4A030] hover:to-[#A67C00] transition-all"
          >
            <CreditCard size={20} /> Subscribe Now
          </button>

          <div className="text-center text-xs text-white/40 space-y-1">
            <p className="flex items-center justify-center gap-1"><Shield size={12} /> Secure payment via Stripe / PayPal</p>
            <p>Cancel anytime. 30-day money-back guarantee.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
