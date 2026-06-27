import { createTripRequestDraft } from '#src/trip-requests/domain/trip-request'
import type { CreateTripRequestInput } from '#src/trip-requests/domain/trip-request'

const validInput = {
  requesterName: 'Maria',
  origin: 'Teresina',
  destination: 'Fortaleza',
  departureAt: '2026-12-24T10:30:00-03:00',
  returnAt: '2026-12-26T08:00:00-03:00',
  purpose: 'Meeting',
  passengerCount: 2,
}

describe('createTripRequestDraft validation', () => {
  it('rejects missing required fields', () => {
    const inputWithoutRequesterName: Partial<CreateTripRequestInput> = { ...validInput }

    delete inputWithoutRequesterName.requesterName

    expect(() => createTripRequestDraft(inputWithoutRequesterName)).toThrow('requesterName is required.')
  })

  it('rejects blank text fields', () => {
    expect(() => createTripRequestDraft({ ...validInput, purpose: '   ' })).toThrow('purpose must not be blank.')
  })

  it('rejects equal origin and destination', () => {
    expect(() => createTripRequestDraft({ ...validInput, destination: 'Teresina' })).toThrow(
      'origin and destination must be different.',
    )
  })

  it('rejects invalid chronology', () => {
    expect(() =>
      createTripRequestDraft({
        ...validInput,
        returnAt: '2026-12-23T08:00:00-03:00',
      }),
    ).toThrow('returnAt must not be earlier than departureAt.')
  })

  it('rejects invalid passenger count', () => {
    expect(() => createTripRequestDraft({ ...validInput, passengerCount: 0 })).toThrow(
      'passengerCount must be a positive integer.',
    )
  })
})
