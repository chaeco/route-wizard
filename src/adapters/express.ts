/**
 * Express.js adapter for route-wizard
 */

import { routeWizard, RouteWizardOptions } from '../index.js'

// Express types (will be available when express is installed)
interface ExpressRequest {
  method: string
  url: string
  headers: Record<string, string | string[]>
  body?: any
  query?: Record<string, any>
  params?: Record<string, string>
  app?: any
}

interface ExpressResponse {
  status(code: number): this
  setHeader(name: string, value: string): this
  json(data: any): void
  send(data: any): void
}

type ExpressNextFunction = (error?: any) => void

export interface ExpressRouteWizardOptions extends RouteWizardOptions {
  /**
   * Express-specific options
   */
  expressOptions?: {
    /**
     * Whether to use Express-style error handling
     * @default true
     */
    useErrorHandler?: boolean
  }
}

/**
 * Express.js middleware adapter for route-wizard
 * Converts route-wizard middleware to Express-compatible middleware
 *
 * @param options Configuration options for route-wizard
 * @returns Express middleware function
 */
export function expressRouteWizard(options: ExpressRouteWizardOptions = {}) {
  const {
    expressOptions = {},
    ...wizardOptions
  } = options

  const { useErrorHandler = true } = expressOptions

  // Get the base route-wizard middleware
  const wizardMiddleware = routeWizard(wizardOptions)

  // Return Express-compatible middleware
  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
      // Create a context object that mimics Express request/response
      const ctx = {
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
          query: req.query,
          params: req.params,
        },
        response: {
          status: 200,
          headers: {},
          body: null,
        },
        state: {},
        app: req.app,
      }

      // Call the route-wizard middleware
      await wizardMiddleware(ctx as any, next)

      // If route was handled, convert back to Express response
      if (ctx.response.body !== null) {
        res.status(ctx.response.status)

        // Set headers
        Object.entries(ctx.response.headers).forEach(([key, value]) => {
          res.setHeader(key, value as string)
        })

        // Send response body
        if (typeof ctx.response.body === 'object') {
          res.json(ctx.response.body)
        } else {
          res.send(ctx.response.body)
        }
      } else {
        // Route not handled, continue to next middleware
        next()
      }
    } catch (error) {
      if (useErrorHandler) {
        next(error)
      } else {
        throw error
      }
    }
  }
}