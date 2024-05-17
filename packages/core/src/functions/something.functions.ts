import { result } from '@mondrian-framework/model'
import { functions } from '@templatetitle/interface'
import { authGuard, dbProvider, setTotalCountProvider } from '../providers'

export const createEntity = functions.createEntity.use({ providers: { db: dbProvider }, guards: { authGuard } }).implement({
  async body({ input: { field1 }, retrieve, db: { prisma } }) {
    const circuit = await prisma.entity.create({
      data: { field1 },
      select: retrieve.select,
    })
    return result.ok(circuit)
  },
})

export const getEntities = functions.getEntities.use({ providers: { db: dbProvider, setTotalCount: setTotalCountProvider } }).implement({
  async body({ input: { search }, retrieve, db: { prisma }, setTotalCount }) {
    const [entities, count] = await prisma.entity.findManyAndCount({ where: { field1: { contains: search } }, ...retrieve })
    setTotalCount(count)
    return result.ok(entities)
  },
})
