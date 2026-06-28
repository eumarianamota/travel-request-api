import { validationError } from '#src/shared/domain/application-error'

export const parseTripRequestId = (value: string | undefined): number => {
  if (value === undefined) {
    throw validationError('id must be a positive integer.')
  }

  const normalized = value.trim()

  if (!/^\d+$/.test(normalized)) {
    throw validationError('id must be a positive integer.')
  }

  const parsedId = Number(normalized)

  if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
    throw validationError('id must be a positive integer.')
  }

  return parsedId
}
