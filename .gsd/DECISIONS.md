# DECISIONS.md — Architecture Decision Record (ADR) Log

## ADR-001: Architecture & Technology Selection
- **Status**: Accepted
- **Context**: Need a lightweight, reliable, high-performance URL shortener API with persistent storage and fast redirects.
- **Decision**: 
  - Express.js + TypeScript for strongly typed, modular web service.
  - SQLite with `better-sqlite3` for fast, in-process, synchronous persistence with WAL (Write-Ahead Logging) mode.
  - Zod for strict type-safe runtime payload validation.
  - Jest + Supertest for automated unit and HTTP integration testing.
  - `nanoid` (or crypto alphabet) for collision-resistant 6-7 char short code generation.
  - HTTP `302 Found` for redirects to ensure click analytics are captured on every request.
- **Consequences**: Zero external database infrastructure dependencies (Docker/Postgres not required to run), ultra-fast single-node response times, zero network hop latency for DB reads.
