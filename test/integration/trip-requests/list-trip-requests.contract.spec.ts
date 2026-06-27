import { readFile } from 'node:fs/promises'

describe('list trip requests OpenAPI contract', () => {
  it('documents the list flow success and internal error responses', async () => {
    const contract = await readFile(
      new URL('../../../specs/002-list-trip-requests/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(contract).toContain('/trip-requests:')
    expect(contract).toContain('operationId: listTripRequests')
    expect(contract).toContain("'200':")
    expect(contract).toContain("'500':")
    expect(contract).toContain('data: []')
    expect(contract).toContain('const: INTERNAL_SERVER_ERROR')
  })
})
