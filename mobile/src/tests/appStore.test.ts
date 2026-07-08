import { useAppStore } from '../stores/appStore';

describe('App Store', () => {
  beforeEach(() => {
    useAppStore.setState({
      projects: [],
      insights: [],
      isOffline: false,
      isLoading: false,
      notificationsEnabled: true,
    });
  });

  it('should add a project', () => {
    const store = useAppStore.getState();
    const project = {
      id: 'proj_1',
      name: 'Test Project',
      industry: 'Technology',
      status: 'pending' as const,
      progress: 0,
      deliverables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.addProject(project);
    expect(useAppStore.getState().projects).toHaveLength(1);
    expect(useAppStore.getState().projects[0].name).toBe('Test Project');
  });

  it('should update project progress', () => {
    const store = useAppStore.getState();
    const project = {
      id: 'proj_1',
      name: 'Test Project',
      industry: 'Technology',
      status: 'building' as const,
      progress: 50,
      deliverables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.addProject(project);
    store.updateProject('proj_1', { progress: 75 });
    expect(useAppStore.getState().projects[0].progress).toBe(75);
  });

  it('should cache and retrieve data', async () => {
    const store = useAppStore.getState();
    await store.cacheData('test_key', { foo: 'bar' });
    const data = await store.getCachedData('test_key');
    expect(data).toEqual({ foo: 'bar' });
  });
});
