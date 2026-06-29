import { validationError } from '#src/shared/domain/application-error'

export type HolidayYear = number

const invalidHolidayYearError = (): ReturnType<typeof validationError> =>
  validationError('year must be a positive integer.')

export const parseHolidayYear = (input: string | undefined): HolidayYear => {
  if (input === undefined || !/^\d+$/.test(input)) {
    throw invalidHolidayYearError()
  }

  const year = Number(input)

  if (!Number.isSafeInteger(year) || year <= 0) {
    throw invalidHolidayYearError()
  }

  return year
}
