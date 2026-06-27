import type { NextFunction, Request, Response } from 'express'

import { internalServerError, isApplicationError } from '#src/shared/domain/application-error'
import type { Logger } from '#src/shared/infra/http/logger'

export interface ErrorResponseBody {
  success: false
  error: {
    code: string
    message: string
  }
}

const toResponseBody = (code: string, message: string): ErrorResponseBody => ({
  success: false,
  error: {
    code,
    message,
  },
})

export const createErrorMiddleware =
  (logger: Logger) =>
  (error: unknown, _request: Request, response: Response<ErrorResponseBody>, _next: NextFunction): void => {
    if (isApplicationError(error)) {
      if (error.statusCode >= 500) {
        logger.error('Create trip request failed with application error', { code: error.code, message: error.message })
      } else {
        logger.warn('Create trip request rejected', { code: error.code, message: error.message })
      }

      response.status(error.statusCode).json(toResponseBody(error.code, error.message))

      return
    }

    logger.error('Unexpected internal failure while processing request')

    const mappedError = internalServerError()
    response.status(mappedError.statusCode).json(toResponseBody(mappedError.code, mappedError.message))
  }
