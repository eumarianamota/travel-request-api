import process from 'node:process'

import type * as EnvModule from '#src/config/env'
import type * as MainModule from '#src/main'

const originalEnv = { ...process.env }

const restoreEnv = (): void => {
  process.env = { ...originalEnv }
}

const clearAppEnv = (): void => {
  delete process.env['NODE_ENV']
  delete process.env['APP_NAME']
  delete process.env['APP_PORT']
  delete process.env['DATABASE_URL']
  delete process.env['HOLIDAYS_API_BASE_URL']
}

const loadEnvModule = async (): Promise<typeof EnvModule> => {
  vi.resetModules()
  vi.doMock('dotenv/config', () => ({}))

  return import('#src/config/env')
}

const loadMainModule = async (): Promise<typeof MainModule> => {
  vi.resetModules()
  vi.doMock('dotenv/config', () => ({}))

  return import('#src/main')
}

const mutableEnv = (): Record<string, string | undefined> => process.env as Record<string, string | undefined>

describe('environment configuration', () => {
  beforeEach(() => {
    restoreEnv()
    clearAppEnv()
  })

  afterEach(() => {
    restoreEnv()
    vi.restoreAllMocks()
    vi.doUnmock('dotenv/config')
  })

  it('uses safe defaults when environment variables are missing', async () => {
    const { env } = await loadEnvModule()

    expect(env).toStrictEqual({
      nodeEnv: 'development',
      appName: 'ts-project',
      appPort: 3030,
      databaseUrl: 'postgresql://postgres:postgres@localhost:5432/travel_request_api',
      holidaysApiBaseUrl: 'https://brasilapi.com.br',
    })
  })

  it('parses valid environment variables', async () => {
    process.env['NODE_ENV'] = 'production'
    process.env['APP_NAME'] = 'professional-template'
    process.env['APP_PORT'] = '8080'
    process.env['DATABASE_URL'] = 'postgresql://localhost:5432/app'
    process.env['HOLIDAYS_API_BASE_URL'] = 'https://example.com'

    const { env } = await loadEnvModule()

    expect(env).toStrictEqual({
      nodeEnv: 'production',
      appName: 'professional-template',
      appPort: 8080,
      databaseUrl: 'postgresql://localhost:5432/app',
      holidaysApiBaseUrl: 'https://example.com',
    })
  })

  it('throws for an invalid NODE_ENV', async () => {
    mutableEnv()['NODE_ENV'] = 'prod'

    await expect(loadEnvModule()).rejects.toThrow('Invalid NODE_ENV: prod')
  })

  it('throws for an invalid APP_PORT', async () => {
    process.env['NODE_ENV'] = 'test'
    process.env['APP_PORT'] = '0'

    await expect(loadEnvModule()).rejects.toThrow('Invalid APP_PORT')
  })

  it('throws for an invalid DATABASE_URL', async () => {
    process.env['NODE_ENV'] = 'test'
    process.env['DATABASE_URL'] = ''

    await expect(loadEnvModule()).rejects.toThrow('Invalid DATABASE_URL')
  })
})

describe('bootstrap', () => {
  beforeEach(() => {
    restoreEnv()
    process.env['NODE_ENV'] = 'test'
    process.env['APP_NAME'] = 'ts-project'
    process.env['APP_PORT'] = '3030'
    process.env['DATABASE_URL'] = 'postgresql://localhost:5432/app'
    process.env['HOLIDAYS_API_BASE_URL'] = 'https://example.com'
  })

  afterEach(() => {
    restoreEnv()
    vi.restoreAllMocks()
    vi.doUnmock('dotenv/config')
  })

  it('builds the application context from environment configuration', async () => {
    const { buildBootstrapContext } = await loadMainModule()

    const context = buildBootstrapContext()

    expect(context.port).toBe(3030)
    expect(typeof context.app.post).toBe('function')
    expect(typeof context.app.get).toBe('function')
  })
})
