import { parseHolidayYear } from '#src/holidays/domain/holiday-year'

describe('holiday year', () => {
  it('parses a valid positive integer year', () => {
    expect(parseHolidayYear('2026')).toBe(2026)
  })

  it('rejects a non-numeric year', () => {
    expect(() => parseHolidayYear('abc')).toThrow('year must be a positive integer.')
  })

  it('rejects a non-positive year', () => {
    expect(() => parseHolidayYear('0')).toThrow('year must be a positive integer.')
  })

  it('rejects an undefined year input', () => {
    expect(() => parseHolidayYear(undefined)).toThrow('year must be a positive integer.')
  })
})
