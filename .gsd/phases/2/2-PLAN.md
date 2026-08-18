---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Core Domain Logic & Validation

## Objective
Implement Zod validation schemas, URL normalizer, base62 short code generator, and the core URL service layer handling custom aliases, collisions, and analytics logic.

## Context
- .gsd/SPEC.md
- src/types/url.ts
- src/repositories/urlRepository.ts

## Tasks

<task type="auto">
  <name>Implement Validation Schemas & URL Normalizer</name>
  <files>src/utils/validation.ts, src/utils/normalizer.ts, tests/unit/validation.test.ts</files>
  <action>
    - Create `src/utils/normalizer.ts` with a `normalizeUrl(url: string)` function that trims whitespace and ensures the URL starts with `http://` or `https://`.
    - Create `src/utils/validation.ts` with Zod schemas:
      - `createUrlSchema`: requires `original_url` (valid URL format after normalization). Optional `custom_alias` (alphanumeric and dashes/underscores only, length 3-30). Optional `expires_at` (ISO date string, future date).
    - Write unit tests in `tests/unit/validation.test.ts` validating happy paths and rejection of invalid URLs or malformed aliases.
  </action>
  <verify>npm test -- tests/unit/validation.test.ts</verify>
  <done>Zod schemas correctly validate valid inputs and reject invalid URLs/aliases with proper error messages, verified by passing unit tests.</done>
</task>

<task type="auto">
  <name>Implement Short Code Generator</name>
  <files>src/utils/generator.ts, tests/unit/generator.test.ts</files>
  <action>
    - Create `src/utils/generator.ts` with a `generateShortCode(length = 6)` function.
    - Implement a secure, dependency-free base62 generator using `crypto.randomBytes` to produce alphanumeric strings `[a-zA-Z0-9]`.
    - Write unit tests in `tests/unit/generator.test.ts` verifying the output length and character set.
  </action>
  <verify>npm test -- tests/unit/generator.test.ts</verify>
  <done>Generator produces valid base62 strings of expected length securely without third-party dependencies.</done>
</task>

<task type="auto">
  <name>Implement URL Service Layer</name>
  <files>src/services/urlService.ts, tests/unit/urlService.test.ts</files>
  <action>
    - Create `src/services/urlService.ts`.
    - Implement `shortenUrl(payload)`: Normalizes URL, validates payload using Zod. If `custom_alias` provided, checks availability and creates. If no alias, generates a short code in a retry loop (max 3-5 times) handling collisions via `UrlRepository.isCodeAvailable()`.
    - Implement `getUrlAnalytics(code)`: Returns analytical data (clicks, creation date).
    - Write unit tests mocking `UrlRepository` (or using the in-memory DB) to verify collision retry logic, validation error propagation, and custom alias conflict handling.
  </action>
  <verify>npm test -- tests/unit/urlService.test.ts</verify>
  <done>Service layer successfully orchestrates validation, generation, and repository interactions including collision retry logic, verified by unit tests.</done>
</task>

## Success Criteria
- [ ] Zod validation blocks invalid URLs and malformed custom aliases.
- [ ] Short code generator creates valid base62 strings.
- [ ] URL Service correctly orchestrates the flow and handles collisions.
- [ ] All unit tests pass cleanly with high coverage of business logic.
