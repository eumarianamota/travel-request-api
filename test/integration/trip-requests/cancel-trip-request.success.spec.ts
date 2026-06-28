import type { HolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft, TripRequestStatus } from '#src/trip-requests/domain/trip-request'

import { patchJson, withTestServer } from './test-http.js'

class InMemoryTripRequestRepository implements TripRequestRepository {
  public constructor(private readonly tripRequests: TripRequest[]) {}

  public async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in cancel success test')
  }

  public async findById(id: number): Promise<TripRequest | null> {
    return this.tripRequests.find((tripRequest) => tripRequest.id === id) ?? null
  }

  public async list(): Promise<TripRequest[]> {
    return this.tripRequests
  }

  public async updateStatus(id: number, status: TripRequestStatus): Promise<TripRequest | null> {
    const index = this.tripRequests.findIndex((tripRequest) => tripRequest.id === id)

    if (index < 0) {
      return null
    }

    const currentTripRequest = this.tripRequests[index]

    if (currentTripRequest === undefined) {
      return null
    }

    const updatedTripRequest = {
      ...currentTripRequest,
      status,
    }

    this.tripRequests[index] = updatedTripRequest

    return updatedTripRequest
  }
}

const holidayValidationService: HolidayValidationService = {
  async ensureTravelAllowed() {
    return undefined
  },
}

describe('PATCH /trip-requests/:id/cancel success flow', () => {
  it('returns 200 with the standardized success envelope and the logically canceled trip request', async () => {
    const repository = new InMemoryTripRequestRepository([
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
    ])
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository: repository,
      holidayValidationService,
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await patchJson(baseUrl, '/trip-requests/1/cancel')

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toStrictEqual({
        success: true,
        data: {
          id: 1,
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
          purpose: 'Participation in an institutional meeting',
          passengerCount: 3,
          status: 'canceled',
          createdAt: '2026-06-20T14:30:00.000Z',
        },
      })
      await expect(repository.findById(1)).resolves.toMatchObject({
        id: 1,
        status: 'canceled',
      })
    })
  })
})
