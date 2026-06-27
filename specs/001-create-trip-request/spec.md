# Feature Specification: Create Travel Request

**Feature Branch**: `001-create-trip-request`

**Created**: 2026-06-27

**Status**: Draft

**Input**: User description: "crie a especificação para a Cadastro de solicitação de viagem de acordo com a api-prd.md e o techspec.md"

## Clarifications

### Session 2026-06-27

- Q: Which HTTP statuses must the creation flow use for success and error outcomes? → A: `201` for success, `400` for validation errors, `409` for holiday-blocked creation, `502` for required holiday-provider failure, and `500` for unexpected internal errors.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register a Travel Request (Priority: P1)

As an internal institutional staff member, I want to create a travel request
with the required trip details so that an institutional travel need is
registered in the central system.

**Why this priority**: Travel request creation is the primary business flow and
the main value delivered by the product.

**Independent Test**: Submit a valid travel request with all mandatory fields
and verify that the system returns a newly registered request with generated
identifier, generated creation timestamp, and the expected initial status.

**Acceptance Scenarios**:

1. **Given** a user provides all required trip data and the departure date is
   allowed, **When** the user submits the request, **Then** the system creates
   the travel request and returns it with generated fields and status
   `requested`.
2. **Given** a user provides valid trip data where the departure and return
   dates use accepted ISO 8601 representations, **When** the request is
   created, **Then** the observable timestamps are returned in the canonical UTC
   format.

---

### User Story 2 - Receive Clear Rejection for Invalid Input (Priority: P2)

As an internal institutional staff member, I want invalid travel requests to be
rejected with clear and consistent feedback so that I understand why a request
was not accepted and can correct it.

**Why this priority**: The product depends on strict input validation to
protect data quality and enforce business rules at creation time.

**Independent Test**: Attempt to create travel requests with missing,
inconsistent, or invalid data and verify that the system rejects them with the
standardized error format.

**Acceptance Scenarios**:

1. **Given** a required field is missing, empty, or blank after trimming,
   **When** the user submits the request, **Then** the system rejects it with a
   standardized validation error.
2. **Given** `origin` and `destination` are the same, **When** the user submits
   the request, **Then** the system rejects it with a standardized validation
   error.
3. **Given** `returnAt` is earlier than `departureAt`, **When** the user
   submits the request, **Then** the system rejects it with a standardized
   validation error.
4. **Given** `passengerCount` is not a positive integer, **When** the user
   submits the request, **Then** the system rejects it with a standardized
   validation error.

---

### User Story 3 - Enforce Holiday Validation Before Creation (Priority: P3)

As an internal institutional staff member, I want the system to block travel
requests whose departure date is a national holiday so that travel registration
follows the institutional rule for holiday departures.

**Why this priority**: Holiday validation is a mandatory business rule that
directly affects whether a request may be created.

**Independent Test**: Submit travel requests whose departure dates require
holiday validation and verify that holiday departures are rejected and that the
request is also rejected when required holiday data cannot be obtained.

**Acceptance Scenarios**:

1. **Given** the normalized departure civil date is a national holiday,
   **When** the user submits the request, **Then** the system rejects it with a
   standardized business-rule error.
2. **Given** the request requires holiday verification for a year that is not
   available locally, **When** required holiday data cannot be obtained,
   **Then** the system rejects the request and does not create a partial record.
3. **Given** the request requires holiday verification for a year whose holiday
   data is already available, **When** the user submits the request, **Then**
   the system reuses the existing holiday data for the validation decision.

### Edge Cases

- Accepted ISO 8601 inputs with timezone offsets must be normalized before the
  request becomes observable in the created record.
- The system must reject travel creation when holiday validation is mandatory
  and required holiday data cannot be obtained.
- A request with all fields present but blank textual values after trimming must
  be treated as invalid.
- A request must not be created if `passengerCount` is zero, negative, or not
  an integer.
- A request must not be created if `returnAt` is earlier than `departureAt`
  after the date values are interpreted.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an internal institutional staff member to
  create a travel request with `requesterName`, `origin`, `destination`,
  `departureAt`, `returnAt`, `purpose`, and `passengerCount`.
