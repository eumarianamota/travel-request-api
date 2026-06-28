import { mock } from 'vitest-mock-extended'

import {
  tripRequestAlreadyCanceledError,
  tripRequestNotFoundError,
} from '#src/shared/domain/application-error'
import { createCancelTripRequestUseCase } from '#src/trip-requests/application/cancel-trip-request'
import type { TripRequestRepository } from '#src/trip-requests/application/trip-request-repository'

describe('createCancelTripRequestUseCase', () => {
  it('cancels a pending trip request and returns the updated object', async () => {
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
    tripRequestRepository.updateStatus.mockResolvedValue({
      id: 1,
      requesterName: 'Maria Silva',
      origin: 'Parnaiba',
      destination: 'Teresina',
      departureAt: '2026-06-24T10:00:00.000Z',
      returnAt: '2026-06-24T18:00:00.000Z',
      purpose: 'Meeting',
      passengerCount: 3,
      status: 'canceled',
      createdAt: '2026-06-20T14:30:00.000Z',
    })

    const useCase = createCancelTripRequestUseCase({ tripRequestRepository })

    await expect(useCase.execute('001')).resolves.toMatchObject({
      id: 1,
      status: 'canceled',
    })
    expect(tripRequestRepository.findById.mock.calls).toStrictEqual([[1]])
    expect(tripRequestRepository.updateStatus.mock.calls).toStrictEqual([[1, 'canceled']])
  })

  it('throws the standardized not-found error when the record does not exist', async () => {
    const tripRequestRepository = mock<TripRequestRepository>()
    tripRequestRepository.findById.mockResolvedValue(null)

    const useCase = createCancelTripRequestUseCase({ tripRequestRepository })

    await expect(useCase.execute('42')).rejects.toMatchObject(tripRequestNotFoundError())
    expect(tripRequestRepository.findById.mock.calls).toStrictEqual([[42]])
    expect(tripRequestRepository.updateStatus.mock.calls).toHaveLength(0)
  })

  it('throws the standardized conflict error when the record is already canceled', async () => {
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
      status: 'canceled',
      createdAt: '2026-06-20T14:30:00.000Z',
    })

    const useCase = createCancelTripRequestUseCase({ tripRequestRepository })

    await expect(useCase.execute('1')).rejects.toMatchObject(tripRequestAlreadyCanceledError())
    expect(tripRequestRepository.updateStatus.mock.calls).toHaveLength(0)
  })
})
