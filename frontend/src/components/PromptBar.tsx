import { useState } from "react";
import { ArrowUp, Paperclip, Sparkles, Rocket, Globe, Landmark, Workflow } from "lucide-react";
import { SUGGESTIONS } from "../data/swarm";

const ICONS: Record<string, typeof Rocket> = { Rocket, Globe, Landmark, Workflow };

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

/**
 * Command box: a large rounded input where the user tells Q-Bot
 * what to build, with quick-start suggestion chips.
 */
export default function PromptBar({
  onSubmit,
  placeholder = "Tell Q-Bot what you want to build…",
  showSuggestions = true,
  autoFocus = false,
}: PromptBarProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
  };

  return (
    <div className="w-full">
      <div className="glass-strong rounded-3xl p-2.5 shadow-2xl shadow-black/40 focus-within:glow-cyan transition-shadow">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-mist hover:text-ink hover:bg-white/5 transition"
            aria-label="Attach"
          >
            <Paperclip size={18} />
          </button>
          <textarea
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-relaxed text-ink placeholder:text-mist/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl btn-brand text-white disabled:opacity-40 disabled:shadow-none"
            aria-label="Send to Q-Bot"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-mist/70 mr-1">
            <Sparkles size={13} className="text-cyan" /> Try:
          </span>
          {SUGGESTIONS.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <button
                key={s.label}
                onClick={() => onSubmit(s.prompt)}
                className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-xs text-ink/90 hover:text-white hover:border-white/25 transition"
              >
                <Icon size={13} className="text-cyan" />
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
