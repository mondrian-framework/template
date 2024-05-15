import { randomUUID } from 'crypto'
import { result } from '@mondrian-framework/model'
import { sdk } from '@mondrian-framework/module'
import { module, EnvironmentVars } from '../src'
import { Functions } from '../src/functions'

export function getSdk({ authorization }: { authorization: string }): sdk.Sdk<Functions, unknown> {
  const envsResult = EnvironmentVars.decode(process.env, {
    typeCastingStrategy: 'tryCasting',
    errorReportingStrategy: 'allErrors',
    fieldStrictness: 'allowAdditionalFields',
  })
  if (!envsResult.isOk) {
    throw new Error(`Invalid envs: ${JSON.stringify(envsResult.error)}`)
  }
  return sdk.build({
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
}
