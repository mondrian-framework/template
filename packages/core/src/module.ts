import { module as moduleInterface } from '@templatetitle/interface'
import { Functions, functions } from './functions'
import { decoding } from '@mondrian-framework/model'

export const module: ReturnType<typeof moduleInterface.implement<Functions>> = moduleInterface.implement({
  functions,
  options: {
    checkOutputType: 'throw',
    maxSelectionDepth: 4,
    opentelemetry: true,
    resolveNestedPromises: true,
    preferredDecodingOptions: getPreferredDecodingOptions(),
  },
})

function getPreferredDecodingOptions(): decoding.Options {
  if (process.env.ENVIRONMENT === 'production') {
    return {
      errorReportingStrategy: 'stopAtFirstError',
      fieldStrictness: 'allowAdditionalFields',
      typeCastingStrategy: 'tryCasting',
    }
  } else {
    return {
      errorReportingStrategy: 'allErrors',
      fieldStrictness: 'expectExactFields',
      typeCastingStrategy: 'expectExactTypes',
    }
  }
}
