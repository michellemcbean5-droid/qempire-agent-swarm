import { Calendar, DollarSign, FileText } from "lucide-react";

const grants = [
  { name: "Small Business Innovation Grant", amount: "$25,000", deadline: "2026-08-15", status: "Not Started" },
  { name: "Minority Founder Fund", amount: "$50,000", deadline: "2026-09-01", status: "In Progress" },
  { name: "Local Economic Development Loan", amount: "$100,000", deadline: "2026-10-30", status: "Not Started" },
];

export default function Funding() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Funding Strategy</h1>
        <p className="text-white/60">Grants, loans, and investor opportunities matched to your business.</p>
      </div>

      <div className="grid gap-4">
        {grants.map((grant, index) => (
          <div key={index} className="glass-card rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg mb-1">{grant.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {grant.amount}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Due {grant.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  grant.status === "In Progress" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-white/10 text-white/50"
                }`}>
                  {grant.status}
                </span>
                <button className="inline-flex items-center gap-2 border border-[#4169E1]/30 text-white/70 text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#4169E1]/10 transition-all">
                  <FileText size={16} /> View Application
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
