import 'dotenv/config'

export type NodeEnv = 'development' | 'test' | 'production'

export interface Env {
  nodeEnv: NodeEnv
  appName: string
  appPort: number
  databaseUrl: string
  holidaysApiBaseUrl: string
}

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  if (value === 'development' || value === 'test' || value === 'production') {
    return value
  }

  throw new Error(`Invalid NODE_ENV: ${String(value)}`)
}

const parsePort = (value: string | undefined): number => {
  const port = Number(value)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Invalid APP_PORT')
  }

  return port
}

const parseRequiredString = (value: string | undefined, envName: string): string => {
  if (value === undefined || value.trim() === '') {
    throw new Error(`Invalid ${envName}`)
  }

  return value
}

export const env: Env = {
  nodeEnv: parseNodeEnv(process.env['NODE_ENV'] ?? 'development'),
  appName: process.env['APP_NAME'] ?? 'ts-project',
  appPort: parsePort(process.env['APP_PORT'] ?? '3030'),
  databaseUrl: parseRequiredString(
    process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/travel_request_api',
    'DATABASE_URL',
  ),
  holidaysApiBaseUrl: parseRequiredString(
    process.env['HOLIDAYS_API_BASE_URL'] ?? 'https://brasilapi.com.br',
    'HOLIDAYS_API_BASE_URL',
  ),
}
