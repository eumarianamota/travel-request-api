import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { patchJson, withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in cancel internal-error test')
  },
  async findById(_id: number): Promise<TripRequest | null> {
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
  },
  async list(): Promise<TripRequest[]> {
    return []
  },
  async updateStatus(_id: number, _status: TripRequestStatus): Promise<TripRequest | null> {
    throw new Error('database offline')
  },
}

const holidayValidationService: HolidayValidationService = {
  async ensureTravelAllowed() {
    return undefined
  },
}

describe('PATCH /trip-requests/:id/cancel internal error flow', () => {
  it('returns 500 for unexpected failures', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository,
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await patchJson(baseUrl, '/trip-requests/1/cancel')

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
