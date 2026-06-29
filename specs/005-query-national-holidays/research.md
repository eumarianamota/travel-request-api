# Research: Query National Holidays

## Decision 1: Reuse the existing holidays feature module

- **Decision**: Implement holiday-year querying as an extension of the existing
  `holidays` feature module instead of introducing a new top-level module.
- **Rationale**: The holiday query uses the same holiday records, repository,
  and external gateway already established for local-first holiday validation.
- **Alternatives considered**:
  - Add holiday querying to `shared`: rejected because it would place
    feature-specific business behavior outside the feature boundary.
  - Create a separate query-only module: rejected because it would duplicate
    established holiday concepts and abstractions.

## Decision 2: Validate the provided year before lookup

- **Decision**: Reject non-numeric, non-integer, or non-positive provided year
  values as validation errors before checking local storage or the external
  provider.
- **Rationale**: The product distinguishes invalid input from valid requests
  that require either local reuse or external synchronization.
- **Alternatives considered**:
  - Treat invalid years as absent holiday data: rejected because it would blur
    two distinct user-visible outcomes.
  - Accept any numeric-like string without validation: rejected because it
    weakens the explicit contract for year-based queries.
  - Treat a missing path segment as a feature-level validation error: rejected
    because `/holidays` is outside the route contract and should follow normal
    routing behavior.

## Decision 3: Preserve local-first year resolution for direct queries

- **Decision**: Query the local repository first and call the external holiday
  provider only when the requested year has no locally available records.
- **Rationale**: This matches the product rule already established for holiday
  validation and keeps repeated requests stable and less dependent on remote
  availability.
- **Alternatives considered**:
  - Always call the external provider: rejected because it increases runtime
    dependency and ignores cached data already considered authoritative enough
    for validation.
  - Never call the external provider from this feature: rejected because it
    would make valid uncached years unavailable despite the product requiring
    on-demand consultation.

## Decision 4: Reuse the existing provider-unavailability contract

- **Decision**: Return `502 Bad Gateway` with `HOLIDAYS_API_UNAVAILABLE` when
  the requested year is not available locally and the provider is required but
  unavailable.
- **Rationale**: The current API already uses this contract when holiday data
  is mandatory for trip creation, and provider failures still mean required
  holiday validation data could not be obtained, so direct holiday queries
  should remain consistent.
- **Alternatives considered**:
  - Return `500 Internal Server Error`: rejected because the failure source is
    an explicitly required external dependency.
  - Return an empty list on provider failure: rejected because it would hide a
    real data availability failure from clients.

## Decision 5: Return holiday records in a stable year-scoped list

- **Decision**: Successful responses return all holiday records for the
  requested year in the standard success envelope, preserving the `date`,
  `name`, `type`, and `year` fields for each item.
- **Rationale**: The PRD and technical design already define these fields as
  the observable holiday record shape.
- **Alternatives considered**:
  - Return only dates: rejected because it would omit meaningful holiday
    details already stored and reused by the system.
  - Return provider-specific raw payloads: rejected because it would weaken the
    API’s stable contract and leak external representation choices.

## Decision 6: Prefer integration tests for the holiday query contract

- **Decision**: Validate the feature primarily through integration tests
  covering successful local reuse, successful synchronization, invalid year
  input, and provider-unavailability mapping, with unit tests for year parsing
  and local-first orchestration.
- **Rationale**: The main value is boundary-facing behavior that depends on
  routing, use-case orchestration, repository lookup, gateway fallback, and
  response serialization working together.
- **Alternatives considered**:
  - Unit-only validation: rejected because it would not verify the HTTP
    contract.
  - Full end-to-end environment-only validation: rejected because targeted
    integration tests are faster and repository-aligned.
