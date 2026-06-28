import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

import { withTestServer } from './test-http.js'

class InMemoryTripRequestRepository implements TripRequestRepository {
  public constructor(private readonly tripRequests: TripRequest[]) {}

  public async findById(id: number): Promise<TripRequest | null> {
    return this.tripRequests.find((tripRequest) => tripRequest.id === id) ?? null
  }

  public async list(): Promise<TripRequest[]> {
    return this.tripRequests
  }

  public async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in list tests')
  }
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

describe('GET /trip-requests success flow', () => {
  it('returns 200 with all registered travel requests ordered from most recent departureAt to oldest', async () => {
    const app = createApp({
      logger: createLogger('test'),
      tripRequestRepository: new InMemoryTripRequestRepository([
        {
          id: 2,
          requesterName: 'Bruno',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-26T10:00:00.000Z',
          returnAt: '2026-06-26T18:00:00.000Z',
          purpose: 'Workshop',
          passengerCount: 2,
          status: 'requested',
          createdAt: '2026-06-21T14:30:00.000Z',
        },
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
      holidayValidationService: createHolidayValidationService({
        holidayRepository,
        holidaysGateway,
        logger: createLogger('test'),
      }),
    })

    await withTestServer(app, async (baseUrl: string) => {
      const response = await fetch(`${baseUrl}/trip-requests`)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toStrictEqual({
        success: true,
        data: [
          {
            id: 2,
            requesterName: 'Bruno',
            origin: 'Parnaiba',
            destination: 'Teresina',
            departureAt: '2026-06-26T10:00:00.000Z',
            returnAt: '2026-06-26T18:00:00.000Z',
            purpose: 'Workshop',
            passengerCount: 2,
            status: 'requested',
            createdAt: '2026-06-21T14:30:00.000Z',
          },
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
        ],
      })
    })
  })
})
