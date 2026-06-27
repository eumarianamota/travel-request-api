import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

import { withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async create() {
    throw new Error('should not persist blocked requests')
  },
}

describe('POST /trip-requests holiday flow', () => {
  it('returns 409 when departure falls on a holiday', async () => {
    const holidayRepository: HolidayRepository = {
      async findByYear() {
        return [{ date: '2026-12-25', name: 'Natal', type: 'national', year: 2026 }]
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
          departureAt: '2026-12-25T10:30:00-03:00',
          returnAt: '2026-12-26T08:00:00-03:00',
          purpose: 'Meeting',
          passengerCount: 1,
        }),
      })

      expect(response.status).toBe(409)
      await expect(response.json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'HOLIDAY_TRIP_NOT_ALLOWED',
          message: 'Travel is not allowed on holiday 2026-12-25.',
        },
      })
    })
  })

  it('returns 502 when the provider is required but unavailable', async () => {
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
        throw new Error('provider down')
      },
    }

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
          departureAt: '2027-12-24T10:30:00-03:00',
          returnAt: '2027-12-26T08:00:00-03:00',
          purpose: 'Meeting',
          passengerCount: 1,
        }),
      })

      expect(response.status).toBe(502)
      await expect(response.json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'HOLIDAYS_API_UNAVAILABLE',
          message: 'Required holiday validation is currently unavailable.',
        },
      })
    })
  })
})
