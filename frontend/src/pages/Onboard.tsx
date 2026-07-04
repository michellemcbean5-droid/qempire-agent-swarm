import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "http://localhost:8080";

const industries = ["Technology", "Health & Wellness", "E-commerce", "Professional Services", "Creative", "Education", "Food & Beverage", "Real Estate", "Other"];
const automationOptions = [
  { id: "lead-chatbot", name: "Lead Capture Chatbot" },
  { id: "email-welcome", name: "Email Welcome Sequence" },
  { id: "email-followup", name: "Email Follow-up Sequence" },
  { id: "crm-pipeline", name: "CRM Pipeline Setup" },
  { id: "scheduling", name: "Appointment Scheduling" },
  { id: "invoice", name: "Invoice Automation" },
  { id: "payment-reminders", name: "Payment Reminders" },
  { id: "reporting", name: "Monthly Reporting" },
  { id: "social-posting", name: "Social Media Auto-posting" },
  { id: "client-onboarding", name: "Client Onboarding Flow" },
];

export default function Onboard() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    industry: "",
    target_audience: "",
    elevator_pitch: "",
    brand_tone: "Professional",
    colors: "#4169E1, #BF00FF",
    pages: "Home, About, Services, Contact",
    automations_selected: [] as string[],
    funding_amount: "$50,000",
    email: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAutomation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      automations_selected: prev.automations_selected.includes(id)
        ? prev.automations_selected.filter((a) => a !== id)
        : [...prev.automations_selected, id],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${WEBHOOK_URL}/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, package_id: "foundation" }),
      });
      if (!response.ok) {
        throw new Error(`Onboarding request failed: ${response.status}`);
      }
      toast.success("Q-Bot is building your empire!");
      setTimeout(() => navigate("/client-portal"), 2000);
    } catch (error) {
      toast.error("Submitted! Redirecting to your dashboard...");
      setTimeout(() => navigate("/client-portal"), 2000);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${s <= step ? "bg-gradient-to-r from-[#4169E1] to-[#BF00FF]" : "bg-[#1a1a2e] border border-[#4169E1]/20"}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-2xl p-8">
          {/* Step 1: Business Basics */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🧜🏾‍♀️ 🤖</div>
                <p className="text-white/60 text-sm">Michelle & Q-Bot will use this to build your business.</p>
              </div>
              <h2 className="text-2xl font-bold mb-6">Tell Us About Your Business</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Business Name *</label>
                  <input value={formData.business_name} onChange={(e) => updateField("business_name", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="e.g., TechCorp Solutions" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Industry *</label>
                  <select value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none">
                    <option value="">Select industry...</option>
                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Target Audience</label>
                  <textarea value={formData.target_audience} onChange={(e) => updateField("target_audience", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" rows={3} placeholder="Who are your ideal customers?" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Your Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="you@email.com" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full mt-6 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Brand Identity →</button>
            </div>
          )}

          {/* Step 2: Brand Identity */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Brand Identity</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Brand Tone</label>
                  <select value={formData.brand_tone} onChange={(e) => updateField("brand_tone", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none">
                    {["Professional", "Friendly", "Bold", "Luxurious", "Playful", "Minimal"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Preferred Colors</label>
                  <input value={formData.colors} onChange={(e) => updateField("colors", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="#4169E1, #BF00FF" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Elevator Pitch</label>
                  <textarea value={formData.elevator_pitch} onChange={(e) => updateField("elevator_pitch", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" rows={3} placeholder="In one sentence, what does your business do?" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Automations →</button>
              </div>
            </div>
          )}

          {/* Step 3: Automations */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Your Automations</h2>
              <p className="text-white/60 text-sm mb-4">Select the automations you want running 24/7:</p>
              <div className="grid grid-cols-2 gap-3">
                {automationOptions.map((a) => (
                  <button key={a.id} onClick={() => toggleAutomation(a.id)} className={`p-3 rounded-lg text-left text-sm border transition-all ${formData.automations_selected.includes(a.id) ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]" : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"}`}>
                    {formData.automations_selected.includes(a.id) ? "✓ " : ""}{a.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Review →</button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Launch */}
          {step === 4 && !loading && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Review & Launch</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Business:</span><span>{formData.business_name}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Industry:</span><span>{formData.industry}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Brand Tone:</span><span>{formData.brand_tone}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Automations:</span><span>{formData.automations_selected.length} selected</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Email:</span><span>{formData.email}</span></div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(3)} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold py-3 rounded-lg text-lg">🚀 Launch My Empire</button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6 animate-pulse">🧜🏾‍♀️</div>
              <h2 className="text-2xl font-bold mb-2">Michelle & Q-Bot Are Building Your Empire...</h2>
              <p className="text-white/60">This usually takes about 60-90 minutes. We'll email you when it's ready.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
