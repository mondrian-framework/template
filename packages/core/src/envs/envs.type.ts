import { model } from '@mondrian-framework/model'

/**
 * Here we are defining the environment variables that the module will use.
 * We'll parse process.env inside package/api/src/app.ts before the module startup.
 */
export const EnvironmentVars = model.object({
  ENVIRONMENT: model.enumeration(['develop', 'staging', 'production']),
  DATABASE_URL: model.string({ minLength: 1 }),
})
export type EnvironmentVars = model.Infer<typeof EnvironmentVars>
