# Phase 7 — Mobile App (Google Play Ready)

**Goal**: Bring the mobile app to production quality — polished, tested, and ready for Google Play internal testing.

## Tasks (15)

1. [x] Add `QBotScreen.tsx` — full-screen Q-Bot AI chat with message history and typing indicator
2. [x] Add `AgentManagementScreen.tsx` — list all agents, tap to configure personality/schedule
3. [x] Add `AgentDetailScreen.tsx` — individual agent config (personality, attitude, schedule, specialty)
4. [x] Update `RootNavigator.tsx` — add new screens to stack and bottom tabs
5. [x] Implement push notification handlers for task completion events
6. [x] Add deep linking for `/task/:id` and `/agent/:id` routes
7. [x] Implement background task sync (check for completed tasks every 30 min via expo-background-fetch)
8. [x] Add `agentStore.ts` — Zustand store for agent profiles state
9. [x] Wire `aiService.ts` to Q-Bot chat (send messages, stream responses)
10. [x] Add offline mode detection and graceful degradation
11. [x] Polish all 13 screens (consistent typography, spacing, brand colors)
12. [x] Fix all TypeScript errors (`npm run typecheck` → 0 errors)
13. [x] Fix all ESLint errors (`npm run lint` → 0 warnings)
14. [x] All tests passing (`npm run test:ci`)
15. [x] Generate production AAB via `eas build --platform android --profile production`

## Deliverables

- `QBotScreen.tsx`
- `AgentManagementScreen.tsx`
- `AgentDetailScreen.tsx`
- `agentStore.ts`
- Updated navigator
- Production-signed AAB
- 0 TS/lint errors
