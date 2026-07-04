// Q-Empire 50-Agent War Machine — canonical data used across the app.

export interface Agent {
  id: number;
  name: string;
  connectors: string[];
  blurb: string;
}

export interface Division {
  id: number;
  name: string;
  tag: string;
  accent: "cyan" | "purple" | "magenta" | "gold" | "blue";
  goal: string;
  agents: Agent[];
}

export const DIVISIONS: Division[] = [
  {
    id: 1,
    name: "Acquisition",
    tag: "Div 01 · Agents 1–10",
    accent: "cyan",
    goal: "Find leads, steal competitor clients, and flood the pipeline.",
    agents: [
      { id: 1, name: "Competitor Spy", connectors: ["Semrush", "Playwright"], blurb: "Scrapes competitor sites & ad libraries." },
      { id: 2, name: "Prospector", connectors: ["Explorium"], blurb: "Finds exact contact info for target niches." },
      { id: 3, name: "Cold Striker", connectors: ["HubSpot", "Twilio"], blurb: "500 emails + 100 SMS per day." },
      { id: 4, name: "LinkedIn Hijacker", connectors: ["Buffer", "Playwright"], blurb: "Auto-comments & DMs warm prospects." },
      { id: 5, name: "Ad Sniper", connectors: ["TikTok Ads"], blurb: "Runs hyper-targeted trending ads." },
      { id: 6, name: "Viral Generator", connectors: ["HeyGen", "Magnific"], blurb: "AI videos of Michelle explaining ROI." },
      { id: 7, name: "SEO Dominator", connectors: ["Semrush", "Webflow"], blurb: "3 ranking blog posts a day." },
      { id: 8, name: "Social Poster", connectors: ["Metricool", "Buffer"], blurb: "Posts 10× a day, zero input." },
      { id: 9, name: "Chat Closer", connectors: ["Q-Bot", "Make"], blurb: "Qualifies & books via site chat." },
      { id: 10, name: "Lead Scorer", connectors: ["HubSpot", "MotherDuck"], blurb: "Routes hot vs. cold leads." },
    ],
  },
  {
    id: 2,
    name: "Sales & Closing",
    tag: "Div 02 · Agents 11–20",
    accent: "purple",
    goal: "Turn leads into cash — zero-touch closing.",
    agents: [
      { id: 11, name: "Call Booker", connectors: ["Calendly", "Twilio"], blurb: "Forces qualified leads onto the calendar." },
      { id: 12, name: "Sales Rep", connectors: ["Human"], blurb: "The one human in the loop — takes the call." },
      { id: 13, name: "Call Analyzer", connectors: ["Parallel"], blurb: "Transcribes calls in real time." },
      { id: 14, name: "Proposal Architect", connectors: ["PandaDoc"], blurb: "Custom proposal within 5 minutes." },
      { id: 15, name: "Objection Crusher", connectors: ["HubSpot"], blurb: "Counters objections raised on the call." },
      { id: 16, name: "Urgency Driver", connectors: ["Twilio"], blurb: "24-hour promo-expiry nudges." },
      { id: 17, name: "Contract Closer", connectors: ["PandaDoc"], blurb: "Executes the MSA & SOW." },
      { id: 18, name: "Cash Collector", connectors: ["Stripe", "PayPal"], blurb: "Hits the card for the deposit." },
      { id: 19, name: "Subscription Manager", connectors: ["RevenueCat", "Stripe"], blurb: "Recurring billing for Enterprise." },
      { id: 20, name: "Refund Denier", connectors: ["HubSpot"], blurb: "Enforces the no-refund policy." },
    ],
  },
  {
    id: 3,
    name: "Delivery",
    tag: "Div 03 · Agents 21–30",
    accent: "gold",
    goal: "Deliver the work faster than any human could.",
    agents: [
      { id: 21, name: "Onboarding Concierge", connectors: ["JotForm", "HubSpot"], blurb: "Sends intake the second Stripe clears." },
      { id: 22, name: "Project Architect", connectors: ["Airtable", "Notion"], blurb: "Builds roadmap + client portal." },
      { id: 23, name: "Blueprint Builder", connectors: ["OpenRouter", "Kimi"], blurb: "Business plan, research & pitch deck." },
      { id: 24, name: "Webflow Weaver", connectors: ["Webflow", "Canva"], blurb: "Clones template, brands, ships site." },
      { id: 25, name: "Workflow Engineer", connectors: ["Make", "n8n"], blurb: "Builds the client's automations." },
      { id: 26, name: "Funding Activator", connectors: ["Parallel"], blurb: "Scrapes grants & auto-fills applications." },
      { id: 27, name: "Code Writer", connectors: ["GitHub", "Serena"], blurb: "Custom scripts for Enterprise." },
      { id: 28, name: "QA Enforcer", connectors: ["Playwright"], blurb: "Tests every site & automation." },
      { id: 29, name: "Delivery Courier", connectors: ["Dropbox"], blurb: "Packages & ships branded assets." },
      { id: 30, name: "Client Nurturer", connectors: ["Twilio", "HubSpot"], blurb: "Day 3 / 7 / 14 progress updates." },
    ],
  },
  {
    id: 4,
    name: "Upsell & Retention",
    tag: "Div 04 · Agents 31–40",
    accent: "magenta",
    goal: "Maximize lifetime value per client.",
    agents: [
      { id: 31, name: "Upsell Sniper", connectors: ["HubSpot"], blurb: "Day-21 upgrade to Empire Pro." },
      { id: 32, name: "Retainer Pitcher", connectors: ["Stripe"], blurb: "Day-30 $1,500/mo retainer." },
      { id: 33, name: "Referral Agent", connectors: ["HubSpot"], blurb: "$500 cash per closed referral." },
      { id: 34, name: "Case Study Creator", connectors: ["Notion", "Canva"], blurb: "Turns wins into branded PDFs." },
      { id: 35, name: "Review Beggar", connectors: ["Twilio"], blurb: "Texts happy clients for reviews." },
      { id: 36, name: "Usage Monitor", connectors: ["Cloudflare", "PostHog"], blurb: "Tracks automation usage." },
      { id: 37, name: "Churn Preventer", connectors: ["HubSpot"], blurb: "Saves accounts when usage drops." },
      { id: 38, name: "Invoice Chaser", connectors: ["Stripe", "Twilio"], blurb: "Chases failed payments." },
      { id: 39, name: "Debt Collector", connectors: ["HubSpot"], blurb: "Collects deferred Fund-First balances." },
      { id: 40, name: "VIP Concierge", connectors: ["Slack"], blurb: "Priority-routes $15K clients." },
    ],
  },
  {
    id: 5,
    name: "HR & Payroll",
    tag: "Div 05 · Agents 41–50",
    accent: "blue",
    goal: "Build the human sales army — hands-off.",
    agents: [
      { id: 41, name: "Recruiter", connectors: ["Buffer", "LinkedIn"], blurb: "Posts closer jobs every Monday." },
      { id: 42, name: "Resume Screener", connectors: ["HubSpot"], blurb: "Auto-rejects unqualified applicants." },
      { id: 43, name: "Interview Bot", connectors: ["HeyGen", "Twilio"], blurb: "One-way video interviews." },
      { id: 44, name: "HR Intake Agent", connectors: ["PandaDoc"], blurb: "NDA, W9/1099 & agreements." },
      { id: 45, name: "Onboarding Trainer", connectors: ["Canva", "Dropbox"], blurb: "Welcome kit & sales scripts." },
      { id: 46, name: "Sales Coach", connectors: ["Notion", "Hugging Face"], blurb: "AI roleplay before live leads." },
      { id: 47, name: "Lead Router", connectors: ["HubSpot"], blurb: "Round-robins calls to reps." },
      { id: 48, name: "Performance Monitor", connectors: ["MotherDuck", "Slack"], blurb: "Fires reps under 10% close." },
      { id: 49, name: "Commission Tracker", connectors: ["Stripe", "Airtable"], blurb: "Calculates 10% commissions." },
      { id: 50, name: "Payroll Executor", connectors: ["PayPal"], blurb: "Auto-pays commissions Fridays." },
    ],
  },
];

