import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import { PACKAGES, type PackageId } from "../lib/constants";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:packageId");
  const [, navigate] = useLocation();
  const packageId = (params?.packageId || "foundation") as PackageId;
  const pkg = PACKAGES[packageId] || PACKAGES.foundation;

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
          <p className="text-white/60 text-sm">Michelle & Q-Bot are ready to build your empire</p>
        </div>

        <div className="bg-[#0A0A1A] border border-[#BF00FF]/30 rounded-xl p-6 mb-4">
          <h2 className="font-bold text-lg text-[#00FFFF]">{pkg.name}</h2>
          <ul className="mt-2 space-y-1">
            {pkg.features.map((f, i) => (
              <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                <span className="text-[#00C853]">✓</span>{f}
              </li>
            ))}
          </ul>
          <div className="text-3xl font-black mt-4">{pkg.price}</div>
          <div className="text-sm text-white/40">{pkg.billing}</div>
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
