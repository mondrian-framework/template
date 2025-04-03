import { model } from '@mondrian-framework/model'
import { error, functions } from '@mondrian-framework/module'
import { SomeEntity, BadRequest, Unauthorized } from '../types/index.js'

/*
 * Here we can define any other functions that we want to use in our service
 * We can also split them in multiple files and import in index.ts
 */

export const createEntity = functions.define({
  input: model.object({ field1: model.string() }, { name: 'SomeEntityInput' }),
  output: SomeEntity,
  retrieve: { select: true },
  errors: { BadInput: error.standard.BadInput, BadRequest, Unauthorized },
  options: {
    namespace: 'somenamespace',
    description: 'Create an entity',
  },
})

export const getEntities = functions.define({
  input: model.object({ search: model.string({ maxLength: 1024 }).optional() }, { name: 'GetEntitiesInput' }),
  output: model.array(SomeEntity),
  retrieve: { select: true, orderBy: true, skip: true, take: true },
  errors: { BadInput: error.standard.BadInput, Unauthorized },
  options: { namespace: 'somenamespace', description: 'Retrieve some entities' },
})
