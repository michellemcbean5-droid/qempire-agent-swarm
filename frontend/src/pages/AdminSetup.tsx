import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, KeyRound, Check, Loader2, ShieldCheck, Save, Eye, EyeOff } from "lucide-react";
import NavBar from "../components/NavBar";
import QBot from "../components/QBot";
import { getAdminConfig, claimAdmin, getKeyStatus, saveKeys, type KeyStatus } from "../lib/api";

interface Field {
  key: string;
  label: string;
  placeholder: string;
  secret?: boolean;
}

const GROUPS: { title: string; hint: string; fields: Field[] }[] = [
  {
    title: "Model (Kimi)",
    hint: "Powers Q-Bot's brain for paid users.",
    fields: [
      { key: "KIMI_API_KEY", label: "Kimi / Moonshot API key", placeholder: "sk-…", secret: true },
      { key: "KIMI_MODEL", label: "Kimi model (optional)", placeholder: "kimi-k2.5" },
    ],
  },
  {
    title: "Fallback model",
    hint: "Used only if Kimi isn't set.",
    fields: [{ key: "ANTHROPIC_API_KEY", label: "Anthropic Claude API key", placeholder: "sk-ant-…", secret: true }],
  },
  {
    title: "Billing (Stripe)",
    hint: "Collects subscriptions + credit packs.",
    fields: [
      { key: "STRIPE_SECRET_KEY", label: "Stripe secret key", placeholder: "sk_live_… / sk_test_…", secret: true },
      { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe webhook secret", placeholder: "whsec_…", secret: true },
      { key: "STRIPE_PRICE_CURRENT", label: "Price ID · Standard ($14)", placeholder: "price_…" },
      { key: "STRIPE_PRICE_REEF", label: "Price ID · Plus ($28)", placeholder: "price_…" },
      { key: "STRIPE_PRICE_DEEP_BLUE", label: "Price ID · Pro ($140)", placeholder: "price_…" },
      { key: "STRIPE_PRICE_PACK_5K", label: "Price ID · 5,000 credit pack", placeholder: "price_…" },
      { key: "STRIPE_PRICE_PACK_20K", label: "Price ID · 20,000 credit pack", placeholder: "price_…" },
    ],
  },
  {
    title: "Deploy & comms",
    hint: "Publish client sites, send email, track CRM.",
    fields: [
      { key: "GITHUB_TOKEN", label: "GitHub token", placeholder: "ghp_…", secret: true },
      { key: "GITHUB_USERNAME", label: "GitHub username", placeholder: "your-username" },
      { key: "GMAIL_ADDRESS", label: "Gmail address", placeholder: "you@gmail.com" },
      { key: "GMAIL_APP_PASSWORD", label: "Gmail app password", placeholder: "16-char app password", secret: true },
      { key: "GOOGLE_SHEET_ID", label: "Google Sheet ID", placeholder: "1AbC…" },
    ],
  },
];

export default function AdminSetup() {
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<KeyStatus | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminConfig()
      .then((c) => setConfigured(c.configured))
      .catch(() => toast.error("Can't reach the server. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  const claim = async () => {
    setBusy(true);
    try {
      const s = await claimAdmin(token);
      setStatus(s);
      setConfigured(true);
      setUnlocked(true);
      toast.success("Password set — you're in.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not set password.");
    } finally {
      setBusy(false);
    }
  };

  const unlock = async () => {
    setBusy(true);
    try {
      const s = await getKeyStatus(token);
      setStatus(s);
      setUnlocked(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Wrong password.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const s = await saveKeys(token, values);
      setStatus(s);
      setValues({});
      toast.success(`Saved ${s.saved ?? 0} key${s.saved === 1 ? "" : "s"} securely.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-gold">
            <Lock size={13} /> Owner only · Admin setup
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-gradient-gold">Paste your keys, once.</h1>
          <p className="mx-auto mt-3 max-w-md text-mist">
            No files. No terminal. Enter your keys here and they're stored safely on the server.
          </p>
        </div>

        {loading ? (
          <div className="mt-14 flex justify-center">
            <Loader2 className="animate-spin text-cyan" />
          </div>
        ) : !unlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 max-w-sm rounded-3xl glass-strong p-6 text-center"
          >
            <QBot size={52} className="mx-auto" />
            <h2 className="mt-3 font-display text-lg font-bold">
              {configured ? "Enter admin password" : "Create your admin password"}
            </h2>
            <p className="mt-1 text-sm text-mist">
              {configured ? "Unlock to manage your keys." : "You're the first here — pick a password to lock this page."}
            </p>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && token && (configured ? unlock() : claim())}
              placeholder={configured ? "Admin password" : "Choose a password (6+ chars)"}
              className="mt-4 w-full rounded-xl glass px-4 py-3 text-center text-sm text-ink placeholder:text-mist/50 focus:outline-none"
            />
            <button
              onClick={configured ? unlock : claim}
              disabled={!token || busy}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl btn-brand py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
              {configured ? "Unlock" : "Set password & continue"}
            </button>
          </motion.div>
        ) : (
          <div className="mt-8 space-y-5">
            {GROUPS.map((g) => (
              <div key={g.title} className="rounded-3xl glass-strong p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> {g.title}
                </div>
                <p className="mt-0.5 text-xs text-mist">{g.hint}</p>
                <div className="mt-4 space-y-3">
                  {g.fields.map((f) => {
                    const st = status?.keys[f.key];
                    return (
                      <div key={f.key}>
                        <label className="flex items-center justify-between text-xs text-mist">
                          <span>{f.label}</span>
                          {st?.set && (
                            <span className="inline-flex items-center gap-1 text-cyan">
                              <Check size={11} /> set{st.preview && <span className="text-mist/60"> · {st.preview}</span>}
                            </span>
                          )}
                        </label>
                        <div className="mt-1 flex items-center gap-2 rounded-xl glass px-3 py-2">
                          <input
                            type={f.secret && !reveal[f.key] ? "password" : "text"}
                            value={values[f.key] ?? ""}
                            onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                            placeholder={st?.set ? "•••• (leave blank to keep)" : f.placeholder}
                            className="flex-1 bg-transparent text-sm text-ink placeholder:text-mist/40 focus:outline-none"
                          />
                          {f.secret && (
                            <button
                              onClick={() => setReveal({ ...reveal, [f.key]: !reveal[f.key] })}
                              className="text-mist hover:text-ink"
                            >
                              {reveal[f.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={save}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl btn-gold py-3.5 text-base font-bold disabled:opacity-50"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save keys
            </button>
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-mist/70">
              <ShieldCheck size={13} /> Stored server-side, never shown in full. Blank fields keep their current value.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
