# Data Model: Create Travel Request

## Entity: TravelRequest

### Description

Represents the travel request record produced when the create flow succeeds.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | integer | Generated | Unique positive identifier |
| `requesterName` | string | Yes | Must be present and non-empty after trim |
| `origin` | string | Yes | Must be present, non-empty after trim, and different from `destination` |
| `destination` | string | Yes | Must be present, non-empty after trim, and different from `origin` |
| `departureAt` | string | Yes | Accepted as valid ISO 8601 input; normalized to canonical UTC output |
| `returnAt` | string | Yes | Accepted as valid ISO 8601 input; must not be earlier than `departureAt` |
| `purpose` | string | Yes | Must be present and non-empty after trim |
| `passengerCount` | integer | Yes | Must be a positive integer |
| `status` | `requested \| canceled` | Generated | Must be `requested` on creation |
| `createdAt` | string | Generated | Canonical UTC timestamp generated during persistence |

### Validation Rules

- All required fields must be present.
- All required text fields must remain non-empty after trimming.
- `origin` and `destination` must differ.
- `returnAt` must be greater than or equal to `departureAt`.
- `passengerCount` must be a positive integer.
- The normalized departure civil date must not match a national holiday.

### State Transitions Relevant to This Feature

| From | To | Trigger |
|------|----|---------|
| not yet created | `requested` | Successful create flow |

### Persistence Mapping

| Domain Field | Storage Representation |
|-------------|------------------------|
| `id` | `trip_requests.id` |
| `requesterName` | `trip_requests.requester_name` |
| `origin` | `trip_requests.origin` |
| `destination` | `trip_requests.destination` |
| `departureAt` | `trip_requests.departure_at` |
| `returnAt` | `trip_requests.return_at` |
| `purpose` | `trip_requests.purpose` |
| `passengerCount` | `trip_requests.passenger_count` |
| `status` | `trip_requests.status` |
| `createdAt` | `trip_requests.created_at` |

## Entity: HolidayValidationRecord

### Description

Represents the holiday data needed to decide whether a normalized departure
civil date permits travel-request creation.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `date` | string | Yes | Civil date in `YYYY-MM-DD` |
| `name` | string | Yes | Non-empty holiday name |
| `type` | string | Yes | Holiday category used in the returned record |
| `year` | integer | Yes | Must match the year extracted from `date` |

### Validation Rules

- `date`, `name`, and `type` must be present.
- `year` must match the date year.
- `(year, date)` must be unique in persistence.

### Relationships

- A create request depends on holiday records for the normalized departure year.
- Holiday records may come from local persistence or, when absent, from the
  upstream provider.

## Response Shapes

### SuccessCreationResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | TravelRequest | Contains the created request |

### ErrorCreationResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `false` |
| `error.code` | string | One of `VALIDATION_ERROR`, `HOLIDAY_TRIP_NOT_ALLOWED`, `HOLIDAYS_API_UNAVAILABLE`, `INTERNAL_SERVER_ERROR` |
| `error.message` | string | Clear English message |
