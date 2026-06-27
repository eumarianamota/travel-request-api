import { readFile } from 'node:fs/promises'

describe('create trip request OpenAPI contract', () => {
  it('documents the create flow success and error responses', async () => {
    const contract = await readFile(
      new URL('../../../specs/001-create-trip-request/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(contract).toContain('/trip-requests:')
    expect(contract).toContain("'201':")
    expect(contract).toContain("'400':")
    expect(contract).toContain("'409':")
    expect(contract).toContain("'502':")
    expect(contract).toContain("'500':")
    expect(contract).toContain('const: VALIDATION_ERROR')
    expect(contract).toContain('const: HOLIDAY_TRIP_NOT_ALLOWED')
    expect(contract).toContain('const: HOLIDAYS_API_UNAVAILABLE')
    expect(contract).toContain('const: INTERNAL_SERVER_ERROR')
  })
})
