import { readFile } from 'node:fs/promises'

describe('cancel trip request OpenAPI contract', () => {
  it('documents success, validation, not-found, conflict, and internal-error responses', async () => {
    const cancelContract = await readFile(
      new URL('../../../specs/004-cancel-trip-request/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )
    const successContract = await readFile(
      new URL('../../../specs/006-standardize-success-responses/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(cancelContract).toContain('/trip-requests/{id}/cancel:')
    expect(cancelContract).toContain('operationId: cancelTripRequest')
    expect(cancelContract).toContain("'200':")
    expect(cancelContract).toContain("'400':")
    expect(cancelContract).toContain("'404':")
    expect(cancelContract).toContain("'409':")
    expect(cancelContract).toContain("'500':")
    expect(cancelContract).toContain('const: TRIP_REQUEST_ALREADY_CANCELED')
    expect(cancelContract).toContain('const: INTERNAL_SERVER_ERROR')
    expect(successContract).toContain('/trip-requests/{id}/cancel:')
    expect(successContract).toContain('TripRequestObjectSuccessResponse')
    expect(successContract).toContain('const: true')
  })
})
