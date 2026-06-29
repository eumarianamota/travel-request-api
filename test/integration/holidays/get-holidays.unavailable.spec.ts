import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { getHolidaysByYear, withTestServer } from '../trip-requests/test-http.js'

const holidayRepository: HolidayRepository = {
  async findByYear() {
    return []
  },
  async saveMany() {
    return undefined
  },
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

describe('GET /holidays/:year provider unavailable flow', () => {
  it('returns 502 when the requested uncached year depends on an unavailable provider', async () => {
    const holidaysGateway: HolidaysGateway = {
      async fetchNationalHolidays() {
        throw new Error('network')
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
      const response = await getHolidaysByYear(baseUrl, 2027)

      expect(response.status).toBe(502)
      await expect(response.json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'HOLIDAYS_API_UNAVAILABLE',
          message: 'Required holiday validation is currently unavailable.',
        },
      })
    })
  })
})
