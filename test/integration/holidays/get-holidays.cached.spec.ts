import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { getHolidaysByYear, withTestServer } from '../trip-requests/test-http.js'

class InMemoryHolidayRepository implements HolidayRepository {
  public constructor(private readonly holidays: { date: string; name: string; type: string; year: number }[]) {}

  public async findByYear(year: number) {
    return this.holidays.filter((holiday) => holiday.year === year)
  }

  public async saveMany(_year: number, _holidays: { date: string; name: string; type: string; year: number }[]) {
    return undefined
  }
}

class StubTripRequestRepository implements TripRequestRepository {
  public async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in holidays tests')
  }

  public async findById(_id: number): Promise<TripRequest | null> {
    return null
  }

  public async list(): Promise<TripRequest[]> {
    return []
  }

  public async updateStatus(_id: number, _status: TripRequestStatus): Promise<TripRequest | null> {
    return null
  }
}

const holidayValidationService: HolidayValidationService = {
  async ensureTravelAllowed() {
    return undefined
  },
}

describe('GET /holidays/:year cached flow', () => {
  it('returns locally available data without requiring a fresh provider call', async () => {
    const holidayRepository = new InMemoryHolidayRepository([
      { date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 },
    ])
    const fetchNationalHolidays = vi.fn<HolidaysGateway['fetchNationalHolidays']>()
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository: new StubTripRequestRepository(),
      holidayValidationService,
      holidayQuery: {
        holidayRepository,
        holidaysGateway: {
          fetchNationalHolidays,
        },
      },
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await getHolidaysByYear(baseUrl, 2026)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toStrictEqual({
        success: true,
        data: [{ date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 }],
      })
      expect(fetchNationalHolidays).not.toHaveBeenCalled()
    })
  })
})
