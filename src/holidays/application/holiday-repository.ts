import type { HolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'

export interface HolidayRepository {
  findByYear(year: number): Promise<HolidayValidationRecord[]>
  saveMany(year: number, holidays: HolidayValidationRecord[]): Promise<void>
}
