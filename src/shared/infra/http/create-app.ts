import express from 'express'
import type { Express } from 'express'

import { createErrorMiddleware } from '#src/shared/infra/http/error-middleware'
import type { Logger } from '#src/shared/infra/http/logger'
import { registerRoutes } from '#src/shared/infra/http/register-routes'
import type { AppDependencies } from '#src/shared/infra/http/types'

export interface AppLocals {
  logger: Logger
}

export const createApp = (dependencies: AppDependencies): Express => {
  const app = express()
  const logger = dependencies.logger

  app.locals['logger'] = logger

  app.use(express.json())
  registerRoutes(app, dependencies)
  app.use(createErrorMiddleware(logger))

  return app
}
