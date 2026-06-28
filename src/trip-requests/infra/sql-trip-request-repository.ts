import type { Pool } from 'pg'

import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import { createTripRequestSummary } from '#src/trip-requests/domain/trip-request'
import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

interface TripRequestRow {
  id: number
  requester_name: string
  origin: string
  destination: string
  departure_at: string
  return_at: string
  purpose: string
  passenger_count: number
  status: 'requested' | 'canceled'
  created_at: string
}

const mapTripRequestRow = (row: TripRequestRow): TripRequest =>
  createTripRequestSummary({
    id: row.id,
    requesterName: row.requester_name,
    origin: row.origin,
    destination: row.destination,
    departureAt: row.departure_at,
    returnAt: row.return_at,
    purpose: row.purpose,
    passengerCount: row.passenger_count,
    status: row.status,
    createdAt: row.created_at,
  })

export class SqlTripRequestRepository implements TripRequestRepository {
  public constructor(private readonly pool: Pool) {}

  public async findById(id: number): Promise<TripRequest | null> {
    const result = await this.pool.query<TripRequestRow>(
      `SELECT
        id,
        requester_name,
        origin,
        destination,
        departure_at::text AS departure_at,
        return_at::text AS return_at,
        purpose,
        passenger_count,
        status,
        created_at::text AS created_at
       FROM trip_requests
       WHERE id = $1`,
      [id],
    )

    const row = result.rows[0]

    if (row === undefined) {
      return null
    }

    return mapTripRequestRow(row)
  }

  public async list(): Promise<TripRequest[]> {
    const result = await this.pool.query<TripRequestRow>(
      `SELECT
        id,
        requester_name,
        origin,
        destination,
        departure_at::text AS departure_at,
        return_at::text AS return_at,
        purpose,
        passenger_count,
        status,
        created_at::text AS created_at
       FROM trip_requests
       ORDER BY departure_at DESC`,
    )

    return result.rows.map((row) => mapTripRequestRow(row))
  }

  public async create(input: TripRequestDraft): Promise<TripRequest> {
    const result = await this.pool.query<TripRequestRow>(
      `INSERT INTO trip_requests (
        requester_name,
        origin,
        destination,
        departure_at,
        return_at,
        purpose,
        passenger_count,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        requester_name,
        origin,
        destination,
        departure_at::text AS departure_at,
        return_at::text AS return_at,
        purpose,
        passenger_count,
        status,
        created_at::text AS created_at`,
      [
        input.requesterName,
        input.origin,
        input.destination,
        input.departureAt,
        input.returnAt,
        input.purpose,
        input.passengerCount,
        input.status,
      ],
    )

    return mapTripRequestRow(result.rows[0] as TripRequestRow)
  }
}
