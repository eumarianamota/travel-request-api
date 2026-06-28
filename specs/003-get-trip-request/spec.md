# Feature Specification: Get Trip Request

**Feature Branch**: `003-get-trip-request`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "crie a especificação para Consulta de solicitação por identificador de acordo com os arquivos api-prd.md e techspec.md"

## Clarifications

### Session 2026-06-28

- Q: Should `GET /trip-requests/:id` introduce new authentication or authorization behavior? → A: No new auth behavior; it follows the current service access model.
- Q: Should identifiers with leading zeros such as `001` be accepted? → A: Yes, accept them as valid and interpret them as the same positive integer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View a Specific Travel Request (Priority: P1)

As an internal institutional staff member, I want to consult a travel request
by identifier so that I can retrieve a specific registered record directly.

**Why this priority**: Direct lookup by identifier is the main user value of
this feature and enables precise access to an individual request.

**Independent Test**: Persist a travel request, request
`GET /trip-requests/:id`, and verify that the response returns the complete
travel-request object in the standard success envelope.

**Acceptance Scenarios**:

1. **Given** a travel request exists for the requested identifier, **When** the
   user requests `GET /trip-requests/:id`, **Then** the system returns that
   travel request in the standard success response.
2. **Given** a stored travel request includes observable timestamps and status,
   **When** the user requests it by identifier, **Then** the returned object
   preserves canonical UTC timestamps and the observable status.

---

### User Story 2 - Receive Clear Feedback When the Travel Request Does Not Exist (Priority: P2)

As an internal institutional staff member, I want a missing travel request to
be rejected with a predictable not-found response so that I can distinguish
absence of data from other failures.

**Why this priority**: The feature must provide a stable not-found contract for
direct record lookup.

**Independent Test**: Request `GET /trip-requests/:id` for a non-existent
identifier and verify that the response is a standardized `404` not-found
error.

**Acceptance Scenarios**:

1. **Given** no travel request exists for the requested identifier, **When**
   the user requests `GET /trip-requests/:id`, **Then** the system returns a
   standardized not-found error.

---

### User Story 3 - Reject Invalid Identifier Input Consistently (Priority: P3)

As an internal institutional staff member, I want invalid identifiers to be
rejected consistently so that I understand that the lookup request itself is
incorrect rather than the record being absent.

**Why this priority**: Identifier validation prevents ambiguous client behavior
between invalid requests and valid not-found lookups.

**Independent Test**: Request `GET /trip-requests/:id` with an invalid
identifier value and verify that the response is a standardized validation
error.

**Acceptance Scenarios**:

1. **Given** the identifier is missing, non-numeric, or not a positive
   integer, **When** the user requests `GET /trip-requests/:id`, **Then** the
   system returns a standardized validation error.
2. **Given** the identifier format is valid but the record does not exist,
   **When** the user requests `GET /trip-requests/:id`, **Then** the system
   returns the not-found error instead of a validation error.

### Edge Cases

- A valid positive identifier that does not match any stored travel request
  must return a standardized not-found response.
- An invalid identifier format must be rejected before the system attempts to
  treat the request as a not-found lookup.
- An identifier with leading zeros, such as `001`, must be interpreted as the
  corresponding positive integer instead of being rejected for formatting
  alone.
- The returned `departureAt`, `returnAt`, and `createdAt` values must remain in
  canonical UTC format even when the original creation inputs used other valid
  ISO 8601 timezone representations.
- Unexpected persistence or application failures during lookup must return the
  standardized internal error response instead of a partial record.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an internal institutional staff member to
  consult a travel request by `id`.
- **FR-002**: The system MUST return the complete travel request when the
  requested identifier exists.
- **FR-003**: The system MUST return the lookup result in the standardized
  success envelope with `success` and `data`.
- **FR-004**: The `data` field of a successful lookup response MUST contain a
  single travel-request object.
- **FR-005**: The returned travel request MUST include `id`, `requesterName`,
  `origin`, `destination`, `departureAt`, `returnAt`, `purpose`,
  `passengerCount`, `status`, and `createdAt`.
- **FR-006**: The system MUST preserve observable statuses in the lookup
  response and limit them to `pending` and `canceled`.
- **FR-007**: The system MUST return `departureAt`, `returnAt`, and `createdAt`
  in the canonical UTC format `YYYY-MM-DDTHH:mm:ss.sssZ`.
- **FR-008**: The system MUST reject identifiers that are missing,
  non-numeric, or not positive integers.
- **FR-008a**: The system MUST accept identifiers with leading zeros when their
  numeric value is still a positive integer.
- **FR-009**: The system MUST use `VALIDATION_ERROR` when the identifier input
  is invalid.
- **FR-010**: The system MUST return `400 Bad Request` when the identifier
  input is invalid.
- **FR-011**: The system MUST return a standardized error response when the
  requested travel request does not exist.
- **FR-012**: The system MUST use `TRIP_REQUEST_NOT_FOUND` when the requested
  travel request is not found.
- **FR-013**: The system MUST return `404 Not Found` when the requested travel
  request is not found.
- **FR-014**: The system MUST return unexpected lookup failures in the
  standardized error envelope with `success`, `error.code`, and
  `error.message`.
- **FR-015**: The system MUST use `INTERNAL_SERVER_ERROR` for unexpected
  failures during lookup.
- **FR-016**: The system MUST return `500 Internal Server Error` for
  unexpected failures during lookup.
- **FR-017**: The lookup operation MUST not introduce new authentication or
  authorization behavior beyond the current API access model.

### Key Entities *(include if feature involves data)*

- **Travel Request Detail**: The observable travel-request record returned by
  the lookup operation, containing identity, traveler context, trip timestamps,
  passenger count, purpose, creation timestamp, and current status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful lookup requests return the standardized
  success envelope with a single travel-request object in `data`.
- **SC-002**: 100% of evaluated lookups for non-existent identifiers return the
  standardized not-found error with the correct error category.
- **SC-003**: 100% of evaluated invalid identifier inputs return the
  standardized validation error instead of a not-found response.
- **SC-004**: 100% of returned travel-request timestamps are presented in the
  canonical UTC format.

## Assumptions

- This specification is intentionally limited to the `GET /trip-requests/:id`
  operation and does not include listing, creation, cancellation, or holiday
  queries.
- The primary users are internal institutional staff members who already have
  access to the API.
- The `GET /trip-requests/:id` operation follows the current service access
  model and does not add new authentication or authorization requirements in
  this feature.
- The identifier represents a positive integer generated by the system for each
  registered travel request.
- The lookup operation reads persisted travel requests only and does not
  require fresh external holiday-provider access.
- The standardized success and error contracts already defined for the API
  apply to the lookup operation without introducing new response shapes.
