/**
 * Utility functions
 */

import { RouteScanner } from './scanner.js'
import type { RouteDefinition, HttpMethod } from './types.js'

/**
 * Create a logger function based on enabled flag
 * @param enabled Whether logging is enabled
 * @returns Logger function that outputs to console if enabled, otherwise no-op
 */
export function createLogger(enabled: boolean): (...args: any[]) => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return enabled ? console.log : (() => undefined)
}

/**
 * Utility function for auto-registering routes
 * @param controllersPath Path to the controllers directory to scan
 * @param methodMappings Optional custom mapping of file prefixes to HTTP methods
 * @param separator Optional separator used in route file names (default: '-')
 * @param ignorePatterns Optional glob patterns for files to ignore during scanning
 * @param logEnabled Optional flag to enable/disable logging (default: true)
 * @returns Promise resolving to array of discovered route definitions
 */
export async function autoRegisterRoutes(controllersPath: string, methodMappings?: Record<string, HttpMethod>, separator?: string, ignorePatterns?: string[], logEnabled?: boolean): Promise<RouteDefinition[]> {
  const scanner = new RouteScanner(methodMappings, separator, ignorePatterns, logEnabled)
  const routes = await scanner.scanDirectory(controllersPath)
  return routes
}

/**
 * Register routes to app
 * @param app The application instance to register routes to
 * @param routes Array of route definitions to register
 * @param logEnabled Whether to enable logging during registration (default: true)
 */
export function registerRoutesToApp(app: any, routes: RouteDefinition[], logEnabled: boolean = true): void {
  const log = createLogger(logEnabled)
  routes.forEach(route => {
    try {
      // 使用通用路由注册方式
      // 假设app支持方法 + 路径的方式注册路由
      const routeMethod = route.method.toLowerCase()
      if (app[routeMethod]) {
        if (route.middlewares && route.middlewares.length > 0) {
          // 有中间件的情况
          app[routeMethod](route.path, ...route.middlewares, route.handler)
        } else {
          // 没有中间件的情况
          app[routeMethod](route.path, route.handler)
        }
        log(`✅ Route registered successfully: ${route.method} ${route.path}`)
      } else {
        log(`❌ Unsupported HTTP method: ${route.method}`)
      }
    } catch (error) {
      log(`❌ Failed to register route: ${route.method} ${route.path}`, error)
    }
  })
}