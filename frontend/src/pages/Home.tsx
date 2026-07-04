import { useLocation } from "wouter";

const packages = [
  { id: "foundation", name: "Foundation", price: "$1,997", billing: "one-time", features: ["Business plan & pitch deck", "3-page website", "3 AI automations", "Funding strategy"], popular: false },
  { id: "empire-pro", name: "Empire Builder Pro", price: "$4,997", billing: "one-time", features: ["Everything in Foundation", "5-7 page website + app plan", "10 AI automations", "Full funding activation"], popular: true },
  { id: "enterprise", name: "Enterprise AI", price: "$15K+", billing: "custom", features: ["Custom AI systems", "Multi-agent orchestration", "Legacy integration", "24/7 support"], popular: false },
  { id: "payg", name: "Pay-As-You-Go", price: "$250+", billing: "per module", features: ["Individual modules", "No commitment", "Combine as needed", "Flexible pricing"], popular: false },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A1A]/90 backdrop-blur-xl border-b border-[#4169E1]/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#BF00FF] flex items-center justify-center font-black text-lg">Q</div>
            <div>
              <div className="font-black text-sm tracking-wider">Q-EMPIRE</div>
              <div className="text-[10px] text-[#00FFFF] tracking-widest">AUTOMATION</div>
            </div>
          </div>
          <button onClick={() => navigate("/checkout/empire-pro")} className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold text-sm px-5 py-2 rounded-lg">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#BF00FF]/10 border border-[#BF00FF]/30 rounded-full px-4 py-2 text-sm text-[#00FFFF] mb-6">
          AI-POWERED BUSINESS AUTOMATION
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-black leading-tight mb-6">
          Build Your<br />
          <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF007F] bg-clip-text text-transparent">Empire on Autopilot.</span>
        </h1>
        <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
          Pay once. Fill out a wizard. Watch AI build your entire business — website, branding, automations, funding — in under 90 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button onClick={() => navigate("/checkout/empire-pro")} className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold px-8 py-4 rounded-lg text-lg">
            Start Building Now
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center"><div className="text-3xl font-black text-[#00FFFF]">90</div><div className="text-xs text-white/50">Min Buildout</div></div>
          <div className="text-center"><div className="text-3xl font-black text-[#00FFFF]">15+</div><div className="text-xs text-white/50">Hours Saved/Week</div></div>
          <div className="text-center"><div className="text-3xl font-black text-[#00FFFF]">3.7x</div><div className="text-xs text-white/50">ROI Average</div></div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-4">Choose Your Package</h2>
        <p className="text-white/60 text-center mb-12">Every plan includes our full AI automation engine.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`bg-[#1a1a2e]/50 border rounded-2xl p-6 relative ${pkg.popular ? "border-2 border-[#BF00FF]" : "border-[#4169E1]/20"}`}>
              {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#BF00FF] text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
              <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
              <div className="text-3xl font-black mb-1">{pkg.price}</div>
              <div className="text-sm text-white/40 mb-4">{pkg.billing}</div>
              <ul className="space-y-2 text-sm text-white/70 mb-6">
                {pkg.features.map((f, i) => <li key={i} className="flex items-center gap-2"><span className="text-[#00C853]">✓</span>{f}</li>)}
              </ul>
              <button onClick={() => navigate(`/checkout/${pkg.id}`)} className="w-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">
                Select Package
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
