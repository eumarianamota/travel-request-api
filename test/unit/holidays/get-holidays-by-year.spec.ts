import { mock } from 'vitest-mock-extended'

import { createGetHolidaysByYearUseCase } from '#src/holidays/application/get-holidays-by-year'
import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import type { Logger } from '#src/shared/infra/http/logger'

describe('get holidays by year', () => {
  it('reuses local data when the requested year is already cached', async () => {
    const holidayRepository = mock<HolidayRepository>()
    const holidaysGateway = mock<HolidaysGateway>()
    const logger = mock<Logger>()

    holidayRepository.findByYear.mockResolvedValue([
      { date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 },
    ])

    const useCase = createGetHolidaysByYearUseCase({
      holidayRepository,
      holidaysGateway,
      logger,
    })

    await expect(useCase.execute('2026')).resolves.toStrictEqual([
      { date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 },
    ])
    expect(holidaysGateway.fetchNationalHolidays.mock.calls).toHaveLength(0)
  })

  it('synchronizes and persists holidays when the requested year is uncached', async () => {
    const holidayRepository = mock<HolidayRepository>()
    const holidaysGateway = mock<HolidaysGateway>()
    const logger = mock<Logger>()
    const synchronizedHolidays = [{ date: '2027-04-21', name: 'Tiradentes', type: 'national', year: 2027 }]

    holidayRepository.findByYear.mockResolvedValue([])
    holidaysGateway.fetchNationalHolidays.mockResolvedValue(synchronizedHolidays)

    const useCase = createGetHolidaysByYearUseCase({
      holidayRepository,
      holidaysGateway,
      logger,
    })

    await expect(useCase.execute('2027')).resolves.toStrictEqual(synchronizedHolidays)
    expect(holidaysGateway.fetchNationalHolidays.mock.calls).toStrictEqual([[2027]])
    expect(holidayRepository.saveMany.mock.calls).toStrictEqual([[2027, synchronizedHolidays]])
  })

  it('maps provider failures to the standardized availability error', async () => {
    const holidayRepository = mock<HolidayRepository>()
    const holidaysGateway = mock<HolidaysGateway>()
    const logger = mock<Logger>()

    holidayRepository.findByYear.mockResolvedValue([])
    holidaysGateway.fetchNationalHolidays.mockRejectedValue(new Error('network'))

    const useCase = createGetHolidaysByYearUseCase({
      holidayRepository,
      holidaysGateway,
      logger,
    })

    await expect(useCase.execute('2028')).rejects.toThrow('Required holiday validation is currently unavailable.')
  })
})
