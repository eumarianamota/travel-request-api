# Data Model: Cancel Trip Request

## Entity: CancelableTravelRequest

### Description

Represents the persisted travel-request record targeted by the logical
cancellation operation.

### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | integer | Yes | Unique positive identifier of the registered request |
| `requesterName` | string | Yes | Preserved as the stored requester name |
| `origin` | string | Yes | Preserved as the stored origin |
| `destination` | string | Yes | Preserved as the stored destination |
| `departureAt` | string | Yes | Preserved in canonical UTC format |
| `returnAt` | string | Yes | Preserved in canonical UTC format |
| `purpose` | string | Yes | Preserved as the stored trip purpose |
| `passengerCount` | integer | Yes | Preserved as the stored positive passenger count |
| `status` | `pending \| canceled` | Yes | Changes from `pending` to `canceled` on successful cancellation |
| `createdAt` | string | Yes | Preserved in canonical UTC format |

### Validation Rules

- The requested identifier must be a positive integer.
- Leading-zero positive identifiers are valid and map to the same numeric id.
- A successful cancellation must preserve all required fields.
- `status` must remain limited to `pending` or `canceled`.
- `departureAt`, `returnAt`, and `createdAt` must use the canonical UTC format
  `YYYY-MM-DDTHH:mm:ss.sssZ`.

### State Transition Rules

- `pending -> canceled` is the only valid transition in scope for this
  feature.
- `canceled -> canceled` is invalid and must produce the standardized
  `TRIP_REQUEST_ALREADY_CANCELED` conflict error.
- The record must remain persisted after cancellation.

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

### SuccessCancelResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `true` |
| `data` | `CancelableTravelRequest` | Contains the updated travel request with status `canceled` |

### ErrorCancelResponse

| Field | Type | Rules |
|-------|------|-------|
| `success` | boolean | Always `false` |
| `error.code` | string | `VALIDATION_ERROR`, `TRIP_REQUEST_NOT_FOUND`, `TRIP_REQUEST_ALREADY_CANCELED`, or `INTERNAL_SERVER_ERROR` depending on the failure |
| `error.message` | string | Clear English message |
