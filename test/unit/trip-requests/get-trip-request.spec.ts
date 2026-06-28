import { mock } from 'vitest-mock-extended'

import { tripRequestNotFoundError } from '#src/shared/domain/application-error'
import { createGetTripRequestUseCase } from '#src/trip-requests/application/get-trip-request'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

describe('createGetTripRequestUseCase', () => {
  it('returns the trip request found for a valid identifier', async () => {
    const tripRequestRepository = mock<TripRequestRepository>()
    tripRequestRepository.findById.mockResolvedValue({
      id: 1,
      requesterName: 'Maria Silva',
      origin: 'Parnaiba',
      destination: 'Teresina',
      departureAt: '2026-06-24T10:00:00.000Z',
      returnAt: '2026-06-24T18:00:00.000Z',
      purpose: 'Meeting',
      passengerCount: 3,
      status: 'pending',
      createdAt: '2026-06-20T14:30:00.000Z',
    })

    const useCase = createGetTripRequestUseCase({ tripRequestRepository })

    await expect(useCase.execute('001')).resolves.toMatchObject({
      id: 1,
      requesterName: 'Maria Silva',
    })
    expect(tripRequestRepository.findById.mock.calls).toStrictEqual([[1]])
  })

  it('throws the standardized not-found error when the record does not exist', async () => {
    const tripRequestRepository = mock<TripRequestRepository>()
    tripRequestRepository.findById.mockResolvedValue(null)

    const useCase = createGetTripRequestUseCase({ tripRequestRepository })

    await expect(useCase.execute('42')).rejects.toMatchObject(tripRequestNotFoundError())
    expect(tripRequestRepository.findById.mock.calls).toStrictEqual([[42]])
  })
})
