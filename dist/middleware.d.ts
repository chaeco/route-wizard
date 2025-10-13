/**
 * Middleware functions
 */
import type { RouteWizardOptions } from './types.js';
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
export declare function routeWizard(options?: RouteWizardOptions): (ctx: any, _next: any) => Promise<void>;
