import { readFile } from 'node:fs/promises'

describe('cancel trip request OpenAPI contract', () => {
  it('documents success, validation, not-found, conflict, and internal-error responses', async () => {
    const contract = await readFile(
      new URL('../../../specs/004-cancel-trip-request/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(contract).toContain('/trip-requests/{id}/cancel:')
    expect(contract).toContain('operationId: cancelTripRequest')
    expect(contract).toContain("'200':")
    expect(contract).toContain("'400':")
    expect(contract).toContain("'404':")
    expect(contract).toContain("'409':")
    expect(contract).toContain("'500':")
    expect(contract).toContain('const: TRIP_REQUEST_ALREADY_CANCELED')
    expect(contract).toContain('const: INTERNAL_SERVER_ERROR')
  })
})
