import type { Express } from 'express'

import type { AppDependencies } from '#src/shared/infra/http/types'
import { cancelTripRequestController } from '#src/trip-requests/infra/cancel-trip-request-controller'
import { createTripRequestController } from '#src/trip-requests/infra/create-trip-request-controller'
import { getTripRequestController } from '#src/trip-requests/infra/get-trip-request-controller'
import { listTripRequestsController } from '#src/trip-requests/infra/list-trip-requests-controller'

export const registerTripRequestRoutes = (app: Express, dependencies: AppDependencies): void => {
  app.patch('/trip-requests/:id/cancel', cancelTripRequestController(dependencies))
  app.get('/trip-requests/:id', getTripRequestController(dependencies))
  app.get('/trip-requests', listTripRequestsController(dependencies))
  app.post('/trip-requests', createTripRequestController(dependencies))
}
