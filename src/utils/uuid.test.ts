import { isUuid } from './is'
import { randomUUID } from './uuid'

describe('UUIDError', () => {
  test('UUID', async () => {
    expect(isUuid(randomUUID())).toBeTruthy()
  })
})
