# Research: Standardize Error Responses

## Decision 1: Treat error-envelope standardization as a shared HTTP-boundary concern

- **Decision**: Keep error serialization centralized in the shared HTTP error
  middleware instead of duplicating envelope logic in individual controllers.
- **Rationale**: The feature is about observable failed response shape. The
  existing middleware already receives all thrown application errors and
  unexpected failures, making it the narrowest and most coherent boundary for
  standardization.
- **Alternatives considered**:
  - Serialize errors inside each controller: rejected because it would
    duplicate response logic and make contract drift more likely.
  - Move HTTP-shaped envelopes into application use cases: rejected because it
    would leak transport concerns into business orchestration.

## Decision 2: Preserve the current application error catalog and status mappings

- **Decision**: Reuse the existing canonical error codes and their documented
  HTTP status mappings for validation, not-found, business-rule, provider, and
  unexpected-failure paths.
- **Rationale**: The PRD already defines the vocabulary, and the repository has
  matching application errors. The feature should standardize the envelope, not
  invent a new taxonomy.
- **Alternatives considered**:
  - Introduce new generic categories such as `BAD_REQUEST` or `CONFLICT`:
    rejected because it would reduce precision and drift from the documented
    contract.
  - Collapse multiple failure paths to one generic error code: rejected because
    clients need stable, specific failure reasons.

## Decision 3: Keep operation-specific error statuses unchanged

- **Decision**: Preserve `400`, `404`, `409`, `502`, and `500` exactly where
  they are already defined, while standardizing only the response envelope.
- **Rationale**: The product requirement is consistency of error structure and
  code mapping, not a redesign of operation semantics.
- **Alternatives considered**:
  - Normalize all failures to one HTTP status: rejected because it would break
    documented behavior and remove useful protocol-level signal.
  - Revisit the status strategy for all endpoints: rejected because it expands
    scope beyond this feature.

## Decision 4: Validate the feature primarily through integration and contract regression tests

- **Decision**: Use integration tests for observable error flows on each
  affected endpoint and maintain contract examples for the documented error
  responses.
- **Rationale**: The feature is user-visible at the HTTP boundary, so
  end-to-end request/response verification gives the strongest signal while
  still keeping the scope small.
- **Alternatives considered**:
  - Unit-only validation of the middleware: rejected because it would not prove
    the full endpoint contract.
  - Manual-only quickstart validation: rejected because the constitution treats
    automated tests as delivery gates.

## Decision 5: Preserve success-response standardization as a separate concern

- **Decision**: Limit this feature to failed responses and keep the already
  standardized success envelope unchanged.
- **Rationale**: Success and error contracts are related but distinct API
  concerns, and the success shape was already specified and implemented in
  feature 006.
- **Alternatives considered**:
  - Reopen success and error shaping together: rejected because it mixes two
    completed contracts and increases rework risk without a product need.
