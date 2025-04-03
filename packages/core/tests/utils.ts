import { randomUUID } from 'crypto'
import { client } from '@mondrian-framework/module'
import { module, EnvironmentVars } from '../src/index.js'
import { Functions } from '../src/functions/index.js'

export function getSdk({ authorization }: { authorization: string }): client.Client<Functions, unknown> {
  const envsResult = EnvironmentVars.decode(process.env, {
    typeCastingStrategy: 'tryCasting',
    errorReportingStrategy: 'allErrors',
    fieldStrictness: 'allowAdditionalFields',
  })
  if (!envsResult.isOk) {
    throw new Error(`Invalid envs: ${JSON.stringify(envsResult.error)}`)
  }
  return client.build({
    module,
    context: async () => ({
      envs: envsResult.value,
      operationId: randomUUID(),
      authorization: `Bearer ${authorization}`,
      request: { ip: 'test', driver: 'http' } as const,
      setHeader() {},
    }),
  })
}

export async function initializeTestEnvs(): Promise<void> {
  process.env.ENVIRONMENT = 'develop'
  process.env.DATABASE_URL = 'TODO'
  // Add any other required environment variables for testing
}
