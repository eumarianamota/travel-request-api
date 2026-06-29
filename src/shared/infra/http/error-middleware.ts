import type { NextFunction, Request, Response } from 'express'

import {
  internalServerError,
  isApplicationError,
  toApplicationErrorDetail,
  type ApplicationErrorDetail,
} from '#src/shared/domain/application-error'
import type { Logger } from '#src/shared/infra/http/logger'

export interface ErrorResponseBody {
  success: false
  error: ApplicationErrorDetail
}

const toResponseBody = (error: ApplicationErrorDetail): ErrorResponseBody => ({
  success: false,
  error,
})

export const createErrorMiddleware =
  (logger: Logger) =>
  (error: unknown, _request: Request, response: Response<ErrorResponseBody>, _next: NextFunction): void => {
    if (isApplicationError(error)) {
      if (error.statusCode >= 500) {
        logger.error('Request failed with application error', { code: error.code, message: error.message })
      } else {
        logger.warn('Request rejected', { code: error.code, message: error.message })
      }

      response.status(error.statusCode).json(toResponseBody(toApplicationErrorDetail(error)))

      return
    }

    logger.error('Unexpected internal failure while processing request')

    const mappedError = internalServerError()
    response.status(mappedError.statusCode).json(toResponseBody(toApplicationErrorDetail(mappedError)))
  }
