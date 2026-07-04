import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import type { PackageDefinition } from "../lib/constants";

interface PackageCardProps {
  pkg: PackageDefinition;
  onSelect: () => void;
  index: number;
}

export default function PackageCard({ pkg, onSelect, index }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl p-6 transition-all hover:scale-[1.02]",
        pkg.popular
          ? "bg-[#1a1a2e]/80 border-2 border-[#BF00FF] shadow-lg shadow-[#BF00FF]/20"
          : "bg-[#1a1a2e]/50 border border-[#4169E1]/20"
      )}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#BF00FF] text-white text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}

      <h3 className="font-bold text-xl mb-1">{pkg.name}</h3>
      <p className="text-white/50 text-sm mb-4">{pkg.description}</p>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-black">{pkg.price}</span>
        <span className="text-white/40 text-sm">{pkg.billing}</span>
      </div>

      <ul className="space-y-2 text-sm text-white/70 mb-6">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check size={16} className="text-[#00C853] mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={cn(
          "w-full font-bold py-3 rounded-lg transition-all",
          pkg.popular
            ? "bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white hover:from-[#3158D0] hover:to-[#A600DD]"
            : "bg-white/5 border border-[#4169E1]/30 text-white hover:bg-[#4169E1]/20"
        )}
      >
        Choose {pkg.name}
      </button>
    </motion.div>
  );
}
