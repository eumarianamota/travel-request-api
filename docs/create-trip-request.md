# Create Trip Request

## Runtime setup

1. Configure `.env` with `DATABASE_URL` and `HOLIDAYS_API_BASE_URL`.
2. Install dependencies with `yarn install`.
3. Prepare the PostgreSQL schema:

```bash
yarn db:schema
```

4. Start the API:

```bash
yarn dev
```

## Main behavior

- `POST /trip-requests` creates a new travel request.
- Text fields are trimmed before validation and persistence.
- `departureAt` and `returnAt` are normalized to canonical UTC timestamps.
- The create flow checks local holiday data first and synchronizes the year from BrasilAPI only when required.
- Holiday departures return `409 HOLIDAY_TRIP_NOT_ALLOWED`.
- Required provider failures return `502 HOLIDAYS_API_UNAVAILABLE`.
