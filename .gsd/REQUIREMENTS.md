# REQUIREMENTS.md

## Format
| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | Setup Node.js + Express + TypeScript environment with strict configuration and script tooling | SPEC Goal 1 | Complete (Phase 1) |
| REQ-02 | Setup SQLite database with `better-sqlite3`, WAL mode, indexing, and URL repository layer | SPEC Goal 1 | Complete (Phase 1) |
| REQ-03 | Implement input validation using Zod for URL creation and custom alias constraints | SPEC Goal 2 | Pending |
| REQ-04 | Implement URL service with short code generation, collision resistance, and custom alias support | SPEC Goal 1 | Pending |
| REQ-05 | Implement `POST /api/shorten` API endpoint, `GET /:code` 302 redirection, and click tracking | SPEC Goal 1, 3 | Pending |
| REQ-06 | Implement `GET /api/urls/:code/analytics` endpoint and centralized 404/error handling middleware | SPEC Goal 4, 5 | Pending |
| REQ-07 | Implement unit and integration tests with Jest and Supertest covering all positive & negative flows | SPEC Goal 6 | Pending |
