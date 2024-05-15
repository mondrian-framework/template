import { model } from '@mondrian-framework/model'

/*
 * Here we are defining all the scalar types that will be used in the module
 */

export const ObjectId = model.string({
  regex: /^[0-9a-f]{24}$/,
  description: '12 bytes (hex)',
  name: 'ObjectId',
})
export type ObjectId = model.Infer<typeof ObjectId>
