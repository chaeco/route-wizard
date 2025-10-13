/**
 * Fastify adapter for route-wizard
 */

import { routeWizard, RouteWizardOptions } from '../index.js'

export interface FastifyRouteWizardOptions extends RouteWizardOptions {
  /**
   * Fastify-specific options
   */
  fastifyOptions?: {
    /**
     * Whether to use Fastify-style error handling
     * @default true
     */
    useErrorHandler?: boolean
  }
}

/**
 * Fastify plugin for route-wizard
 * Automatically registers routes from controllers directory
 *
 * @param fastify Fastify instance
 * @param options Configuration options for route-wizard
 * @param done Callback to signal plugin registration completion
 */
export function fastifyRouteWizard(fastify: any, options: FastifyRouteWizardOptions = {}, done: () => void) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const {
    fastifyOptions = {},
    ...wizardOptions
  } = options

  const { useErrorHandler = true } = fastifyOptions

  // Get the base route-wizard middleware
  const wizardMiddleware = routeWizard(wizardOptions)

  // Create a context that will be used for route registration
  const ctx = {
    app: fastify,
    method: '',
    url: '',
    headers: {},
    query: {},
    params: {},
    body: null,
    state: {}
  }

  // Call route-wizard to register routes
  wizardMiddleware(ctx, (error?: Error) => {
    if (error) {
      if (useErrorHandler) {
        fastify.log.error(error)
      }
      done()
      return
    }

    done()
  })
}