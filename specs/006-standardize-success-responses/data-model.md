# Data Model: Standardize Success Responses

## Entity: SuccessResponseEnvelope

### Description

Represents the standardized outer structure used for every successful API
response covered by this feature.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `success` | boolean | Yes | Always `true` |
| `data` | object or array | Yes | Contains the observable business payload for the successful operation |

### Validation Rules

- `success` must always be `true` for successful responses.
- `data` must always be present for successful responses in scope.
- The envelope must not introduce endpoint-specific wrapper variants beyond
  `success` and `data`.

## Entity: TripRequestSuccessPayload

### Description

Represents the observable trip-request payload returned inside `data` for
successful create, list, get-by-id, and cancel operations.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | integer | Yes | Positive persisted identifier |
| `requesterName` | string | Yes | Preserved business field |
| `origin` | string | Yes | Preserved business field |
| `destination` | string | Yes | Preserved business field |
| `departureAt` | string | Yes | UTC timestamp in `YYYY-MM-DDTHH:mm:ss.sssZ` |
| `returnAt` | string | Yes | UTC timestamp in `YYYY-MM-DDTHH:mm:ss.sssZ` |
| `purpose` | string | Yes | Preserved business field |
| `passengerCount` | integer | Yes | Positive integer |
| `status` | string | Yes | Observable status already defined by the product |
| `createdAt` | string | Yes | UTC timestamp in `YYYY-MM-DDTHH:mm:ss.sssZ` |

### Response Rules

- Create, get-by-id, and cancel return a single `TripRequestSuccessPayload`
  object in `data`.
- List returns a `TripRequestSuccessPayload[]` in `data`.
- Empty list results must still use the same envelope with `data: []`.

## Entity: HolidayQuerySuccessPayload

### Description

Represents the observable holiday payload returned inside `data` for
successful holiday-year queries.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `date` | string | Yes | Civil date in `YYYY-MM-DD` format |
| `name` | string | Yes | Preserved holiday name |
| `type` | string | Yes | Preserved holiday type |
| `year` | integer | Yes | Requested holiday year |

### Response Rules

- Holiday-year queries return a `HolidayQuerySuccessPayload[]` in `data`.
- The returned list must contain only records for the requested year.

## Response Shapes

### CreateTripRequestSuccessResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `TripRequestSuccessPayload` | Contains the created trip request |

### ListTripRequestsSuccessResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `TripRequestSuccessPayload[]` | Contains the ordered trip-request list, possibly empty |

### GetTripRequestSuccessResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `TripRequestSuccessPayload` | Contains the retrieved trip request |

### CancelTripRequestSuccessResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `TripRequestSuccessPayload` | Contains the updated canceled trip request |

### QueryHolidaysSuccessResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `HolidayQuerySuccessPayload[]` | Contains the requested holiday list |
