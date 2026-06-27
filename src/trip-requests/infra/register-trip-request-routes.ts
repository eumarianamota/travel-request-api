import type { Express } from 'express'

import type { AppDependencies } from '#src/shared/infra/http/types'
import { createTripRequestController } from '#src/trip-requests/infra/create-trip-request-controller'
import { listTripRequestsController } from '#src/trip-requests/infra/list-trip-requests-controller'

export const registerTripRequestRoutes = (app: Express, dependencies: AppDependencies): void => {
  app.get('/trip-requests', listTripRequestsController(dependencies))
  app.post('/trip-requests', createTripRequestController(dependencies))
}
