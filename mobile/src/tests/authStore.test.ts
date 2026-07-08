import { useAuthStore } from '../stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  });

  it('should register a new user', async () => {
    const store = useAuthStore.getState();
    await store.register('test@example.com', 'Test User', 'password123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe('test@example.com');
  });

  it('should login a user', async () => {
    const store = useAuthStore.getState();
    await store.login('test@example.com', 'password123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('should logout a user', async () => {
    const store = useAuthStore.getState();
    await store.register('test@example.com', 'Test User', 'password123');
    await store.logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('should apply valid master code', () => {
    const store = useAuthStore.getState();
    store.register('test@example.com', 'Test User', 'password123');
    const result = store.applyMasterCode('QEMP2024ELITE');
    expect(result).toBe(true);
    expect(useAuthStore.getState().user?.tier).toBe('elite');
  });

  it('should reject invalid master code', () => {
    const store = useAuthStore.getState();
    store.register('test@example.com', 'Test User', 'password123');
    const result = store.applyMasterCode('INVALID');
    expect(result).toBe(false);
  });
});