- **FR-002**: The system MUST generate `id`, `status`, and `createdAt` for each
  successfully created travel request.
- **FR-003**: The system MUST persist and return a successfully created travel
  request with the observable status `requested`.
- **FR-004**: The system MUST reject creation requests when any required field
  is missing.
- **FR-005**: The system MUST reject creation requests when a required textual
  field is empty or becomes empty after trimming.
- **FR-006**: The system MUST reject creation requests when `origin` and
  `destination` are equal.
- **FR-007**: The system MUST reject creation requests when `returnAt` is
  earlier than `departureAt`.
- **FR-008**: The system MUST reject creation requests when `passengerCount` is
  not a positive integer.
- **FR-009**: The system MUST accept valid ISO 8601 date inputs recognized by
  the product and normalize `departureAt` and `returnAt` before persistence.
- **FR-010**: The system MUST return `departureAt`, `returnAt`, and `createdAt`
  in the canonical UTC format `YYYY-MM-DDTHH:mm:ss.sssZ`.
- **FR-011**: The system MUST determine the holiday-validation date from the
  normalized departure civil date.
- **FR-012**: The system MUST verify local holiday data before relying on
  required external holiday data for travel creation.
- **FR-013**: The system MUST reject creation requests whose normalized
  departure date matches a national holiday.
- **FR-014**: The system MUST reject creation requests when required external
  holiday validation cannot be completed.
- **FR-015**: The system MUST return successful creation responses in the
  standardized success envelope with `success` and `data`.
- **FR-016**: The system MUST return invalid creation attempts in the
  standardized error envelope with `success`, `error.code`, and `error.message`.
- **FR-017**: The system MUST use `VALIDATION_ERROR` for invalid request data.
- **FR-018**: The system MUST use `HOLIDAY_TRIP_NOT_ALLOWED` when the departure
  date falls on a national holiday.
- **FR-019**: The system MUST use `HOLIDAYS_API_UNAVAILABLE` when required
  upstream holiday validation fails.
- **FR-020**: The system MUST return an outcome that distinguishes invalid
  input, forbidden holiday departure, unavailable required holiday data, and
  unexpected internal failure during creation.
- **FR-021**: The system MUST return `201 Created` for successful travel
  request creation.
- **FR-022**: The system MUST return `400 Bad Request` for invalid creation
  requests rejected as validation errors.
- **FR-023**: The system MUST return `409 Conflict` when travel creation is
  blocked because the departure date is a national holiday.
- **FR-024**: The system MUST return `502 Bad Gateway` when required upstream
  holiday validation is unavailable.
- **FR-025**: The system MUST return `500 Internal Server Error` for unexpected
  failures during travel creation.

### Key Entities *(include if feature involves data)*

- **Travel Request**: The travel-registration record created by this feature,
  containing the requester name, origin, destination, departure timestamp,
  return timestamp, purpose, passenger count, generated identifier, generated
  creation timestamp, and observable status.
- **Holiday Validation Record**: The holiday information used to decide whether
  the normalized departure civil date permits travel creation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid creation attempts result in a registered travel
  request returned with generated identifier, generated creation timestamp, and
  status `requested`.
- **SC-002**: 100% of evaluated invalid creation attempts are rejected with the
  standardized error structure and the correct error category.
- **SC-003**: 100% of evaluated holiday departures are blocked before a travel
  request is created.
- **SC-004**: 100% of evaluated accepted date inputs are returned in the
  canonical UTC timestamp format in successful creation responses.

## Assumptions

- This specification is intentionally limited to the travel-request creation
  flow and does not include listing, retrieval by identifier, cancellation, or
  standalone holiday consultation as part of this feature.
- The primary users are internal institutional staff members who already have
  access to the API.
- All users share the same permissions in this version of the product.
- The feature depends on holiday information being available either from local
  records or, when required, from the upstream holiday provider.
- The standardized success and error contracts defined in the product documents
  apply to this creation flow without introducing additional response shapes.
