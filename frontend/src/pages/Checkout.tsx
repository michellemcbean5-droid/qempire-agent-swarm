import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";

const packageDetails: Record<string, { name: string; price: string; description: string }> = {
  foundation: { name: "Foundation Launchpad", price: "$1,997", description: "Business plan, 3-page website, 3 automations, funding strategy" },
  "empire-pro": { name: "Empire Builder Pro", price: "$4,997", description: "Full buildout with 5-7 page website, 10 automations, and aggressive funding" },
  enterprise: { name: "Enterprise AI", price: "$15,000+", description: "Custom AI systems, multi-agent orchestration, and dedicated support" },
  payg: { name: "Pay-As-You-Go", price: "$250+", description: "Individual modules — pick exactly what you need" },
};

export default function Checkout() {
  const [, params] = useRoute("/checkout/:packageId");
  const [, navigate] = useLocation();
  const packageId = params?.packageId || "foundation";
  const pkg = packageDetails[packageId] || packageDetails.foundation;

  const handlePayment = () => {
    toast.success("Redirecting to secure checkout...");
    // In production: redirect to PayPal/Stripe payment link
    // For now: simulate payment and go to onboarding
    setTimeout(() => {
      navigate(`/onboard?package=${packageId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4169E1] to-[#BF00FF] flex items-center justify-center font-black text-2xl mx-auto mb-4">Q</div>
          <h1 className="text-2xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-white/60 text-sm">You're about to unlock your automated empire</p>
        </div>

        <div className="bg-[#0A0A1A] border border-[#BF00FF]/30 rounded-xl p-6 mb-6">
          <h2 className="font-bold text-lg text-[#00FFFF]">{pkg.name}</h2>
          <p className="text-white/60 text-sm mt-1">{pkg.description}</p>
          <div className="text-3xl font-black mt-4">{pkg.price}</div>
          <div className="text-sm text-white/40">one-time payment</div>
        </div>

        <button onClick={handlePayment} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold py-4 rounded-lg text-lg mb-4">
          Pay with PayPal
        </button>

        <div className="text-center text-xs text-white/40">
          <p>🔒 Secure payment via PayPal</p>
          <p className="mt-1">30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}
