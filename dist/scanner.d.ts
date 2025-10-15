/**
 * Route Scanner - Synchronous file-based route discovery
 *
 * File convention:
 *   users.get.ts           → GET /users
 *   users.[id].get.ts      → GET /users/:id
 *   users.[id].posts.[postId].get.ts → GET /users/:id/posts/:postId
 *   users/[id]/GET.ts      → GET /users/:id (legacy folder structure)
 */
export interface Route {
    method: string;
    path: string;
    handler: ((...args: unknown[]) => unknown) | null;
}
export interface ScanOptions {
    separator?: string;
    maxDepth?: number;
}
/**
 * Scan directory for route files synchronously
 * @param dir - Directory to scan
 * @param basePath - Base URL path (internal use)
 * @param options - Scan configuration options
 * @returns Array of route definitions
 */
export declare function scanRoutes(dir: string, basePath?: string, options?: ScanOptions): Route[];
