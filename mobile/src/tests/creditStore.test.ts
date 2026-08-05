import { useCreditStore, CREDIT_COSTS } from '../stores/creditStore';

describe('Credit Store', () => {
  beforeEach(() => {
    useCreditStore.setState({
      balance: 100,
      spentToday: 0,
      lastResetDate: new Date().toDateString(),
      dailyCap: 500,
      usageLog: [],
      lowCreditWarningShown: false,
    });
  });

  it('starts with the correct initial balance', () => {
    expect(useCreditStore.getState().balance).toBe(100);
  });

  it('canAfford returns true when balance is sufficient', () => {
    expect(useCreditStore.getState().canAfford('ai_chat')).toBe(true);
  });

  it('canAfford returns false when balance is insufficient', () => {
    useCreditStore.setState({ balance: 1 });
    const cost = CREDIT_COSTS['generate_content']; // 10
    expect(useCreditStore.getState().canAfford('generate_content')).toBe(false);
    expect(cost).toBe(10);
  });

  it('deduct reduces balance and increases spentToday', () => {
    const ok = useCreditStore.getState().deduct('ai_chat');
    expect(ok).toBe(true);
    const cost = CREDIT_COSTS['ai_chat'];
    expect(useCreditStore.getState().balance).toBe(100 - cost);
    expect(useCreditStore.getState().spentToday).toBe(cost);
  });

  it('deduct returns false when insufficient balance', () => {
    useCreditStore.setState({ balance: 0 });
    const ok = useCreditStore.getState().deduct('ai_chat');
    expect(ok).toBe(false);
    expect(useCreditStore.getState().balance).toBe(0);
  });

  it('deduct is blocked by daily cap', () => {
    useCreditStore.setState({ spentToday: 499, dailyCap: 500, balance: 1000 });
    // ai_chat costs 5, would push spentToday to 504 > 500
    const ok = useCreditStore.getState().deduct('ai_chat');
    expect(ok).toBe(false);
  });

  it('deduct for free action (file_read = 0) always succeeds', () => {
    useCreditStore.setState({ balance: 0 });
    const ok = useCreditStore.getState().deduct('file_read');
    expect(ok).toBe(true);
    expect(useCreditStore.getState().balance).toBe(0);
  });

  it('topUp adds credits', () => {
    useCreditStore.getState().topUp(50);
    expect(useCreditStore.getState().balance).toBe(150);
  });

  it('resetDailyCounter resets spentToday', () => {
    useCreditStore.setState({ spentToday: 100 });
    useCreditStore.getState().resetDailyCounter();
    expect(useCreditStore.getState().spentToday).toBe(0);
  });

  it('usage log records deductions', () => {
    useCreditStore.getState().deduct('ai_chat', 'task_001');
    const log = useCreditStore.getState().usageLog;
    expect(log.length).toBe(1);
    expect(log[0].action).toBe('ai_chat');
    expect(log[0].taskId).toBe('task_001');
  });

  it('getTierDailyCap returns correct cap for tier', () => {
    expect(useCreditStore.getState().getTierDailyCap('free')).toBe(50);
    expect(useCreditStore.getState().getTierDailyCap('pro')).toBe(500);
    expect(useCreditStore.getState().getTierDailyCap('elite')).toBe(2000);
  });
});
