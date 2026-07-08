import PostHog from 'posthog-react-native';

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY || 'ph_project_api_key';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export const analyticsService = {
  async init() {
    await PostHog.initAsync(POSTHOG_API_KEY, { host: POSTHOG_HOST });
  },

  identify(userId: string, properties?: Record<string, any>) {
    PostHog.identify(userId, properties);
  },

  track(event: string, properties?: Record<string, any>) {
    PostHog.capture(event, properties);
  },

  screen(name: string, properties?: Record<string, any>) {
    PostHog.screen(name, properties);
  },

  reset() {
    PostHog.reset();
  },
};
