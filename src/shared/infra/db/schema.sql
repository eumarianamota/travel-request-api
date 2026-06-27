CREATE TABLE IF NOT EXISTS trip_requests (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  requester_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_at TIMESTAMPTZ NOT NULL,
  return_at TIMESTAMPTZ NOT NULL,
  purpose TEXT NOT NULL,
  passenger_count INTEGER NOT NULL CHECK (passenger_count > 0),
  status TEXT NOT NULL CHECK (status IN ('requested', 'canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS trip_requests_departure_at_idx ON trip_requests (departure_at);

CREATE TABLE IF NOT EXISTS holidays (
  date DATE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  year INTEGER NOT NULL,
  CONSTRAINT holidays_year_date_unique UNIQUE (year, date)
);

CREATE INDEX IF NOT EXISTS holidays_year_idx ON holidays (year);
