import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

export interface TripRequestRepository {
  create(input: TripRequestDraft): Promise<TripRequest>
  findById(id: number): Promise<TripRequest | null>
  list(): Promise<TripRequest[]>
  updateStatus(id: number, status: TripRequestStatus): Promise<TripRequest | null>
}
