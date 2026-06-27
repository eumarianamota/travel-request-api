import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest } from '#src/trip-requests/domain/trip-request'

export interface ListTripRequestsUseCase {
  execute(): Promise<TripRequest[]>
}

export interface ListTripRequestsOptions {
  tripRequestRepository: TripRequestRepository
}

export const createListTripRequestsUseCase = ({
  tripRequestRepository,
}: ListTripRequestsOptions): ListTripRequestsUseCase => ({
  async execute(): Promise<TripRequest[]> {
    return tripRequestRepository.list()
  },
})
