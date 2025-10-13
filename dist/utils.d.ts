/**
 * Utility functions
 */
import type { RouteDefinition, HttpMethod } from './types.js';
/**
 * Create a logger function based on enabled flag
 * @param enabled Whether logging is enabled
 * @returns Logger function that outputs to console if enabled, otherwise no-op
 */
export declare function createLogger(enabled: boolean): (...args: any[]) => void;
/**
 * Utility function for auto-registering routes
 * @param controllersPath Path to the controllers directory to scan
 * @param methodMappings Optional custom mapping of file prefixes to HTTP methods
 * @param separator Optional separator used in route file names (default: '-')
 * @param ignorePatterns Optional glob patterns for files to ignore during scanning
 * @param logEnabled Optional flag to enable/disable logging (default: true)
 * @returns Promise resolving to array of discovered route definitions
 */
export declare function autoRegisterRoutes(controllersPath: string, methodMappings?: Record<string, HttpMethod>, separator?: string, ignorePatterns?: string[], logEnabled?: boolean): Promise<RouteDefinition[]>;
/**
 * Register routes to app
 * @param app The application instance to register routes to
 * @param routes Array of route definitions to register
 * @param logEnabled Whether to enable logging during registration (default: true)
 */
export declare function registerRoutesToApp(app: any, routes: RouteDefinition[], logEnabled?: boolean): void;
