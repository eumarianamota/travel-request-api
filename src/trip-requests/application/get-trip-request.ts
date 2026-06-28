import { tripRequestNotFoundError } from '#src/shared/domain/application-error'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest } from '#src/trip-requests/domain/trip-request'
import { parseTripRequestId } from '#src/trip-requests/domain/trip-request-id'

export interface GetTripRequestUseCase {
  execute(id: string | undefined): Promise<TripRequest>
}

export interface GetTripRequestOptions {
  tripRequestRepository: TripRequestRepository
}

export const createGetTripRequestUseCase = ({
  tripRequestRepository,
}: GetTripRequestOptions): GetTripRequestUseCase => ({
  async execute(id) {
    const tripRequestId = parseTripRequestId(id)
    const tripRequest = await tripRequestRepository.findById(tripRequestId)

    if (tripRequest === null) {
      throw tripRequestNotFoundError()
    }

    return tripRequest
  },
})
