import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { CreateTripRequestInput, TripRequest } from '#src/trip-requests/domain/trip-request'
import { createTripRequestDraft, toCivilDate } from '#src/trip-requests/domain/trip-request'

export interface CreateTripRequestUseCase {
  execute(input: Partial<CreateTripRequestInput>): Promise<TripRequest>
}

export interface CreateTripRequestOptions {
  tripRequestRepository: TripRequestRepository
  holidayValidationService: HolidayValidationService
}

export const createCreateTripRequestUseCase = ({
  tripRequestRepository,
  holidayValidationService,
}: CreateTripRequestOptions): CreateTripRequestUseCase => ({
  async execute(input) {
    const draft = createTripRequestDraft(input)
    await holidayValidationService.ensureTravelAllowed(toCivilDate(draft.departureAt))

    return tripRequestRepository.create(draft)
  },
})
