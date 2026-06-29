import { readFile } from 'node:fs/promises'

describe('get holidays OpenAPI contract', () => {
  it('documents the holiday query success and error responses', async () => {
    const contract = await readFile(
      new URL('../../../specs/005-query-national-holidays/contracts/openapi.yaml', import.meta.url),
      'utf8',
    )

    expect(contract).toContain('/holidays/{year}:')
    expect(contract).toContain("'200':")
    expect(contract).toContain("'400':")
    expect(contract).toContain("'502':")
    expect(contract).toContain("'500':")
    expect(contract).toContain('const: VALIDATION_ERROR')
    expect(contract).toContain('const: HOLIDAYS_API_UNAVAILABLE')
    expect(contract).toContain('const: INTERNAL_SERVER_ERROR')
  })
})
