# Feature Specification: Institutional Travel Request Management

**Feature Branch**: `001-trip-request-management`

**Created**: 2026-06-27

**Status**: Draft

**Input**: User description: "crie a minha especify com base nos arquivos docs/api-prd.md e docs/techspec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Travel Request (Priority: P1)

As an internal staff member, I want to register a travel request with the
required trip details so that institutional travel needs are recorded in one
central place.

**Why this priority**: Creating a request is the core business outcome. Without
it, the product does not deliver its main value.

**Independent Test**: Submit a valid request with all mandatory fields and
verify that a new record is created, returned with generated fields, and ready
for later consultation and cancellation.

**Acceptance Scenarios**:

1. **Given** a user provides all required trip data with a valid departure date,
   **When** the request is submitted, **Then** the system creates the travel
   request with a unique identifier, a creation timestamp, and the status
   `requested`.
2. **Given** a user provides a departure date that falls on a national holiday,
   **When** the request is submitted, **Then** the system rejects the request
   and explains that holiday travel cannot be created.
3. **Given** a user provides invalid trip data such as missing required fields,
   equal origin and destination, a return date before departure, or a non-
   positive passenger count, **When** the request is submitted, **Then** the
   system rejects the request with a standardized validation error.

---

### User Story 2 - Consult Registered Travel Requests (Priority: P2)

As an internal staff member, I want to list all travel requests and inspect a
specific request by its identifier so that I can track existing records and
find the exact trip I need.

**Why this priority**: Consultation is the main operational follow-up after
creation and is required for day-to-day use of the product.

**Independent Test**: Create one or more requests, retrieve the full list, and
retrieve a single request by identifier to confirm records are returned in a
predictable and complete format.

**Acceptance Scenarios**:

1. **Given** one or more travel requests exist, **When** the user asks for the
   list, **Then** the system returns all registered requests ordered by departure
   date from most recent to oldest.
2. **Given** no travel requests exist, **When** the user asks for the list,
   **Then** the system returns an empty list in the standard success format.
3. **Given** a travel request identifier exists, **When** the user requests
   that record, **Then** the system returns the complete travel request.
4. **Given** a travel request identifier does not exist, **When** the user
   requests that record, **Then** the system returns a standardized not-found
   error.

---

### User Story 3 - Cancel Travel Request and Consult Holidays (Priority: P3)

As an internal staff member, I want to cancel an existing travel request and
consult national holidays for a given year so that I can stop trips that should
not happen and understand holiday constraints that affect travel registration.

**Why this priority**: Cancellation preserves the operational history of a
registered trip, and holiday consultation supports the validation rule that
blocks travel on national holidays.

**Independent Test**: Cancel an existing request and confirm its status changes
without deleting the record; request holidays for a year and confirm a
consistent list is returned or a standardized error is produced when the data
cannot be obtained.

**Acceptance Scenarios**:

1. **Given** an existing request with status `requested`, **When** the user
   cancels it, **Then** the system returns the same request with status
   `canceled`.
2. **Given** an already canceled request, **When** the user tries to cancel it
   again, **Then** the system returns a standardized business-rule error.
3. **Given** a nonexistent request identifier, **When** the user tries to
   cancel it, **Then** the system returns a standardized not-found error.
4. **Given** the user asks for national holidays of a year, **When** holiday
   data is available, **Then** the system returns a list of holidays in the
   standard success format.

### Edge Cases

- Valid date inputs received in alternate ISO 8601 representations must be
  normalized to the canonical UTC representation before they become observable
  in stored or returned data.
- A creation request must fail when holiday verification depends on an external
  source and that source is unavailable or returns an error.
- A list query must return an empty collection rather than an error when no
  travel requests exist.
- Travel requests must remain retrievable after cancellation because
  cancellation is logical rather than destructive.
- Repeated cancellation attempts for the same request must be rejected without
  changing the stored record again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow internal staff to create a travel request
  with requester name, origin, destination, departure date and time, return
  date and time, purpose, and passenger count.
- **FR-002**: The system MUST generate and return a unique identifier, creation
  timestamp, and initial status for each successfully created travel request.
