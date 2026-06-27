# Research: Create Travel Request

## Decision 1: Implement the feature as a standalone vertical slice

- **Decision**: Build the create flow as a focused vertical slice containing
  only the required travel-request and holiday-validation capabilities.
- **Rationale**: The specification is intentionally limited to creation, so the
  implementation should avoid pulling list, get-by-id, or cancel behavior into
  the first delivery.
- **Alternatives considered**:
  - Build the full travel-request module up front: rejected because it expands
    scope beyond the active feature.
  - Start with only HTTP request validation: rejected because the feature must
    also persist data and enforce holiday business rules.

## Decision 2: Use local-first holiday validation behind explicit application
abstractions

- **Decision**: The create use case will query locally stored holidays first
  and only call the holiday provider when the required year is unavailable
  locally.
- **Rationale**: This matches the product rule, reduces external dependency in
  normal operation, and keeps the business decision isolated from transport
  details.
- **Alternatives considered**:
  - Always call the provider: rejected because it increases latency and
    external dependency for every create request.
  - Skip creation blocking when the provider is unavailable: rejected because it
    violates the specification.

## Decision 3: Normalize travel timestamps before persistence

- **Decision**: Accept valid ISO 8601 request timestamps and normalize them to
  the canonical UTC representation before persistence and response rendering.
- **Rationale**: The product defines the observable contract and requires the
  normalized civil departure date for holiday checks.
- **Alternatives considered**:
  - Preserve client-supplied timezone formatting: rejected because it weakens
    contract consistency.
  - Store local-time values without timezone normalization: rejected because it
    introduces ambiguity.

## Decision 4: Use raw SQL repositories with PostgreSQL constraints

- **Decision**: Persist new travel requests and cached holidays through raw SQL
  repositories backed by PostgreSQL constraints for critical invariants.
- **Rationale**: The technical design already selects PostgreSQL and raw SQL,
  and database constraints reinforce key business invariants such as positive
  passenger count and valid status values.
- **Alternatives considered**:
  - ORM-based mapping: rejected because it adds complexity without solving a
    current problem.
  - Memory-only persistence: rejected because the product requires durable
    storage.

## Decision 5: Formalize the creation contract with OpenAPI

- **Decision**: Capture the create endpoint request and response contract in an
  OpenAPI document that also records the explicit error statuses clarified in
  the spec.
- **Rationale**: The feature exposes an HTTP boundary and benefits from a
  machine-readable contract for implementation and testing.
- **Alternatives considered**:
  - Only prose-based contract notes: rejected because they are less precise and
    harder to validate.

## Decision 6: Split validation between unit and integration layers

- **Decision**: Use unit tests for creation rules, timestamp normalization, and
  holiday orchestration; use integration tests for HTTP response contracts,
  persistence, and provider-failure handling.
- **Rationale**: This follows repository testing rules and keeps fast feedback
  for domain logic while still verifying the actual API boundary.
- **Alternatives considered**:
  - Integration-only testing: rejected because it slows feedback and makes
    business-rule failures harder to isolate.
  - Unit-only testing: rejected because it would not verify the external
    contract or persistence boundary.
