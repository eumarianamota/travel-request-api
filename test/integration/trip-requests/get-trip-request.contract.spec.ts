import { readFile } from 'node:fs/promises'

describe('get trip request OpenAPI contract', () => {
  it('documents success, validation, not-found, and internal-error responses', async () => {
    const getContract = await readFile(
      new URL('../../../specs/003-get-trip-request/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )
    const successContract = await readFile(
      new URL('../../../specs/006-standardize-success-responses/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(getContract).toContain('/trip-requests/{id}:')
    expect(getContract).toContain('operationId: getTripRequestById')
    expect(getContract).toContain("'200':")
    expect(getContract).toContain("'400':")
    expect(getContract).toContain("'404':")
    expect(getContract).toContain("'500':")
    expect(getContract).toContain('const: TRIP_REQUEST_NOT_FOUND')
    expect(getContract).toContain('const: INTERNAL_SERVER_ERROR')
    expect(successContract).toContain('/trip-requests/{id}:')
    expect(successContract).toContain('TripRequestObjectSuccessResponse')
    expect(successContract).toContain('const: true')
  })
})
