export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void
  warn(message: string, meta?: Record<string, unknown>): void
  error(message: string, meta?: Record<string, unknown>): void
}

const serializeMeta = (meta: Record<string, unknown> | undefined): string =>
  meta === undefined ? '' : ` ${JSON.stringify(meta)}`

export const createLogger = (appName: string): Logger => ({
  info(message, meta) {
    process.stdout.write(`[${appName}] ${message}${serializeMeta(meta)}\n`)
  },
  warn(message, meta) {
    console.warn(`[${appName}] ${message}${serializeMeta(meta)}`)
  },
  error(message, meta) {
    console.error(`[${appName}] ${message}${serializeMeta(meta)}`)
  },
})
