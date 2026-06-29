# Quickstart: Standardize Success Responses

## Purpose

Validate that all currently exposed successful API operations return the
standard `success` and `data` envelope without changing their documented
status codes or business payload shapes.

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

### 1. Create returns the standard success envelope

Send a valid `POST /trip-requests`.

Expected outcome:

- Response status `201`
- Response body uses `success: true`
- Response body includes the created trip request in `data`

### 2. List operations return collections inside `data`

Request `GET /trip-requests` and `GET /holidays/{year}` successfully.

Expected outcome:

- Response status `200`
- Response body uses `success: true`
- The returned collection is placed directly inside `data`
- Empty trip-request results still use `data: []`

### 3. Single-resource operations return one object inside `data`

Request `GET /trip-requests/{id}` and `PATCH /trip-requests/{id}/cancel`
successfully.

Expected outcome:

- Response status `200`
- Response body uses `success: true`
- The returned trip request is placed directly inside `data`

### 4. Successful responses preserve canonical observable payloads

Inspect successful trip-request and holiday responses.

Expected outcome:

- Trip-request payloads preserve the existing observable field names
- Trip-request date fields remain normalized UTC strings
- Holiday payloads preserve `date`, `name`, `type`, and `year`

## Validation Commands

Run validation in repository-preferred order:

```bash
yarn test -- test/integration/trip-requests/*.spec.ts test/integration/holidays/*.spec.ts
yarn type:check
yarn lint
yarn test
```

See the response examples in
[`contracts/openapi.yaml`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/006-standardize-success-responses/contracts/openapi.yaml)
and the response-shape details in
[`data-model.md`](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/specs/006-standardize-success-responses/data-model.md).
