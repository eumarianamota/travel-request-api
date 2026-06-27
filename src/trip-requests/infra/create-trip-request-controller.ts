import type { NextFunction, Request, Response } from 'express'

import type { AppDependencies } from '#src/shared/infra/http/types'
import { createCreateTripRequestUseCase } from '#src/trip-requests/application/create-trip-request'
import type { CreateTripRequestInput } from '#src/trip-requests/domain/trip-request'

export const createTripRequestController =
  (dependencies: AppDependencies) =>
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const useCase = createCreateTripRequestUseCase({
      tripRequestRepository: dependencies.tripRequestRepository,
      holidayValidationService: dependencies.holidayValidationService,
    })

    try {
      const tripRequest = await useCase.execute(request.body as Partial<CreateTripRequestInput>)

      dependencies.logger.info('Trip request created successfully', { tripRequestId: tripRequest.id })

      response.status(201).json({
        success: true,
        data: tripRequest,
      })
    } catch (error) {
      next(error)
    }
  }
