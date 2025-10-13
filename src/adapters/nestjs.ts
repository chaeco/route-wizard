/**
 * NestJS adapter for route-wizard
 */

import { routeWizard, RouteWizardOptions } from '../index.js'

// NestJS context type (will be available when @nestjs/common is installed)
interface NestJSRequest {
  method: string
  url: string
  headers: Record<string, string | string[]>
  query: Record<string, unknown>
  params: Record<string, string>
  body?: unknown
  raw: {
    method: string
    url: string
    headers: Record<string, string | string[]>
  }
}

interface NestJSResponse {
  status(code: number): NestJSResponse
  header(name: string, value: string | string[]): NestJSResponse
  send(payload?: unknown): NestJSResponse
  json(payload?: unknown): NestJSResponse
  type(type: string): NestJSResponse
  statusCode: number
  headers: Record<string, string | string[]>
}

type NestJSNextFunction = () => void

export interface NestJSRouteWizardOptions extends RouteWizardOptions {
  /**
   * NestJS-specific options
   */
  nestjsOptions?: {
    /**
     * Whether to use NestJS-style error handling
     * @default true
     */
    useErrorHandler?: boolean
  }
}

/**
 * NestJS middleware adapter for route-wizard
 * Uses route-wizard directly with NestJS request/response objects
 *
 * @param options Configuration options for route-wizard
 * @returns NestJS middleware function
 */
export function nestjsRouteWizard(options: NestJSRouteWizardOptions = {}) {
  const {
    nestjsOptions = {},
    ...wizardOptions
  } = options

  const { useErrorHandler = true } = nestjsOptions

  // Get the base route-wizard middleware
  const wizardMiddleware = routeWizard(wizardOptions)

  // Return NestJS-compatible middleware
  return async (req: NestJSRequest, res: NestJSResponse, next: NestJSNextFunction) => {
    try {
      // Create a context object that mimics the structure expected by route-wizard
      const ctx = {
        req,
        res,
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body
      }

      // Call the route-wizard middleware with the adapted context
      await wizardMiddleware(ctx, next)
    } catch {
      if (useErrorHandler) {
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        next()
      }
    }
  }
}