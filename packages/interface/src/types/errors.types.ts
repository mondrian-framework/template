import { model } from '@mondrian-framework/model'
import { error } from '@mondrian-framework/module'

/*
 * Here we are defining all the error types that will be used in the module
 * This are similar to the mondrian types but we are using error.define instead of model.define
 */

export const { Unauthorized, BadRequest } = error.define({
  Unauthorized: { message: 'Authorization required', reason: model.string() },
  BadRequest: { message: 'Bad request', reason: model.string().optional() },
  //others...
})

export type Unauthorized = model.Infer<typeof Unauthorized>
export type BadRequest = model.Infer<typeof BadRequest>
