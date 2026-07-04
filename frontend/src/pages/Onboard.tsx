import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import Navigation from "../components/Navigation";
import StepIndicator from "../components/StepIndicator";
import AIChatAssistant from "../components/AIChatAssistant";
import { useAuth } from "../contexts/AuthContext";
import {
  PACKAGES,
  INDUSTRIES,
  BRAND_TONES,
  WEBSITE_PAGES,
  AUTOMATION_MODULES,
  FUNDING_TYPES,
  type PackageDefinition,
} from "../lib/constants";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "http://localhost:8080";

interface FormData {
  business_name: string;
  industry: string;
  target_audience: string;
  elevator_pitch: string;
  email: string;
  brand_tone: string;
  colors: string;
  tagline: string;
  pages: string[];
  automations_selected: string[];
  funding_amount: number;
  funding_types: string[];
  funding_timeline: string;
}

export default function Onboard() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const packageId = searchParams.get("package") || "empire-pro";
  const pkg = useMemo(() => PACKAGES.find((p) => p.id === packageId) || PACKAGES[2], [packageId]);

  const steps = useMemo(() => pkg.onboardingSteps, [pkg]);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    business_name: "",
    industry: "",
    target_audience: "",
    elevator_pitch: "",
    email: "",
    brand_tone: "Professional",
    colors: "#4169E1, #BF00FF",
    tagline: "",
    pages: ["home", "about", "services", "contact"],
    automations_selected: [],
    funding_amount: 50000,
    funding_types: [],
    funding_timeline: "3-6 months",
  });

  useEffect(() => {
    // Pre-select default automations up to package limit
    const defaults = AUTOMATION_MODULES.slice(0, pkg.maxAutomations).map((a) => a.id);
    setFormData((prev) => ({
      ...prev,
      automations_selected: defaults.slice(0, pkg.maxAutomations),
    }));
  }, [pkg]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAutomation = (id: string) => {
    setFormData((prev) => {
      const selected = prev.automations_selected.includes(id)
        ? prev.automations_selected.filter((a) => a !== id)
        : [...prev.automations_selected, id];
      return { ...prev, automations_selected: selected.slice(0, pkg.maxAutomations) };
    });
  };

  const togglePage = (id: string) => {
    setFormData((prev) => {
      const selected = prev.pages.includes(id)
        ? prev.pages.filter((p) => p !== id)
        : [...prev.pages, id];
      return { ...prev, pages: selected.slice(0, pkg.maxPages) };
    });
  };

  const toggleFundingType = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      funding_types: prev.funding_types.includes(id)
        ? prev.funding_types.filter((t) => t !== id)
        : [...prev.funding_types, id],
    }));
  };

  const validateCurrentStep = (): boolean => {
    const step = steps[stepIndex];
    if (step === "business-basics") {
      if (!formData.business_name.trim() || !formData.industry || !formData.email.trim()) {
        toast.error("Please fill in all required fields.");
        return false;
      }
    }
    if (step === "automation-needs" && formData.automations_selected.length === 0) {
      toast.error("Please select at least one automation.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (stepIndex < steps.length - 1) setStepIndex((s) => s + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${WEBHOOK_URL}/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, package_id: pkg.id }),
      });
      await response.json();
      login(formData.email, pkg.id, formData.business_name);
      toast.success("Q-Bot is building your empire!");
      setTimeout(() => navigate("/client-portal"), 2000);
    } catch (error) {
      login(formData.email, pkg.id, formData.business_name);
      toast.success("Submitted! Redirecting to your dashboard...");
      setTimeout(() => navigate("/client-portal"), 2000);
    }
  };

  const currentStepKey = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="min-h-screen bg-[#0A0A1A]">
      <Navigation />
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <StepIndicator steps={steps.map((s) => s.replace(/-/g, " "))} currentStep={stepIndex + 1} />

          <div className="glass-card rounded-2xl p-6 md:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] mx-auto mb-6 animate-pulse flex items-center justify-center text-4xl font-black">Q</div>
                  <h2 className="text-2xl font-bold mb-2">Q-Bot is Building Your Empire...</h2>
                  <p className="text-white/60">This usually takes 60-90 minutes. We'll email you when it's ready.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStepKey}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepKey === "business-basics" && (
                    <BusinessBasicsStep formData={formData} updateField={updateField} />
                  )}
                  {currentStepKey === "brand-identity" && (
                    <BrandIdentityStep formData={formData} updateField={updateField} />
                  )}
                  {currentStepKey === "website-brief" && (
                    <WebsiteBriefStep formData={formData} pkg={pkg} togglePage={togglePage} />
                  )}
                  {currentStepKey === "automation-needs" && (
                    <AutomationNeedsStep formData={formData} pkg={pkg} toggleAutomation={toggleAutomation} />
                  )}
                  {currentStepKey === "funding-goals" && (
                    <FundingGoalsStep formData={formData} toggleFundingType={toggleFundingType} updateField={updateField} />
                  )}
                  {currentStepKey === "review" && (
                    <ReviewStep formData={formData} pkg={pkg} />
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleBack}
                      disabled={stepIndex === 0}
                      className="flex-1 border border-white/20 text-white/70 font-bold py-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    {isLastStep ? (
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold py-3 rounded-lg text-lg flex items-center justify-center gap-2"
                      >
                        🚀 Launch My Empire
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        Next <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AIChatAssistant context="onboarding" />
    </div>
  );
}

interface StepProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

