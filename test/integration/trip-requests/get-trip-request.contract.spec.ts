import { readFile } from 'node:fs/promises'

describe('get trip request OpenAPI contract', () => {
  it('documents success, validation, not-found, and internal-error responses', async () => {
    const contract = await readFile(
      new URL('../../../specs/003-get-trip-request/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(contract).toContain('/trip-requests/{id}:')
    expect(contract).toContain('operationId: getTripRequestById')
    expect(contract).toContain("'200':")
    expect(contract).toContain("'400':")
    expect(contract).toContain("'404':")
    expect(contract).toContain("'500':")
    expect(contract).toContain('const: TRIP_REQUEST_NOT_FOUND')
    expect(contract).toContain('const: INTERNAL_SERVER_ERROR')
  })
})
