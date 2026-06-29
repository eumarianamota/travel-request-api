import { readFile } from 'node:fs/promises'

describe('get holidays OpenAPI contract', () => {
  it('documents the holiday query success and error responses', async () => {
    const holidaysContract = await readFile(
      new URL('../../../specs/005-query-national-holidays/contracts/openapi.yaml', import.meta.url),
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

    expect(holidaysContract).toContain('/holidays/{year}:')
    expect(holidaysContract).toContain("'200':")
    expect(holidaysContract).toContain("'400':")
    expect(holidaysContract).toContain("'502':")
    expect(holidaysContract).toContain("'500':")
    expect(holidaysContract).toContain('const: VALIDATION_ERROR')
    expect(holidaysContract).toContain('const: HOLIDAYS_API_UNAVAILABLE')
    expect(holidaysContract).toContain('const: INTERNAL_SERVER_ERROR')
    expect(errorContract).toContain('/holidays/{year}:')
    expect(errorContract).toContain('operationId: listNationalHolidaysByYear')
    expect(errorContract).toContain("'400':")
    expect(errorContract).toContain("'502':")
    expect(errorContract).toContain("'500':")
    expect(errorContract).toContain('ValidationErrorResponse')
    expect(errorContract).toContain('HolidaysApiUnavailableErrorResponse')
    expect(errorContract).toContain('InternalServerErrorResponse')
    expect(successContract).toContain('/holidays/{year}:')
    expect(successContract).toContain('HolidayListSuccessResponse')
    expect(successContract).toContain('const: true')
  })
})
