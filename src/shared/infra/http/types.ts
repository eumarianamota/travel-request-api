import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { Logger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

export interface AppDependencies {
  logger: Logger
  tripRequestRepository: TripRequestRepository
  holidayValidationService: HolidayValidationService
}
