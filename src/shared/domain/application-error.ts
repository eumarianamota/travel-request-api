export type ApplicationErrorCode =
  | 'VALIDATION_ERROR'
  | 'TRIP_REQUEST_NOT_FOUND'
  | 'TRIP_REQUEST_ALREADY_CANCELED'
  | 'HOLIDAY_TRIP_NOT_ALLOWED'
  | 'HOLIDAYS_API_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'

export class ApplicationError extends Error {
  public readonly code: ApplicationErrorCode
  public readonly statusCode: number

  public constructor(code: ApplicationErrorCode, message: string, statusCode: number) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.name = 'ApplicationError'
  }
}

export const validationError = (message: string): ApplicationError =>
  new ApplicationError('VALIDATION_ERROR', message, 400)

export const holidayTripNotAllowedError = (date: string): ApplicationError =>
  new ApplicationError('HOLIDAY_TRIP_NOT_ALLOWED', `Travel is not allowed on holiday ${date}.`, 409)

export const tripRequestNotFoundError = (): ApplicationError =>
  new ApplicationError('TRIP_REQUEST_NOT_FOUND', 'Travel request not found.', 404)

export const tripRequestAlreadyCanceledError = (): ApplicationError =>
  new ApplicationError('TRIP_REQUEST_ALREADY_CANCELED', 'Travel request is already canceled.', 409)

export const holidaysApiUnavailableError = (): ApplicationError =>
  new ApplicationError(
    'HOLIDAYS_API_UNAVAILABLE',
    'Required holiday validation is currently unavailable.',
    502,
  )

export const internalServerError = (): ApplicationError =>
  new ApplicationError('INTERNAL_SERVER_ERROR', 'An unexpected internal error occurred.', 500)

export const isApplicationError = (error: unknown): error is ApplicationError => error instanceof ApplicationError
