import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import type { HolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'
import {
  holidayTripNotAllowedError,
  holidaysApiUnavailableError,
} from '#src/shared/domain/application-error'
import type { Logger } from '#src/shared/infra/http/logger'

export interface HolidayValidationService {
  ensureTravelAllowed(departureCivilDate: string): Promise<void>
}

export interface CreateHolidayValidationServiceOptions {
  holidayRepository: HolidayRepository
  holidaysGateway: HolidaysGateway
  logger: Logger
}

const matchesDate = (holiday: HolidayValidationRecord, departureCivilDate: string): boolean =>
  holiday.date === departureCivilDate

export const createHolidayValidationService = ({
  holidayRepository,
  holidaysGateway,
  logger,
}: CreateHolidayValidationServiceOptions): HolidayValidationService => ({
  async ensureTravelAllowed(departureCivilDate) {
    const year = Number(departureCivilDate.slice(0, 4))
    let holidays = await holidayRepository.findByYear(year)

    if (holidays.length === 0) {
      logger.info('Holiday cache miss, synchronizing year', { year })

      try {
        holidays = await holidaysGateway.fetchNationalHolidays(year)
      } catch {
        logger.error('Holiday provider unavailable for required validation', { year })
        throw holidaysApiUnavailableError()
      }

      await holidayRepository.saveMany(year, holidays)
    }

    if (holidays.some((holiday) => matchesDate(holiday, departureCivilDate))) {
      throw holidayTripNotAllowedError(departureCivilDate)
    }
  },
})
