export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite';

export interface User {
  id: string;
  email: string;
  name: string;
  tier: SubscriptionTier;
  referralCode: string;
  referredBy?: string;
  credits: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  industry: string;
  status: 'pending' | 'building' | 'complete' | 'error';
  progress: number;
  deliverables: Deliverable[];
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'blueprint' | 'website' | 'automation' | 'funding' | 'branding';
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
  url?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly' | 'one_time';
  features: string[];
  popular?: boolean;
  tier: SubscriptionTier;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  tierUpgrade?: SubscriptionTier;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
}

export interface AIInsight {
  id: string;
  type: 'market' | 'competitor' | 'content' | 'funding' | 'seo';
  title: string;
  content: string;
  confidence: number;
  generatedAt: string;
}
