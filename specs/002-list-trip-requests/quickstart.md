# Quickstart: List Trip Requests

## Purpose

Validate the travel-request listing feature end-to-end once implementation is
available.

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

### 1. List registered travel requests

Send a `GET /trip-requests` request.

Expected outcome:

- Response status `200`
- Response body uses the standard success envelope
- `data` contains all stored travel requests
- Items are ordered by `departureAt` from the most recent to the oldest

### 2. Return an empty list when no records exist

Send `GET /trip-requests` against an empty `trip_requests` dataset.

Expected outcome:

- Response status `200`
- Response body is `{ "success": true, "data": [] }`

### 3. Preserve canonical UTC timestamps and observable statuses

Send `GET /trip-requests` after storing requests with canonical travel data and
mixed statuses.

Expected outcome:

- Each returned item includes `id`, `requesterName`, `origin`, `destination`,
  `departureAt`, `returnAt`, `purpose`, `passengerCount`, `status`, and
  `createdAt`
- `departureAt`, `returnAt`, and `createdAt` are canonical UTC timestamps
- `status` remains within `requested` or `canceled`

### 4. Map unexpected failures to the standard internal error response

Force an unexpected persistence failure during `GET /trip-requests`.

Expected outcome:

- Response status `500`
- Error code `INTERNAL_SERVER_ERROR`
- No partial list is returned

## Validation Commands

Run validation in repository-preferred order:

```bash
yarn test -- test/integration/trip-requests/list-trip-requests.spec.ts
yarn type:check
yarn lint
yarn test
```

See the response examples in
[`contracts/openapi.yaml`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/002-list-trip-requests/contracts/openapi.yaml)
and the response entity details in
[`data-model.md`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/002-list-trip-requests/data-model.md).
