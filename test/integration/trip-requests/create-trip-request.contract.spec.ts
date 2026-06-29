import { readFile } from 'node:fs/promises'

describe('create trip request OpenAPI contract', () => {
  it('documents the create flow success and error responses', async () => {
    const createContract = await readFile(
      new URL('../../../specs/001-create-trip-request/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )
    const successContract = await readFile(
      new URL('../../../specs/006-standardize-success-responses/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(createContract).toContain('/trip-requests:')
    expect(createContract).toContain("'201':")
    expect(createContract).toContain("'400':")
    expect(createContract).toContain("'409':")
    expect(createContract).toContain("'502':")
    expect(createContract).toContain("'500':")
    expect(createContract).toContain('const: VALIDATION_ERROR')
    expect(createContract).toContain('const: HOLIDAY_TRIP_NOT_ALLOWED')
    expect(createContract).toContain('const: HOLIDAYS_API_UNAVAILABLE')
    expect(createContract).toContain('const: INTERNAL_SERVER_ERROR')
    expect(successContract).toContain('/trip-requests:')
    expect(successContract).toContain("'201':")
    expect(successContract).toContain('TripRequestObjectSuccessResponse')
    expect(successContract).toContain('const: true')
  })
})
