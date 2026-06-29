import type { NextFunction, Request, Response } from 'express'

import { toSuccessResponseBody } from '#src/shared/infra/http/success-response'
import type { AppDependencies } from '#src/shared/infra/http/types'
import { createListTripRequestsUseCase } from '#src/trip-requests/application/list-trip-requests'

export const listTripRequestsController =
  (dependencies: AppDependencies) =>
  async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    const useCase = createListTripRequestsUseCase({
      tripRequestRepository: dependencies.tripRequestRepository,
    })

    try {
      const tripRequests = await useCase.execute()

      dependencies.logger.info('Trip requests listed successfully', {
        count: tripRequests.length,
      })

      response.status(200).json(toSuccessResponseBody(tripRequests))
    } catch (error) {
      next(error)
    }
  }
