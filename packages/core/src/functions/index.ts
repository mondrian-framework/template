import { functions as fn } from '@mondrian-framework/module'
import * as something from './something.functions'

export type Functions = typeof something /* & typeof something2 */

export const functions: Functions = {
  ...something,
  // ...something2,
} satisfies fn.Functions
