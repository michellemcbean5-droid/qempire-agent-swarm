import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatAssistantProps {
  context?: string;
}

export default function AIChatAssistant({ context = "general" }: AIChatAssistantProps) {
  // context prop retained for future use (e.g., routing to different AI prompts)
  void context;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Q-Bot. How can I help you build your empire today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    // Simulated Q-Bot response with basic keyword matching
    setTimeout(() => {
      const lowerInput = userMessage.toLowerCase();
      let response = "I can help you choose a plan, walk you through onboarding, or explain how Q-Empire builds your business.";

      if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("plan")) {
        response = "We offer Starter ($49/mo), Foundation ($199/mo), Empire Pro ($499/mo), and Enterprise ($1,997/mo). Each tier includes more automations, pages, and features.";
      } else if (lowerInput.includes("onboard") || lowerInput.includes("wizard") || lowerInput.includes("form")) {
        response = "The onboarding wizard collects your business details, brand preferences, website pages, automations, and funding goals. It takes about 5 minutes.";
      } else if (lowerInput.includes("portal") || lowerInput.includes("dashboard") || lowerInput.includes("progress")) {
        response = "Your client portal shows real-time progress on your business blueprint, website, automations, and funding strategy.";
      } else if (lowerInput.includes("automation") || lowerInput.includes("bot")) {
        response = "Q-Bot can set up lead capture chatbots, email sequences, CRM pipelines, scheduling, invoicing, payment reminders, reporting, social posting, and client onboarding flows.";
      } else if (lowerInput.includes("website") || lowerInput.includes("site")) {
        response = "We generate a professional React website based on your brand, pages, and content. It deploys to GitHub Pages and is mobile-responsive.";
      } else if (lowerInput.includes("fund") || lowerInput.includes("grant") || lowerInput.includes("loan")) {
        response = "Our funding strategy identifies grants, loans, and investor opportunities matched to your industry and funding goals.";
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
        response = "Hello! I'm Q-Bot. How can I help you build your empire today?";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-[#1a1a2e] border border-[#4169E1]/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">Q</div>
                <span className="font-bold text-sm">Q-Bot Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-[#4169E1] text-white rounded-br-none"
                        : "bg-[#0A0A1A] text-white/80 border border-[#4169E1]/20 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[#4169E1]/20 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Q-Bot..."
                className="flex-1 bg-[#0A0A1A] border border-[#4169E1]/30 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white p-2 rounded-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white shadow-lg shadow-[#BF00FF]/30 flex items-center justify-center hover:scale-110 transition-transform"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