- **FR-003**: The system MUST expose only `requested` and `canceled` as
  observable travel request statuses in this version.
- **FR-004**: The system MUST reject creation requests with missing required
  fields, empty textual values, or text values that become empty after trimming.
- **FR-005**: The system MUST reject creation requests where origin and
  destination are the same.
- **FR-006**: The system MUST reject creation requests where the return date is
  earlier than the departure date.
- **FR-007**: The system MUST reject creation requests where passenger count is
  not a positive integer.
- **FR-008**: The system MUST validate whether the normalized departure civil
  date is a national holiday before creating a travel request.
- **FR-009**: The system MUST reject creation requests when the departure date
  falls on a national holiday.
- **FR-010**: The system MUST fail the creation request when holiday validation
  requires unavailable external holiday data.
- **FR-011**: The system MUST accept valid ISO 8601 date inputs and normalize
  observable departure, return, and creation timestamps to the canonical UTC
  format with `Z`.
- **FR-012**: The system MUST allow users to list all registered travel
  requests.
- **FR-013**: The system MUST return listed travel requests ordered by departure
  date from most recent to oldest.
- **FR-014**: The system MUST return an empty list when no travel requests are
  registered.
- **FR-015**: The system MUST allow users to retrieve a single travel request
  by identifier.
- **FR-016**: The system MUST return a standardized not-found error when a
  requested travel request does not exist.
- **FR-017**: The system MUST allow users to cancel an existing travel request.
- **FR-018**: The system MUST perform cancellation logically by preserving the
  request and changing only its observable status to `canceled`.
- **FR-019**: The system MUST reject attempts to cancel a request that is
  already canceled.
- **FR-020**: The system MUST allow users to consult national holidays for a
  specific year.
- **FR-021**: The system MUST return holiday information in a reusable,
  consistent format that includes at least the holiday date and name.
- **FR-022**: The system MUST return successful operations in a standardized
  success envelope with a `success` indicator and a `data` field.
- **FR-023**: The system MUST return failed operations in a standardized error
  envelope with a `success` indicator, an internal error code, and a clear
  message in English.
- **FR-024**: The system MUST use distinct standardized error codes for
  validation failure, missing travel request, repeated cancellation, holiday
  restriction, unavailable external holiday data, and unexpected internal
  failure.
- **FR-025**: The system MUST return outcomes that distinguish invalid input,
  missing resources, business-rule conflicts, unavailable required upstream
  data, and unexpected internal failures.

### Key Entities *(include if feature involves data)*

- **Travel Request**: A record of an institutional trip request containing its
  identifier, requester identity, origin, destination, departure and return
  timestamps, purpose, passenger count, current status, and creation timestamp.
- **Holiday**: A national holiday entry containing at least the civil date,
  display name, and category needed to decide whether travel can be created for
  that date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid travel request submissions result in a persisted
  request returned with identifier, status, and timestamps in the standardized
  success format.
- **SC-002**: 100% of invalid creation, lookup, and cancellation scenarios
  return the standardized error structure with the correct category of failure.
- **SC-003**: Users can retrieve the full list of travel requests and locate a
  specific request by identifier in a single attempt for 95% of evaluated test
  scenarios.
- **SC-004**: 100% of cancellation attempts for existing active requests change
  the observable status to `canceled` while preserving the original record for
  later consultation.
- **SC-005**: 100% of evaluated holiday-blocked travel dates are refused before
  a travel request becomes registered.

## Assumptions

- The primary users are internal institutional staff members who interact with
  the product through API requests rather than a graphical interface.
- All users with access to the product have the same permissions in this
  version.
- Editing or permanently deleting travel requests is out of scope for this
  version.
- Approval workflows, user management, authentication, authorization, vehicle
  allocation, driver allocation, reports, and additional filters are out of
  scope for this version.
- National holiday information is authoritative for the business rule that
  blocks travel creation on holiday departure dates.
- When holiday data is already available to the product for a year, the product
  reuses that data rather than requiring a new external fetch for the same
  decision.
