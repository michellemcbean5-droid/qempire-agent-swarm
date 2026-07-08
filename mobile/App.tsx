import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ToastProvider } from './src/components/ToastProvider';
import { useAppStore } from './src/stores/appStore';
import { useAuthStore } from './src/stores/authStore';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'qempire://', 'https://qempire.app'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: '',
          Dashboard: 'dashboard',
          Projects: 'projects',
          AI: 'ai',
          Profile: 'profile',
        },
      },
      Onboarding: 'onboarding',
      Checkout: 'checkout/:packageId',
      ProjectDetail: 'project/:projectId',
      Settings: 'settings',
      Support: 'support',
      Referrals: 'referrals',
    },
  },
};

function AppInitializer() {
  const initApp = useAppStore((s) => s.initApp);
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initApp();
    initAuth();
  }, []);

  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ToastProvider>
          <NavigationContainer linking={linking} fallback={null}>
            <AppInitializer />
            <RootNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </ToastProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
