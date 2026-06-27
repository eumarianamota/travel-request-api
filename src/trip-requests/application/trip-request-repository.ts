import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

export interface TripRequestRepository {
  create(input: TripRequestDraft): Promise<TripRequest>
  list(): Promise<TripRequest[]>
}
