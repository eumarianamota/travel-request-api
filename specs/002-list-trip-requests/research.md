# Research: List Trip Requests

## Decision 1: Reuse the existing travel-request vertical slice

- **Decision**: Implement listing as an extension of the existing
  `trip-requests` feature module instead of introducing a separate top-level
  module.
- **Rationale**: The list endpoint reads the same travel-request entity and
  belongs to the same feature boundary already established for creation.
- **Alternatives considered**:
  - Create a generic query module: rejected because it introduces abstraction
    without a feature-driven need.
  - Add listing logic directly in shared HTTP bootstrap: rejected because it
    would move business behavior outside the feature boundary.

## Decision 2: Treat empty results as a successful business outcome

- **Decision**: Return `200 OK` with `success: true` and `data: []` when no
  travel requests exist.
- **Rationale**: The PRD explicitly defines empty-list behavior as a success
  case, not an error or special response shape.
- **Alternatives considered**:
  - Return `404 Not Found` for no records: rejected because the collection
    resource exists even when it has no items.
  - Return a custom empty-state payload: rejected because it would drift from
    the standard success envelope.

## Decision 3: Make ordering explicit at the persistence boundary

- **Decision**: Order listing results by `departureAt` descending in the
  repository query.
- **Rationale**: The feature contract requires observable ordering, and
  enforcing it where data is fetched keeps the behavior deterministic.
- **Alternatives considered**:
  - Sort only in the controller: rejected because it couples transport code to
    business ordering rules.
  - Leave ordering unspecified: rejected because it violates the product
    contract.

## Decision 4: Preserve the same observable travel-request shape as creation

- **Decision**: Return list items using the same observable fields and UTC
  timestamp normalization as the created travel-request response.
- **Rationale**: The PRD shows the same shape for travel-request objects across
  operations, which reduces consumer ambiguity and contract drift.
- **Alternatives considered**:
  - Return a reduced summary object: rejected because the PRD expects the full
    travel-request object in the list response.
  - Return raw database timestamps: rejected because it would break the
    canonical UTC contract.

## Decision 5: Prefer integration tests for list behavior

- **Decision**: Validate listing primarily through integration tests covering
  HTTP responses, empty results, ordering, and failure mapping.
- **Rationale**: The behavior is mostly boundary-facing and depends on route,
  repository, and response serialization working together.
- **Alternatives considered**:
  - Unit-only testing of ordering: rejected because it would not verify the
    external contract.
  - Full end-to-end environment-only validation: rejected because it would be
    slower and less isolated than repository-preferred integration coverage.
