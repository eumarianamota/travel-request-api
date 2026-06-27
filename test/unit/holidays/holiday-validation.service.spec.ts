import { mock } from 'vitest-mock-extended'

import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import type { Logger } from '#src/shared/infra/http/logger'

describe('holiday validation service', () => {
  it('reuses local data when the year is already cached', async () => {
    const holidayRepository = mock<HolidayRepository>()
    const holidaysGateway = mock<HolidaysGateway>()
    const logger = mock<Logger>()

    holidayRepository.findByYear.mockResolvedValue([
      { date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 },
    ])

    const service = createHolidayValidationService({
      holidayRepository,
      holidaysGateway,
      logger,
    })

    await expect(service.ensureTravelAllowed('2026-01-02')).resolves.toBeUndefined()

    expect(holidaysGateway.fetchNationalHolidays.mock.calls).toHaveLength(0)
  })

  it('rejects travel when the normalized date is a holiday', async () => {
    const holidayRepository = mock<HolidayRepository>()
    const holidaysGateway = mock<HolidaysGateway>()
    const logger = mock<Logger>()

    holidayRepository.findByYear.mockResolvedValue([
      { date: '2026-12-25', name: 'Natal', type: 'national', year: 2026 },
    ])

    const service = createHolidayValidationService({
      holidayRepository,
      holidaysGateway,
      logger,
    })

    await expect(service.ensureTravelAllowed('2026-12-25')).rejects.toThrow(
      'Travel is not allowed on holiday 2026-12-25.',
    )
  })

  it('fails safely when the provider is required but unavailable', async () => {
    const holidayRepository = mock<HolidayRepository>()
    const holidaysGateway = mock<HolidaysGateway>()
    const logger = mock<Logger>()

    holidayRepository.findByYear.mockResolvedValue([])
    holidaysGateway.fetchNationalHolidays.mockRejectedValue(new Error('network'))

    const service = createHolidayValidationService({
      holidayRepository,
      holidaysGateway,
      logger,
    })

    await expect(service.ensureTravelAllowed('2026-05-01')).rejects.toThrow(
      'Required holiday validation is currently unavailable.',
    )
  })
})
