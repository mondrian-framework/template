import { rest } from '@mondrian-framework/rest'
import { module } from '../index.js'

/*
 * Here we are defining the REST API. Just define which functions you want to expose through REST.
 */

const getManyHeaders = {
  'x-total-count': { schema: { type: 'integer' }, description: 'Total elemets that was found with the current query' },
} as const

export const REST = rest.define({
  module,
  version: 1,
  functions: {
    createEntity: { method: 'post', path: '/entities', security: [{ TSID: [] }] },
    getEntities: { method: 'get', path: '/entities', responseHeaders: getManyHeaders },
  },
  securities: {
    TSID: { type: 'http', scheme: 'bearer' },
  },
  errorCodes: {
    BadRequest: 400,
    BadInput: 400,
    Unauthorized: 401,
  },
})
