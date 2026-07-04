import { FileText, Presentation, Search } from "lucide-react";

const blueprintItems = [
  {
    title: "Business Plan",
    description: "10-page strategic business plan with market analysis, financial projections, and go-to-market strategy.",
    icon: FileText,
    status: "Ready",
    url: "#business-plan",
  },
  {
    title: "Pitch Deck",
    description: "12-slide investor-ready pitch deck with your brand story, traction, and funding ask.",
    icon: Presentation,
    status: "Ready",
    url: "#pitch-deck",
  },
  {
    title: "Market Research",
    description: "Competitor analysis, target audience insights, and industry trends for your niche.",
    icon: Search,
    status: "Ready",
    url: "#market-research",
  },
];

export default function Blueprint() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Business Blueprint</h1>
        <p className="text-white/60">Download and review your strategic business documents.</p>
      </div>

      <div className="grid gap-6">
        {blueprintItems.map((item) => (
          <div key={item.title} className="glass-card rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4169E1]/20 to-[#BF00FF]/20 flex items-center justify-center shrink-0">
                <item.icon className="text-[#00FFFF]" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <span className="text-xs bg-[#00C853]/20 text-[#00C853] px-2 py-1 rounded-full">{item.status}</span>
                </div>
                <p className="text-white/60 text-sm mb-4">{item.description}</p>
                <a
                  href={item.url}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4169E1] to-[#BF00FF] text-white text-sm font-bold px-4 py-2 rounded-lg hover:from-[#3158D0] hover:to-[#A600DD] transition-all"
                >
                  Download {item.title}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
