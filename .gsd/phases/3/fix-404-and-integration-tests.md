---
phase: 3
plan: fix-404-and-integration-tests
wave: 1
gap_closure: true
---

# Fix Plan: 404 Handler and Integration Tests

## Problem
The phase 3 verification failed because unmapped endpoints return Express's default HTML 404 page instead of a JSON response, and the planned `supertest` integration tests were never implemented.

## Tasks

<task type="auto">
  <name>Implement Global 404 Handler</name>
  <files>src/app.ts</files>
  <action>
    - Open `src/app.ts`.
    - Add a catch-all middleware right before `app.use(errorHandler)` that responds to any unhandled requests with a 404 status and `{"error": "Not Found"}` JSON payload.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Any request to an unmapped route returns a JSON 404 error.</done>
</task>

<task type="auto">
  <name>Implement Phase 3 Integration Tests</name>
  <files>tests/integration/api.test.ts</files>
  <action>
    - Create `tests/integration/api.test.ts`.
    - Use `supertest` to mount `app` and test:
      1. `POST /api/urls` (success and validation error).
      2. `GET /:code` (302 redirect for existing, 404 for non-existing).
      3. `GET /api/urls/:code/analytics` (200 success).
      4. `GET /api/unknown-route` (404 JSON response).
  </action>
  <verify>npm test -- tests/integration/api.test.ts</verify>
  <done>Integration tests correctly cover all Phase 3 requirements and pass cleanly.</done>
</task>
