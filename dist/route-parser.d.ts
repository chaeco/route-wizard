/**
 * Route parsing utilities
 */
import type { HttpMethod } from './types.js';
export interface RouteInfo {
    path: string;
    method: HttpMethod;
}
/**
 * Default method mappings
 */
export declare const DEFAULT_METHOD_MAPPINGS: Record<string, HttpMethod>;
/**
 * Generate route path and HTTP method from file path
 * @param basePath Base path prefix for the route
 * @param fileName Name of the route file (without directory path)
 * @param methodMappings Mapping of file prefixes to HTTP methods
 * @param separator Separator used between method prefix and route name in filename
 * @returns Object containing the generated route path and HTTP method
 */
export declare function generateRoutePath(basePath: string, fileName: string, methodMappings?: Record<string, HttpMethod>, separator?: string): RouteInfo;
/**
 * Check if file is a valid route file
 * @param fileName Name of the file to check
 * @param methodMappings Mapping of file prefixes to HTTP methods
 * @param separator Separator used between method prefix and route name in filename
 * @returns True if the file is a valid route file, false otherwise
 */
export declare function isValidRouteFile(fileName: string, methodMappings?: Record<string, HttpMethod>, separator?: string): boolean;
