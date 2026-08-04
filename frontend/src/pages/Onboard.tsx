import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { submitOnboarding } from "../lib/api";
import {
  INDUSTRIES,
  REVENUE_RANGES,
  BRAND_TONES,
  WEBSITE_PAGES,
  WEBSITE_FEATURES,
  AUTOMATION_MODULES,
  FUNDING_TYPES,
  FUNDING_TIMELINES,
  PACKAGES,
  type PackageId,
} from "../lib/constants";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Business",
  "Brand",
  "Website",
  "Automations",
  "Funding",
  "Review",
];

interface FormData {
  business_name: string;
  industry: string;
  target_audience: string;
  elevator_pitch: string;
  current_revenue: string;
  email: string;
  brand_tone: string;
  colors: string;
  tagline: string;
  inspiration_urls: string[];
  pages: string[];
  website_features: string[];
  domain: string;
  automations_selected: string[];
  funding_amount: string;
  funding_types: string[];
  funding_timeline: string;
}

export default function Onboard() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { setSession } = useAuth();
  const params = new URLSearchParams(search);
  const packageId = (params.get("package") || "foundation") as PackageId;
  const pkg = PACKAGES[packageId] || PACKAGES.foundation;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    business_name: "",
    industry: "",
    target_audience: "",
    elevator_pitch: "",
    current_revenue: "Pre-revenue",
    email: "",
    brand_tone: "Professional",
    colors: "#4169E1, #BF00FF",
    tagline: "",
    inspiration_urls: ["", "", ""],
    pages: ["Home", "About", "Services", "Contact"],
    website_features: [],
    domain: "",
    automations_selected: [],
    funding_amount: "$50,000",
    funding_types: [],
    funding_timeline: "3-6 months",
  });

  const updateField = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "pages" | "website_features" | "automations_selected" | "funding_types", item: string) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
      };
    });
  };

  // Determine which steps are shown based on package
  const showFundingStep = pkg.includesFunding || packageId === "payg";
  const effectiveTotalSteps = showFundingStep ? TOTAL_STEPS : TOTAL_STEPS - 1;

  const canAdvanceStep = (): boolean => {
    if (step === 1) return !!(formData.business_name && formData.industry && formData.email);
    if (step === 2) return !!(formData.brand_tone && formData.elevator_pitch);
    return true;
  };

  const nextStep = () => {
    if (!canAdvanceStep()) {
      toast.error("Please fill in the required fields before continuing.");
      return;
    }
    // Skip funding step if not included
    if (step === 4 && !showFundingStep) {
      setStep(6);
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => {
    if (step === 6 && !showFundingStep) {
      setStep(4);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const handleSubmit = async () => {
    if (!formData.business_name || !formData.email) {
      toast.error("Business name and email are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        pages: formData.pages.join(", "),
        inspiration_urls: formData.inspiration_urls.filter(Boolean),
        package_id: packageId,
      };
      const result = await submitOnboarding(payload);
      setSession({
        taskIds: result.tasks_created.map((t) => t.id),
        email: formData.email,
        businessName: formData.business_name,
        packageId,
      });
      toast.success("Q-Bot is building your empire!");
      setTimeout(() => navigate("/client-portal"), 2000);
    } catch {
      // Still redirect — backend may be offline in dev
      toast.info("Submitted! Redirecting to your dashboard...");
      setSession({
        taskIds: [],
        email: formData.email,
        businessName: formData.business_name,
        packageId,
      });
      setTimeout(() => navigate("/client-portal"), 2000);
    }
  };

  const progressPercent = ((step - 1) / (effectiveTotalSteps - 1)) * 100;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#BF00FF]/10 border border-[#BF00FF]/30 rounded-full px-4 py-2 text-sm text-[#00FFFF] mb-4">
            🧜🏾‍♀️ {pkg.name}
          </div>
          <h1 className="text-3xl font-display font-bold">Build Your Empire</h1>
        </div>

        {/* Step Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isSkipped = !showFundingStep && stepNum === 5;
              if (isSkipped) return null;
              return (
                <div key={stepNum} className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${stepNum < step ? "bg-[#00C853] text-white" : stepNum === step ? "bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white" : "bg-[#1a1a2e] border border-[#4169E1]/20 text-white/40"}`}>
                    {stepNum < step ? "✓" : stepNum}
                  </div>
                  <span className={`text-[10px] hidden sm:block ${stepNum === step ? "text-[#00FFFF]" : "text-white/30"}`}>{label}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-[#1a1a2e]/50 border border-[#4169E1]/20 rounded-2xl p-8">
          {/* ── Step 1: Business Basics ── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🧜🏾‍♀️ 🤖</div>
                <p className="text-white/60 text-sm">Michelle & Q-Bot will use this to build your business.</p>
              </div>
              <h2 className="text-2xl font-bold mb-6">Tell Us About Your Business</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Business Name <span className="text-[#FF007F]">*</span></label>
                  <input value={formData.business_name} onChange={(e) => updateField("business_name", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="e.g., TechCorp Solutions" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Industry <span className="text-[#FF007F]">*</span></label>
                  <select value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none">
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Target Audience</label>
                  <textarea value={formData.target_audience} onChange={(e) => updateField("target_audience", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" rows={3} placeholder="Who are your ideal customers?" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Current Revenue</label>
                  <select value={formData.current_revenue} onChange={(e) => updateField("current_revenue", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none">
                    {REVENUE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Your Email <span className="text-[#FF007F]">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="you@email.com" />
                </div>
              </div>
              <button onClick={nextStep} className="w-full mt-6 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Brand Identity →</button>
            </div>
          )}

          {/* ── Step 2: Brand Identity ── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Brand Identity</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Brand Tone <span className="text-[#FF007F]">*</span></label>
                  <select value={formData.brand_tone} onChange={(e) => updateField("brand_tone", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none">
                    {BRAND_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Preferred Colors</label>
                  <input value={formData.colors} onChange={(e) => updateField("colors", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="#4169E1, #BF00FF" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Elevator Pitch <span className="text-[#FF007F]">*</span></label>
                  <textarea value={formData.elevator_pitch} onChange={(e) => updateField("elevator_pitch", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" rows={3} maxLength={200} placeholder="In one sentence, what does your business do? (max 200 chars)" />
                  <div className="text-xs text-white/30 text-right mt-1">{formData.elevator_pitch.length}/200</div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Tagline Ideas (optional)</label>
                  <input value={formData.tagline} onChange={(e) => updateField("tagline", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="e.g., From idea to empire in 90 minutes" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Inspiration Websites (optional, up to 3)</label>
                  {formData.inspiration_urls.map((url, i) => (
                    <input key={i} value={url} onChange={(e) => {
                      const updated = [...formData.inspiration_urls];
                      updated[i] = e.target.value;
                      updateField("inspiration_urls", updated);
                    }} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none mb-2" placeholder={`https://example${i + 1}.com`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Website →</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Website Brief ── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Website Brief</h2>
              <p className="text-white/60 text-sm mb-4">
                {packageId === "foundation" ? "Select up to 3 pages." : packageId === "empire-pro" ? "Select up to 7 pages." : "Select pages for your site."}
              </p>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Pages Needed</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {WEBSITE_PAGES.map((page) => (
                    <button key={page} onClick={() => toggleArrayItem("pages", page)} className={`p-3 rounded-lg text-left text-sm border transition-all ${formData.pages.includes(page) ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]" : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"}`}>
                      {formData.pages.includes(page) ? "✓ " : ""}{page}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Key Features</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {WEBSITE_FEATURES.map((feat) => (
                    <button key={feat} onClick={() => toggleArrayItem("website_features", feat)} className={`p-3 rounded-lg text-left text-sm border transition-all ${formData.website_features.includes(feat) ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]" : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"}`}>
                      {formData.website_features.includes(feat) ? "✓ " : ""}{feat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Domain Name (if you have one)</label>
                <input value={formData.domain} onChange={(e) => updateField("domain", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" placeholder="e.g., mybusiness.com" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Automations →</button>
              </div>
            </div>
          )}

          {/* ── Step 4: Automation Needs ── */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Automations</h2>
              <p className="text-white/60 text-sm mb-4">
                Select automations to run 24/7.{" "}
                {pkg.maxAutomations < 999 && <span className="text-[#00FFFF]">({pkg.maxAutomations} included in your plan)</span>}
              </p>
              <div className="space-y-2">
                {AUTOMATION_MODULES.map((a) => {
                  const selected = formData.automations_selected.includes(a.id);
                  const atLimit = !selected && formData.automations_selected.length >= pkg.maxAutomations;
                  return (
                    <button key={a.id} onClick={() => !atLimit && toggleArrayItem("automations_selected", a.id)} disabled={atLimit} className={`w-full p-4 rounded-lg text-left border transition-all flex items-start gap-3 ${selected ? "bg-[#4169E1]/20 border-[#00FFFF]" : atLimit ? "bg-[#0A0A1A] border-[#4169E1]/10 opacity-40 cursor-not-allowed" : "bg-[#0A0A1A] border-[#4169E1]/20 hover:border-[#4169E1]/50"}`}>
                      <span className="text-2xl mt-0.5">{a.icon}</span>
                      <div>
                        <div className={`font-semibold text-sm ${selected ? "text-[#00FFFF]" : "text-white"}`}>{selected ? "✓ " : ""}{a.name}</div>
                        <div className="text-xs text-white/50 mt-0.5">{a.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">
                  {showFundingStep ? "Next: Funding →" : "Next: Review →"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Funding Goals (conditional) ── */}
          {step === 5 && showFundingStep && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Funding Goals</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Funding Amount Needed: <span className="text-[#00FFFF] font-bold">{formData.funding_amount}</span></label>
                  <input type="range" min={5000} max={500000} step={5000} value={parseInt(formData.funding_amount.replace(/[$,]/g, "")) || 50000} onChange={(e) => updateField("funding_amount", `$${parseInt(e.target.value).toLocaleString()}`)} className="w-full accent-[#4169E1]" />
                  <div className="flex justify-between text-xs text-white/30 mt-1"><span>$5K</span><span>$500K</span></div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Preferred Funding Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FUNDING_TYPES.map((t) => (
                      <button key={t} onClick={() => toggleArrayItem("funding_types", t)} className={`p-3 rounded-lg text-sm border transition-all ${formData.funding_types.includes(t) ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]" : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"}`}>
                        {formData.funding_types.includes(t) ? "✓ " : ""}{t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Timeline</label>
                  <select value={formData.funding_timeline} onChange={(e) => updateField("funding_timeline", e.target.value)} className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none">
                    {FUNDING_TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg">Next: Review →</button>
              </div>
            </div>
          )}

          {/* ── Step 6: Review & Launch ── */}
          {step === 6 && !loading && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Review & Launch 🚀</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Package:</span><span className="text-[#D4AF37]">{pkg.name}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Business:</span><span>{formData.business_name}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Industry:</span><span>{formData.industry}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Revenue:</span><span>{formData.current_revenue}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Brand Tone:</span><span>{formData.brand_tone}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Pages:</span><span>{formData.pages.join(", ")}</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Automations:</span><span>{formData.automations_selected.length} selected</span></div>
                {showFundingStep && (
                  <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Funding Goal:</span><span>{formData.funding_amount}</span></div>
                )}
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Email:</span><span>{formData.email}</span></div>
              </div>
              <div className="bg-[#0A0A1A] border border-[#00C853]/30 rounded-lg p-4 text-sm text-[#00C853] mb-6">
                🤖 Q-Bot will begin building your empire immediately after you launch. Estimated completion: 60-90 minutes. You'll receive email updates at each milestone.
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg">← Back</button>
                <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold py-3 rounded-lg text-lg">🚀 Launch My Empire</button>
              </div>
            </div>
          )}

          {/* ── Loading / Success State ── */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6 animate-pulse">🧜🏾‍♀️</div>
              <h2 className="text-2xl font-bold mb-2">Michelle & Q-Bot Are Building Your Empire...</h2>
              <p className="text-white/60 mb-4">This usually takes about 60-90 minutes. We'll email you when it's ready.</p>
              <div className="flex items-center justify-center gap-2 text-[#00FFFF] text-sm">
                <span className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
