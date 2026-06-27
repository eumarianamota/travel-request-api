import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { env } from '#src/config/env'
import { createDatabasePool } from '#src/shared/infra/db/database-connection'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

export const runSchema = async (): Promise<void> => {
  const pool = createDatabasePool({
    connectionString: env.databaseUrl,
  })

  try {
    const schema = await readFile(path.join(currentDir, 'schema.sql'), 'utf8')
    await pool.query(schema)
  } finally {
    await pool.end()
  }
}

void runSchema()
