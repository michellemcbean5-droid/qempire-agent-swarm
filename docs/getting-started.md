# Getting Started — Q-Empire Mobile App

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only) or Android: Android Studio
- Expo Go app on physical device (optional)

## Installation

```bash
# 1. Navigate to mobile directory
cd mobile

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your keys
# EXPO_PUBLIC_HF_API_KEY=your_huggingface_token
# EXPO_PUBLIC_POSTHOG_KEY=your_posthog_key
```

## Running Locally

```bash
# Start Expo development server
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go for physical device
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:ci

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Building

```bash
# Preview build (internal testing)
eas build --profile preview

# Production build
# (Requires Apple Developer + Google Play accounts)
eas build --profile production
```

## Project Structure Quick Reference

| Directory | Contents |
|-----------|----------|
| `src/screens/` | All 10 app screens |
| `src/components/` | Reusable UI components |
| `src/stores/` | Zustand state management |
| `src/services/` | API integrations |
| `src/navigation/` | React Navigation config |
| `src/tests/` | Jest test suites |

## Common Issues

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `npm install` |
| `Metro bundler error` | Clear cache: `npx expo start --clear` |
| `iOS build fails` | Run `pod install` in ios/ directory |
| `Android build fails` | Clean gradle: `cd android && ./gradlew clean` |
| `Type errors` | Run `npm run typecheck` to see details |

## Next Steps

1. Review `docs/architecture.md` for system design
2. Review `docs/api-reference.md` for API integrations
3. Review `docs/monetization.md` for pricing and tiers
4. Review `docs/store-deployment.md` for release process
