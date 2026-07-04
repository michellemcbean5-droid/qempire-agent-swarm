import { ExternalLink, RefreshCw } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Website() {
  const { session } = useAuth();
  const websiteUrl = "https://example-qempire-site.github.io";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Live Website</h1>
        <p className="text-white/60">Preview, visit, and request changes to your generated site.</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg">{session?.businessName || "Your Business"} Website</h3>
            <p className="text-sm text-white/50">{websiteUrl}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white text-sm font-bold px-4 py-2 rounded-lg"
            >
              <ExternalLink size={16} /> Visit Live Site
            </a>
            <button className="inline-flex items-center gap-2 border border-[#4169E1]/30 text-white/70 text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#4169E1]/10 transition-all">
              <RefreshCw size={16} /> Request Changes
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-[#4169E1]/20 bg-[#0A0A1A] aspect-video">
          <iframe
            src={websiteUrl}
            title="Live Website Preview"
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
