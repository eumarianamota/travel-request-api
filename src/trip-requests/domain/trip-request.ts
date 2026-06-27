import { validationError } from '#src/shared/domain/application-error'

export type TripRequestStatus = 'requested' | 'canceled'

export interface CreateTripRequestInput {
  requesterName: string
  origin: string
  destination: string
  departureAt: string
  returnAt: string
  purpose: string
  passengerCount: number
}

export interface TripRequestData {
  requesterName: string
  origin: string
  destination: string
  departureAt: string
  returnAt: string
  purpose: string
  passengerCount: number
}

export interface TripRequestDraft extends TripRequestData {
  status: 'requested'
}

export interface TripRequest extends TripRequestData {
  id: number
  status: TripRequestStatus
  createdAt: string
}

type RequiredTextFieldName = 'requesterName' | 'origin' | 'destination' | 'purpose'

const assertRequiredText = (fieldName: RequiredTextFieldName, value: string | undefined): string => {
  if (value === undefined) {
    throw validationError(`${fieldName} is required.`)
  }

  const normalized = value.trim()

  if (normalized === '') {
    throw validationError(`${fieldName} must not be blank.`)
  }

  return normalized
}

export const normalizeTimestamp = (value: string, fieldName: 'departureAt' | 'returnAt'): string => {
  if (value.trim() === '') {
    throw validationError(`${fieldName} is required.`)
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    throw validationError(`${fieldName} must be a valid ISO 8601 timestamp.`)
  }

  return parsedDate.toISOString()
}

export const toCivilDate = (normalizedTimestamp: string): string => normalizedTimestamp.slice(0, 10)

export const createTripRequestDraft = (input: Partial<CreateTripRequestInput>): TripRequestDraft => {
  const requesterName = assertRequiredText('requesterName', input.requesterName)
  const origin = assertRequiredText('origin', input.origin)
  const destination = assertRequiredText('destination', input.destination)
  const purpose = assertRequiredText('purpose', input.purpose)

  if (origin === destination) {
    throw validationError('origin and destination must be different.')
  }

  if (input.passengerCount === undefined) {
    throw validationError('passengerCount is required.')
  }

  if (!Number.isInteger(input.passengerCount) || input.passengerCount <= 0) {
    throw validationError('passengerCount must be a positive integer.')
  }

  if (input.departureAt === undefined) {
    throw validationError('departureAt is required.')
  }

  if (input.returnAt === undefined) {
    throw validationError('returnAt is required.')
  }

  const departureAt = normalizeTimestamp(input.departureAt, 'departureAt')
  const returnAt = normalizeTimestamp(input.returnAt, 'returnAt')

  if (new Date(returnAt).getTime() < new Date(departureAt).getTime()) {
    throw validationError('returnAt must not be earlier than departureAt.')
  }

  return {
    requesterName,
    origin,
    destination,
    departureAt,
    returnAt,
    purpose,
    passengerCount: input.passengerCount,
    status: 'requested',
  }
}
