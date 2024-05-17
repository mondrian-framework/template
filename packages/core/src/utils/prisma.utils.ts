import { result } from '@mondrian-framework/model'
import { CustomPrismaClient } from '../providers'

class TransactionError<T> extends Error {
  public readonly e: T
  constructor(e: T) {
    super('Transaction failed')
    this.e = e
  }
}

/**
 * Execute many operations in a single transaction.
 * This utility is useful when you need to abort the transaction in case of a fail return.
 */
export async function transact<T>(
  prisma: CustomPrismaClient,
  f: (tx: CustomPrismaClient) => Promise<T>,
  options?: {
    maxWait?: number
    timeout?: number
  },
): Promise<T> {
  try {
    const res = await prisma.$transaction(async (tx) => {
      const res = await f(tx as CustomPrismaClient)
      if (res instanceof result.Failure) {
        throw new TransactionError(res.error)
      }
      return res
    }, options)
    return res
  } catch (e) {
    if (e instanceof TransactionError) {
      return result.fail(e.e) as T
    } else {
      throw e
    }
  }
}
