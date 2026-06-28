# Implementation Plan: Get Trip Request

**Branch**: `n/a` | **Date**: 2026-06-28 | **Spec**: [/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/003-get-trip-request/spec.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/003-get-trip-request/spec.md)

**Input**: Feature specification from `/specs/003-get-trip-request/spec.md`

## Summary

Implement the `GET /trip-requests/:id` flow as the next vertical slice of the
API. The feature will retrieve a single persisted travel request by
identifier, return the complete observable travel-request object in the
standardized success envelope, reject invalid identifiers with a validation
error, accept leading-zero positive integers such as `001` as the same
identifier value, and map missing records to the standardized not-found
contract.

## Technical Context

**Language/Version**: TypeScript 6 on Node.js 24.15+

**Primary Dependencies**: Express, dotenv, pg, Vitest, vitest-mock-extended

**Storage**: PostgreSQL 17 with the existing `trip_requests` and `holidays`
tables

**Testing**: Vitest unit and integration tests

**Target Platform**: Linux-hosted Node.js service with local PostgreSQL for
development

**Project Type**: Backend web service

**Performance Goals**: Correctly handle direct travel-request lookup with a
predictable response contract and immediate distinction between invalid input,
missing data, and successful retrieval

**Constraints**: Use Yarn commands only; preserve feature-oriented
`domain`/`application`/`infra` boundaries; keep observable statuses limited to
`pending` and `canceled`; return observable timestamps in
`YYYY-MM-DDTHH:mm:ss.sssZ`; validate identifiers before repository lookup while
accepting leading-zero positive integers; preserve the current API access model
without adding new authentication or authorization behavior; keep
implementation scoped to the get-by-id flow

**Scale/Scope**: One read endpoint, one identifier lookup query, one not-found
error contract, and the minimal bootstrap changes needed to expose single-item
lookup without expanding into cancellation or holiday-query work

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: The planned structure keeps travel-request business rules in `domain`,
  orchestration in `application`, and HTTP and SQL code in `infra`.
- PASS: The specification captures explicit success, validation, not-found, and
  internal-error contracts plus canonical UTC timestamp requirements.
- PASS: The feature does not require a new external integration and stays
  compatible with the existing local-first holiday strategy already defined for
  the API.
- PASS: The plan includes unit coverage for identifier validation and
  integration coverage for HTTP and persistence behavior.
- PASS: Validation order remains aligned with repository rules: targeted tests,
  `yarn type:check`, `yarn lint`, and `yarn test`.
- PASS: No new dependency or cross-cutting mechanism is introduced beyond the
  already justified runtime stack.

## Project Structure

### Documentation (this feature)

```text
specs/003-get-trip-request/
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
extend the existing `trip-requests` feature with get-by-id specific
application, repository, and controller behavior. Shared HTTP bootstrap and
error handling remain under `src/shared/`, while lookup behavior stays isolated
inside the `trip-requests` module.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Repository abstraction for single-record lookup | The get-by-id flow must remain decoupled from SQL details and consistent with the existing travel-request architecture | Direct controller-to-SQL access would break established clean architecture boundaries and reduce testability |
