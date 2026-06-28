import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async findById(): Promise<TripRequest | null> {
    throw new Error('not implemented in internal-error test')
  },
  async list(): Promise<TripRequest[]> {
    throw new Error('database offline')
  },
  async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in internal-error test')
  },
  async updateStatus(_id: number, _status: TripRequestStatus): Promise<TripRequest | null> {
    return null
  },
}

const holidayRepository: HolidayRepository = {
  async findByYear() {
    return []
  },
  async saveMany() {
    return undefined
  },
}

const holidaysGateway: HolidaysGateway = {
  async fetchNationalHolidays() {
    return []
  },
}

describe('GET /trip-requests internal error flow', () => {
  it('returns 500 for unexpected failures', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository,
      holidayValidationService: createHolidayValidationService({
        holidayRepository,
        holidaysGateway,
        logger: createLogger('test'),
      }),
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await fetch(`${baseUrl}/trip-requests`)

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected internal error occurred.',
        },
      })
    })
  })
})
