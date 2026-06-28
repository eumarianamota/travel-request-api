# Quickstart: Get Trip Request

## Purpose

Validate the travel-request lookup-by-identifier feature end-to-end once
implementation is available.

## Prerequisites

- Node.js 24.15+
- Corepack enabled
- Yarn 4+
- PostgreSQL 17 available locally
- Required environment variables configured, including:
  - `NODE_ENV`
  - `APP_NAME`
  - `APP_PORT`
  - `DATABASE_URL`

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Start the local PostgreSQL instance.

3. Prepare the required database tables for `trip_requests` and `holidays`.

```bash
yarn db:schema
```

4. Seed one or more travel requests, or create them through the existing
creation endpoint.

5. Start the application:

```bash
yarn dev
```

## Validation Scenarios

### 1. Retrieve a stored travel request by identifier

Send a `GET /trip-requests/{id}` request using an existing identifier.

Expected outcome:

- Response status `200`
- Response body uses the standard success envelope
- `data` contains the complete travel-request object for the requested
  identifier

### 2. Reject missing travel requests with the standardized not-found contract

Send `GET /trip-requests/{id}` using a valid positive identifier that does not
exist in storage.

Expected outcome:

- Response status `404`
- Error code `TRIP_REQUEST_NOT_FOUND`
- Response body uses the standard error envelope

### 3. Reject invalid identifiers consistently

Send `GET /trip-requests/{id}` using an identifier that is non-numeric or not
a positive integer.

Expected outcome:

- Response status `400`
- Error code `VALIDATION_ERROR`
- Response body uses the standard error envelope

### 4. Accept leading-zero positive identifiers

Send `GET /trip-requests/001` when travel request `1` exists in storage.

Expected outcome:

- Response status `200`
- Response body uses the standard success envelope
- `data.id` is returned as `1`

### 5. Preserve canonical UTC timestamps and observable statuses

Send `GET /trip-requests/{id}` for a stored travel request with canonical trip
data.

Expected outcome:

- `departureAt`, `returnAt`, and `createdAt` are canonical UTC timestamps
- `status` remains within `pending` or `canceled`

### 6. Map unexpected failures to the standard internal error response

Force an unexpected persistence failure during `GET /trip-requests/{id}`.

Expected outcome:

- Response status `500`
- Error code `INTERNAL_SERVER_ERROR`
- No partial travel-request data is returned

## Validation Commands

Run validation in repository-preferred order:

```bash
yarn test -- test/integration/trip-requests/get-trip-request*.spec.ts test/unit/trip-requests/get-trip-request*.spec.ts
yarn type:check
yarn lint
yarn test
```

See the response examples in
[`contracts/openapi.yaml`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/003-get-trip-request/contracts/openapi.yaml)
and the entity details in
[`data-model.md`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/003-get-trip-request/data-model.md).
