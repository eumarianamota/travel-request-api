import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'
import type { TripRequest, TripRequestDraft } from '#src/trip-requests/domain/trip-request'

import { withTestServer } from './test-http.js'

class InMemoryTripRequestRepository implements TripRequestRepository {
  private nextId = 1

  public readonly created: TripRequest[] = []

  public async findById(id: number): Promise<TripRequest | null> {
    return this.created.find((tripRequest) => tripRequest.id === id) ?? null
  }

  public async list(): Promise<TripRequest[]> {
    return this.created
  }

  public async create(input: TripRequestDraft): Promise<TripRequest> {
    const tripRequest: TripRequest = {
      id: this.nextId++,
      ...input,
      createdAt: '2026-06-27T12:00:00.000Z',
    }

    this.created.push(tripRequest)

    return tripRequest
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
    return [{ date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 }]
  },
}

describe('POST /trip-requests success flow', () => {
  it('returns 201 with the standardized success envelope and canonical UTC timestamps', async () => {
    const tripRequestRepository = new InMemoryTripRequestRepository()
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
      const response = await fetch(`${baseUrl}/trip-requests`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          requesterName: 'Maria',
          origin: 'Teresina',
          destination: 'Fortaleza',
          departureAt: '2026-12-24T10:30:00-03:00',
          returnAt: '2026-12-26T08:00:00-03:00',
          purpose: 'Meeting',
          passengerCount: 2,
        }),
      })

      expect(response.status).toBe(201)
      await expect(response.json()).resolves.toStrictEqual({
        success: true,
        data: {
          id: 1,
          requesterName: 'Maria',
          origin: 'Teresina',
          destination: 'Fortaleza',
          departureAt: '2026-12-24T13:30:00.000Z',
          returnAt: '2026-12-26T11:00:00.000Z',
          purpose: 'Meeting',
          passengerCount: 2,
          status: 'requested',
          createdAt: '2026-06-27T12:00:00.000Z',
        },
      })
      expect(tripRequestRepository.created).toHaveLength(1)
    })
  })
})
