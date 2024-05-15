import { graphql } from '@mondrian-framework/graphql'
import { module } from '../'

/*
 * Here we are defining the graphql API. Just define which functions you want to expose through graphql.
 */

export const GRAPHQL = graphql.define({
  module,
  functions: {
    getEntities: { type: 'query', name: 'entities' },
    createEntity: { type: 'mutation' },
  },
})
