# Implementation Plan: Query National Holidays

**Branch**: `n/a` | **Date**: 2026-06-28 | **Spec**: [/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/005-query-national-holidays/spec.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/005-query-national-holidays/spec.md)

**Input**: Feature specification from `/specs/005-query-national-holidays/spec.md`

## Summary

Implement the `GET /holidays/:year` flow as the next vertical slice of the
API. The feature will return national holidays for a requested year in the
standard success envelope, validate year input before lookup, reuse locally
available year data first, synchronize from BrasilAPI only when the requested
year is absent locally, and map required-provider failures to the standardized
availability error.

## Technical Context

**Language/Version**: TypeScript 6 on Node.js 24.15+

**Primary Dependencies**: Express, dotenv, pg, Vitest, vitest-mock-extended

**Storage**: PostgreSQL 17 with the existing `holidays` table

**Testing**: Vitest unit and integration tests

**Target Platform**: Linux-hosted Node.js service with local PostgreSQL for
development

**Project Type**: Backend web service

**Performance Goals**: Correctly return complete holiday-year results with
predictable success, validation, and provider-unavailability contracts

**Constraints**: Use Yarn commands only; preserve feature-oriented
`domain`/`application`/`infra` boundaries; keep the existing local-first
holiday strategy; preserve the current success and error envelope contracts;
validate year input before repository or gateway lookup; keep the scope
limited to querying one year at a time without adding new authentication or
authorization behavior; treat `/holidays/{year}` as the only feature route in
scope, leaving missing path segments to normal routing behavior

**Scale/Scope**: One holiday query endpoint, one year-based lookup flow, one
local-first synchronization path for uncached year data, and the minimal
bootstrap changes needed to expose holiday consultation over HTTP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PASS: The plan extends the existing `holidays` feature while keeping query
  orchestration in `application`, validation rules in `domain`, and HTTP/SQL
  adapters in `infra`.
- PASS: The feature preserves explicit success and error envelopes and defines
  user-visible validation and provider-unavailability contracts.
- PASS: The external holiday lookup remains behind the existing gateway and
  repository abstractions with local-first behavior preserved.
- PASS: The plan includes unit coverage for year parsing and local-first query
  orchestration, plus integration coverage for HTTP and synchronization
  behavior.
- PASS: Validation remains aligned with repository rules: targeted tests,
  `yarn type:check`, `yarn lint`, and `yarn test`.
- PASS: No new dependency or cross-cutting mechanism is introduced beyond the
  existing runtime stack.

## Project Structure

### Documentation (this feature)

```text
specs/005-query-national-holidays/
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
├── shared/
│   ├── domain/
│   └── infra/
│       ├── db/
│       └── http/
├── holidays/
│   ├── domain/
│   ├── application/
│   └── infra/
└── trip-requests/
    ├── domain/
    ├── application/
    └── infra/

test/
├── main.spec.ts
├── unit/
│   ├── holidays/
│   └── trip-requests/
└── integration/
    └── holidays/
```

**Structure Decision**: Keep the repository as a single TypeScript service and
extend the existing `holidays` feature with query-specific application and
controller behavior. The shared HTTP bootstrap remains under `src/shared/`,
while holiday retrieval and synchronization stay isolated inside the
`holidays` module.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | n/a | n/a |
