# Quickstart: Standardize Error Responses

## Purpose

Validate that all currently exposed failed API operations return the standard
`success` and `error` envelope without changing their documented error codes or
HTTP status mappings.

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

### 1. Validation failures return the standard error envelope

Send invalid requests to `POST /trip-requests`, `GET /trip-requests/{id}`,
`PATCH /trip-requests/{id}/cancel`, and `GET /holidays/{year}`.

Expected outcome:

- Response status `400`
- Response body uses `success: false`
- Response body includes `error.code: VALIDATION_ERROR`
- Response body includes an English `error.message`

### 2. Not-found and business-rule failures preserve their documented codes

Request a missing trip request, cancel a missing trip request, cancel an
already canceled trip request, and create a trip request on a holiday date.

Expected outcome:

- Missing resource responses return `404` with `TRIP_REQUEST_NOT_FOUND`
- Already canceled responses return `409` with
  `TRIP_REQUEST_ALREADY_CANCELED`
- Holiday rule responses return `409` with `HOLIDAY_TRIP_NOT_ALLOWED`
- All bodies use the same `success: false` plus `error` envelope

### 3. Provider failures preserve the standardized dependency error contract

Trigger an operation that requires the holiday provider when the provider is
unavailable.

Expected outcome:

- Response status `502`
- Response body uses `success: false`
- Response body includes `error.code: HOLIDAYS_API_UNAVAILABLE`
- Response body includes the canonical English message

### 4. Unexpected failures preserve the standardized internal error contract

Trigger an unexpected internal failure on an operation in scope.

Expected outcome:

- Response status `500`
- Response body uses `success: false`
- Response body includes `error.code: INTERNAL_SERVER_ERROR`
- Response body includes the canonical English message

## Validation Commands

Run validation in repository-preferred order:

```bash
yarn test -- test/integration/trip-requests/*.spec.ts test/integration/holidays/*.spec.ts
yarn type:check
yarn lint
yarn test
```

See the response examples in
[`contracts/openapi.yaml`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/007-standardize-error-responses/contracts/openapi.yaml)
and the error mapping details in
[`data-model.md`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/007-standardize-error-responses/data-model.md).