function BusinessBasicsStep({ formData, updateField }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tell Us About Your Business</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">Business Name *</label>
          <input
            value={formData.business_name}
            onChange={(e) => updateField("business_name", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
            placeholder="e.g., TechCorp Solutions"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Industry *</label>
          <select
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Target Audience</label>
          <textarea
            value={formData.target_audience}
            onChange={(e) => updateField("target_audience", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
            rows={3}
            placeholder="Who are your ideal customers?"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Elevator Pitch</label>
          <textarea
            value={formData.elevator_pitch}
            onChange={(e) => updateField("elevator_pitch", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
            rows={2}
            placeholder="In one sentence, what does your business do?"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Your Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
            placeholder="you@email.com"
          />
        </div>
      </div>
    </div>
  );
}

function BrandIdentityStep({ formData, updateField }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Brand Identity</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">Brand Tone</label>
          <select
            value={formData.brand_tone}
            onChange={(e) => updateField("brand_tone", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {BRAND_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Preferred Colors</label>
          <input
            value={formData.colors}
            onChange={(e) => updateField("colors", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
            placeholder="#4169E1, #BF00FF"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Tagline Ideas</label>
          <input
            value={formData.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
            placeholder="e.g., Building empires on autopilot"
          />
        </div>
      </div>
    </div>
  );
}

interface WebsiteBriefProps {
  formData: FormData;
  pkg: PackageDefinition;
  togglePage: (id: string) => void;
}

function WebsiteBriefStep({ formData, pkg, togglePage }: WebsiteBriefProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Website Brief</h2>
      <p className="text-white/60 text-sm mb-6">Select up to {pkg.maxPages} pages for your site.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {WEBSITE_PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => togglePage(page.id)}
            className={`p-3 rounded-lg text-sm border transition-all ${
              formData.pages.includes(page.id)
                ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]"
                : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"
            }`}
          >
            {formData.pages.includes(page.id) ? "✓ " : ""}{page.name}
          </button>
        ))}
      </div>
      {formData.pages.length >= pkg.maxPages && (
        <div className="flex items-center gap-2 text-[#D4AF37] text-sm mb-4">
          <AlertCircle size={16} /> Maximum {pkg.maxPages} pages selected for this plan.
        </div>
      )}
    </div>
  );
}

interface AutomationNeedsProps {
  formData: FormData;
  pkg: PackageDefinition;
  toggleAutomation: (id: string) => void;
}

function AutomationNeedsStep({ formData, pkg, toggleAutomation }: AutomationNeedsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose Your Automations</h2>
      <p className="text-white/60 text-sm mb-6">Select up to {pkg.maxAutomations} automations for your plan.</p>
      <div className="grid md:grid-cols-2 gap-3">
        {AUTOMATION_MODULES.map((a) => (
          <button
            key={a.id}
            onClick={() => toggleAutomation(a.id)}
            className={`p-4 rounded-lg text-left border transition-all ${
              formData.automations_selected.includes(a.id)
                ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]"
                : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"
            }`}
          >
            <div className="font-bold text-sm">{formData.automations_selected.includes(a.id) ? "✓ " : ""}{a.name}</div>
            <div className="text-xs text-white/50 mt-1">{a.description}</div>
          </button>
        ))}
      </div>
      {formData.automations_selected.length >= pkg.maxAutomations && pkg.maxAutomations < 999 && (
        <div className="flex items-center gap-2 text-[#D4AF37] text-sm mt-4">
          <AlertCircle size={16} /> Maximum {pkg.maxAutomations} automations selected.
        </div>
      )}
    </div>
  );
}

interface FundingGoalsProps {
  formData: FormData;
  toggleFundingType: (id: string) => void;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

function FundingGoalsStep({ formData, toggleFundingType, updateField }: FundingGoalsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Funding Goals</h2>
      <div className="space-y-6">
        <div>
          <label className="text-sm text-white/60 mb-2 block">
            Funding Amount: <span className="text-[#00FFFF] font-bold">${formData.funding_amount.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={formData.funding_amount}
            onChange={(e) => updateField("funding_amount", Number(e.target.value))}
            className="w-full accent-[#BF00FF]"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-2 block">Preferred Funding Types</label>
          <div className="grid grid-cols-2 gap-3">
            {FUNDING_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleFundingType(type.id)}
                className={`p-3 rounded-lg text-sm border transition-all ${
                  formData.funding_types.includes(type.id)
                    ? "bg-[#4169E1]/20 border-[#00FFFF] text-[#00FFFF]"
                    : "bg-[#0A0A1A] border-[#4169E1]/20 text-white/70"
                }`}
              >
                {formData.funding_types.includes(type.id) ? "✓ " : ""}{type.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Timeline</label>
          <select
            value={formData.funding_timeline}
            onChange={(e) => updateField("funding_timeline", e.target.value)}
            className="w-full bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {["ASAP", "1-3 months", "3-6 months", "6-12 months"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

interface ReviewProps {
  formData: FormData;
  pkg: PackageDefinition;
}

function ReviewStep({ formData, pkg }: ReviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review & Launch</h2>
      <div className="bg-[#0A0A1A] border border-[#4169E1]/20 rounded-xl p-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Plan:</span><span className="text-[#00FFFF] font-bold">{pkg.name}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Business:</span><span>{formData.business_name}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Industry:</span><span>{formData.industry}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Brand Tone:</span><span>{formData.brand_tone}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Website Pages:</span><span>{formData.pages.length} selected</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Automations:</span><span>{formData.automations_selected.length} selected</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Funding:</span><span>${formData.funding_amount.toLocaleString()}</span></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/60">Email:</span><span>{formData.email}</span></div>
      </div>
    </div>
  );
}
