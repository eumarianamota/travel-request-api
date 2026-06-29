import type { Express } from 'express'

import { registerHolidayRoutes } from '#src/holidays/infra/register-holiday-routes'
import type { AppDependencies } from '#src/shared/infra/http/types'
import { registerTripRequestRoutes } from '#src/trip-requests/infra/register-trip-request-routes'

export const registerRoutes = (app: Express, dependencies: AppDependencies): void => {
  registerHolidayRoutes(app, dependencies)
  registerTripRequestRoutes(app, dependencies)
}
