# Phase 9 — QA, Testing & CI/CD Hardening

**Goal**: Ensure the entire system is production-quality with comprehensive test coverage and automated CI/CD.

## Tasks (15)

1. [x] Achieve ≥80% test coverage on `core/` Python modules
2. [x] Achieve ≥70% test coverage on `tools/` Python modules
3. [x] All mobile tests green (`npm run test:ci`)
4. [x] All frontend TypeScript checks pass
5. [x] Add integration test: full task lifecycle (BUILD_WEBSITE end-to-end)
6. [x] Add load test: 10 concurrent tasks (verify no race conditions in state)
7. [x] Add security test: ensure no secrets in API responses
8. [x] Set up GitHub Actions workflow: lint → test → build (Python + frontend + mobile)
9. [x] Add Dependabot config for Python and npm dependency updates
10. [x] Add Docker health checks to `docker-compose.yml`
11. [x] Add `/health` endpoint to webhook receiver with dependency checks
12. [x] Set up error monitoring (Sentry integration for backend and mobile)
13. [x] Set up PostHog event tracking for key user actions (mobile + web)
14. [x] Performance test: mobile app startup < 3s, API < 2s
15. [x] Accessibility audit: mobile app VoiceOver/TalkBack compatibility

## Deliverables

- ≥80% Python test coverage
- All CI checks green
- GitHub Actions workflow file
- Sentry integration
- Performance benchmarks documented
