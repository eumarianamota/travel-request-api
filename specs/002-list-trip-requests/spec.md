# Feature Specification: List Trip Requests

**Feature Branch**: `002-list-trip-requests`

**Created**: 2026-06-27

**Status**: Draft

**Input**: User description: "crie a especificação para Listagem de solicitações de viagem conforme os documentos api-prd.md e techspec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Registered Travel Requests (Priority: P1)

As an internal institutional staff member, I want to list travel requests so
that I can review the travel records that have already been registered.

**Why this priority**: Listing existing requests is a core read operation that
lets users inspect the records already stored by the system.

**Independent Test**: Persist multiple travel requests with different departure
dates and verify that a `GET /trip-requests` request returns all of them in the
standard success envelope.

**Acceptance Scenarios**:

1. **Given** travel requests already exist, **When** the user requests the
   list, **Then** the system returns all registered travel requests in the
   standard success response.
2. **Given** travel requests exist with different departure timestamps,
   **When** the user requests the list, **Then** the system returns them
   ordered by `departureAt` from the most recent to the oldest.

---

### User Story 2 - Receive an Empty List When No Records Exist (Priority: P2)

As an internal institutional staff member, I want the list operation to return
an empty collection when nothing has been registered so that I can distinguish
between "no data yet" and an operation failure.

**Why this priority**: The empty-state behavior is part of the observable API
contract and prevents users from treating an absence of data as an error.

**Independent Test**: Request `GET /trip-requests` against an empty dataset and
verify that the response is `200 OK` with `success: true` and `data: []`.

**Acceptance Scenarios**:

1. **Given** no travel requests are registered, **When** the user requests the
   list, **Then** the system returns a successful response containing an empty
   list.

---

### User Story 3 - Receive Predictable Travel Request Details in the List (Priority: P3)

As an internal institutional staff member, I want each listed item to preserve
the expected travel-request data contract so that I can safely consume the list
output in the same way as individual travel records.

**Why this priority**: The listing endpoint must remain predictable and
consistent with the product's contract for observable trip-request data.

**Independent Test**: Request `GET /trip-requests` after storing records with
different statuses and timestamps, then verify that each item includes the full
expected fields with canonical UTC timestamps and observable statuses.

**Acceptance Scenarios**:

1. **Given** registered travel requests include observable statuses and
   timestamps, **When** the user requests the list, **Then** each returned item
   contains the expected fields and canonical UTC timestamp values.
2. **Given** registered travel requests include both active and canceled
   records, **When** the user requests the list, **Then** the system includes
   both `pending` and `canceled` items in the returned list.

### Edge Cases

- The list operation must return `data: []` instead of an error when the
  dataset is empty.
- Records with identical `departureAt` values are still required to appear in
  the response, but only the descending `departureAt` order is part of the
  observable contract.
- Returned `departureAt`, `returnAt`, and `createdAt` values must remain in the
  canonical UTC timestamp format even when the original creation inputs used
  other valid ISO 8601 timezone representations.
- Unexpected persistence or application failures during listing must return the
  standardized internal error response instead of a partial list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an internal institutional staff member to
  list the travel requests that are currently registered.
- **FR-002**: The system MUST return all registered travel requests in the
  listing response.
- **FR-003**: The system MUST return an empty list when no travel requests are
  registered.
- **FR-004**: The system MUST order the returned travel requests by
  `departureAt`, from the most recent to the oldest.
- **FR-005**: The system MUST return the listing result in the standardized
  success envelope with `success` and `data`.
- **FR-006**: The system MUST return a simple list of travel-request objects in
  the `data` field.
- **FR-007**: Each listed travel request MUST include `id`, `requesterName`,
  `origin`, `destination`, `departureAt`, `returnAt`, `purpose`,
  `passengerCount`, `status`, and `createdAt`.
- **FR-008**: The system MUST preserve observable statuses in the listing
  response and limit them to `pending` and `canceled`.
- **FR-009**: The system MUST return `departureAt`, `returnAt`, and `createdAt`
  in the canonical UTC format `YYYY-MM-DDTHH:mm:ss.sssZ`.
- **FR-010**: The system MUST include both non-canceled and canceled travel
  requests in the listing response when both exist.
- **FR-011**: The system MUST return `200 OK` for successful listing requests,
  including when the result is empty.
- **FR-012**: The system MUST return unexpected listing failures in the
  standardized error envelope with `success`, `error.code`, and
  `error.message`.
- **FR-013**: The system MUST use `INTERNAL_SERVER_ERROR` for unexpected
  failures during listing.
- **FR-014**: The system MUST return `500 Internal Server Error` for unexpected
  failures during listing.

### Key Entities *(include if feature involves data)*

- **Travel Request Summary**: The observable travel-request record returned by
  the list operation, containing identity, traveler context, trip timestamps,
  passenger count, purpose, creation timestamp, and current status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful listing requests return the standardized
  success envelope with a `data` collection.
- **SC-002**: 100% of evaluated datasets with registered requests return all
  persisted records in descending `departureAt` order.
- **SC-003**: 100% of evaluated empty datasets return `200 OK` with `data: []`.
- **SC-004**: 100% of listed travel-request timestamps are returned in the
  canonical UTC format.

## Assumptions

- This specification is intentionally limited to the `GET /trip-requests`
  operation and does not include creation, get-by-id, cancellation, or holiday
  queries.
- The primary users are internal institutional staff members who already have
  access to the API.
- Filtering, pagination, and search behavior are out of scope for this feature
  version unless the specification is later amended.
- The listing operation reads persisted travel requests only and does not
  require fresh external holiday-provider access.
- The standardized success and error contracts already defined for the API
  apply to the listing operation without introducing new response shapes.
