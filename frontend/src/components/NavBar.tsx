import { Link, useLocation } from "wouter";
import { Zap } from "lucide-react";
import QBot from "./QBot";
import { useAccount } from "../lib/account";

const LINKS = [
  { href: "/idea", label: "Idea Builder" },
  { href: "/simulator", label: "Path to $1M" },
  { href: "/formula", label: "Formula" },
  { href: "/connectors", label: "Connectors" },
  { href: "/#pricing", label: "Pricing" },
];

export default function NavBar() {
  const [, navigate] = useLocation();
  const { account } = useAccount();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b hairline bg-abyss/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <QBot size={38} />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-wide text-gradient-gold">Q-EMPIRE</div>
            <div className="text-[9px] tracking-[0.3em] text-cyan/80">AI · AUTOMATION</div>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-mist transition hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/account")}
            className="hidden items-center gap-1.5 rounded-full glass px-3 py-2 text-xs font-medium text-ink transition hover:border-white/25 sm:flex"
            title="Credits"
          >
            <Zap size={13} className="text-gold" /> {account.credits.toLocaleString()}
          </button>
          <button
            onClick={() => navigate("/command")}
            className="rounded-full btn-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Try Q-Bot
          </button>
        </div>
      </div>
    </nav>
  );
}
