import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

import type { Express } from 'express'

export const withTestServer = async <T>(
  app: Express,
  run: (baseUrl: string) => Promise<T>,
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const server = createServer(app)

    server.listen(0, '127.0.0.1', () => {
      const address = server.address() as AddressInfo
      const baseUrl = `http://127.0.0.1:${String(address.port)}`

      void run(baseUrl)
        .then((result) => {
          server.close((closeError) => {
            if (closeError) {
              reject(closeError)
              return
            }

            resolve(result)
          })
        })
        .catch((error: unknown) => {
          const rejectionError = error instanceof Error ? error : new Error(String(error))

          server.close(() => {
            reject(rejectionError)
          })
        })
    })
  })

export const getJson = async (baseUrl: string, path: string): Promise<Response> => fetch(`${baseUrl}${path}`)

export const patchJson = async (baseUrl: string, path: string): Promise<Response> =>
  fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
    },
  })
