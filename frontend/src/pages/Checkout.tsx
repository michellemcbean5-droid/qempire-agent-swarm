import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import QBot from "../components/QBot";

const packageDetails: Record<string, { name: string; price: string; description: string }> = {
  foundation: { name: "Foundation", price: "$1,997", description: "Business plan, 3-page website, 3 automations, funding strategy" },
  "empire-pro": { name: "Empire Builder Pro", price: "$4,997", description: "Full buildout: 5–7 page website, 10 automations, aggressive funding" },
  enterprise: { name: "Enterprise AI", price: "$15,000+", description: "Custom AI systems, 50-agent orchestration, dedicated support" },
  payg: { name: "Pay-As-You-Go", price: "$250+", description: "Individual modules — pick exactly what you need" },
};

export default function Checkout() {
  const [, params] = useRoute("/checkout/:packageId");
  const [, navigate] = useLocation();
  const packageId = params?.packageId || "foundation";
  const pkg = packageDetails[packageId] || packageDetails.foundation;

  const handlePayment = () => {
    toast.success("Redirecting to secure checkout…");
    setTimeout(() => navigate(`/onboard?package=${packageId}`), 1400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="mb-4 flex items-center gap-1.5 text-sm text-mist hover:text-ink">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="rounded-3xl glass-strong p-8">
          <div className="mb-7 text-center">
            <QBot size={64} className="mx-auto animate-float" />
            <h1 className="mt-3 font-display text-2xl font-bold">Secure checkout</h1>
            <p className="mt-1 text-sm text-mist">Q-Bot is ready to build your empire.</p>
          </div>

          <div className="rounded-2xl border hairline bg-abyss/50 p-6">
            <h2 className="font-display text-lg font-bold text-gradient-gold">{pkg.name}</h2>
            <p className="mt-1 text-sm text-mist">{pkg.description}</p>
            <div className="mt-4 font-display text-3xl font-bold">{pkg.price}</div>
            <div className="text-xs text-mist">one-time payment</div>
          </div>

          <button onClick={handlePayment} className="mt-6 w-full rounded-xl btn-gold py-3.5 text-base font-bold">
            Pay securely
          </button>

          <div className="mt-4 space-y-1 text-center text-xs text-mist">
            <p className="flex items-center justify-center gap-1.5"><Lock size={12} /> Encrypted payment via PayPal / Stripe</p>
            <p className="flex items-center justify-center gap-1.5"><ShieldCheck size={12} /> 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
