import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { getHolidaysByYear, withTestServer } from '../trip-requests/test-http.js'

class InMemoryHolidayRepository implements HolidayRepository {
  public constructor(private readonly holidaysByYear: Map<number, { date: string; name: string; type: string; year: number }[]>) {}

  public async findByYear(year: number) {
    return this.holidaysByYear.get(year) ?? []
  }

  public async saveMany(year: number, holidays: { date: string; name: string; type: string; year: number }[]) {
    this.holidaysByYear.set(year, [...holidays])
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

describe('GET /holidays/:year success flow', () => {
  it('returns a cached year in the standardized success envelope', async () => {
    const holidayRepository = new InMemoryHolidayRepository(
      new Map([
        [
          2026,
          [
            { date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 },
            { date: '2026-04-21', name: 'Tiradentes', type: 'national', year: 2026 },
          ],
        ],
      ]),
    )
    const holidaysGateway: HolidaysGateway = {
      async fetchNationalHolidays() {
        throw new Error('gateway should not be called for cached year')
      },
    }
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository: new StubTripRequestRepository(),
      holidayValidationService,
      holidayQuery: {
        holidayRepository,
        holidaysGateway,
      },
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await getHolidaysByYear(baseUrl, 2026)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toStrictEqual({
        success: true,
        data: [
          { date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 },
          { date: '2026-04-21', name: 'Tiradentes', type: 'national', year: 2026 },
        ],
      })
    })
  })

  it('synchronizes an uncached year and returns the fetched holidays', async () => {
    const holidayRepository = new InMemoryHolidayRepository(new Map())
    const holidaysGateway: HolidaysGateway = {
      async fetchNationalHolidays(year: number) {
        return [{ date: `${String(year)}-09-07`, name: 'Independencia do Brasil', type: 'national', year }]
      },
    }
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository: new StubTripRequestRepository(),
      holidayValidationService,
      holidayQuery: {
        holidayRepository,
        holidaysGateway,
      },
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await getHolidaysByYear(baseUrl, 2029)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toStrictEqual({
        success: true,
        data: [{ date: '2029-09-07', name: 'Independencia do Brasil', type: 'national', year: 2029 }],
      })
      await expect(holidayRepository.findByYear(2029)).resolves.toStrictEqual([
        { date: '2029-09-07', name: 'Independencia do Brasil', type: 'national', year: 2029 },
      ])
    })
  })
})
