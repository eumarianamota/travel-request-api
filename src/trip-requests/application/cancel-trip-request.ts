import { tripRequestNotFoundError } from '#src/shared/domain/application-error'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import { cancelTripRequest, type TripRequest } from '#src/trip-requests/domain/trip-request'
import { parseTripRequestId } from '#src/trip-requests/domain/trip-request-id'

export interface CancelTripRequestUseCase {
  execute(id: string | undefined): Promise<TripRequest>
}

export interface CancelTripRequestOptions {
  tripRequestRepository: TripRequestRepository
}

export const createCancelTripRequestUseCase = ({
  tripRequestRepository,
}: CancelTripRequestOptions): CancelTripRequestUseCase => ({
  async execute(id) {
    const tripRequestId = parseTripRequestId(id)
    const existingTripRequest = await tripRequestRepository.findById(tripRequestId)

    if (existingTripRequest === null) {
      throw tripRequestNotFoundError()
    }

    const canceledTripRequest = cancelTripRequest(existingTripRequest)
    const persistedTripRequest = await tripRequestRepository.updateStatus(
      canceledTripRequest.id,
      canceledTripRequest.status,
    )

    if (persistedTripRequest === null) {
      throw tripRequestNotFoundError()
    }

    return persistedTripRequest
  },
})
