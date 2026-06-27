import { validationError } from '#src/shared/domain/application-error'

export interface HolidayValidationRecord {
  date: string
  name: string
  type: string
  year: number
}

export const createHolidayValidationRecord = (input: HolidayValidationRecord): HolidayValidationRecord => {
  if (input.date.trim() === '') {
    throw validationError('Holiday date is required.')
  }

  if (input.name.trim() === '') {
    throw validationError('Holiday name is required.')
  }

  if (input.type.trim() === '') {
    throw validationError('Holiday type is required.')
  }

  const inputYear = Number(input.date.slice(0, 4))

  if (input.year !== inputYear) {
    throw validationError('Holiday year must match holiday date year.')
  }

  return {
    date: input.date,
    name: input.name.trim(),
    type: input.type.trim(),
    year: input.year,
  }
}
