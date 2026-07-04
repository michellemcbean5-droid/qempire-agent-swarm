export interface PackageDefinition {
  id: string;
  name: string;
  price: string;
  priceNumeric: number;
  billing: string;
  description: string;
  features: string[];
  maxAutomations: number;
  maxPages: number;
  includesBlueprint: boolean;
  includesFunding: boolean;
  includesWebsite: boolean;
  popular: boolean;
  onboardingSteps: string[];
}

export const PACKAGES: PackageDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    priceNumeric: 49,
    billing: "/month",
    description: "Perfect for solopreneurs testing the waters",
    features: [
      "1 AI automation",
      "Basic business blueprint",
      "1-page landing site",
      "Email support",
      "Cancel anytime"
    ],
    maxAutomations: 1,
    maxPages: 1,
    includesBlueprint: true,
    includesFunding: false,
    includesWebsite: true,
    popular: false,
    onboardingSteps: ["business-basics", "brand-identity", "automation-needs", "review"]
  },
  {
    id: "foundation",
    name: "Foundation",
    price: "$199",
    priceNumeric: 199,
    billing: "/month",
    description: "For founders ready to automate their core operations",
    features: [
      "3 AI automations",
      "Full business blueprint & pitch deck",
      "3-page professional website",
      "Initial funding strategy",
      "Priority support (24-48 hrs)"
    ],
    maxAutomations: 3,
    maxPages: 3,
    includesBlueprint: true,
    includesFunding: true,
    includesWebsite: true,
    popular: false,
    onboardingSteps: ["business-basics", "brand-identity", "website-brief", "automation-needs", "funding-goals", "review"]
  },
  {
    id: "empire-pro",
    name: "Empire Pro",
    price: "$499",
    priceNumeric: 499,
    billing: "/month",
    description: "Full business buildout with aggressive automation",
    features: [
      "10 AI automations",
      "Advanced 5-7 page website",
      "Full funding activation",
      "Launch & scale strategy",
      "Priority support (12-24 hrs)"
    ],
    maxAutomations: 10,
    maxPages: 7,
    includesBlueprint: true,
    includesFunding: true,
    includesWebsite: true,
    popular: true,
    onboardingSteps: ["business-basics", "brand-identity", "website-brief", "automation-needs", "funding-goals", "review"]
  },
  {
    id: "enterprise",
    name: "Enterprise AI",
    price: "$1,997",
    priceNumeric: 1997,
    billing: "/month",
    description: "Custom AI systems for established businesses",
    features: [
      "Unlimited AI automations",
      "Custom app development",
      "Multi-agent orchestration",
      "RAG data infrastructure",
      "Dedicated account manager",
      "24/7 support + compliance"
    ],
    maxAutomations: 999,
    maxPages: 999,
    includesBlueprint: true,
    includesFunding: false,
    includesWebsite: true,
    popular: false,
    onboardingSteps: ["business-basics", "brand-identity", "website-brief", "automation-needs", "review"]
  }
];

export interface AutomationModule {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const AUTOMATION_MODULES: AutomationModule[] = [
  { id: "lead-chatbot", name: "Lead Capture Chatbot", description: "Q-Bot qualifies leads and collects info 24/7", icon: "MessageSquare" },
  { id: "email-welcome", name: "Email Welcome Sequence", description: "3-email series sent to new leads over 7 days", icon: "Mail" },
  { id: "email-followup", name: "Email Follow-up Sequence", description: "Re-engage cold leads after 14 days", icon: "MailPlus" },
  { id: "crm-pipeline", name: "CRM Pipeline Setup", description: "Track leads through stages in a visual dashboard", icon: "Kanban" },
  { id: "scheduling", name: "Appointment Scheduling", description: "Clients book directly into your calendar", icon: "Calendar" },
  { id: "invoice", name: "Invoice Automation", description: "Generate and send invoices automatically", icon: "Receipt" },
  { id: "payment-reminders", name: "Payment Reminders", description: "Follow up on unpaid invoices automatically", icon: "Bell" },
  { id: "reporting", name: "Monthly Reporting", description: "Auto-generated performance summaries", icon: "BarChart3" },
  { id: "social-posting", name: "Social Media Auto-posting", description: "Schedule and publish across platforms", icon: "Share2" },
  { id: "client-onboarding", name: "Client Onboarding Flow", description: "Welcome new clients with docs & next steps", icon: "UserPlus" }
];

export const INDUSTRIES = [
  "Technology",
  "Health & Wellness",
  "E-commerce",
  "Professional Services",
  "Creative",
  "Education",
  "Food & Beverage",
  "Real Estate",
  "Finance",
  "Other"
];

export const BRAND_TONES = ["Professional", "Friendly", "Bold", "Luxurious", "Playful", "Minimal"];

export const WEBSITE_PAGES = [
  { id: "home", name: "Home" },
  { id: "about", name: "About" },
  { id: "services", name: "Services" },
  { id: "pricing", name: "Pricing" },
  { id: "contact", name: "Contact" },
  { id: "blog", name: "Blog" },
  { id: "portfolio", name: "Portfolio" },
  { id: "testimonials", name: "Testimonials" }
];

export const FUNDING_TYPES = [
  { id: "grants", name: "Grants" },
  { id: "loans", name: "Bank Loans" },
  { id: "angel", name: "Angel Investors" },
  { id: "vc", name: "Venture Capital" },
  { id: "crowdfunding", name: "Crowdfunding" }
];
