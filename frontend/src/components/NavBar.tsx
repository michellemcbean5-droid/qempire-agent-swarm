import { Link, useLocation } from "wouter";
import QBot from "./QBot";

const LINKS = [
  { href: "/#swarm", label: "The Swarm" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/command", label: "Live Demo" },
];

export default function NavBar() {
  const [, navigate] = useLocation();

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
            onClick={() => navigate("/command")}
            className="hidden rounded-full glass px-4 py-2 text-sm font-medium text-ink transition hover:border-white/25 sm:block"
          >
            Try Q-Bot
          </button>
          <button
            onClick={() => navigate("/checkout/empire-pro")}
            className="rounded-full btn-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
