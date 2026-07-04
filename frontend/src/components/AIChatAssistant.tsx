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

    // Simulated Q-Bot response based on context
    setTimeout(() => {
      const responses: Record<string, string> = {
        general: "I can help you choose a plan, walk you through onboarding, or explain how Q-Empire builds your business.",
        onboarding: "Take your time with each step. The more details you provide, the better Q-Bot can tailor your business buildout.",
        portal: "Your dashboard updates in real-time as Q-Bot completes each deliverable. You can download assets from each tab.",
      };
      setMessages((prev) => [...prev, { role: "assistant", content: responses[context] || responses.general }]);
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