export const ALL_AGENTS: Agent[] = DIVISIONS.flatMap((d) => d.agents);

export const CONNECTORS = [
  "Airtable", "Buffer", "Calendly", "Canva", "Cloudflare", "Dropbox", "Explorium",
  "GitHub", "HeyGen", "HubSpot", "Hugging Face", "Jotform", "Magnific", "Make",
  "Metricool", "MotherDuck", "Notion", "OpenRouter", "PandaDoc", "Parallel",
  "PayPal", "Playwright", "RevenueCat", "Semrush", "Serena", "Stripe",
  "TikTok Ads", "Twilio", "Webflow",
];

export interface Pkg {
  id: string;
  name: string;
  price: string;
  billing: string;
  tagline: string;
  features: string[];
  popular?: boolean;
}

export const PACKAGES: Pkg[] = [
  {
    id: "foundation",
    name: "Foundation",
    price: "$1,997",
    billing: "one-time",
    tagline: "The launchpad for solo founders.",
    features: ["Business plan & pitch deck", "3-page branded website", "3 AI automations", "Initial funding strategy"],
  },
  {
    id: "empire-pro",
    name: "Empire Builder Pro",
    price: "$4,997",
    billing: "one-time",
    tagline: "Full buildout with aggressive funding.",
    features: ["Everything in Foundation", "5–7 page site + app plan", "10 AI automations", "Full funding activation (grants, loans, VC)"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise AI",
    price: "$15K+",
    billing: "custom + retainer",
    tagline: "Custom multi-agent orchestration.",
    features: ["Custom AI systems engineering", "50-agent swarm orchestration", "Legacy integration & RAG", "24/7 support · GDPR/HIPAA"],
  },
  {
    id: "payg",
    name: "Pay-As-You-Go",
    price: "$250+",
    billing: "per module",
    tagline: "Build incrementally as you grow.",
    features: ["Individual modules à la carte", "Website, automations, funding", "No commitment", "Combine as needed"],
  },
];

// ---------- Do-It-Yourself (self-serve) plans ----------
// The DIY extension of qempireai.com: drive Q-Bot and build your own automations.
// Structure mirrors the leading AI-agent tool, priced 30% cheaper across the board.

export interface DiyPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  wasPrice: string; // the equivalent full-market price we undercut
  credits: string;
  save: string; // savings badge
  tagline: string;
  features: string[];
  popular?: boolean;
}

