# Feature Specification: Cancel Trip Request

**Feature Branch**: `004-cancel-trip-request`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "crie a especificação para o Cancelamento de solicitação de viagem de acordo com o api-prd.md e techspec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cancel an Existing Travel Request (Priority: P1)

As an internal institutional staff member, I want to cancel an existing travel
request so that the API reflects that the trip should no longer happen without
removing the request history.

**Why this priority**: Logical cancellation is the core user value of this
feature and preserves the operational history required by the product.

**Independent Test**: Persist a travel request with status `pending`,
request `PATCH /trip-requests/:id/cancel`, and verify that the response returns
the complete travel-request object with status `canceled` in the standard
success envelope.

**Acceptance Scenarios**:

1. **Given** a travel request exists and is currently `pending`, **When** the
   user requests `PATCH /trip-requests/:id/cancel`, **Then** the system returns
   the updated travel request in the standard success response with status
   `canceled`.
2. **Given** a travel request is canceled successfully, **When** the user later
   consults that same request, **Then** the request still exists and preserves
   all observable fields except for the updated status.

---

### User Story 2 - Receive Clear Feedback When the Travel Request Does Not Exist (Priority: P2)

As an internal institutional staff member, I want a cancellation attempt for a
missing travel request to fail with a predictable not-found response so that I
can distinguish an absent record from other failures.

**Why this priority**: The feature must preserve the API's standardized
not-found contract for direct operations on an identifier.

**Independent Test**: Request `PATCH /trip-requests/:id/cancel` for a
non-existent identifier and verify that the response is a standardized `404`
not-found error.

**Acceptance Scenarios**:

1. **Given** no travel request exists for the requested identifier, **When**
   the user requests `PATCH /trip-requests/:id/cancel`, **Then** the system
   returns a standardized not-found error.

---

### User Story 3 - Prevent Duplicate Cancellation (Priority: P3)

As an internal institutional staff member, I want the API to reject repeated
cancellation of an already canceled travel request so that business state
violations remain explicit and predictable.

**Why this priority**: The product explicitly requires repeated cancellation to
be blocked as an invalid business-state transition.

**Independent Test**: Persist a travel request already marked as `canceled`,
request `PATCH /trip-requests/:id/cancel`, and verify that the response is a
standardized business-rule error.

**Acceptance Scenarios**:

1. **Given** the requested travel request already has status `canceled`,
   **When** the user requests `PATCH /trip-requests/:id/cancel`, **Then** the
   system returns a standardized conflict error instead of applying a second
   cancellation.
2. **Given** the requested travel request is already `canceled`, **When** the
   cancellation attempt is rejected, **Then** the stored status remains
   `canceled`.

### Edge Cases

- A valid positive identifier that does not match any stored travel request
  must return a standardized not-found response.
- An invalid identifier format must be rejected before the system attempts to
  cancel the record.
- An identifier with leading zeros, such as `001`, must be interpreted as the
  corresponding positive integer instead of being rejected for formatting
  alone.
- A cancellation attempt for an already canceled travel request must return
  `409 Conflict` with the standardized `TRIP_REQUEST_ALREADY_CANCELED` error.
- Logical cancellation must preserve the stored travel request record and all
  observable fields except for the change of `status` to `canceled`.
- Unexpected persistence or application failures during cancellation must
  return the standardized internal error response instead of a partial update.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an internal institutional staff member to
  cancel a travel request by `id`.
- **FR-002**: The cancellation operation MUST be logical and MUST not remove
  the travel request from persistence.
- **FR-003**: A successful cancellation MUST change the observable `status` to
  `canceled`.
- **FR-004**: The cancellation response MUST return the complete updated
  travel-request object in the standardized success envelope with `success` and
  `data`.
- **FR-005**: The `data` field of a successful cancellation response MUST
  contain a single travel-request object with `id`, `requesterName`, `origin`,
  `destination`, `departureAt`, `returnAt`, `purpose`, `passengerCount`,
  `status`, and `createdAt`.
- **FR-006**: The cancellation operation MUST preserve observable statuses and
  limit them to `pending` and `canceled`.
- **FR-007**: The cancellation operation MUST preserve `departureAt`,
  `returnAt`, and `createdAt` in the canonical UTC format
  `YYYY-MM-DDTHH:mm:ss.sssZ`.
- **FR-008**: The system MUST reject identifiers that are missing,
  non-numeric, or not positive integers.
- **FR-009**: The system MUST accept identifiers with leading zeros when their
  numeric value is still a positive integer.
- **FR-010**: The system MUST use `VALIDATION_ERROR` when the identifier input
  is invalid.
- **FR-011**: The system MUST return `400 Bad Request` when the identifier
  input is invalid.
- **FR-012**: The system MUST return a standardized error response when the
  requested travel request does not exist.
- **FR-013**: The system MUST use `TRIP_REQUEST_NOT_FOUND` when the requested
  travel request is not found.
- **FR-014**: The system MUST return `404 Not Found` when the requested travel
  request is not found.
- **FR-015**: The system MUST reject cancellation of a travel request whose
  observable `status` is already `canceled`.
- **FR-016**: The system MUST use `TRIP_REQUEST_ALREADY_CANCELED` when a
  cancellation attempt targets an already canceled travel request.
- **FR-017**: The system MUST return `409 Conflict` when a cancellation attempt
  targets an already canceled travel request.
- **FR-018**: The system MUST return unexpected cancellation failures in the
  standardized error envelope with `success`, `error.code`, and
  `error.message`.
- **FR-019**: The system MUST use `INTERNAL_SERVER_ERROR` for unexpected
  failures during cancellation.
- **FR-020**: The system MUST return `500 Internal Server Error` for
  unexpected failures during cancellation.
- **FR-021**: The cancellation operation MUST not introduce new authentication
  or authorization behavior beyond the current API access model.

### Key Entities *(include if feature involves data)*

- **Cancelable Travel Request**: The persisted travel-request record targeted by
  the cancellation operation, containing identity, traveler context, trip
  timestamps, passenger count, purpose, creation timestamp, and observable
  status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful cancellation requests return the standardized
  success envelope with a single travel-request object whose `status` is
  `canceled`.
- **SC-002**: 100% of evaluated cancellations for non-existent identifiers
  return the standardized not-found error with the correct error category.
- **SC-003**: 100% of evaluated repeated cancellations for already canceled
  requests return the standardized conflict error instead of altering the
  record again.
- **SC-004**: 100% of evaluated invalid identifier inputs return the
  standardized validation error instead of a not-found or conflict response.

## Assumptions

- This specification is intentionally limited to the
  `PATCH /trip-requests/:id/cancel` operation and does not include creation,
  listing, get-by-id, or holiday-query changes.
- The primary users are internal institutional staff members who already have
  access to the API.
- The cancellation operation follows the current service access model and does
  not add new authentication or authorization requirements in this feature.
- The identifier represents a positive integer generated by the system for each
  registered travel request.
- The current observable statuses remain limited to `pending` and `canceled`.
- A logically canceled travel request must remain retrievable through existing
  consultation flows after cancellation.
