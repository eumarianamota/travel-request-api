import type { HolidaysGateway } from '#src/holidays/application/holidays-gateway'
import type { HolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'
import { createHolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'

interface BrasilApiHolidayResponse {
  date: string
  name: string
  type: string
}

export class BrasilApiHolidaysGateway implements HolidaysGateway {
  public constructor(private readonly baseUrl: string) {}

  public async fetchNationalHolidays(year: number): Promise<HolidayValidationRecord[]> {
    const response = await fetch(`${this.baseUrl}/api/feriados/v1/${String(year)}`)

    if (!response.ok) {
      throw new Error(`BrasilAPI request failed with status ${String(response.status)}`)
    }

    const payload = (await response.json()) as BrasilApiHolidayResponse[]

    return payload.map((holiday) =>
      createHolidayValidationRecord({
        date: holiday.date,
        name: holiday.name,
        type: holiday.type,
        year,
      }),
    )
  }
}
