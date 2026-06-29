import { readFile } from 'node:fs/promises'

describe('list trip requests OpenAPI contract', () => {
  it('documents the list flow success and internal error responses', async () => {
    const listContract = await readFile(
      new URL('../../../specs/002-list-trip-requests/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )
    const errorContract = await readFile(
      new URL('../../../specs/007-standardize-error-responses/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )
    const successContract = await readFile(
      new URL('../../../specs/006-standardize-success-responses/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(listContract).toContain('/trip-requests:')
    expect(listContract).toContain('operationId: listTripRequests')
    expect(listContract).toContain("'200':")
    expect(listContract).toContain("'500':")
    expect(listContract).toContain('data: []')
    expect(listContract).toContain('const: INTERNAL_SERVER_ERROR')
    expect(errorContract).toContain('/trip-requests:')
    expect(errorContract).toContain('operationId: listTripRequests')
    expect(errorContract).toContain("'500':")
    expect(errorContract).toContain('InternalServerErrorResponse')
    expect(successContract).toContain('/trip-requests:')
    expect(successContract).toContain('TripRequestListSuccessResponse')
    expect(successContract).toContain('const: true')
  })
})
