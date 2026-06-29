import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import type { Logger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

export interface HolidayQueryDependencies {
  holidayRepository: HolidayRepository
  holidaysGateway: HolidaysGateway
}

export interface AppDependencies {
  logger: Logger
  tripRequestRepository: TripRequestRepository
  holidayValidationService: HolidayValidationService
  holidayQuery?: HolidayQueryDependencies
}
