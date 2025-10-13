/**
 * Hoa.js adapter for route-wizard
 */

import { routeWizard, RouteWizardOptions } from '../index.js'

// Hoa context type (will be available when hoa is installed)
interface HoaContext {
  req: {
    method: string
    url: string
    href: string
    pathname: string
    search: string
    query: Record<string, string | string[]>
    headers: Record<string, string | string[]>
    body?: unknown
    ip?: string
  }
  res: {
    status: number
    statusText: string
    headers: Record<string, string>
    body: unknown
    type?: string
    length?: number
  }
  app?: Record<string, unknown>
  state?: Record<string, unknown>
  throw(status: number, message?: string): never
}

type HoaNextFunction = () => Promise<void>

export interface HoaRouteWizardOptions extends RouteWizardOptions {
  /**
   * Hoa-specific options
   */
  hoaOptions?: {
    /**
     * Whether to use Hoa-style error handling
     * @default true
     */
    useErrorHandler?: boolean
  }
}

/**
 * Hoa.js middleware adapter for route-wizard
 * Uses route-wizard directly with Hoa context
 *
 * @param options Configuration options for route-wizard
 * @returns Hoa middleware function
 */
export function hoaRouteWizard(options: HoaRouteWizardOptions = {}) {
  const {
    hoaOptions = {},
    ...wizardOptions
  } = options

  const { useErrorHandler = true } = hoaOptions

  // Get the base route-wizard middleware
  const wizardMiddleware = routeWizard(wizardOptions)

  // Return Hoa-compatible middleware
  return async (ctx: HoaContext, next: HoaNextFunction) => {
    try {
      // Call the route-wizard middleware directly with Hoa context
      await wizardMiddleware(ctx, next)
    } catch (error) {
      if (useErrorHandler) {
        ctx.res.status = 500
        ctx.res.body = { error: 'Internal Server Error' }
      } else {
        throw error
      }
    }
  }
}