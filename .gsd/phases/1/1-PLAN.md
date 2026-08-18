---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Project Setup, Tooling & Database Layer

## Objective
Initialize the Node.js TypeScript project environment with all required dependencies, strict TypeScript/Jest configurations, SQLite connection management via `better-sqlite3`, table schema initialization with WAL mode, and a type-safe URL repository layer.

## Context
- .gsd/SPEC.md
- .gsd/phases/1/RESEARCH.md
- package.json
- tsconfig.json
- jest.config.js

## Tasks

<task type="auto">
  <name>Initialize Node.js TypeScript Project Configuration & Dependencies</name>
  <files>package.json, tsconfig.json, jest.config.js, .gitignore, .env.example, src/config/env.ts</files>
  <action>
    - Create `package.json` with scripts (`build`, `start`, `dev`, `test`, `test:coverage`, `clean`).
    - Install production dependencies: `express`, `better-sqlite3`, `zod`, `dotenv`.
    - Install development dependencies: `typescript`, `@types/node`, `@types/express`, `@types/better-sqlite3`, `ts-node-dev`, `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`, `rimraf`.
    - Create `tsconfig.json` with strict mode, target ES2022, CommonJS module resolution, and output to `dist`.
    - Create `jest.config.js` configuring `ts-jest` for executing tests in TypeScript.
    - Create `.gitignore` ignoring `node_modules`, `dist`, `data`, `.env`, `coverage`.
    - Create `.env.example` and `src/config/env.ts` with typed environment variable parsing using Zod.
  </action>
  <verify>npm run build --dry-run || npx tsc --noEmit</verify>
  <done>Dependencies installed, tsconfig and jest configured, environment loader compiles cleanly without type errors.</done>
</task>

<task type="auto">
  <name>Implement SQLite Connection and Database Schema Initialization</name>
  <files>src/db/connection.ts, src/db/schema.ts, src/db/index.ts</files>
  <action>
    - Create `src/db/connection.ts` managing `better-sqlite3` instance with configurable DB path (e.g. `data/urls.db` or in-memory `:memory:` for testing).
    - Configure PRAGMAs: `journal_mode = WAL`, `foreign_keys = ON`, `synchronous = NORMAL`.
    - Create `src/db/schema.ts` defining and applying the `urls` table schema and index on `code`.
    - Provide a clean migration/init function `initDatabase(dbPath?: string)` that initializes tables and returns the DB connection.
    - Implement close/cleanup helpers for graceful shutdown and test isolation.
  </action>
  <verify>npx ts-node -e "import { initDatabase, closeDatabase } from './src/db'; const db = initDatabase(':memory:'); console.log('DB init ok'); closeDatabase();"</verify>
  <done>Database connection initializes schema in memory and persistent file, executes PRAGMAs, and creates tables with indexes successfully.</done>
</task>

<task type="auto">
  <name>Implement URL Repository with Prepared Statements and Unit Verification</name>
  <files>src/types/url.ts, src/repositories/urlRepository.ts, tests/unit/urlRepository.test.ts</files>
  <action>
    - Create `src/types/url.ts` with `UrlRecord`, `CreateUrlDTO`, and `UrlAnalyticsDTO` interfaces.
    - Create `src/repositories/urlRepository.ts` with prepared statement methods:
      - `create(dto: CreateUrlDTO): UrlRecord`
      - `findByCode(code: string): UrlRecord | null`
      - `incrementClicks(code: string): UrlRecord | null`
      - `isCodeAvailable(code: string): boolean`
    - Write unit tests in `tests/unit/urlRepository.test.ts` running against an in-memory SQLite database verifying CRUD operations, uniqueness constraint violations, and atomic click counter increments.
  </action>
  <verify>npm test -- tests/unit/urlRepository.test.ts</verify>
  <done>All URL repository unit tests pass with 100% assertions on create, findByCode, incrementClicks, and uniqueness collision detection.</done>
</task>

## Success Criteria
- [ ] TypeScript configuration passes compilation without errors.
- [ ] Database schema initializes SQLite database with WAL mode and `urls` table.
- [ ] URL Repository operates cleanly with prepared statements and typed return models.
- [ ] Repository unit tests pass cleanly using Jest.
