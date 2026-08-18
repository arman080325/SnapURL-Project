# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A production-ready, high-performance URL Shortener REST API built with Node.js, Express, TypeScript, and SQLite (`better-sqlite3`). The service provides URL shortening with custom alias support, robust input validation with Zod, instant HTTP 302 redirections with click-tracking analytics, clean 404/error handling, and comprehensive Jest unit & integration test coverage.

## Goals
1. Provide a `POST /api/shorten` endpoint to shorten long URLs with either auto-generated unique keys (nanoid/base62) or user-specified custom aliases.
2. Ensure strict input validation using Zod for all incoming payloads and URL formats.
3. Provide a fast redirect endpoint `GET /:code` returning `302 Found` to the original target URL and incrementing the click analytics counter.
4. Provide a `GET /api/urls/:code/analytics` endpoint returning click counts, creation time, and last accessed timestamp.
5. Provide standard JSON error responses and 404 handling for unknown codes, invalid inputs, and duplicate custom aliases.
6. Implement comprehensive test suites with Jest and Supertest achieving high code coverage across database, service, and controller layers.

## Non-Goals (Out of Scope)
- User authentication and multi-tenant authorization (v1 focuses on public/api-key-less core engine).
- Advanced geolocation / IP address parsing in analytics (v1 tracks total clicks, created_at, last_accessed_at).
- Frontend UI application (this is purely a backend API service).

## Users
- Developers and client applications seeking a lightweight, self-hosted, persistent URL shortener service.

## Constraints
- **Runtime**: Node.js (v18+) with TypeScript (strict mode enabled).
- **Web Framework**: Express.js.
- **Database**: SQLite with `better-sqlite3` (WAL mode enabled for concurrent read performance).
- **Validation**: Zod schema validation middleware.
- **Testing**: Jest with `ts-jest` and `supertest`.

## Success Criteria
- [ ] TypeScript builds cleanly with zero type errors.
- [ ] Database schema initializes SQLite table with unique indexing on `code`/`alias`.
- [ ] `POST /api/shorten` generates short code for valid URLs and rejects invalid URLs with 400 Bad Request.
- [ ] `POST /api/shorten` with custom alias succeeds when available and returns 409 Conflict when alias is already taken.
- [ ] `GET /:code` redirects to target URL with `302 Found` and increments click count.
- [ ] `GET /:code` returns `404 Not Found` when code does not exist.
- [ ] `GET /api/urls/:code/analytics` returns structured JSON with total clicks, created timestamp, and last accessed timestamp.
- [ ] All Jest unit and integration tests pass cleanly.
