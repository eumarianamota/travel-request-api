import { fileURLToPath } from 'node:url'

import { env } from '#src/config/env'
import { createHolidayValidationService } from '#src/holidays/application/holiday-validation-service'
import { BrasilApiHolidaysGateway } from '#src/holidays/infra/brasil-api-holidays-gateway'
import { SqlHolidayRepository } from '#src/holidays/infra/sql-holiday-repository'
import { createDatabasePool } from '#src/shared/infra/db/database-connection'
import { createApp } from '#src/shared/infra/http/create-app'
import { createLogger } from '#src/shared/infra/http/logger'
import type { Logger } from '#src/shared/infra/http/logger'
import { SqlTripRequestRepository } from '#src/trip-requests/infra/sql-trip-request-repository'

export interface BootstrapContext {
  app: ReturnType<typeof createApp>
  port: number
}

export const buildBootstrapContext = (): BootstrapContext => {
  const logger = createLogger(env.appName)
  const pool = createDatabasePool({
    connectionString: env.databaseUrl,
  })
  const tripRequestRepository = new SqlTripRequestRepository(pool)
  const holidayRepository = new SqlHolidayRepository(pool)
  const holidaysGateway = new BrasilApiHolidaysGateway(env.holidaysApiBaseUrl)
  const holidayValidationService = createHolidayValidationService({
    holidayRepository,
    holidaysGateway,
    logger,
  })

  const app = createApp({
    logger,
    tripRequestRepository,
    holidayValidationService,
    holidayQuery: {
      holidayRepository,
      holidaysGateway,
    },
  })

  return {
    app,
    port: env.appPort,
  }
}

export const bootstrap = (): BootstrapContext => {
  const context = buildBootstrapContext()
  const logger = context.app.locals['logger'] as Logger

  context.app.listen(context.port, () => {
    logger.info(`HTTP server listening on port ${String(context.port)}`)
  })

  return context
}

const isEntrypoint = (): boolean => {
  const entrypoint = process.argv[1]

  if (entrypoint === undefined) {
    return false
  }

  return fileURLToPath(import.meta.url) === entrypoint
}

if (isEntrypoint()) {
  bootstrap()
}
