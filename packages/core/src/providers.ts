import { result } from '@mondrian-framework/model'
import { provider } from '@mondrian-framework/module'
import { types } from '@templatetitle/interface'
import { Prisma, PrismaClient } from '@prisma/client'
import { EnvironmentVars } from './envs/envs.type'

type ContextInput = {
  envs: EnvironmentVars
  authorization?: string
  correlationId?: string
  request: {
    driver: 'http' | 'cron'
    ip?: string
  }
  setHeader: (key: string, value: string) => void
}

export const envsProvider = provider.build({
  async body(input: { envs: EnvironmentVars }) {
    return result.ok(input.envs)
  },
})

export async function closeAll(): Promise<void> {
  await prismaClient.$disconnect()
}

export const setTotalCountProvider = provider.build({
  async body({ setHeader }: ContextInput) {
    return result.ok((totalCount: number) => {
      setHeader('x-total-count', totalCount.toString())
    })
  },
})

export type CustomPrismaClient = typeof customPrismaClient

const prismaClient = new PrismaClient()

const natveDbProvider = provider.build({
  async body() {
    return result.ok({ prisma: prismaClient })
  },
})

export const customPrismaClient = prismaClient.$extends({
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>,
      ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
        return prismaClient.$transaction([(this as any).findMany(args), (this as any).count({ where: (args as any).where })]) as any
      },
    },
  },
})

export const dbProvider = provider.use({ providers: { db: natveDbProvider } }).build({
  async body(_: {}, { db: { prisma } }) {
    return result.ok({ prisma: customPrismaClient })
  },
})

export const authGuard = provider.build({
  errors: { Unauthorized: types.Unauthorized },
  async body({ authorization, envs }: ContextInput) {
    const accessToken = authorization?.replace('Bearer ', '')
    if (accessToken === 'ok' && envs.ENVIRONMENT === 'develop') {
      return result.ok()
    }
    return result.fail({ Unauthorized: { reason: 'Wrong authentication' } })
  },
})
