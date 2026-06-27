import { createTripRequestSummary } from '#src/trip-requests/domain/trip-request'

describe('createTripRequestSummary', () => {
  it('preserves canonical UTC timestamps and observable status', () => {
    expect(
      createTripRequestSummary({
        id: 1,
        requesterName: 'Maria',
        origin: 'Parnaiba',
        destination: 'Teresina',
        departureAt: '2026-06-24T10:00:00.000Z',
        returnAt: '2026-06-24T18:00:00.000Z',
        purpose: 'Meeting',
        passengerCount: 3,
        status: 'requested',
        createdAt: '2026-06-20T14:30:00.000Z',
      }),
    ).toStrictEqual({
      id: 1,
      requesterName: 'Maria',
      origin: 'Parnaiba',
      destination: 'Teresina',
      departureAt: '2026-06-24T10:00:00.000Z',
      returnAt: '2026-06-24T18:00:00.000Z',
      purpose: 'Meeting',
      passengerCount: 3,
      status: 'requested',
      createdAt: '2026-06-20T14:30:00.000Z',
    })
  })

  it('rejects unsupported observable statuses', () => {
    expect(() =>
      createTripRequestSummary({
        id: 1,
        requesterName: 'Maria',
        origin: 'Parnaiba',
        destination: 'Teresina',
        departureAt: '2026-06-24T10:00:00.000Z',
        returnAt: '2026-06-24T18:00:00.000Z',
        purpose: 'Meeting',
        passengerCount: 3,
        status: 'approved',
        createdAt: '2026-06-20T14:30:00.000Z',
      }),
    ).toThrow('status must be requested or canceled.')
  })
})
