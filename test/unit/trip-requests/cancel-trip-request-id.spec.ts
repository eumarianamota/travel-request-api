import { parseTripRequestId } from '#src/trip-requests/domain/trip-request-id'

describe('cancel trip request id parsing', () => {
  it('accepts leading-zero positive integers', () => {
    expect(parseTripRequestId('001')).toBe(1)
  })

  it('rejects missing identifiers', () => {
    expect(() => parseTripRequestId(undefined)).toThrow('id must be a positive integer.')
  })

  it('rejects non-numeric identifiers', () => {
    expect(() => parseTripRequestId('abc')).toThrow('id must be a positive integer.')
  })

  it('rejects non-positive integers', () => {
    expect(() => parseTripRequestId('0')).toThrow('id must be a positive integer.')
  })
})
