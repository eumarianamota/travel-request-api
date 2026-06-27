import type { Pool } from 'pg'

import type { HolidayRepository } from '#src/holidays/application/holiday-repository'
import type { HolidayValidationRecord } from '#src/holidays/domain/holiday-validation-record'
import { withDatabaseTransaction } from '#src/shared/infra/db/database-client'

interface HolidayRow {
  date: string
  name: string
  type: string
  year: number
}

export class SqlHolidayRepository implements HolidayRepository {
  public constructor(private readonly pool: Pool) {}

  public async findByYear(year: number): Promise<HolidayValidationRecord[]> {
    const result = await this.pool.query<HolidayRow>(
      `SELECT date::text AS date, name, type, year
         FROM holidays
        WHERE year = $1
        ORDER BY date ASC`,
      [year],
    )

    return result.rows.map((row) => ({
      date: row.date,
      name: row.name,
      type: row.type,
      year: row.year,
    }))
  }

  public async saveMany(year: number, holidays: HolidayValidationRecord[]): Promise<void> {
    await withDatabaseTransaction(this.pool, async (client) => {
      await client.query('DELETE FROM holidays WHERE year = $1', [year])

      for (const holiday of holidays) {
        await client.query(
          `INSERT INTO holidays (date, name, type, year)
           VALUES ($1, $2, $3, $4)`,
          [holiday.date, holiday.name, holiday.type, holiday.year],
        )
      }
    })
  }
}
