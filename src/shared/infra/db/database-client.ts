import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'

export interface DatabaseClient {
  query<ResultRow extends QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<QueryResult<ResultRow>>
}

export const withDatabaseTransaction = async <T>(
  pool: Pool,
  run: (client: PoolClient) => Promise<T>,
): Promise<T> => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await run(client)
    await client.query('COMMIT')

    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
