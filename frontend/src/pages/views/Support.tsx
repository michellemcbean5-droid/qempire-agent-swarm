import { MessageSquare, Calendar, HelpCircle } from "lucide-react";

const faqs = [
  { q: "How long does the buildout take?", a: "Most business buildouts complete within 60-90 minutes after onboarding." },
  { q: "Can I change my subscription tier?", a: "Yes, you can upgrade or downgrade your plan at any time from your account settings." },
  { q: "What if I need custom automations?", a: "Enterprise plans include custom AI systems and unlimited automations." },
  { q: "How do I access my deliverables?", a: "All deliverables are available in this portal under Blueprint, Website, Automations, and Funding." },
];

export default function Support() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-white/60">Get help from Q-Bot or schedule a call with our team.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4169E1]/20 to-[#BF00FF]/20 flex items-center justify-center mb-4">
            <MessageSquare className="text-[#00FFFF]" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Chat with Q-Bot</h3>
          <p className="text-white/60 text-sm mb-4">Our AI assistant is available 24/7 to answer questions about your buildout.</p>
          <p className="text-xs text-white/40">Click the floating Q-Bot button in the bottom-right corner.</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4169E1]/20 to-[#BF00FF]/20 flex items-center justify-center mb-4">
            <Calendar className="text-[#00FFFF]" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Schedule a Call</h3>
          <p className="text-white/60 text-sm mb-4">Book a strategy call with a Q-Empire automation specialist.</p>
          <button className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white text-sm font-bold px-4 py-2 rounded-lg">
            Book Now
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><HelpCircle size={20} /> Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <h4 className="font-bold mb-1">{faq.q}</h4>
              <p className="text-sm text-white/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
