# Data Model: Query National Holidays

## Entity: NationalHoliday

### Description

Represents a national holiday record returned for a requested year.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `date` | string | Yes | Civil date in `YYYY-MM-DD` format |
| `name` | string | Yes | Preserved holiday name |
| `type` | string | Yes | Preserved holiday type/category |
| `year` | integer | Yes | Must match the requested year and the year extracted from `date` |

### Validation Rules

- The requested year must be a positive integer.
- The feature validates only provided `year` path values; requests without a
  year path segment are outside this feature contract.
- Every returned holiday record must include all required fields.
- `year` must match the year portion of `date`.
- Successful responses must contain only records that belong to the requested
  year.

### Retrieval Rules

- A valid year must return the locally available records when present.
- A valid year with no local records must trigger on-demand synchronization
  before the year is returned successfully.
- If synchronization is required and the provider fails, the query must return
  the standardized provider-unavailability error.

### Persistence Mapping

| Domain Field | Storage Representation |
|-------------|------------------------|
| `date` | `holidays.date` |
| `name` | `holidays.name` |
| `type` | `holidays.type` |
| `year` | `holidays.year` |

## Entity: HolidayYearQuery

### Description

Represents the user request to retrieve all national holidays for a single
calendar year.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `year` | integer | Yes | Positive integer identifying the target calendar year |

### Validation Rules

- `year` must be present.
- `year` must be numeric, integral, and greater than zero.

## Response Shapes

### SuccessHolidayQueryResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `NationalHoliday[]` | Contains the holiday list for the requested year |

### ErrorHolidayQueryResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `false` |
| `error.code` | string | `VALIDATION_ERROR`, `HOLIDAYS_API_UNAVAILABLE`, or `INTERNAL_SERVER_ERROR` depending on the failure |
| `error.message` | string | Clear English message |
