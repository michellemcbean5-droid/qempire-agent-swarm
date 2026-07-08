export const COLORS = {
  dark: '#0A0A1A',
  blue: '#4169E1',
  purple: '#BF00FF',
  cyan: '#00FFFF',
  pink: '#FF007F',
  gold: '#D4AF37',
  success: '#00C853',
  warning: '#FFB300',
  error: '#FF1744',
};

export const PACKAGES: Package[] = [
  {
    id: 'foundation',
    name: 'Foundation Launchpad',
    price: 1997,
    billing: 'one_time',
    features: [
      'Business plan & pitch deck',
      '3-page website',
      '3 AI automations',
      'Funding strategy',
      'Email support',
    ],
    tier: 'basic',
  },
  {
    id: 'empire-pro',
    name: 'Empire Builder Pro',
    price: 4997,
    billing: 'one_time',
    features: [
      'Everything in Foundation',
      '5-7 page website + app plan',
      '10 AI automations',
      'Full funding activation',
      'Priority support',
      'AI market insights',
    ],
    popular: true,
    tier: 'pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise AI',
    price: 15000,
    billing: 'one_time',
    features: [
      'Custom AI systems',
      'Multi-agent orchestration',
      'Legacy integration',
      '24/7 dedicated support',
      'White-glove onboarding',
      'API access',
    ],
    tier: 'elite',
  },
];

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    maxProjects: 1,
    maxAutomations: 0,
    aiRequestsPerDay: 5,
    adsEnabled: true,
  },
  basic: {
    name: 'Basic',
    price: 29.99,
    maxProjects: 3,
    maxAutomations: 5,
    aiRequestsPerDay: 50,
    adsEnabled: false,
  },
  pro: {
    name: 'Pro',
    price: 99.99,
    maxProjects: 10,
    maxAutomations: 25,
    aiRequestsPerDay: 200,
    adsEnabled: false,
  },
  elite: {
    name: 'Elite',
    price: 399.99,
    maxProjects: 999,
    maxAutomations: 999,
    aiRequestsPerDay: 999,
    adsEnabled: false,
    masterCode: true,
  },
};

export const MASTER_ACCESS_CODE = 'QEMP2024ELITE';

export const API_ENDPOINTS = {
  huggingFace: 'https://api-inference.huggingface.co/models/',
  duckDuckGo: 'https://duckduckgo.com/html/',
  qempireWebhook: 'https://api.qempire.app',
};