export const DIY_PLANS: DiyPlan[] = [
  {
    id: "diy-free",
    name: "Tide Pool",
    price: "$0",
    period: "forever",
    wasPrice: "",
    credits: "500 daily credits + 1,000 to start",
    save: "Free forever",
    tagline: "Test-drive Q-Bot. Build a workflow or two.",
    features: ["Full Q-Bot workspace", "500 refreshing credits/day", "Community templates", "1 active automation"],
  },
  {
    id: "diy-standard",
    name: "Current",
    price: "$14",
    period: "/mo",
    wasPrice: "$20",
    credits: "4,000 credits / month",
    save: "30% cheaper",
    tagline: "For parents building on the side.",
    features: ["Everything in Tide Pool", "4,000 monthly credits", "Up to 10 automations", "All connector templates", "Agent Mode"],
    popular: true,
  },
  {
    id: "diy-plus",
    name: "Reef",
    price: "$28",
    period: "/mo",
    wasPrice: "$40",
    credits: "8,000 credits / month",
    save: "30% cheaper",
    tagline: "Deeper research, sites & slides.",
    features: ["Everything in Current", "8,000 monthly credits", "Wide research", "Website & deck generation", "Up to 20 concurrent tasks"],
  },
  {
    id: "diy-pro",
    name: "Deep Blue",
    price: "$140",
    period: "/mo",
    wasPrice: "$200",
    credits: "40,000 credits / month",
    save: "Save $60/mo",
    tagline: "Run many automations at scale.",
    features: ["Everything in Reef", "40,000 monthly credits", "Sustained large-scale research", "Batch generation", "Priority everything"],
  },
];

export interface Suggestion {
  label: string;
  prompt: string;
  icon: string; // lucide icon name
}

export const SUGGESTIONS: Suggestion[] = [
  { label: "Launch a business", prompt: "Build my entire business — brand, website, automations and funding strategy.", icon: "Rocket" },
  { label: "Build a website", prompt: "Design and deploy a branded 5-page website for my company.", icon: "Globe" },
  { label: "Find funding", prompt: "Find grants and prepare funding applications for my startup.", icon: "Landmark" },
  { label: "Set up automations", prompt: "Set up lead capture, follow-up and CRM automations that run 24/7.", icon: "Workflow" },
];

// ---------- Credits & agent versions (Manus-style framework) ----------

// Everyone gets a daily refill of free credits on top of any plan credits.
export const DAILY_FREE_CREDITS = 500;

export interface AgentVersion {
  id: "lite" | "standard" | "pro";
  name: string;
  cost: number;          // credits per task run
  speed: string;
  blurb: string;
  best: string;
  recommended?: boolean;
}

// Three pickable Q-Bot versions — pick fast+cheap or deep+thorough.
export const AGENT_VERSIONS: AgentVersion[] = [
  {
    id: "lite",
    name: "Q-Bot Lite",
    cost: 1,
    speed: "Fastest",
    blurb: "Quick tasks, drafts, and simple automations.",
    best: "Everyday small jobs",
  },
  {
    id: "standard",
    name: "Q-Bot Standard",
    cost: 3,
    speed: "Balanced",
    blurb: "The all-rounder for building real deliverables.",
    best: "Websites, plans, automations",
    recommended: true,
  },
  {
    id: "pro",
    name: "Q-Bot Pro",
    cost: 8,
    speed: "Deep",
    blurb: "Maximum reasoning for complex, high-stakes work.",
    best: "Funding, research, multi-step builds",
  },
];
