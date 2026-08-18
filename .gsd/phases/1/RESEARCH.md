# Phase 1 Research: Project Setup & Database Layer

## Architecture & Technology Decisions

### 1. TypeScript & Express Configuration
- **Module System**: CommonJS/NodeNext targeting ES2022 for seamless interoperability with `better-sqlite3` and Jest.
- **Strict Mode**: Enabled in `tsconfig.json` (`strict: true`, `noImplicitAny: true`, `noUnusedLocals: true`).
- **Build Output**: `dist/` folder with `rimraf` clean scripts.
- **Dev Server**: `ts-node-dev` for fast live reload without manual rebuilds.

### 2. SQLite & Better-SQLite3
- `better-sqlite3` is synchronous, avoiding unnecessary promise overhead for local SQLite operations and eliminating event loop lag.
- **Pragmas**:
  - `journal_mode = WAL` (Write-Ahead Logging for high concurrency read/write)
  - `foreign_keys = ON`
  - `synchronous = NORMAL`
- **Database Schema**:
  ```sql
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    click_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_accessed_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
  ```

### 3. Repository Layer Pattern
- Strongly typed `UrlModel` interface:
  ```typescript
  export interface UrlRecord {
    id: number;
    code: string;
    original_url: string;
    click_count: number;
    created_at: string;
    updated_at: string;
    last_accessed_at: string | null;
  }
  ```
- `UrlRepository` prepared statements:
  - `create(code, originalUrl): UrlRecord`
  - `findByCode(code): UrlRecord | null`
  - `incrementClicks(code): UrlRecord | null`
  - `isCodeAvailable(code): boolean`
