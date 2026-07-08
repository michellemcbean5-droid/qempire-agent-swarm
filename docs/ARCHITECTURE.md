# Mobile App Architecture — Q-Empire Agent Swarm

## Overview

The Q-Empire mobile app is a React Native (Expo SDK 52) application that provides a complete mobile interface for the Q-Empire autonomous agent system.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Expo SDK 52 | Cross-platform mobile development |
| Language | TypeScript | Type-safe development |
| Navigation | React Navigation v7 | Stack + Bottom tabs |
| State | Zustand | Lightweight global state |
| Storage | AsyncStorage | Offline persistence |
| Styling | StyleSheet | Native styling |
| UI | Custom components | Consistent design system |
| AI | HuggingFace API | Free AI content generation |
| Monetization | RevenueCat + AdMob | In-app purchases + ads |
| Analytics | PostHog | Event tracking |
| Crash | Sentry | Error reporting |
| Notifications | Expo Notifications | Push notifications |

## Directory Structure

```
mobile/
├── App.tsx                 # Root component with providers
├── app.json                # Expo configuration
├── eas.json                # EAS build profiles
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── jest.setup.js           # Test mocks
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── GradientButton.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── ToastProvider.tsx
│   ├── screens/            # 10 screen components
│   │   ├── HomeScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProjectsScreen.tsx
│   │   ├── AIScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── ProjectDetailScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── SupportScreen.tsx
│   │   └── ReferralsScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── RootNavigator.tsx
│   ├── stores/             # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── subscriptionStore.ts
│   ├── services/           # API integrations
│   │   ├── aiService.ts
│   │   ├── monetizationService.ts
│   │   └── analyticsService.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── constants/            # App constants
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── tests/              # Test suites
│       ├── authStore.test.ts
│       ├── appStore.test.ts
│       ├── subscriptionStore.test.ts
│       ├── aiService.test.ts
│       └── components.test.tsx
```

## State Management

### Zustand Stores

1. **Auth Store** (`authStore.ts`)
   - User authentication state
   - Login/register/logout
   - Promo code application
   - Master code validation

2. **App Store** (`appStore.ts`)
   - Projects list
   - AI insights cache
   - Offline mode toggle
   - AsyncStorage persistence

3. **Subscription Store** (`subscriptionStore.ts`)
   - Current tier
   - Daily AI request counters
   - Feature gating logic
   - Ad-free status

## Navigation Flow

```
Unauthenticated:
  OnboardingScreen → Register/Login → Main Tabs

Authenticated (Main Tabs):
  HomeScreen → CheckoutScreen
  DashboardScreen → ProjectDetailScreen
  ProjectsScreen → ProjectDetailScreen
  AIScreen
  ProfileScreen → SettingsScreen / SupportScreen / ReferralsScreen / CheckoutScreen
```

## Data Flow

```
User Action → Zustand Store → AsyncStorage (persist)
                    ↓
              API Service (if online)
                    ↓
              Response → Store Update → UI Re-render
```

## Offline Strategy

1. All data cached in AsyncStorage
2. API calls wrapped with offline check
3. Queue pending actions for sync when online
4. Cached data valid for 1 hour (configurable)

## Security

- No secrets committed to repo
- `.env.example` for template
- Expo Secure Store for sensitive data
- Master code hashed before comparison
- Rate limiting on code attempts

## Performance

- Skeleton screens during loading
- Lazy loading for heavy screens
- Image optimization via Expo Image
- Memoized components where applicable
