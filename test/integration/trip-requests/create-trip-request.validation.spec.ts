import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

import { withTestServer } from './test-http.js'

const tripRequestRepository: TripRequestRepository = {
  async create() {
    throw new Error('should not persist invalid requests')
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

describe('POST /trip-requests validation flow', () => {
  it('returns 400 for invalid request payloads', async () => {
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
          destination: 'Teresina',
          departureAt: '2026-12-24T10:30:00-03:00',
          returnAt: '2026-12-23T08:00:00-03:00',
          purpose: ' ',
          passengerCount: 0,
        }),
      })

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toStrictEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'purpose must not be blank.',
        },
      })
    })
  })
})
