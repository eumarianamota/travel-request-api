# Quickstart: Create Travel Request

## Purpose

Validate the create-travel-request feature end-to-end once implementation is
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
  - `HOLIDAYS_API_BASE_URL`

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

4. Start the application:

```bash
yarn dev
```

## Validation Scenarios

### 1. Create a valid travel request

Send a `POST /trip-requests` request using the payload defined in
[`contracts/openapi.yaml`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/001-create-trip-request/contracts/openapi.yaml).

Expected outcome:

- Response status `201`
- Response body uses the standard success envelope
- Returned request includes generated `id`, generated `createdAt`, and status
  `requested`
- `departureAt`, `returnAt`, and `createdAt` are canonical UTC timestamps

### 2. Reject invalid request data

Send create requests with missing required fields, blank text fields, equal
origin and destination, invalid passenger count, or invalid return chronology.

Expected outcome:

- Response status `400`
- Error code `VALIDATION_ERROR`
- No travel request is created

### 3. Reject holiday-blocked departures

Send a create request whose normalized departure civil date is a national
holiday.

Expected outcome:

- Response status `409`
- Error code `HOLIDAY_TRIP_NOT_ALLOWED`
- No travel request is created

### 4. Reject required holiday-provider failures

Send a create request for a year whose holiday data is not available locally
while the required holiday provider is unavailable.

Expected outcome:

- Response status `502`
- Error code `HOLIDAYS_API_UNAVAILABLE`
- No partial travel request is persisted

### 5. Confirm local-first holiday reuse

Send a create request for a year whose holiday data is already stored locally.

Expected outcome:

- The request is validated using existing local holiday data
- No required upstream dependency is needed for the decision

## Validation Commands

Run validation in repository-preferred order:

```bash
yarn test -- test/unit/trip-requests/create-trip-request.domain.spec.ts
yarn test -- test/integration/trip-requests/create-trip-request.success.spec.ts
yarn type:check
yarn lint
yarn test
```

The feature also adds dedicated regression coverage for validation, holiday
blocking, provider failure, internal error mapping, OpenAPI assertions, and
bootstrap wiring.
