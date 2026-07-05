import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Gauge, DollarSign, Rocket, Crown, ArrowRight } from "lucide-react";
import NavBar from "../components/NavBar";
import QBot from "../components/QBot";

const money = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${Math.round(n)}`;

const MONTHS = 36;

export default function Simulator() {
  const [, navigate] = useLocation();
  const [rev0, setRev0] = useState(1500); // starting monthly revenue
  const [price, setPrice] = useState(250); // avg sale price
  const [autopilot, setAutopilot] = useState(3); // 1-5 automation level

  const sim = useMemo(() => {
    const g = 0.05 + autopilot * 0.045; // monthly growth from automation (9.5%–27.5%)
    const cap = 250_000; // realistic monthly ceiling
    const series: number[] = [];
    let cumulative = 0;
    let monthToMillionRunRate = -1;
    for (let m = 0; m <= MONTHS; m++) {
      const rev = Math.min(cap, rev0 * Math.pow(1 + g, m));
      series.push(rev);
      cumulative += rev;
      if (monthToMillionRunRate === -1 && rev * 12 >= 1_000_000) monthToMillionRunRate = m;
    }
    const finalRunRate = series[MONTHS] * 12;
    const maxY = Math.max(...series);
    return { g, series, cumulative, monthToMillionRunRate, finalRunRate, maxY };
  }, [rev0, price, autopilot]);

  // Build the chart geometry.
  const W = 640, H = 240, pad = 8;
  const pts = sim.series.map((v, i) => {
    const x = pad + (i / MONTHS) * (W - pad * 2);
    const y = H - pad - (v / sim.maxY) * (H - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`;

  const milestones = [
    { label: "$10K/mo", v: 10_000 },
    { label: "$50K/mo", v: 50_000 },
    { label: "$100K/mo", v: 100_000 },
    { label: "$1M/yr", v: 1_000_000 / 12 },
  ].map((m) => {
    const idx = sim.series.findIndex((v) => v >= m.v);
    return { ...m, month: idx === -1 ? null : idx };
  });

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-24">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-gold">
            <Crown size={13} /> Interactive · Path to a Million
          </motion.div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Your roadmap to <span className="text-gradient-gold">$1,000,000</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-mist">
            Drag the sliders to your real numbers. Watch how automations running 24/7 compound a
            small start into a seven-figure business.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Controls */}
          <div className="rounded-3xl glass-strong p-6">
            <Slider icon={<DollarSign size={15} className="text-cyan" />} label="Starting revenue / month"
              value={money(rev0)} min={0} max={20000} step={250} v={rev0} onChange={setRev0} />
            <Slider icon={<TrendingUp size={15} className="text-purple" />} label="Average sale price"
              value={money(price)} min={25} max={5000} step={25} v={price} onChange={setPrice} />
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-mist"><Gauge size={15} className="text-gold" /> Automation level</span>
                <span className="font-semibold text-ink">{["Manual", "Light", "Solid", "Heavy", "Full autopilot"][autopilot - 1]}</span>
              </div>
              <input type="range" min={1} max={5} step={1} value={autopilot} onChange={(e) => setAutopilot(+e.target.value)}
                className="w-full accent-[#22e0ff]" />
              <div className="mt-1 flex justify-between text-[10px] text-mist/60">
                {[1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
              </div>
              <p className="mt-2 text-xs text-mist">More automations = more of the work runs itself, 24/7.</p>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-cyan/10 to-purple/10 p-4 text-center">
              <div className="text-xs uppercase tracking-widest text-mist">Projected run-rate at 3 years</div>
              <motion.div key={sim.finalRunRate} initial={{ scale: 0.9, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl font-bold text-gradient-gold">
                {money(sim.finalRunRate)}<span className="text-lg text-mist">/yr</span>
              </motion.div>
              {sim.monthToMillionRunRate > 0 ? (
                <div className="mt-1 text-sm text-cyan">Hits $1M/yr in ~{sim.monthToMillionRunRate} months 🚀</div>
              ) : (
                <div className="mt-1 text-xs text-mist">Turn up automation to reach $1M/yr faster.</div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-3xl glass-strong p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Monthly revenue · 36 months</span>
              <span className="flex items-center gap-1.5 text-xs text-mist"><Sparkles size={12} className="text-cyan" /> on autopilot</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              <defs>
                <linearGradient id="simfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22e0ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="simline" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22e0ff" />
                  <stop offset="60%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ff2d95" />
                </linearGradient>
              </defs>
              <motion.polygon points={area} fill="url(#simfill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <motion.polyline
                points={line} fill="none" stroke="url(#simline)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                key={line} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeOut" }}
              />
              <motion.circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={5} fill="#ff2d95"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} />
            </svg>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {milestones.map((m) => (
                <div key={m.label} className="rounded-xl glass px-3 py-2 text-center">
                  <div className="text-sm font-bold text-gradient-gold">{m.label}</div>
                  <div className="text-[11px] text-mist">{m.month === null ? "push harder" : m.month === 0 ? "you're here" : `month ${m.month}`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl glass-strong p-8 text-center">
          <QBot size={56} className="animate-float" />
          <h2 className="font-display text-2xl font-bold">Like those numbers? Let's build it for real.</h2>
          <p className="max-w-lg text-sm text-mist">
            Q-Bot turns this projection into an actual business — brand, site and the exact
            automations that run it 24/7. Follow the step-by-step formula.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate("/formula")} className="inline-flex items-center gap-1.5 rounded-full btn-gold px-5 py-2.5 text-sm font-bold">
              See the Millionaire Formula <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/idea")} className="inline-flex items-center gap-1.5 rounded-full btn-brand px-5 py-2.5 text-sm font-semibold text-white">
              <Rocket size={15} /> Start with my idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ icon, label, value, min, max, step, v, onChange }: {
  icon: React.ReactNode; label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void;
}) {
  return (
    <div className="mt-4 first:mt-0">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-mist">{icon} {label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => onChange(+e.target.value)} className="w-full accent-[#22e0ff]" />
    </div>
  );
}
