import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { patchJson, withTestServer } from './test-http.js'

class InMemoryTripRequestRepository implements TripRequestRepository {
  public constructor(private readonly tripRequests: TripRequest[]) {}

  public async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in cancel validation test')
  }

  public async findById(id: number): Promise<TripRequest | null> {
    return this.tripRequests.find((tripRequest) => tripRequest.id === id) ?? null
  }

  public async list(): Promise<TripRequest[]> {
    return this.tripRequests
  }

  public async updateStatus(id: number, status: TripRequestStatus): Promise<TripRequest | null> {
    const tripRequest = this.tripRequests.find((item) => item.id === id)

    if (tripRequest === undefined) {
      return null
    }

    tripRequest.status = status

    return tripRequest
  }
}

const holidayValidationService: HolidayValidationService = {
  async ensureTravelAllowed() {
    return undefined
  },
}

describe('PATCH /trip-requests/:id/cancel validation flow', () => {
  it('returns 400 for invalid identifiers', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository: new InMemoryTripRequestRepository([]),
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const invalidResponses = await Promise.all([
        patchJson(baseUrl, '/trip-requests/0/cancel'),
        patchJson(baseUrl, '/trip-requests/abc/cancel'),
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
      tripRequestRepository: new InMemoryTripRequestRepository([
        {
          id: 1,
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
          purpose: 'Participation in an institutional meeting',
          passengerCount: 3,
          status: 'requested',
          createdAt: '2026-06-20T14:30:00.000Z',
        },
      ]),
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await patchJson(baseUrl, '/trip-requests/001/cancel')

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toMatchObject({
        success: true,
        data: {
          id: 1,
          status: 'canceled',
        },
      })
    })
  })
})
