/**
 * Route Scanner
 */
import type { RouteDefinition, HttpMethod } from './types.js';
export declare class RouteScanner {
    private routes;
    private methodMappings;
    private separator;
    private ignorePatterns;
    private logEnabled;
    /**
     * Create a new RouteScanner instance
     * @param methodMappings Mapping of file prefixes to HTTP methods (default: standard mappings)
     * @param separator Separator used in route file names (default: '-')
     * @param ignorePatterns Glob patterns for files/directories to ignore during scanning
     * @param logEnabled Whether to enable logging during scanning (default: true)
     */
    constructor(methodMappings?: Record<string, HttpMethod>, separator?: string, ignorePatterns?: string[], logEnabled?: boolean);
    /**
     * Check if a file or directory should be ignored
     */
    private shouldIgnore;
    /**
     * Scan directory and register routes
     * @param directoryPath Absolute or relative path to the directory to scan for route files
     * @param basePath Base path prefix for generated routes (default: empty string)
     * @returns Promise resolving to array of discovered route definitions
     */
    scanDirectory(directoryPath: string, basePath?: string): Promise<RouteDefinition[]>;
    /**
     * Process route file
     */
    private processRouteFile;
    /**
     * Get all routes
     */
    getRoutes(): RouteDefinition[];
    /**
     * Clear routes
     */
    clear(): void;
}
