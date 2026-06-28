# Implementation Plan: Create Travel Request

**Branch**: `n/a` | **Date**: 2026-06-27 | **Spec**: [/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/001-create-trip-request/spec.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/001-create-trip-request/spec.md)

**Input**: Feature specification from `/specs/001-create-trip-request/spec.md`

## Summary

Implement the travel-request creation flow as the first feature slice of the
API. The feature will validate request payloads, normalize timestamps, block
holiday departures using a local-first holiday lookup strategy, persist the new
travel request, and return standardized success and error responses using the
explicit HTTP statuses defined in the specification.

## Technical Context

**Language/Version**: TypeScript 6 on Node.js 24.15+

**Primary Dependencies**: Express, dotenv, pg, Vitest, vitest-mock-extended

**Storage**: PostgreSQL 17 with raw SQL tables for `trip_requests` and `holidays`

**Testing**: Vitest unit and integration tests

**Target Platform**: Linux-hosted Node.js service with local PostgreSQL for development

**Project Type**: Backend web service

**Performance Goals**: Correctly handle the internal create-request workflow
with predictable response contracts and immediate validation feedback for manual
API consumers

**Constraints**: Use Yarn commands only; preserve feature-oriented
`domain`/`application`/`infra` boundaries; keep observable statuses limited to
`pending` and `canceled`; normalize observable timestamps to
`YYYY-MM-DDTHH:mm:ss.sssZ`; fail creation when mandatory holiday validation
cannot be completed; keep implementation scoped to the create flow

**Scale/Scope**: One create endpoint, two supporting domain entities, one
external holiday dependency, and the minimal shared infrastructure needed to
support future features without implementing those future features now

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: The planned structure keeps travel-request business rules in `domain`,
  orchestration in `application`, and HTTP, database, and gateway code in
  `infra`.
- PASS: The specification captures explicit success and error contracts,
  canonical UTC timestamp normalization, and the observable `pending` status
  for successful creation.
- PASS: Holiday validation is modeled as a local-first external dependency
  behind explicit abstractions, with mandatory failure when required remote data
  cannot be obtained.
- PASS: The plan includes unit tests for business rules and integration tests
  for HTTP, persistence, and gateway-facing behavior.
- PASS: Validation order remains aligned with repository rules: targeted tests,
  `yarn type:check`, `yarn lint`, and `yarn test`.
- PASS: New dependencies such as `express` and `pg` are justified by the
  documented runtime contract and persistence requirement.

## Project Structure

### Documentation (this feature)

```text
specs/001-create-trip-request/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── main.ts
├── config/
│   └── env.ts
├── shared/
│   ├── domain/
│   └── infra/
│       ├── db/
│       └── http/
├── trip-requests/
│   ├── domain/
│   ├── application/
│   └── infra/
└── holidays/
    ├── domain/
    ├── application/
    └── infra/

test/
├── main.spec.ts
├── unit/
│   ├── trip-requests/
│   └── holidays/
└── integration/
    └── trip-requests/
```

**Structure Decision**: Keep the repository as a single TypeScript service and
introduce feature-oriented modules for `trip-requests` and `holidays`. Shared
HTTP bootstrap, database access, and common error handling stay under
`src/shared/`, while travel-request creation rules and holiday validation
orchestration remain isolated inside their respective feature folders.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Repository and gateway abstractions | The create flow depends on PostgreSQL persistence and holiday-provider access behind stable application boundaries | Direct controller-to-SQL or controller-to-provider calls would break clean architecture boundaries and reduce testability |
