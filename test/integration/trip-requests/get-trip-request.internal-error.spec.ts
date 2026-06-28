import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

import { getJson, withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in get-by-id internal-error test')
  },
  async findById(): Promise<TripRequest | null> {
    throw new Error('database offline')
  },
  async list(): Promise<TripRequest[]> {
    return []
  },
}

const holidayValidationService: HolidayValidationService = {
  async ensureTravelAllowed() {
    return undefined
  },
}

describe('GET /trip-requests/:id internal error flow', () => {
  it('returns 500 for unexpected failures', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository,
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await getJson(baseUrl, '/trip-requests/1')

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
