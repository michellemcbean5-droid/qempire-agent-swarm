export const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "http://localhost:8080";

export const PACKAGES = {
  foundation: {
    id: "foundation",
    name: "Foundation Launchpad",
    price: "$1,997",
    billing: "one-time",
    maxAutomations: 3,
    maxPages: 3,
    tasks: ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING"],
    features: ["Business plan & pitch deck", "3-page website", "3 AI automations", "Funding strategy"],
    includesFunding: true,
    includesBranding: false,
  },
  "empire-pro": {
    id: "empire-pro",
    name: "Empire Builder Pro",
    price: "$4,997",
    billing: "one-time",
    maxAutomations: 10,
    maxPages: 7,
    tasks: ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING", "GENERATE_BRANDING"],
    features: ["Everything in Foundation", "5-7 page website + app plan", "10 AI automations", "Full funding activation"],
    includesFunding: true,
    includesBranding: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise AI",
    price: "$15,000+",
    billing: "custom",
    maxAutomations: 999,
    maxPages: 999,
    tasks: ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS"],
    features: ["Custom AI systems", "Multi-agent orchestration", "Legacy integration", "24/7 support"],
    includesFunding: false,
    includesBranding: true,
  },
  payg: {
    id: "payg",
    name: "Pay-As-You-Go",
    price: "$250+",
    billing: "per module",
    maxAutomations: 999,
    maxPages: 999,
    tasks: [],
    features: ["Individual modules", "No commitment", "Combine as needed", "Flexible pricing"],
    includesFunding: false,
    includesBranding: false,
  },
} as const;

export type PackageId = keyof typeof PACKAGES;

export const INDUSTRIES = [
  "Technology",
  "Health & Wellness",
  "E-commerce",
  "Professional Services",
  "Creative",
  "Education",
  "Food & Beverage",
  "Real Estate",
  "Other",
];

export const REVENUE_RANGES = [
  "Pre-revenue",
  "Under $10K/mo",
  "$10K-$50K/mo",
  "$50K-$100K/mo",
  "$100K+/mo",
];

export const BRAND_TONES = ["Professional", "Friendly", "Bold", "Luxurious", "Playful", "Minimal"];

export const WEBSITE_PAGES = [
  "Home",
  "About",
  "Services",
  "Pricing",
  "Contact",
  "Blog",
  "Portfolio",
  "Testimonials",
];

export const WEBSITE_FEATURES = [
  "Contact Form",
  "Booking Calendar",
  "Live Chat",
  "Payment Integration",
  "Newsletter Signup",
];

export const AUTOMATION_MODULES = [
  { id: "lead-chatbot", name: "Lead Capture Chatbot", description: "Collect visitor info via embedded chat widget (Tawk.to + Google Sheets)", icon: "💬" },
  { id: "email-welcome", name: "Email Welcome Sequence", description: "Send 3 emails over 7 days to new leads (Gmail + Apps Script)", icon: "📧" },
  { id: "email-followup", name: "Email Follow-up Sequence", description: "Re-engage cold leads after 14 days automatically", icon: "🔄" },
  { id: "crm-pipeline", name: "CRM Pipeline Setup", description: "Track leads through stages in Google Sheets", icon: "📊" },
  { id: "scheduling", name: "Appointment Scheduling", description: "Let clients book calls via Calendly (free tier)", icon: "📅" },
  { id: "invoice", name: "Invoice Automation", description: "Generate and send invoices via Google Docs + Apps Script", icon: "🧾" },
  { id: "payment-reminders", name: "Payment Reminders", description: "Follow up on unpaid invoices with time-triggered Gmail", icon: "💰" },
  { id: "reporting", name: "Monthly Reporting", description: "Auto-generate performance summaries from Google Sheets", icon: "📈" },
  { id: "social-posting", name: "Social Media Auto-posting", description: "Schedule posts across platforms (Buffer free tier)", icon: "📱" },
  { id: "client-onboarding", name: "Client Onboarding Flow", description: "Welcome new clients with docs and Drive folder creation", icon: "🎉" },
];

export const FUNDING_TYPES = [
  "Grants",
  "Bank Loans",
  "Angel Investors",
  "VC",
  "Crowdfunding",
];

export const FUNDING_TIMELINES = [
  "ASAP",
  "1-3 months",
  "3-6 months",
  "6-12 months",
];
