import { cron } from '@mondrian-framework/cron'
import { module } from '../'

export const CRON = cron.define({
  module,
  functions: {
    //getEntities: { cron: '0 0 * * *', input: async () => ({ search: '123' }) },
  },
})
