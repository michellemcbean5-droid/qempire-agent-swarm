import { useMemo, useState } from "react";
import { Search, Check, Plus, Link2, MapPin } from "lucide-react";
import NavBar from "../components/NavBar";
import { CONNECTORS, CONNECTOR_CATEGORIES, CONNECTOR_COUNT, connectorGradient } from "../data/connectors";
import { useAccount } from "../lib/account";

export default function Connectors() {
  const { account, toggleConnector } = useAccount();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONNECTORS.filter(
      (c) =>
        (cat === "All" || c.category === cat) &&
        (!q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
    );
  }, [query, cat]);

  const connectedCount = account.connectors.length;

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
        {/* header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-cyan">
            <Link2 size={13} /> {CONNECTOR_COUNT}+ connectors · plus a choice of maps
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Connect Q-Bot to your world</h1>
          <p className="mx-auto mt-3 max-w-xl text-mist">
            Pick from {CONNECTOR_COUNT} integrations. Q-Bot acts through the tools you already use —
            from Stripe to Shopify to Google Maps.
          </p>
          {connectedCount > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-xs text-cyan">
              <Check size={13} /> {connectedCount} connected
            </div>
          )}
        </div>

        {/* search */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="glass-strong flex items-center gap-2 rounded-2xl px-4 py-2.5">
            <Search size={17} className="text-mist" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 224 connectors…"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-mist/60 focus:outline-none"
            />
          </div>
        </div>

        {/* category filter */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["All", ...CONNECTOR_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                cat === c ? "btn-brand text-white" : "glass text-mist hover:text-ink"
              }`}
            >
              {c === "Maps & Location" ? (
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> Maps</span>
              ) : (
                c
              )}
            </button>
          ))}
        </div>

        {/* grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => {
            const on = account.connectors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleConnector(c.name)}
                className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  on ? "border-cyan/50 bg-cyan/[0.07] glow-cyan" : "hairline glass hover:border-white/25"
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${connectorGradient(c.name)} text-sm font-bold text-white`}>
                  {c.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{c.name}</div>
                  <div className="truncate text-[11px] text-mist">{c.category}</div>
                </div>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${on ? "bg-cyan text-abyss" : "border hairline text-mist group-hover:text-ink"}`}>
                  {on ? <Check size={13} /> : <Plus size={13} />}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-mist">No connectors match “{query}”.</p>
        )}
      </div>
    </div>
  );
}
