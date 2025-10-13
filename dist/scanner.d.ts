/**
 * Route Scanner - Synchronous file-based route discovery
 *
 * File convention:
 *   users/get.ts           → GET /users
 *   users/[id]/GET.ts      → GET /users/:id
 *   users/[id]/PUT.ts      → PUT /users/:id
 */
export interface Route {
    method: string;
    path: string;
    handler: ((...args: unknown[]) => unknown) | null;
}
/**
 * Scan directory for route files synchronously
 * @param dir - Directory to scan
 * @param basePath - Base URL path (internal use)
 * @returns Array of route definitions
 */
export declare function scanRoutes(dir: string, basePath?: string): Route[];
