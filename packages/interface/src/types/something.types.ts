import { model } from '@mondrian-framework/model'
import { ObjectId } from './scalars.types'

/*
 * Here we are defining all the types that will be used in the module.
 * Can be splitted in multiple files, just remember to export all types in the index.ts file
 */

export const SomeEntity = () =>
  model.entity(
    {
      id: ObjectId,
      field1: model.string(),
    },
    {
      description: 'Some entity definition...',
      retrieve: {
        orderBy: { id: true, field1: true },
        skip: true,
        take: true,
      },
    },
  )
export type SomeEntity = model.Infer<typeof SomeEntity>
