// The Q-Empire connector marketplace — 190+ integrations Q-Bot can act through,
// grouped by category. Maps & Location is its own category (the "choice of maps").

export interface Connector {
  name: string;
  category: string;
}

// name lists per category (kept compact; deduped at export)
const CATALOG: Record<string, string[]> = {
  "CRM & Sales": [
    "HubSpot", "Salesforce", "Pipedrive", "Zoho CRM", "Close", "Copper", "Freshsales",
    "Keap", "Insightly", "Attio", "Folk", "monday CRM", "Nutshell", "Streak",
  ],
  "Email & Marketing": [
    "Mailchimp", "SendGrid", "Klaviyo", "ActiveCampaign", "ConvertKit", "Constant Contact",
    "Brevo", "Customer.io", "Mailgun", "Postmark", "Drip", "MailerLite", "Beehiiv", "Loops",
  ],
  "Payments & Billing": [
    "Stripe", "PayPal", "Square", "Braintree", "Chargebee", "RevenueCat", "Paddle",
    "Recurly", "Wise", "Plaid", "GoCardless", "Lemon Squeezy",
  ],
  "Social & Content": [
    "Buffer", "Hootsuite", "Metricool", "Later", "Sprout Social", "TikTok", "Instagram",
    "Facebook", "LinkedIn", "X (Twitter)", "YouTube", "Pinterest", "Threads", "Reddit",
  ],
  "Advertising": [
    "Google Ads", "Meta Ads", "TikTok Ads", "LinkedIn Ads", "Microsoft Ads", "Reddit Ads",
    "Snapchat Ads", "Taboola",
  ],
  "Productivity & Docs": [
    "Notion", "Airtable", "Google Sheets", "Google Docs", "Google Drive", "Microsoft 365",
    "Coda", "ClickUp", "Asana", "Trello", "monday.com", "Basecamp", "Todoist", "Confluence",
  ],
  "Communication": [
    "Slack", "Microsoft Teams", "Discord", "Twilio", "Telegram", "WhatsApp", "Zoom",
    "Google Meet", "Intercom", "Front", "Crisp", "Vonage",
  ],
  "Support & Helpdesk": [
    "Zendesk", "Freshdesk", "Help Scout", "Gorgias", "Kustomer", "Gladly", "Tawk.to", "HelpCrunch",
  ],
  "Dev & Cloud": [
    "GitHub", "GitLab", "Bitbucket", "Vercel", "Netlify", "Cloudflare", "AWS", "Google Cloud",
    "Azure", "DigitalOcean", "Supabase", "Firebase",
  ],
  "Data & Analytics": [
    "Google Analytics", "Mixpanel", "Amplitude", "PostHog", "Segment", "Snowflake", "BigQuery",
    "MotherDuck", "Metabase", "Looker", "Hex", "Fivetran",
  ],
  "AI & Models": [
    "OpenAI", "Anthropic", "Google Gemini", "Mistral", "OpenRouter", "Hugging Face", "Groq",
    "Perplexity", "ElevenLabs", "HeyGen", "Replicate", "Stability AI",
  ],
  "E-commerce": [
    "Shopify", "WooCommerce", "BigCommerce", "Etsy", "Amazon", "eBay", "Squarespace", "Wix",
    "Webflow", "Ecwid", "Gumroad", "Whatnot",
  ],
  "Scheduling & Booking": [
    "Calendly", "Cal.com", "Acuity", "SavvyCal", "YouCanBook.me", "Setmore", "Doodle", "Google Calendar",
  ],
  "Docs & E-signature": [
    "PandaDoc", "DocuSign", "Dropbox Sign", "Adobe Sign", "SignNow", "Docsketch", "Concord", "Ironclad",
  ],
  "Storage & Files": [
    "Dropbox", "Box", "OneDrive", "pCloud", "Egnyte", "MEGA", "Backblaze", "Wasabi",
  ],
  "Finance & Accounting": [
    "QuickBooks", "Xero", "FreshBooks", "Wave", "Bill.com", "Ramp", "Brex", "Expensify", "Mercury", "Gusto",
  ],
  "HR & Hiring": [
    "BambooHR", "Rippling", "Deel", "Workable", "Greenhouse", "Lever", "Indeed", "LinkedIn Recruiter",
  ],
  "Forms & Surveys": [
    "Typeform", "JotForm", "Google Forms", "SurveyMonkey", "Tally", "Formstack", "Paperform", "Fillout",
  ],
  "Design & Creative": [
    "Canva", "Figma", "Adobe Express", "Magnific", "Midjourney", "Descript", "Kapwing", "Photoroom",
  ],
  "Automation & iPaaS": [
    "Zapier", "Make", "n8n", "Workato", "Tray.io", "IFTTT", "Pipedream", "Activepieces",
  ],
  "Research & Scraping": [
    "Playwright", "Apify", "Semrush", "Explorium", "Parallel", "Bright Data",
  ],
  "Maps & Location": [
    "Google Maps", "Mapbox", "HERE", "OpenStreetMap", "Foursquare", "Radar", "TomTom", "Geoapify",
  ],
};

// Flatten + dedupe by name.
const seen = new Set<string>();
export const CONNECTORS: Connector[] = Object.entries(CATALOG).flatMap(([category, names]) =>
  names
    .filter((n) => (seen.has(n) ? false : (seen.add(n), true)))
    .map((name) => ({ name, category }))
);

export const CONNECTOR_CATEGORIES = Object.keys(CATALOG);
export const CONNECTOR_COUNT = CONNECTORS.length;

// A short, curated set for the homepage marquee.
export const FEATURED_CONNECTORS = [
  "Stripe", "PayPal", "HubSpot", "Shopify", "Twilio", "Google Maps", "Notion", "Slack",
  "Canva", "TikTok", "OpenAI", "Webflow", "Airtable", "Mailchimp", "Calendly", "GitHub",
];

// A deterministic gradient per connector, from its name (brandless but distinct).
export function connectorGradient(name: string): string {
  const palettes = [
    "from-cyan/30 to-blue-500/20",
    "from-purple/30 to-fuchsia-500/20",
    "from-magenta/30 to-pink-500/20",
    "from-gold/30 to-amber-500/20",
    "from-emerald-400/30 to-teal-500/20",
    "from-sky-400/30 to-indigo-500/20",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}
