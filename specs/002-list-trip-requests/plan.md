# Implementation Plan: List Trip Requests

**Branch**: `n/a` | **Date**: 2026-06-27 | **Spec**: [/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/002-list-trip-requests/spec.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/002-list-trip-requests/spec.md)

**Input**: Feature specification from `/specs/002-list-trip-requests/spec.md`

## Summary

Implement the `GET /trip-requests` flow as the next vertical slice of the API.
The feature will read persisted travel requests, return them in the
standardized success envelope, preserve the observable trip-request contract,
and guarantee descending `departureAt` ordering with a successful empty-list
response when no records exist.

## Technical Context

**Language/Version**: TypeScript 6 on Node.js 24.15+

**Primary Dependencies**: Express, dotenv, pg, Vitest, vitest-mock-extended

**Storage**: PostgreSQL 17 with the existing `trip_requests` and `holidays`
tables

**Testing**: Vitest unit and integration tests

**Target Platform**: Linux-hosted Node.js service with local PostgreSQL for
development

**Project Type**: Backend web service

**Performance Goals**: Correctly handle the travel-request list workflow with a
predictable response contract and immediate empty-state feedback for manual API
consumers

**Constraints**: Use Yarn commands only; preserve feature-oriented
`domain`/`application`/`infra` boundaries; keep observable statuses limited to
`requested` and `canceled`; return observable timestamps in
`YYYY-MM-DDTHH:mm:ss.sssZ`; keep list ordering explicit by descending
`departureAt`; keep implementation scoped to the list flow

**Scale/Scope**: One read endpoint, one repository query, one list response
contract, and the minimal bootstrap changes needed to expose travel-request
listing without expanding into get-by-id or cancellation work

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: The planned structure keeps travel-request business rules in `domain`,
  orchestration in `application`, and HTTP and SQL code in `infra`.
- PASS: The specification captures explicit success and error contracts,
  observable statuses, ordering rules, and canonical UTC timestamp
  requirements.
- PASS: The feature does not require a new external integration and stays
  compatible with the existing local-first holiday strategy already defined for
  the API.
- PASS: The plan includes integration coverage for the HTTP and persistence
  boundary plus targeted tests for list-specific behavior when needed.
- PASS: Validation order remains aligned with repository rules: targeted tests,
  `yarn type:check`, `yarn lint`, and `yarn test`.
- PASS: No new dependency or cross-cutting mechanism is introduced beyond the
  already justified runtime stack.

## Project Structure

### Documentation (this feature)

```text
specs/002-list-trip-requests/
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
extend the existing `trip-requests` feature with list-specific application,
repository, and controller behavior. Shared HTTP bootstrap and error handling
remain under `src/shared/`, while list behavior stays isolated inside the
`trip-requests` module.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Repository abstraction for listing | The list flow must remain decoupled from SQL details and consistent with the existing travel-request architecture | Direct controller-to-SQL access would break established clean architecture boundaries and reduce testability |
