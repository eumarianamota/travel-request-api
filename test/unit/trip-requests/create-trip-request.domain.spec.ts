import { createTripRequestDraft, normalizeTimestamp } from '#src/trip-requests/domain/trip-request'

describe('createTripRequestDraft', () => {
  it('normalizes ISO timestamps to canonical UTC format', () => {
    expect(normalizeTimestamp('2026-12-24T10:30:00-03:00', 'departureAt')).toBe('2026-12-24T13:30:00.000Z')
  })

  it('creates a requested trip request draft with trimmed text fields', () => {
    expect(
      createTripRequestDraft({
        requesterName: '  Maria  ',
        origin: ' Teresina ',
        destination: ' Fortaleza ',
        departureAt: '2026-12-24T10:30:00-03:00',
        returnAt: '2026-12-26T08:00:00-03:00',
        purpose: ' Meeting ',
        passengerCount: 2,
      }),
    ).toStrictEqual({
      requesterName: 'Maria',
      origin: 'Teresina',
      destination: 'Fortaleza',
      departureAt: '2026-12-24T13:30:00.000Z',
      returnAt: '2026-12-26T11:00:00.000Z',
      purpose: 'Meeting',
      passengerCount: 2,
      status: 'requested',
    })
  })
})
