import { useSubscriptionStore } from '../stores/subscriptionStore';

describe('Subscription Store', () => {
  beforeEach(() => {
    useSubscriptionStore.setState({
      tier: 'free',
      isAdFree: false,
      aiRequestsToday: 0,
      lastResetDate: new Date().toDateString(),
    });
  });

  it('should get free tier limits', () => {
    const limits = useSubscriptionStore.getState().getTierLimits();
    expect(limits.price).toBe(0);
    expect(limits.maxProjects).toBe(1);
    expect(limits.aiRequestsPerDay).toBe(5);
    expect(limits.adsEnabled).toBe(true);
  });

  it('should allow AI requests within limit', () => {
    const store = useSubscriptionStore.getState();
    expect(store.canUseFeature('ai_requests')).toBe(true);
  });

  it('should block AI requests over limit', () => {
    const store = useSubscriptionStore.getState();
    for (let i = 0; i < 5; i++) {
      store.incrementAIRequest();
    }
    expect(store.canUseFeature('ai_requests')).toBe(false);
  });

  it('should reset daily counters', () => {
    const store = useSubscriptionStore.getState();
    store.incrementAIRequest();
    store.incrementAIRequest();
    store.resetDailyCounters();
    expect(useSubscriptionStore.getState().aiRequestsToday).toBe(0);
  });

  // Extended feature gating tests
  it('free tier should allow ai_requests when under limit', () => {
    const store = useSubscriptionStore.getState();
    expect(store.canUseFeature('ai_requests')).toBe(true);
  });

  it('free tier should NOT allow api_access', () => {
    const store = useSubscriptionStore.getState();
    expect(store.canUseFeature('api_access')).toBe(false);
  });

  it('elite tier should allow api_access', () => {
    useSubscriptionStore.setState({ tier: 'elite', aiRequestsToday: 0 });
    expect(useSubscriptionStore.getState().canUseFeature('api_access')).toBe(true);
  });

  it('free tier should NOT allow premium_tools', () => {
    const store = useSubscriptionStore.getState();
    expect(store.canUseFeature('premium_tools')).toBe(false);
  });

  it('pro tier should allow premium_tools', () => {
    useSubscriptionStore.setState({ tier: 'pro', aiRequestsToday: 0 });
    expect(useSubscriptionStore.getState().canUseFeature('premium_tools')).toBe(true);
  });

  it('free tier should NOT allow export', () => {
    const store = useSubscriptionStore.getState();
    expect(store.canUseFeature('export')).toBe(false);
  });

  it('basic tier should allow export', () => {
    useSubscriptionStore.setState({ tier: 'basic', aiRequestsToday: 0 });
    expect(useSubscriptionStore.getState().canUseFeature('export')).toBe(true);
  });

  it('pro tier limits should have more AI requests than free', () => {
    useSubscriptionStore.setState({ tier: 'pro', aiRequestsToday: 0 });
    const proLimits = useSubscriptionStore.getState().getTierLimits();
    useSubscriptionStore.setState({ tier: 'free', aiRequestsToday: 0 });
    const freeLimits = useSubscriptionStore.getState().getTierLimits();
    expect(proLimits.aiRequestsPerDay).toBeGreaterThan(freeLimits.aiRequestsPerDay);
  });
});
