# Feature Specification: Query National Holidays

**Feature Branch**: `005-query-national-holidays`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "$speckit-specify crie a especificação para a Consulta de feriados nacionais por ano de acordo com os documentos api-prd.md e techspec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View National Holidays for a Year (Priority: P1)

As an internal institutional staff member, I want to query the national
holidays for a specific year so that I can check whether a travel date falls on
an official holiday.

**Why this priority**: This is the direct user-facing purpose of the feature
and supports the existing travel-request validation flow with a predictable
consultation endpoint.

**Independent Test**: Request the holiday list for a valid year that has
available data and verify that the response returns the holidays for that year
in the standard success envelope.

**Acceptance Scenarios**:

1. **Given** a user requests holidays for a valid year, **When** holiday data is
   available for that year, **Then** the system returns the list in the
   standard success response.
2. **Given** the returned holiday list contains one or more records, **When**
   the response is delivered, **Then** each record includes the expected
   holiday fields for that year.

---

### User Story 2 - Reuse Previously Available Year Data (Priority: P2)

As an internal institutional staff member, I want repeated queries for the same
year to return the same holiday data consistently so that I can rely on stable
results without depending on a fresh external lookup every time.

**Why this priority**: The product requires local-first holiday consultation to
reduce unnecessary dependence on the external holiday provider.

**Independent Test**: Query a year that is already available locally and
verify that the system returns the holiday list successfully without requiring
new external data to fulfill the request.

**Acceptance Scenarios**:

1. **Given** holiday data for a requested year is already available to the
   system, **When** the user queries that year, **Then** the system returns the
   stored holiday list successfully.

---

### User Story 3 - Receive Clear Feedback When the Year Cannot Be Resolved (Priority: P3)

As an internal institutional staff member, I want a failed holiday query to
return a predictable error response so that I can distinguish invalid input
from external unavailability.

**Why this priority**: The feature depends on an external source when the year
is not already available locally, so failures must remain explicit and
standardized.

**Independent Test**: Query holidays using an invalid year and query a valid
year whose data requires an unavailable external source, then verify that each
case returns the standardized error contract for that failure.

**Acceptance Scenarios**:

1. **Given** the requested year is invalid, **When** the user queries holidays
   for that year, **Then** the system rejects the request with a standardized
   validation error.
2. **Given** the requested year is valid but not currently available locally,
   **When** the system cannot obtain the required holiday data from the
   external source, **Then** the system returns a standardized provider
   unavailability error.

### Edge Cases

- The year input is missing, non-numeric, or not a valid positive year.
- The queried year is valid but has no locally available records yet.
- The external holiday provider is required for the year and is unavailable or
  returns an error.
- The returned holiday list must contain only records that belong to the
  requested year.
- Repeated successful queries for the same year must preserve consistent
  observable holiday data and response shape.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an internal institutional staff member to
  query national holidays by year.
- **FR-002**: The system MUST return a successful holiday query in the standard
  success envelope with `success` and `data`.
- **FR-003**: The `data` field of a successful holiday query response MUST
  contain a list of holiday records for the requested year.
- **FR-004**: Each returned holiday record MUST include `date`, `name`, `type`,
  and `year`.
- **FR-005**: The system MUST reject invalid year input before treating the
  year as absent holiday data.
- **FR-006**: The system MUST use `VALIDATION_ERROR` when the requested year is
  invalid.
- **FR-007**: The system MUST return `400 Bad Request` when the requested year
  is invalid.
- **FR-008**: The system MUST prioritize already available holiday data for the
  requested year when it exists.
- **FR-009**: The system MUST obtain holiday data from the external holiday
  source only when the requested year is not already available locally or must
  be refreshed according to the active product rules.
- **FR-010**: When the system obtains holiday data externally for a requested
  year, it MUST make that year available for subsequent queries.
- **FR-011**: The system MUST return only holiday records whose `year` matches
  the requested year.
- **FR-012**: The system MUST preserve the standardized error response envelope
  for all holiday-query failures.
- **FR-013**: The system MUST use `HOLIDAYS_API_UNAVAILABLE` when the requested
  year cannot be resolved because the external holiday source is required but
  unavailable.
- **FR-014**: The system MUST return `502 Bad Gateway` when the requested year
  cannot be resolved because the external holiday source is required but
  unavailable.
- **FR-015**: The system MUST define observable response contracts for success
  and failure paths at the holiday-query API boundary.
- **FR-016**: The system MUST preserve holiday-record invariants across
  retrieval by returning `date`, `name`, `type`, and `year` consistently for
  every successful query result.

### Key Entities *(include if feature involves data)*

- **National Holiday**: A holiday record associated with a specific year,
  containing the civil date, holiday name, holiday type, and year value used
  for travel validation and direct consultation.
- **Holiday Year Query**: A user request scoped to a single year, used to
  retrieve the complete observable set of national holidays for that year.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful holiday queries for valid years return the
  standard success envelope with only holiday records for the requested year.
- **SC-002**: 100% of evaluated invalid year inputs return the standardized
  validation error instead of a success or provider error response.
- **SC-003**: 100% of evaluated holiday queries that require unavailable
  external data return the standardized provider unavailability error.
- **SC-004**: 100% of repeated successful queries for the same year return a
  stable holiday-record shape with `date`, `name`, `type`, and `year` for each
  item.

## Assumptions

- The primary users are internal institutional staff members who already have
  access to the API.
- The feature scope is limited to querying national holidays for one year per
  request.
- The active product rules for holiday data reuse remain local-first, with the
  external source consulted only when the requested year is not already
  available locally or requires refresh according to the active specification.
- The external holiday source remains the authoritative source when local data
  is unavailable for the requested year.
- The holiday query feature does not introduce new authentication or
  authorization behavior beyond the current API access model.
