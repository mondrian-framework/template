import { functions as fn } from '@mondrian-framework/module'
import * as something from './something.definitions'

/*
 * Here we import all functions definitions and merge them to a single object and a single type
 * This we'll be used inside the module definition (see packages/interface/src/module.ts)
 */

export type Functions = typeof something /* & typeof something2 */ //this speeds up compiler

export const functions: Functions = {
  ...something,
  //...something2,
} satisfies fn.FunctionInterfaces
