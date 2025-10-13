/**
 * Middleware functions
 */

import { join } from 'path'
import { watch } from 'fs'
import { RouteScanner } from './scanner.js'
import { createLogger } from './utils.js'
import type { RouteWizardOptions, RouteDefinition } from './types.js'

/**
 * Create auto-route registration middleware
 * @param {RouteWizardOptions} [options={}] Configuration options for route registration
 * @param {string} [options.controllersPath='./controllers'] Path to the controllers directory
 * @param {Record<string, string>} [options.methodMappings] Custom mapping of file prefixes to HTTP methods
 * @param {string} [options.separator='-'] Separator used in route file names
 * @param {string[]} [options.ignorePatterns] Glob patterns for files to ignore during scanning
 * @param {boolean} [options.logEnabled=true] Whether to enable logging of route registration process
 * @param {string} [options.routePrefix=''] Prefix to add to all generated routes
 * @param {boolean} [options.enableCache=true] Whether to enable route caching for performance
 * @param {number} [options.cacheTtl=30000] Cache time-to-live in milliseconds
 * @param {boolean} [options.enableWatch=false] Whether to enable file watching for hot reload
 * @param {Object} [options.watchOptions] Options for file watching
 * @param {string[]} [options.watchOptions.ignored] Files to ignore during watching
 * @param {boolean} [options.watchOptions.persistent=true] Whether watching should be persistent
 * @param {number} [options.watchOptions.interval] Watching interval in milliseconds
 * @returns {Function} Middleware function that automatically registers routes
 */
export function routeWizard(options: RouteWizardOptions = {}) {
  const {
    controllersPath = join(process.cwd(), 'controllers'),
    methodMappings,
    separator = '-',
    ignorePatterns = [],
    logEnabled = true,
    routePrefix = '',
    enableCache = true,
    cacheTtl = 30000, // 30 seconds default
    enableWatch = false,
    watchOptions = {}
  } = options

  if (!separator || separator.length === 0) {
    throw new Error('Separator cannot be empty. Use a non-empty string like "-" or "_".')
  }

  // Create logger function
  const log = createLogger(logEnabled)

  // Cache for routes
  let routeCache: RouteDefinition[] | null = null
  let cacheTimestamp: number = 0
  let cacheKey: string = ''

  // File watching
  let isWatching = false

  // Start file watching for hot reload
  const startWatching = () => {
    if (!enableWatch || isWatching) return

    try {
      const watchPath = controllersPath
      const options = {
        recursive: true,
        persistent: watchOptions.persistent ?? true,
        ...watchOptions
      }

      watch(watchPath, options, (eventType, filename) => {
        if (filename) {
          // Check if file should be ignored
          const shouldIgnore = ignorePatterns.some(pattern => {
            // Simple pattern matching for watch events
            return filename.includes(pattern.replace('*', ''))
          })

          if (!shouldIgnore) {
            log(`🔄 File changed: ${filename}, clearing cache`)
            // Clear cache to force re-scan on next request
            routeCache = null
            cacheTimestamp = 0
            cacheKey = ''
          }
        }
      })

      isWatching = true
      log('👀 Started watching for file changes in:', watchPath)

    } catch (error) {
      log('⚠️ Failed to start file watching:', error)
    }
  }

  return async (ctx: any, _next: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    // ctx: Context object containing request, response, and app instance
    // next: Function to call the next middleware in the chain
    if (!ctx.app._routesRegistered) {
      try {
        // Generate cache key based on configuration
        const currentCacheKey = JSON.stringify({
          controllersPath,
          methodMappings,
          separator,
          ignorePatterns,
          routePrefix
        })

        let routes: RouteDefinition[]

        // Check cache validity
        const now = Date.now()
        const isCacheValid = enableCache &&
                            routeCache !== null &&
                            cacheKey === currentCacheKey &&
                            (now - cacheTimestamp) < cacheTtl

        if (isCacheValid) {
          log('📋 Using cached routes')
          routes = routeCache!
        } else {
          log('🔄 Scanning route directory:', controllersPath)

          const scanner = new RouteScanner(methodMappings, separator, ignorePatterns, logEnabled)
          routes = await scanner.scanDirectory(controllersPath)

          // Update cache
          if (enableCache) {
            routeCache = routes
            cacheTimestamp = now
            cacheKey = currentCacheKey
            log('💾 Routes cached for', cacheTtl, 'ms')
          }
        }

        // 注册路由到应用
        routes.forEach(route => {
          try {
            const routeMethod = route.method.toLowerCase()
            // 应用路由前缀
            const fullPath = routePrefix ? `/${routePrefix}${route.path}`.replace(/\/+/g, '/') : route.path
            if (ctx.app[routeMethod]) {
              if (route.middlewares && route.middlewares.length > 0) {
                // 有中间件的情况
                ctx.app[routeMethod](fullPath, ...route.middlewares, route.handler)
              } else {
                // 没有中间件的情况
                ctx.app[routeMethod](fullPath, route.handler)
              }
              log(`✅ Route registered successfully: ${route.method} ${fullPath}`)
            } else {
              log(`❌ Unsupported HTTP method: ${route.method}`)
            }
          } catch (error) {
            log(`❌ Failed to register route: ${route.method} ${route.path}`, error)
          }
        })

        log(`🎉 Auto-registered ${routes.length} routes`)
        routes.forEach(route => {
          const fullPath = routePrefix ? `/${routePrefix}${route.path}`.replace(/\/+/g, '/') : route.path
          log(`   ${route.method} ${fullPath}`)
        })

        // Mark as registered
        ctx.app._routesRegistered = true

        // Start watching for file changes (only once)
        if (enableWatch && !isWatching) {
          startWatching()
        }

      } catch (error) {
        log('❌ Auto route registration failed:', error)
      }
    }

    await _next()
  }
}