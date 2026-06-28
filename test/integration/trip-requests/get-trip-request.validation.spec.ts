import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { getJson, withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in get-by-id validation test')
  },
  async findById(id: number): Promise<TripRequest | null> {
    if (id === 1) {
      return {
        id: 1,
        requesterName: 'Maria Silva',
        origin: 'Parnaiba',
        destination: 'Teresina',
        departureAt: '2026-06-24T10:00:00.000Z',
        returnAt: '2026-06-24T18:00:00.000Z',
        purpose: 'Participation in an institutional meeting',
        passengerCount: 3,
        status: 'pending',
        createdAt: '2026-06-20T14:30:00.000Z',
      }
    }

    return null
  },
  async list(): Promise<TripRequest[]> {
    return []
  },
  async updateStatus(_id: number, _status: TripRequestStatus): Promise<TripRequest | null> {
    return null
  },
}

const holidayValidationService: HolidayValidationService = {
  async ensureTravelAllowed() {
    return undefined
  },
}

describe('GET /trip-requests/:id validation flow', () => {
  it('returns 400 for non-positive and non-numeric identifiers', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository,
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const invalidResponses = await Promise.all([
        getJson(baseUrl, '/trip-requests/0'),
        getJson(baseUrl, '/trip-requests/abc'),
      ])

      expect(invalidResponses[0].status).toBe(400)
      await expect(invalidResponses[0].json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'id must be a positive integer.',
        },
      })

      expect(invalidResponses[1].status).toBe(400)
      await expect(invalidResponses[1].json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'id must be a positive integer.',
        },
      })
    })
  })

  it('accepts leading-zero positive identifiers and treats them as the same numeric id', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository,
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await getJson(baseUrl, '/trip-requests/001')

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toMatchObject({
        success: true,
        data: {
          id: 1,
        },
      })
    })
  })
})
