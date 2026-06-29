# Data Model: Standardize Error Responses

## Entity: ErrorResponseEnvelope

### Description

Represents the standardized outer structure used for every failed API response
covered by this feature.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `success` | boolean | Yes | Always `false` |
| `error` | object | Yes | Contains the canonical observable error detail |

### Validation Rules

- `success` must always be `false` for standardized failed responses.
- `error` must always be present for failed responses in scope.
- The envelope must not introduce endpoint-specific wrapper variants beyond
  `success` and `error`.

## Entity: ErrorDetail

### Description

Represents the canonical error object nested under `error`.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `code` | string | Yes | English `UPPER_SNAKE_CASE` canonical error code |
| `message` | string | Yes | English observable failure message |

### Validation Rules

- `code` must always match the canonical product error vocabulary in scope.
- `message` must always be a non-empty English string that objectively
  describes the observable failure.

## Entity: ErrorCodeMapping

### Description

Represents the required mapping between each observable failure category, its
canonical error code, and the HTTP status returned to clients.

### Fields

| Failure Category | Code | HTTP Status | Trigger |
|------------------|------|-------------|---------|
| Validation failure | `VALIDATION_ERROR` | `400` | Invalid route parameter or request payload |
| Missing trip request | `TRIP_REQUEST_NOT_FOUND` | `404` | Requested trip request does not exist |
| Already canceled trip request | `TRIP_REQUEST_ALREADY_CANCELED` | `409` | Cancel operation targets an already canceled trip request |
| Holiday-date business rule violation | `HOLIDAY_TRIP_NOT_ALLOWED` | `409` | Trip creation targets a holiday date |
| Holiday provider unavailable | `HOLIDAYS_API_UNAVAILABLE` | `502` | Required holiday lookup cannot be completed |
| Unexpected internal failure | `INTERNAL_SERVER_ERROR` | `500` | Unhandled failure crosses the HTTP boundary |

## Response Shapes by Operation

### CreateTripRequestErrorResponses

- `400` with `VALIDATION_ERROR`
- `409` with `HOLIDAY_TRIP_NOT_ALLOWED`
- `502` with `HOLIDAYS_API_UNAVAILABLE`
- `500` with `INTERNAL_SERVER_ERROR`

### ListTripRequestsErrorResponses

- `500` with `INTERNAL_SERVER_ERROR`

### GetTripRequestErrorResponses

- `400` with `VALIDATION_ERROR`
- `404` with `TRIP_REQUEST_NOT_FOUND`
- `500` with `INTERNAL_SERVER_ERROR`

### CancelTripRequestErrorResponses

- `400` with `VALIDATION_ERROR`
- `404` with `TRIP_REQUEST_NOT_FOUND`
- `409` with `TRIP_REQUEST_ALREADY_CANCELED`
- `500` with `INTERNAL_SERVER_ERROR`

### QueryHolidaysByYearErrorResponses

- `400` with `VALIDATION_ERROR`
- `502` with `HOLIDAYS_API_UNAVAILABLE`
- `500` with `INTERNAL_SERVER_ERROR`
