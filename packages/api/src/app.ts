import { randomUUID } from 'crypto'
import { start as startCron } from '@mondrian-framework/cron'
import { serveWithFastify as serveGraphql } from '@mondrian-framework/graphql-yoga'
import { module as m } from '@mondrian-framework/module'
import { serve as serveRest } from '@mondrian-framework/rest-fastify'
import { module, EnvironmentVars } from '@monetica/core'
import { api } from '@monetica/interface'
import { FastifyReply, FastifyRequest, fastify } from 'fastify'

function parseEnv(): EnvironmentVars {
  const envsResult = EnvironmentVars.decode(process.env, {
    typeCastingStrategy: 'tryCasting',
    errorReportingStrategy: 'allErrors',
    fieldStrictness: 'allowAdditionalFields',
  })
  if (!envsResult.isOk) {
    throw new Error(`Invalid envs: ${JSON.stringify(envsResult.error)}`)
  }
  return envsResult.value
}

function createServer(envs: EnvironmentVars) {
  //build context input from request
  async function buildContextFromRequest({ request, reply }: { request: FastifyRequest; reply: FastifyReply }): Promise<m.ModuleContextInput<typeof module>> {
    const flatHeader = (header: string | string[] | undefined) => (Array.isArray(header) ? header.join(',') : header)
    const correlationId = flatHeader(request.headers?.['X-Correlation-ID'])
    return {
      authorization: request.headers.authorization,
      envs,
      correlationId,
      request: {
        driver: 'http',
        ip: request.ip,
      },
      setHeader: (key: string, value: string) => reply.header(key, value),
    }
  }

  const server = fastify()
  server.get('/healthcheck', async () => ({ status: 'ok' }))

  //Attach rest and graphql APIs
  serveRest({
    server,
    api: { ...api.REST, module },
    context: buildContextFromRequest,
    async onError({ error, functionName }) {
      //Here we can handle the unexpected errors coming from functions, should not happen
      if (envs.ENVIRONMENT === 'develop') {
        return { status: 500, body: { functionName, error } }
      }
      return { status: 500, body: 'Internal server error' } //hide details
    },
    options: { introspection: { path: '/openapi' } },
  })
  serveGraphql({
    server,
    api: { ...api.GRAPHQL, module },
    context: buildContextFromRequest,
    async onError({ error, functionName }) {
      //Here we can handle the unexpected errors coming from functions, should not happen
      if (envs.ENVIRONMENT === 'develop') {
        return
      }
      return { message: 'Internal server error' }
    },
    options: { introspection: true },
  })

  //starts the cron jobs
  startCron({
    api: { ...api.CRON, module },
    async context() {
      return {
        envs,
        request: { driver: 'cron' } as const,
        operationId: randomUUID(),
        setHeader(key, value) {},
      }
    },
  })
  return server
}

const envs = parseEnv()
const server = createServer(envs)
server.listen({ port: 4000, host: '0.0.0.0' }).then((address) => {
  console.log(`Module "${module.name}" has started!\n${address}/openapi\n${address}/graphql`)
})
