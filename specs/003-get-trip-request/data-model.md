# Data Model: Get Trip Request

## Entity: TravelRequestDetail

### Description

Represents the observable travel-request record returned by the get-by-id
operation.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | integer | Yes | Unique positive identifier of the registered request |
| `requesterName` | string | Yes | Preserved as the stored requester name |
| `origin` | string | Yes | Preserved as the stored origin |
| `destination` | string | Yes | Preserved as the stored destination |
| `departureAt` | string | Yes | Returned in canonical UTC format |
| `returnAt` | string | Yes | Returned in canonical UTC format |
| `purpose` | string | Yes | Preserved as the stored trip purpose |
| `passengerCount` | integer | Yes | Preserved as the stored positive passenger count |
| `status` | `pending \| canceled` | Yes | Observable status preserved from the record |
| `createdAt` | string | Yes | Returned in canonical UTC format |

### Validation Rules

- The requested identifier must be a positive integer.
- A successful lookup must include all required fields.
- `status` must remain limited to `pending` or `canceled`.
- `departureAt`, `returnAt`, and `createdAt` must use the canonical UTC format
  `YYYY-MM-DDTHH:mm:ss.sssZ`.

### Lookup Rules

- A valid identifier must map to exactly one travel-request record or produce
  the standardized not-found error.
- Invalid identifier formats must be rejected before the record is treated as
  absent.

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

## Response Shapes

### SuccessLookupResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `TravelRequestDetail` | Contains the requested travel request |

### ErrorLookupResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `false` |
| `error.code` | string | `VALIDATION_ERROR`, `TRIP_REQUEST_NOT_FOUND`, or `INTERNAL_SERVER_ERROR` depending on the failure |
| `error.message` | string | Clear English message |
