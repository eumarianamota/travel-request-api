import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

import { withTestServer } from './test-http.js'

describe('POST /trip-requests internal error flow', () => {
  it('returns 500 for unexpected failures', async () => {
    const tripRequestRepository: TripRequestRepository = {
      async findById() {
        throw new Error('not implemented in create internal-error test')
      },
      async list() {
        return []
      },
      async create() {
        throw new Error('database offline')
      },
    }

    const holidayRepository: HolidayRepository = {
      async findByYear() {
        return [{ date: '2026-01-01', name: 'Confraternizacao Universal', type: 'national', year: 2026 }]
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
          departureAt: '2026-12-24T10:30:00-03:00',
          returnAt: '2026-12-26T08:00:00-03:00',
          purpose: 'Meeting',
          passengerCount: 2,
        }),
      })

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
