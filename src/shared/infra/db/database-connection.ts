import { Pool } from 'pg'

export interface DatabaseConnectionOptions {
  connectionString: string
}

export const createDatabasePool = ({ connectionString }: DatabaseConnectionOptions): Pool =>
  new Pool({
    connectionString,
  })
