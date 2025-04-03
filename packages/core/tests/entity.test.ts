import { getSdk, initializeTestEnvs } from './utils.js'

beforeAll(async () => {
  await initializeTestEnvs()
})

test('Create entity', async () => {
  const sdk = getSdk({ authorization: 'ok' })
  const res = await sdk.functions.createEntity({ field1: 'test' })
  expect(res.isOk && res.value.field1).toEqual('test')
})
