# Research: Get Trip Request

## Decision 1: Reuse the existing travel-request vertical slice

- **Decision**: Implement get-by-id as an extension of the existing
  `trip-requests` feature module instead of introducing a new top-level module.
- **Rationale**: The lookup endpoint reads the same travel-request entity and
  belongs to the same feature boundary already established for creation and
  listing.
- **Alternatives considered**:
  - Create a generic read-query module: rejected because it introduces
    abstraction without a feature-driven need.
  - Put identifier lookup logic in shared HTTP bootstrap: rejected because it
    would move feature behavior outside the trip-request boundary.

## Decision 2: Validate identifiers before persistence lookup

- **Decision**: Reject missing, non-numeric, or non-positive identifiers as
  validation errors before attempting repository lookup.
- **Rationale**: The spec explicitly distinguishes invalid input from a valid
  identifier that simply does not match a stored record.
- **Alternatives considered**:
  - Let every invalid identifier fall through to not-found: rejected because it
    merges two distinct user-visible outcomes.
  - Rely only on route parsing side effects: rejected because validation rules
    should remain explicit and testable.

## Decision 3: Model missing records as a standardized not-found error

- **Decision**: Return `404 Not Found` with `TRIP_REQUEST_NOT_FOUND` when the
  identifier is valid but no record exists.
- **Rationale**: The PRD explicitly requires a standardized not-found contract
  for absent travel requests.
- **Alternatives considered**:
  - Return `200 OK` with a null payload: rejected because it weakens the API's
    explicit error semantics.
  - Return `400 Bad Request` for all failed lookups: rejected because it
    misclassifies valid requests for absent resources.

## Decision 4: Preserve the same observable travel-request shape as creation and listing

- **Decision**: Return the lookup result using the full travel-request object
  with canonical UTC timestamps and observable statuses.
- **Rationale**: The PRD shows the same travel-request shape for success
  responses across create, list, and get-by-id flows.
- **Alternatives considered**:
  - Return a reduced detail object: rejected because it would create contract
    drift across travel-request operations.
  - Return raw persistence values: rejected because it would break the UTC
    normalization contract.

## Decision 5: Prefer integration tests for the main lookup contract

- **Decision**: Validate get-by-id primarily through integration tests covering
  success, invalid identifiers, not-found behavior, and internal failure
  mapping, with unit tests only where identifier validation is isolated.
- **Rationale**: The main behavior is boundary-facing and depends on route,
  use-case orchestration, repository lookup, and response serialization working
  together.
- **Alternatives considered**:
  - Unit-only validation of lookup behavior: rejected because it would not
    verify the HTTP contract.
  - Full environment-only validation: rejected because repository-preferred
    integration coverage is faster and more isolated.
