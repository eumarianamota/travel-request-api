import type { NextFunction, Request, Response } from 'express'

import { createGetHolidaysByYearUseCase } from '#src/holidays/application/get-holidays-by-year'
import type { AppDependencies } from '#src/shared/infra/http/types'

export const getHolidaysController =
  (dependencies: AppDependencies) =>
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const holidayQuery = dependencies.holidayQuery

    if (holidayQuery === undefined) {
      next(new Error('Holiday query dependencies are not configured.'))
      return
    }

    const useCase = createGetHolidaysByYearUseCase({
      holidayRepository: holidayQuery.holidayRepository,
      holidaysGateway: holidayQuery.holidaysGateway,
      logger: dependencies.logger,
    })
    const year = Array.isArray(request.params['year']) ? request.params['year'][0] : request.params['year']

    try {
      const holidays = await useCase.execute(year)
      const requestedYear = Number(year)

      dependencies.logger.info('National holidays retrieved successfully', {
        count: holidays.length,
        year: requestedYear,
      })

      response.status(200).json({
        success: true,
        data: holidays,
      })
    } catch (error) {
      next(error)
    }
  }
