# Research: Cancel Trip Request

## Decision 1: Reuse the existing travel-request vertical slice

- **Decision**: Implement cancellation as an extension of the existing
  `trip-requests` feature module instead of introducing a new top-level module.
- **Rationale**: The cancellation endpoint changes the same travel-request
  entity already handled by creation, listing, and get-by-id flows.
- **Alternatives considered**:
  - Create a dedicated workflow module: rejected because it introduces an
    unnecessary boundary for a single state transition.
  - Put cancellation logic in shared HTTP bootstrap: rejected because it would
    move feature behavior outside the trip-request boundary.

## Decision 2: Validate identifiers before any persistence lookup or update

- **Decision**: Reject missing, non-numeric, or non-positive identifiers as
  validation errors before attempting lookup or status updates, while accepting
  leading-zero positive values such as `001` as the same numeric identifier.
- **Rationale**: The product distinguishes invalid input from valid requests
  that target missing or already canceled records.
- **Alternatives considered**:
  - Let invalid identifiers fall through to not-found: rejected because it
    merges distinct user-visible outcomes.
  - Reject all leading-zero identifiers: rejected because it adds friction
    without changing the referenced positive integer.

## Decision 3: Model cancellation as a logical status transition

- **Decision**: Keep the travel request persisted and update only its
  observable `status` from `requested` to `canceled`.
- **Rationale**: The PRD explicitly requires a logical cancellation that
  preserves request history.
- **Alternatives considered**:
  - Delete the record: rejected because it removes history and violates the
    product rule.
  - Create a separate cancellation record: rejected because the current domain
    only exposes `requested` and `canceled` as observable statuses.

## Decision 4: Reject repeated cancellation as a standardized conflict

- **Decision**: Return `409 Conflict` with `TRIP_REQUEST_ALREADY_CANCELED` when
  the requested record is already canceled.
- **Rationale**: The PRD explicitly defines repeated cancellation as a business
  rule violation that must remain visible to clients.
- **Alternatives considered**:
  - Treat repeated cancellation as idempotent success: rejected because it
    would hide an explicit invalid-state rule from consumers.
  - Return `400 Bad Request`: rejected because the request format is valid and
    the failure is state-based rather than syntactic.

## Decision 5: Preserve the same observable travel-request shape after cancellation

- **Decision**: Return the full travel-request object after cancellation,
  preserving canonical UTC timestamps and all fields except the updated
  `status`.
- **Rationale**: The PRD uses the same response shape across create, list,
  get-by-id, and cancel flows.
- **Alternatives considered**:
  - Return only a confirmation message: rejected because it would create
    contract drift across travel-request operations.
  - Return raw persistence values: rejected because it would weaken the
    normalization contract.

## Decision 6: Prefer integration tests for the cancellation contract

- **Decision**: Validate cancellation primarily through integration tests
  covering success, invalid identifiers, not-found behavior, repeated
  cancellation conflict, and internal failure mapping, with unit tests for
  identifier parsing and invalid-state handling.
- **Rationale**: The main behavior is boundary-facing and depends on route,
  use-case orchestration, repository updates, and response serialization
  working together.
- **Alternatives considered**:
  - Unit-only validation of cancellation behavior: rejected because it would
    not verify the HTTP contract.
  - Full environment-only validation: rejected because repository-preferred
    integration coverage is faster and more isolated.
