import type { Express } from 'express'

import type { AppDependencies } from '#src/shared/infra/http/types'
import { createTripRequestController } from '#src/trip-requests/infra/create-trip-request-controller'

export const registerTripRequestRoutes = (app: Express, dependencies: AppDependencies): void => {
  app.post('/trip-requests', createTripRequestController(dependencies))
}
