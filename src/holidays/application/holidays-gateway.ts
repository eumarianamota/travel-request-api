import type { HolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'

export interface HolidaysGateway {
  fetchNationalHolidays(year: number): Promise<HolidayValidationRecord[]>
}
