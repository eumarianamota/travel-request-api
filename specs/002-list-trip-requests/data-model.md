# Data Model: List Trip Requests

## Entity: TravelRequestSummary

### Description

Represents the observable travel-request record returned by the list operation.

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

- Every listed item must include all required fields.
- `status` must remain limited to `pending` or `canceled`.
- `departureAt`, `returnAt`, and `createdAt` must use the canonical UTC format
  `YYYY-MM-DDTHH:mm:ss.sssZ`.

### Ordering Rules

- The collection must be ordered by `departureAt` descending, from the most
  recent to the oldest.

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

### SuccessListResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `TravelRequestSummary[]` | Contains the ordered list, possibly empty |

### ErrorListResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `false` |
| `error.code` | string | `INTERNAL_SERVER_ERROR` for unexpected list failures |
| `error.message` | string | Clear English message |
