import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

import { getJson, withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in get-by-id not-found test')
  },
  async findById(): Promise<TripRequest | null> {
    return null
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

describe('GET /trip-requests/:id not-found flow', () => {
  it('returns 404 with the standardized not-found error', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository,
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await getJson(baseUrl, '/trip-requests/999')

      expect(response.status).toBe(404)
      await expect(response.json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'TRIP_REQUEST_NOT_FOUND',
          message: 'Travel request not found.',
        },
      })
    })
  })
})
