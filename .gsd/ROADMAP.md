# ROADMAP.md

> **Current Phase**: Phase 1: Project Setup & Database Layer
> **Milestone**: v1.0 Production-Ready URL Shortener API

## Must-Haves (from SPEC)
- [x] TypeScript + Express project architecture with strict typing
- [x] SQLite database setup with `better-sqlite3` and schema initialization
- [ ] Zod schema validation middleware for request inputs
- [ ] URL shortening with nanoid generation and custom alias collision handling
- [ ] Redirection endpoint `GET /:code` (302 Found) with atomic click counting
- [ ] Analytics endpoint `GET /api/urls/:code/analytics`
- [ ] Centralized error handling and 404 handler
- [ ] Full Jest test suite with unit and integration tests

---

## Phases

### Phase 1: Project Setup & Database Layer
**Status**: ✅ Complete
**Objective**: Set up Node.js TypeScript project, dependencies, configuration, SQLite database connection (`better-sqlite3`), database schema/migrations, and repository layer with CRUD operations.
**Requirements**: REQ-01, REQ-02

### Phase 2: Core Domain Logic & Validation
**Status**: ⬜ Not Started
**Objective**: Implement Zod validation schemas, nanoid/base62 code generator, URL service layer handling custom aliases, collisions, URL normalization, and click tracking logic.
**Requirements**: REQ-03, REQ-04

### Phase 3: HTTP API, Redirection & Error Handling
**Status**: ⬜ Not Started
**Objective**: Build Express routes and controllers (`POST /api/shorten`, `GET /:code`, `GET /api/urls/:code/analytics`), global 404 handler, and standard JSON error response middleware.
**Requirements**: REQ-05, REQ-06

### Phase 4: Comprehensive Jest Test Suite & Verification
**Status**: ⬜ Not Started
**Objective**: Implement unit tests for domain/service/repo layers and Supertest integration tests for all API endpoints, edge cases (invalid URLs, duplicate aliases, non-existent codes), and generate test coverage reports.
**Requirements**: REQ-07
