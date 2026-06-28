import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

export interface TripRequestRepository {
  create(input: TripRequestDraft): Promise<TripRequest>
  findById(id: number): Promise<TripRequest | null>
  list(): Promise<TripRequest[]>
}
