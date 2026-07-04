import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Rocket, Check } from "lucide-react";
import NavBar from "../components/NavBar";
import QBot from "../components/QBot";

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

const inputCls =
  "w-full rounded-xl border hairline bg-abyss/60 px-4 py-3 text-sm text-ink placeholder:text-mist/50 focus:border-cyan/50 focus:outline-none focus:glow-cyan transition";

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
    colors: "#22e0ff, #a855f7",
    pages: "Home, About, Services, Contact",
    automations_selected: [] as string[],
    funding_amount: "$50,000",
    email: "",
  });

  const updateField = (field: string, value: unknown) => setFormData((p) => ({ ...p, [field]: value }));

  const toggleAutomation = (id: string) =>
    setFormData((p) => ({
      ...p,
      automations_selected: p.automations_selected.includes(id)
        ? p.automations_selected.filter((a) => a !== id)
        : [...p.automations_selected, id],
    }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${WEBHOOK_URL}/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, package_id: "foundation" }),
      });
      if (!res.ok) throw new Error(`Onboarding failed: ${res.status}`);
      toast.success("Q-Bot is building your empire!");
      setTimeout(() => navigate("/command"), 1600);
    } catch {
      toast.success("Submitted! Taking you to Q-Bot's Computer…");
      setTimeout(() => navigate("/command"), 1600);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 pt-28 pb-20">
        {/* progress */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${s <= step ? "btn-brand text-white" : "glass text-mist"}`}>
                {s < step ? <Check size={15} /> : s}
              </div>
              {s < 4 && <div className={`h-px w-8 ${s < step ? "bg-cyan/40" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl glass-strong p-7 sm:p-8">
          {step === 1 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <QBot size={44} />
                <p className="text-sm text-mist">Q-Bot will use this to build your business from the ground up.</p>
              </div>
              <h2 className="mb-6 font-display text-2xl font-bold">Tell us about your business</h2>
              <div className="space-y-4">
                <Labeled label="Business name *">
                  <input value={formData.business_name} onChange={(e) => updateField("business_name", e.target.value)} className={inputCls} placeholder="e.g. Coastal Kitchen Co." />
                </Labeled>
                <Labeled label="Industry *">
                  <select value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} className={inputCls}>
                    <option value="">Select industry…</option>
                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Labeled>
                <Labeled label="Target audience">
                  <textarea value={formData.target_audience} onChange={(e) => updateField("target_audience", e.target.value)} className={inputCls} rows={3} placeholder="Who are your ideal customers?" />
                </Labeled>
                <Labeled label="Your email *">
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={inputCls} placeholder="you@email.com" />
                </Labeled>
              </div>
              <NextBtn onClick={() => setStep(2)}>Next: Brand identity</NextBtn>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-6 font-display text-2xl font-bold">Brand identity</h2>
              <div className="space-y-4">
                <Labeled label="Brand tone">
                  <select value={formData.brand_tone} onChange={(e) => updateField("brand_tone", e.target.value)} className={inputCls}>
                    {["Professional", "Friendly", "Bold", "Luxurious", "Playful", "Minimal"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Labeled>
                <Labeled label="Preferred colors">
                  <input value={formData.colors} onChange={(e) => updateField("colors", e.target.value)} className={inputCls} placeholder="#22e0ff, #a855f7" />
                </Labeled>
                <Labeled label="Elevator pitch">
                  <textarea value={formData.elevator_pitch} onChange={(e) => updateField("elevator_pitch", e.target.value)} className={inputCls} rows={3} placeholder="In one sentence, what does your business do?" />
                </Labeled>
              </div>
              <div className="mt-6 flex gap-3">
                <BackBtn onClick={() => setStep(1)} />
                <NextBtn onClick={() => setStep(3)}>Next: Automations</NextBtn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold">Choose your automations</h2>
              <p className="mb-4 text-sm text-mist">Select what should run 24/7:</p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {automationOptions.map((a) => {
                  const on = formData.automations_selected.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAutomation(a.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-sm transition ${
                        on ? "border-cyan/50 bg-cyan/10 text-white glow-cyan" : "hairline bg-abyss/40 text-ink/80 hover:border-white/20"
                      }`}
                    >
                      <span className={`grid h-4 w-4 place-items-center rounded ${on ? "bg-cyan text-abyss" : "border hairline"}`}>
                        {on && <Check size={11} />}
                      </span>
                      {a.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex gap-3">
                <BackBtn onClick={() => setStep(2)} />
                <NextBtn onClick={() => setStep(4)}>Next: Review</NextBtn>
              </div>
            </div>
          )}

          {step === 4 && !loading && (
            <div>
              <h2 className="mb-6 font-display text-2xl font-bold">Review &amp; launch</h2>
              <div className="space-y-3 text-sm">
                {[
                  ["Business", formData.business_name || "—"],
                  ["Industry", formData.industry || "—"],
                  ["Brand tone", formData.brand_tone],
                  ["Automations", `${formData.automations_selected.length} selected`],
                  ["Email", formData.email || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b hairline pb-2">
                    <span className="text-mist">{k}</span>
                    <span className="text-ink">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <BackBtn onClick={() => setStep(3)} />
                <button onClick={handleSubmit} className="flex flex-1 items-center justify-center gap-2 rounded-xl btn-gold py-3 text-sm font-bold">
                  <Rocket size={16} /> Launch my empire
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center">
              <QBot size={80} className="mx-auto animate-float" />
              <h2 className="mt-6 font-display text-2xl font-bold">Q-Bot is building your empire…</h2>
              <p className="mt-2 text-sm text-mist">Dispatching the swarm. Taking you to the live workspace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-mist">{label}</label>
      {children}
    </div>
  );
}

function NextBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl btn-brand py-3 text-sm font-semibold text-white">
      {children} <ArrowRight size={15} />
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-1.5 rounded-xl glass px-5 py-3 text-sm font-semibold text-mist hover:text-ink">
      <ArrowLeft size={15} /> Back
    </button>
  );
}
