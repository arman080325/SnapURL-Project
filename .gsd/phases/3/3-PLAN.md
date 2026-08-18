---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: HTTP API, Redirection & Error Handling

## Objective
Build the Express HTTP server, integrate the URL Service Layer created in Phase 2, implement robust error handling, and expose the live server endpoints for URL shortening, analytics, and redirection.

## Context
- .gsd/SPEC.md
- src/services/urlService.ts
- src/utils/validation.ts

## Tasks

<task type="auto">
  <name>Implement Express App & Error Handling</name>
  <files>src/app.ts, src/middleware/errorHandler.ts, src/middleware/validate.ts, tests/integration/app.test.ts</files>
  <action>
    - Create `src/middleware/errorHandler.ts` to globally handle `z.ZodError` (400 Bad Request) and standard `Error` instances (500 or 404).
    - Create `src/middleware/validate.ts` for parsing and validating requests using Zod schemas.
    - Create `src/app.ts` which configures `express()`, adds `express.json()` middleware, and registers the error handler.
    - Export the `app` instance (do not call `app.listen` here to allow supertest integration).
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Express app is configured with centralized error handling and compiles successfully.</done>
</task>

<task type="auto">
  <name>Implement API & Redirection Routes</name>
  <files>src/routes/api.ts, src/routes/redirect.ts, src/app.ts, tests/integration/api.test.ts, tests/integration/redirect.test.ts</files>
  <action>
    - Create `src/routes/api.ts` with:
      - `POST /api/urls`: Uses `UrlService.shortenUrl` to create short links. Returns 201 with the created record.
      - `GET /api/urls/:code/analytics`: Uses `UrlService.getUrlAnalytics`. Returns 200 with stats or 404.
    - Create `src/routes/redirect.ts` with:
      - `GET /:code`: Uses `UrlRepository.findByCode` directly (or a new service method `UrlService.getOriginalUrl`) to fetch the URL, calls `UrlRepository.incrementClicks`, and redirects via `res.redirect(302, original_url)`.
    - Register both route files in `src/app.ts`.
    - Write Supertest integration tests in `tests/integration/api.test.ts` and `tests/integration/redirect.test.ts` verifying API responses, Zod 400 errors, and 302 redirections.
  </action>
  <verify>npm test -- tests/integration/api.test.ts tests/integration/redirect.test.ts</verify>
  <done>Endpoints correctly handle HTTP requests, return expected status codes, and pass integration tests.</done>
</task>

<task type="auto">
  <name>Implement Server Entry Point & Dev Scripts</name>
  <files>src/server.ts</files>
  <action>
    - Create `src/server.ts` which imports `app` and `initDatabase`.
    - Initializes the database connection (`initDatabase()`).
    - Starts the server via `app.listen(PORT)` (reads PORT from env or defaults to 3000).
    - Add graceful shutdown handling for `SIGINT` and `SIGTERM` to call `closeDatabase()`.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Live server entry point is robust and correctly initializes DB and Express.</done>
</task>

## Success Criteria
- [ ] Centralized error handler captures and formats Zod errors cleanly.
- [ ] `POST /api/urls` creates URLs and returns correct JSON.
- [ ] `GET /:code` successfully performs a 302 redirect and increments clicks.
- [ ] `GET /api/urls/:code/analytics` returns click stats.
- [ ] Integration tests pass.
- [ ] Live server can be started using `npm run dev`.
