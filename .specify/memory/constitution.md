<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. Feature-Oriented Clean Architecture
  - Template Principle 2 -> II. Stable API Contracts and UTC Normalization
  - Template Principle 3 -> III. Local-First External Integrations
  - Template Principle 4 -> IV. Tests as Delivery Gates
  - Template Principle 5 -> V. Minimal Infrastructure, Explicit Operations
- Added sections:
  - Technical Standards
  - Delivery Workflow
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated /.specify/templates/plan-template.md
  - ✅ updated /.specify/templates/spec-template.md
  - ✅ updated /.specify/templates/tasks-template.md
  - ⚠ pending /.specify/templates/commands/*.md (directory not present in repository)
- Follow-up TODOs:
  - None
-->
# Travel Request API Constitution

## Core Principles

### I. Feature-Oriented Clean Architecture
Code MUST be organized by feature and, inside each feature, by `domain`,
`application`, and `infra`. Business rules MUST live in `domain`,
orchestration MUST live in `application`, and controllers, repositories,
gateways, and framework code MUST live in `infra`. Shared code MUST stay
small, explicit, and free from feature-specific business rules. Rationale:
this preserves low coupling, keeps tests focused, and matches the approved
technical design for this API.

### II. Stable API Contracts and UTC Normalization
Observable API behavior MUST remain explicit, consistent, and contract-driven.
Success responses MUST use the `success` and `data` envelope, errors MUST be
standardized, and observable trip request statuses MUST remain limited to
`requested` and `canceled` unless the specification is amended. Input dates
accepted in valid ISO 8601 formats MUST be normalized before persistence and
returned in UTC with the `YYYY-MM-DDTHH:mm:ss.sssZ` format. Rationale: the
product depends on predictable client contracts and unambiguous date handling.

### III. Local-First External Integrations
External services MUST be accessed behind explicit gateway or repository
abstractions. Holiday validation and holiday queries MUST check local persisted
data first and call BrasilAPI only when the requested year is absent or needs
refresh according to the active specification. If an operation depends on an
external holiday lookup and the lookup fails, the operation MUST fail without
partial creation. Rationale: this minimizes runtime coupling and preserves the
business rule that holiday validation is authoritative.

### IV. Tests as Delivery Gates
Every behavior change in source code MUST include automated tests or an
explicit written justification for not adding them. Domain and application
rules MUST prefer unit tests; controllers, repositories, SQL persistence, and
HTTP flows MUST prefer integration tests. Before implementation is considered
complete, the smallest adequate validation set MUST run in this order when
applicable: targeted tests, `yarn type:check`, `yarn lint`, and `yarn test`.
Rationale: the repository explicitly treats tests as first-class artifacts and
requires verifiable delivery.

### V. Minimal Infrastructure, Explicit Operations
The project MUST prefer the simplest adequate implementation: TypeScript,
Node.js, Express, PostgreSQL, raw SQL, and Yarn-based workflows. New
dependencies, abstractions, and cross-cutting mechanisms MUST have a clear
problem-driven justification. Logging MUST cover bootstrap, creation,
cancellation, holiday synchronization, validation failures, not-found cases,
invalid cancellation attempts, and unexpected infrastructure failures. Rationale:
the current scope is a focused internal API and must remain easy to reason
about, operate, and change.

## Technical Standards

- TypeScript strictness MUST be preserved.
- Repository commands MUST use `yarn` exclusively.
- Node.js built-in imports SHOULD use the `node:` prefix when applicable.
- Official aliases and import conventions already adopted by the repository,
  including `#src/*` when relevant, MUST be preserved.
- Code identifiers, comments, logs, errors, tests, and internal text MUST be
  written in English.
- Naming MUST follow repository conventions: `camelCase` for values and
  members, `PascalCase` for types, classes, and enums, and `kebab-case` for
  files and directories.
- SQL schema constraints SHOULD enforce critical invariants already defined by
  the product, including positive passenger count and valid status values.

## Delivery Workflow

- Every feature proposal, plan, and task list MUST be checked against this
  constitution before implementation starts.
- Feature specifications MUST describe user journeys, edge cases, functional
  requirements, contract expectations, and assumptions that affect observable
  behavior.
- Implementation plans MUST document the chosen structure, repository
  boundaries, validation strategy, and any constitution violations with an
  explicit justification.
- Task lists for behavior changes MUST include work for automated tests,
  contract preservation, and required observability updates when applicable.
- Reviews MUST reject changes that move business rules into infrastructure,
  weaken automated validation, or introduce unsupported contract drift.

## Governance

This constitution overrides conflicting local habits and acts as the default
decision source for planning, implementation, and review. Amendments MUST be
recorded in this file, include a concise rationale, and update dependent
templates in `.specify/templates/` within the same change. Versioning follows
semantic versioning for governance: MAJOR for incompatible principle changes or
removals, MINOR for new principles or materially expanded guidance, and PATCH
for clarifications that do not change required behavior. Compliance MUST be
checked in every plan's Constitution Check and in every code review for
architecture, contracts, tests, and validation flow.

**Version**: 1.0.0 | **Ratified**: 2026-06-27 | **Last Amended**: 2026-06-27
