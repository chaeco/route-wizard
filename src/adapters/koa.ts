/**
 * Koa.js adapter for route-wizard
 */

import { routeWizard, RouteWizardOptions } from '../index.js'

// Koa context type (will be available when koa is installed)
interface KoaContext {
  method: string
  url: string
  headers: Record<string, string | string[]>
  request: {
    body?: any
    query?: Record<string, any>
  }
  params?: Record<string, string>
  app?: any
  state?: Record<string, any>
  response: {
    status: number
    headers: Record<string, string>
    body: any
  }
}

type KoaNextFunction = () => Promise<void>

export interface KoaRouteWizardOptions extends RouteWizardOptions {
  /**
   * Koa-specific options
   */
  koaOptions?: {
    /**
     * Whether to use Koa-style error handling
     * @default true
     */
    useErrorHandler?: boolean
  }
}

/**
 * Koa.js middleware adapter for route-wizard
 * Uses route-wizard directly with Koa context
 *
 * @param options Configuration options for route-wizard
 * @returns Koa middleware function
 */
export function koaRouteWizard(options: KoaRouteWizardOptions = {}) {
  const {
    koaOptions = {},
    ...wizardOptions
  } = options

  const { useErrorHandler = true } = koaOptions

  // Get the base route-wizard middleware
  const wizardMiddleware = routeWizard(wizardOptions)

  // Return Koa-compatible middleware
  return async (ctx: KoaContext, next: KoaNextFunction) => {
    try {
      // Call the route-wizard middleware directly with Koa context
      await wizardMiddleware(ctx, next)
    } catch (error) {
      if (useErrorHandler) {
        ctx.response.status = 500
        ctx.response.body = { error: 'Internal Server Error' }
      } else {
        throw error
      }
    }
  }
}