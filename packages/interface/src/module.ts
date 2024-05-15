import { module as m } from '@mondrian-framework/module'
import { Functions, functions } from './functions'

/*
 * Here we are defining the module by passing all the functions that we have defined
 */

type ModuleInterfaceType = ReturnType<typeof m.define<Functions>> //speedups compiler

export const module: ModuleInterfaceType = m.define({
  name: 'my-service-name',
  description: `Some description`,
  functions,
})
