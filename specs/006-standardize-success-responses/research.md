# Research: Standardize Success Responses

## Decision 1: Treat success-envelope standardization as an API-boundary concern

- **Decision**: Apply the feature at controller and contract boundaries instead
  of changing domain or application return types.
- **Rationale**: The product requirement is about observable HTTP response
  shape, not internal business orchestration. Keeping the envelope at the API
  boundary preserves clean architecture and limits change scope.
- **Alternatives considered**:
  - Wrap use-case return types in success envelopes: rejected because it would
    leak transport concerns into application logic.
  - Introduce a global serialization abstraction first: rejected because the
    current API surface is small and can be aligned with simpler targeted
    changes.

## Decision 2: Preserve operation-specific HTTP status codes while standardizing only the envelope

- **Decision**: Keep `201 Created` for successful creation and `200 OK` for
  successful read, cancel, and holiday-query operations.
- **Rationale**: The PRD explicitly defines these statuses, and the feature is
  about success-body consistency rather than changing operation semantics.
- **Alternatives considered**:
  - Normalize all successful responses to `200 OK`: rejected because it would
    change documented operation semantics unnecessarily.
  - Expand the feature to revisit all status choices: rejected because it
    broadens scope beyond success-envelope standardization.

## Decision 3: Preserve existing business payload shapes inside `data`

- **Decision**: Keep trip-request responses as full trip-request objects and
  list responses as simple arrays, with only the outer success envelope being
  standardized.
- **Rationale**: The PRD and technical specification already define the
  observable business payloads. Clients need consistent wrapping, not new inner
  payload variants.
- **Alternatives considered**:
  - Add extra metadata objects around lists or single resources: rejected
    because it would create new endpoint-specific variants.
  - Collapse single-resource and list responses to a generic polymorphic shape:
    rejected because the existing payload distinction is already meaningful and
    explicit.

## Decision 4: Validate the feature primarily with integration and contract regression tests

- **Decision**: Use integration tests to assert the observable success envelope
  for each affected endpoint and use contract-regression tests for documented
  examples.
- **Rationale**: The feature is externally visible and primarily about HTTP
  response shape, status codes, and payload serialization working together.
- **Alternatives considered**:
  - Unit-only validation: rejected because it would not sufficiently verify
    the exposed API contract.
  - Manual-only validation through quickstart scenarios: rejected because the
    repository treats automated tests as delivery gates.

## Decision 5: Keep error standardization explicitly out of scope

- **Decision**: Limit the feature to successful responses and rely on the
  already established error standardization contract without modifying it.
- **Rationale**: The spec scope is intentionally narrow and avoids mixing
  separate API-contract concerns in one feature.
- **Alternatives considered**:
  - Update success and error contracts together: rejected because it combines
    two distinct features and increases rework risk for already validated error
    flows.
