/**
 * Type definitions for route-wizard
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export interface RouteHandler {
  (ctx: any): Promise<any> | any
}

export interface RouteDefinition {
  method: HttpMethod
  path: string
  handler: RouteHandler
  middlewares?: any[]
}

export interface RouteWizardOptions {
  controllersPath?: string
  methodMappings?: Record<string, HttpMethod>
  separator?: string
  ignorePatterns?: string[]
  logEnabled?: boolean
  routePrefix?: string
  enableCache?: boolean
  cacheTtl?: number
  enableWatch?: boolean
  watchOptions?: {
    ignored?: string[]
    persistent?: boolean
    interval?: number
  }
}