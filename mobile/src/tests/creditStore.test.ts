/**
 * Tests for creditStore — AI credit wallet, spend caps, and metering.
 */

import { act } from '@testing-library/react-native';
import { useCreditStore, CREDIT_COSTS, TIER_CREDITS } from '../stores/creditStore';

// Reset store between tests
beforeEach(() => {
  useCreditStore.setState({
    balance: 100,
    monthlyAllotment: 100,
    billingPeriodStart: new Date().toISOString().split('T')[0].replace(/\d+$/, '1'),
    transactions: [],
    alertFired: false,
    spendCapEnabled: false,
    spendCapAmount: 9999,
  });
});

describe('creditStore — canAfford', () => {
  it('returns true when balance is sufficient', () => {
    const { canAfford } = useCreditStore.getState();
    expect(canAfford('chat_message')).toBe(true);
  });

  it('returns false when balance is zero', () => {
    useCreditStore.setState({ balance: 0 });
    const { canAfford } = useCreditStore.getState();
    expect(canAfford('chat_message')).toBe(false);
  });

  it('returns false when balance is less than operation cost', () => {
    useCreditStore.setState({ balance: 4 });
    const { canAfford } = useCreditStore.getState();
    // agent_task costs 10 credits
    expect(canAfford('agent_task')).toBe(false);
  });

  it('enforces spend cap when enabled', () => {
    useCreditStore.setState({
      balance: 50,
      monthlyAllotment: 100,
      spendCapEnabled: true,
      spendCapAmount: 50, // already spent 50
    });
    const { canAfford } = useCreditStore.getState();
    // Any additional spend would exceed cap
    expect(canAfford('agent_task')).toBe(false);
  });

  it('allows spend when under spend cap', () => {
    useCreditStore.setState({
      balance: 90,
      monthlyAllotment: 100,
      spendCapEnabled: true,
      spendCapAmount: 80, // cap is 80, only 10 spent so far
    });
    const { canAfford } = useCreditStore.getState();
    expect(canAfford('chat_message')).toBe(true); // 1 credit, 10 spent → 11 ≤ 80
  });
});

describe('creditStore — deductCredits', () => {
  it('deducts credits and records transaction', () => {
    const { deductCredits } = useCreditStore.getState();
    const tx = deductCredits('chat_message');

    expect(tx.blocked).toBe(false);
    expect(tx.operation).toBe('chat_message');
    expect(tx.cost).toBe(CREDIT_COSTS.chat_message);
    expect(tx.balanceAfter).toBe(tx.balanceBefore - tx.cost);

    const { balance, transactions } = useCreditStore.getState();
    expect(balance).toBe(100 - CREDIT_COSTS.chat_message);
    expect(transactions.length).toBe(1);
  });

  it('blocks deduction and records blocked=true when insufficient credits', () => {
    useCreditStore.setState({ balance: 0 });
    const { deductCredits } = useCreditStore.getState();
    const tx = deductCredits('chat_message');

    expect(tx.blocked).toBe(true);
    expect(useCreditStore.getState().balance).toBe(0); // unchanged
  });

  it('does not go below zero', () => {
    useCreditStore.setState({ balance: 1 });
    const { deductCredits } = useCreditStore.getState();
    deductCredits('generate_text'); // costs 2

    // generate_text costs 2 but balance is 1 — should be blocked
    expect(useCreditStore.getState().balance).toBe(1);
  });

  it('sets alertFired when balance drops to threshold', () => {
    // Set balance just above 15% threshold (100 * 0.15 = 15)
    useCreditStore.setState({ balance: 16, monthlyAllotment: 100, alertFired: false });
    const { deductCredits } = useCreditStore.getState();
    deductCredits('chat_message'); // costs 1 → balance becomes 15

    expect(useCreditStore.getState().alertFired).toBe(true);
  });
});

describe('creditStore — grantCredits', () => {
  it('increases balance and allotment', () => {
    const { grantCredits } = useCreditStore.getState();
    grantCredits(50);

    const { balance, monthlyAllotment } = useCreditStore.getState();
    expect(balance).toBe(150);
    expect(monthlyAllotment).toBe(150);
  });
});

describe('creditStore — getLowBalanceWarning', () => {
  it('returns null when alertFired is false', () => {
    useCreditStore.setState({ alertFired: false });
    const { getLowBalanceWarning } = useCreditStore.getState();
    expect(getLowBalanceWarning()).toBeNull();
  });

  it('returns warning message when alertFired is true and balance > 0', () => {
    useCreditStore.setState({ alertFired: true, balance: 10, monthlyAllotment: 100 });
    const { getLowBalanceWarning } = useCreditStore.getState();
    const msg = getLowBalanceWarning();
    expect(msg).toBeTruthy();
    expect(msg).toContain('10');
  });

  it('returns zero-credits message when balance is 0', () => {
    useCreditStore.setState({ alertFired: true, balance: 0, monthlyAllotment: 100 });
    const { getLowBalanceWarning } = useCreditStore.getState();
    expect(getLowBalanceWarning()).toContain('0 AI credits');
  });
});

describe('creditStore — getUsagePercent', () => {
  it('returns 0 when nothing spent', () => {
    useCreditStore.setState({ balance: 100, monthlyAllotment: 100 });
    expect(useCreditStore.getState().getUsagePercent()).toBe(0);
  });

  it('returns 50 when half spent', () => {
    useCreditStore.setState({ balance: 50, monthlyAllotment: 100 });
    expect(useCreditStore.getState().getUsagePercent()).toBe(50);
  });

  it('returns 100 when all spent', () => {
    useCreditStore.setState({ balance: 0, monthlyAllotment: 100 });
    expect(useCreditStore.getState().getUsagePercent()).toBe(100);
  });
});

describe('creditStore — TIER_CREDITS', () => {
  it('defines credits for all tiers', () => {
    expect(TIER_CREDITS.free).toBeGreaterThan(0);
    expect(TIER_CREDITS.basic).toBeGreaterThan(TIER_CREDITS.free);
    expect(TIER_CREDITS.pro).toBeGreaterThan(TIER_CREDITS.basic);
    expect(TIER_CREDITS.elite).toBeGreaterThan(TIER_CREDITS.pro);
  });
});
