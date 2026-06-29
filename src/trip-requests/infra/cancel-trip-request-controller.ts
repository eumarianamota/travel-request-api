import type { NextFunction, Request, Response } from 'express'

import { toSuccessResponseBody } from '#src/shared/infra/http/success-response'
import type { AppDependencies } from '#src/shared/infra/http/types'
import { createCancelTripRequestUseCase } from '#src/trip-requests/application/cancel-trip-request'

export const cancelTripRequestController =
  (dependencies: AppDependencies) =>
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const useCase = createCancelTripRequestUseCase({
      tripRequestRepository: dependencies.tripRequestRepository,
    })
    const id = Array.isArray(request.params['id']) ? request.params['id'][0] : request.params['id']

    try {
      const tripRequest = await useCase.execute(id)

      dependencies.logger.info('Trip request canceled successfully', { tripRequestId: tripRequest.id })

      response.status(200).json(toSuccessResponseBody(tripRequest))
    } catch (error) {
      next(error)
    }
  }
