import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import type { HolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'
import { parseHolidayYear } from '#src/holidays/domain/holiday-year'
import { holidaysApiUnavailableError } from '#src/shared/domain/application-error'
import type { Logger } from '#src/shared/infra/http/logger'

export interface GetHolidaysByYearUseCase {
  execute(yearInput: string | undefined): Promise<HolidayValidationRecord[]>
}

export interface CreateGetHolidaysByYearUseCaseOptions {
  holidayRepository: HolidayRepository
  holidaysGateway: HolidaysGateway
  logger: Logger
}

export const createGetHolidaysByYearUseCase = ({
  holidayRepository,
  holidaysGateway,
  logger,
}: CreateGetHolidaysByYearUseCaseOptions): GetHolidaysByYearUseCase => ({
  async execute(yearInput) {
    const year = parseHolidayYear(yearInput)
    let holidays = await holidayRepository.findByYear(year)

    if (holidays.length === 0) {
      logger.info('Holiday cache miss, synchronizing year', { year })

      try {
        holidays = await holidaysGateway.fetchNationalHolidays(year)
      } catch {
        logger.error('Holiday provider unavailable for direct query', { year })
        throw holidaysApiUnavailableError()
      }

      await holidayRepository.saveMany(year, holidays)
    }

    return holidays
  },
})
