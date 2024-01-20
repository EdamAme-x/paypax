import { isUuid } from './is.ts'
import { randomUUID } from './uuid.ts'

describe('UUIDError', () => {
  test('UUID', async () => {
    expect(isUuid(randomUUID())).toBeTruthy()
  })
})
