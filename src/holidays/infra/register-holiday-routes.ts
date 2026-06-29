import type { Express } from 'express'

import type { AppDependencies } from '#src/shared/infra/http/types'
import { getHolidaysController } from '#src/holidays/infra/get-holidays-controller'

export const registerHolidayRoutes = (app: Express, dependencies: AppDependencies): void => {
  if (dependencies.holidayQuery === undefined) {
    return
  }

  app.get('/holidays/:year', getHolidaysController(dependencies))
}
