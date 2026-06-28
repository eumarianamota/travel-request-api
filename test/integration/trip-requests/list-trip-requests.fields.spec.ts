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
    throw new Error('not implemented in fields test')
  },
  async list(): Promise<TripRequest[]> {
    return [
      {
        id: 1,
        requesterName: 'Maria',
        origin: 'Parnaiba',
        destination: 'Teresina',
        departureAt: '2026-06-24T10:00:00.000Z',
        returnAt: '2026-06-24T18:00:00.000Z',
        purpose: 'Meeting',
        passengerCount: 3,
        status: 'pending',
        createdAt: '2026-06-20T14:30:00.000Z',
      },
      {
        id: 2,
        requesterName: 'Pedro',
        origin: 'Teresina',
        destination: 'Fortaleza',
        departureAt: '2026-05-24T10:00:00.000Z',
        returnAt: '2026-05-28T18:00:00.000Z',
        purpose: 'Training',
        passengerCount: 1,
        status: 'canceled',
        createdAt: '2026-05-20T14:30:00.000Z',
      },
    ]
  },
  async create(_input: TripRequestDraft): Promise<TripRequest> {
    throw new Error('not implemented in fields test')
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

describe('GET /trip-requests field shape flow', () => {
  it('preserves canonical UTC timestamps and observable statuses', async () => {
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
      const payload = (await response.json()) as {
        success: boolean
        data: TripRequest[]
      }

      expect(response.status).toBe(200)
      expect(payload.success).toBe(true)
      expect(payload.data).toHaveLength(2)
      expect(payload.data[0]).toStrictEqual({
        id: 1,
        requesterName: 'Maria',
        origin: 'Parnaiba',
        destination: 'Teresina',
        departureAt: '2026-06-24T10:00:00.000Z',
        returnAt: '2026-06-24T18:00:00.000Z',
        purpose: 'Meeting',
        passengerCount: 3,
        status: 'pending',
        createdAt: '2026-06-20T14:30:00.000Z',
      })
      expect(payload.data[1]?.status).toBe('canceled')
    })
  })
})
