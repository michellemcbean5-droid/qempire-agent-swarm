import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import AIScreen from '../screens/AIScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import ReferralsScreen from '../screens/ReferralsScreen';
import QBotScreen from '../screens/QBotScreen';
import AgentManagementScreen from '../screens/AgentManagementScreen';
import AgentDetailScreen from '../screens/AgentDetailScreen';

export type RootStackParamList = {
  Main: undefined;
  Onboarding: undefined;
  Checkout: { packageId: string };
  ProjectDetail: { projectId: string };
  Settings: undefined;
  Support: undefined;
  Referrals: undefined;
  QBot: undefined;
  AgentManagement: undefined;
  AgentDetail: { agentId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Projects: undefined;
  QBot: undefined;
  Agents: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabIcon, focused && styles.tabIconTextFocused]}>{icon}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: '#00FFFF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} /> }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🚀" focused={focused} /> }}
      />
      <Tab.Screen
        name="QBot"
        component={QBotScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👑" focused={focused} />, tabBarLabel: 'Q-Bot' }}
      />
      <Tab.Screen
        name="Agents"
        component={AgentManagementScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🤖" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A1A' },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="Referrals" component={ReferralsScreen} />
          <Stack.Screen name="QBot" component={QBotScreen} />
          <Stack.Screen name="AgentManagement" component={AgentManagementScreen} />
          <Stack.Screen name="AgentDetail" component={AgentDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0A0A1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(65,105,225,0.2)',
    height: 80,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  tabIconFocused: {
    backgroundColor: 'rgba(65,105,225,0.15)',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabIconTextFocused: {
    opacity: 1,
  },
});
