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
});
