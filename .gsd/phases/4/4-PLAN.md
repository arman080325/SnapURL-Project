---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Comprehensive Test Suite & Coverage Reports

## Objective
Finalize Phase 4 by generating official test coverage reports. Since all unit and integration tests were progressively implemented in Phases 1-3, this phase will focus on configuring Jest for accurate coverage metrics (excluding the server entry point) and producing the final coverage report.

## Context
- .gsd/SPEC.md
- package.json
- tsconfig.json

## Tasks

<task type="auto">
  <name>Configure Jest Coverage</name>
  <files>jest.config.js</files>
  <action>
    - Create or update `jest.config.js` (or package.json if jest is configured there).
    - Set `collectCoverageFrom` to `["src/**/*.ts"]`.
    - Set `coveragePathIgnorePatterns` to exclude `src/index.ts` and `src/config/env.ts` (as they are entry/config scripts).
    - Ensure `ts-jest` is properly configured.
  </action>
  <verify>npx jest --showConfig | findstr coveragePathIgnorePatterns</verify>
  <done>Jest is configured to collect coverage while ignoring server entry scripts.</done>
</task>

<task type="auto">
  <name>Generate Coverage Report</name>
  <files>package.json, coverage/</files>
  <action>
    - Ensure `test:coverage` script exists in `package.json` (`jest --coverage`).
    - Run `npm run test:coverage`.
    - Verify that overall statement coverage is > 90%.
  </action>
  <verify>npm run test:coverage</verify>
  <done>Coverage report is generated and all core layers (Repo, Service, API) have >90% coverage.</done>
</task>

## Success Criteria
- [ ] Jest is configured to ignore `src/index.ts`.
- [ ] `npm run test:coverage` successfully runs all 38+ tests.
- [ ] Final test coverage for `src/services`, `src/repositories`, and `src/routes` is > 90%.
