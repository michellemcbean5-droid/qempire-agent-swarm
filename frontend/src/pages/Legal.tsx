import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Check, PenLine, ChevronDown } from "lucide-react";
import NavBar from "../components/NavBar";
import QBot from "../components/QBot";
import { LEGAL_DOCS } from "../data/legal";
import { useAccount } from "../lib/account";

export default function Legal() {
  const [, navigate] = useLocation();
  const { account, update } = useAccount();
  const [open, setOpen] = useState<string>("nda");
  const [name, setName] = useState(account.ndaName);
  const [agreed, setAgreed] = useState(!!account.legalAcceptedAt);

  const accepted = !!account.legalAcceptedAt;

  const accept = () => {
    if (!name.trim() || !agreed) return;
    update({ legalAcceptedAt: new Date().toISOString(), ndaName: name.trim() });
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-cyan">
            <ShieldCheck size={13} /> Before you start
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Agreements &amp; paperwork</h1>
          <p className="mx-auto mt-3 max-w-xl text-mist">
            Quick and painless. Review these, sign the NDA, and you're cleared to build.
            {accepted && <span className="text-cyan"> You're all set. 👑</span>}
          </p>
        </div>

        {/* documents */}
        <div className="mt-8 space-y-3">
          {LEGAL_DOCS.map((d) => {
            const isOpen = open === d.id;
            return (
              <div key={d.id} className={`overflow-hidden rounded-2xl border ${isOpen ? "glass-strong" : "glass hairline"}`}>
                <button onClick={() => setOpen(isOpen ? "" : d.id)} className="flex w-full items-center gap-3 p-4 text-left">
                  <FileText size={18} className="shrink-0 text-cyan" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-ink">{d.title}</div>
                    <div className="truncate text-xs text-mist">{d.summary}</div>
                  </div>
                  <ChevronDown size={16} className={`shrink-0 text-mist transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t hairline">
                    <div className="space-y-2 p-4 text-sm leading-relaxed text-ink/85">
                      {d.body.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* sign */}
        <div className="mt-8 rounded-3xl glass-strong p-6 glow-cyan">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <PenLine size={16} className="text-gold" /> Sign the NDA &amp; accept
          </div>
          {accepted ? (
            <div className="mt-4 rounded-2xl bg-cyan/10 p-4 text-sm text-cyan">
              <Check size={15} className="mb-1 inline" /> Signed by <span className="font-semibold">{account.ndaName}</span> on{" "}
              {new Date(account.legalAcceptedAt).toLocaleDateString()}. You can start building.
              <div className="mt-3">
                <button onClick={() => navigate("/idea")} className="rounded-full btn-brand px-4 py-2 text-xs font-semibold text-white">Start with my idea →</button>
              </div>
            </div>
          ) : (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your full legal name"
                className="mt-4 w-full rounded-xl glass px-4 py-3 text-sm text-ink placeholder:text-mist/50 focus:outline-none"
              />
              <label className="mt-3 flex items-start gap-2 text-sm text-ink/90">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-[#22e0ff]" />
                <span>I have read and agree to the Mutual NDA, Terms of Service, Privacy Policy, Earnings Disclaimer, and Refund policy above.</span>
              </label>
              <button onClick={accept} disabled={!name.trim() || !agreed} className="mt-4 w-full rounded-xl btn-gold py-3 text-sm font-bold disabled:opacity-50">
                Sign &amp; continue
              </button>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-mist/70">
                <QBot size={16} /> These are plain-language templates. For your protection, have a lawyer review them before going live.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
