# Quickstart: Query National Holidays

## Purpose

Validate the national-holidays query feature end-to-end once implementation is
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

### 1. Query a cached year successfully

Request `GET /holidays/{year}` for a year that already has stored holiday
records.

Expected outcome:

- Response status `200`
- Response body uses the standard success envelope
- Every returned item has `date`, `name`, `type`, and `year`
- Every returned item belongs to the requested year

### 2. Synchronize and return an uncached year successfully

Request `GET /holidays/{year}` for a valid year that is not yet stored
locally.

Expected outcome:

- Response status `200`
- Response body uses the standard success envelope
- The requested year becomes available for subsequent queries

### 3. Reject invalid year input consistently

Request `GET /holidays/{year}` using a provided year that is non-numeric or
not a positive integer.

Expected outcome:

- Response status `400`
- Error code `VALIDATION_ERROR`
- Response body uses the standard error envelope

### 4. Map required provider failures to the standard availability response

Request `GET /holidays/{year}` for a valid uncached year while the required
provider is unavailable.

Expected outcome:

- Response status `502`
- Error code `HOLIDAYS_API_UNAVAILABLE`
- Response body uses the standard error envelope

## Validation Commands

Run validation in repository-preferred order:

```bash
yarn test -- test/integration/holidays/*.spec.ts test/unit/holidays/*.spec.ts
yarn type:check
yarn lint
yarn test
```

See the response examples in
[`contracts/openapi.yaml`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/005-query-national-holidays/contracts/openapi.yaml)
and the entity details in
[`data-model.md`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/005-query-national-holidays/data-model.md).
