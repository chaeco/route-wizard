/**
 * Route Scanner - Synchronous file-based route discovery
 *
 * File convention:
 *   users.get.ts           → GET /users
 *   users.[id].get.ts      → GET /users/:id
 *   users.[id].posts.[postId].get.ts → GET /users/:id/posts/:postId
 *   users/[id]/GET.ts      → GET /users/:id (legacy folder structure)
 */

import { readdirSync, statSync } from 'fs';
import path from 'path';
import { join, extname } from 'path';

export interface Route {
  method: string;
  path: string;
  handler: ((...args: unknown[]) => unknown) | null;
  middlewares?: ((...args: unknown[]) => unknown)[];
}

export interface ScanOptions {
  separator?: string; // Default: '.'
  maxDepth?: number; // Default: 10
}

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
const DEFAULT_OPTIONS: Required<ScanOptions> = {
  separator: '.',
  maxDepth: 10,
};

/**
 * Parse a route segment (folder name or filename part) into URL path segment
 */
function parseRouteSegment(segment: string): string {
  if (segment.startsWith('[[') && segment.endsWith(']]')) {
    // Optional parameter: [[query]] → :query?
    return `:${segment.slice(2, -2)}?`;
  }
  if (segment.startsWith('[') && segment.endsWith(']')) {
    // Required parameter: [id] → :id
    return `:${segment.slice(1, -1)}`;
  }
  return segment;
}

/**
 * Extract route information from a file path
 */
function extractRouteInfo(
  filePath: string,
  basePath: string,
  options: Required<ScanOptions>
): Route | null {
  const ext = extname(filePath);
  if (ext !== '.ts' && ext !== '.js') {
    return null;
  }

  const fileName = path.basename(filePath, ext);
  const parts = fileName.split(options.separator);

  // Last part should be HTTP method
  const methodName = parts.pop()!;
  if (!HTTP_METHODS.includes(methodName.toLowerCase())) {
    return null;
  }

  // If no parts left, this is legacy folder-based route
  // The path comes from basePath only
  if (parts.length === 0) {
    const routePath = basePath || '/';
    const handler = loadHandler(filePath);
    const method = methodName.toUpperCase();
    return { method, path: routePath, handler };
  }

  // Filename-based routing: convert parts to path segments
  const pathSegments = parts.map(parseRouteSegment);
  const routePath = basePath
    ? `${basePath}/${pathSegments.join('/')}`
    : `/${pathSegments.join('/')}`;

  // Check depth limit
  const depth = (basePath + routePath).split('/').filter(Boolean).length;
  if (depth > options.maxDepth) {
    return null;
  }

  const handler = loadHandler(filePath);
  const method = methodName.toUpperCase();

  return { method, path: routePath, handler };
}

/**
 * Scan directory for route files synchronously
 * @param dir - Directory to scan
 * @param basePath - Base URL path (internal use)
 * @param options - Scan configuration options
 * @returns Array of route definitions
 */
export function scanRoutes(dir: string, basePath: string = '', options: ScanOptions = {}): Route[] {
  const routes: Route[] = [];
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        const segment = parseRouteSegment(item);
        const newBasePath = basePath ? `${basePath}/${segment}` : `/${segment}`;

        // Check depth before recursing
        const currentDepth = newBasePath.split('/').filter(Boolean).length;
        if (currentDepth <= config.maxDepth) {
          routes.push(...scanRoutes(fullPath, newBasePath, config));
        }
      } else if (stat.isFile()) {
        // Handle both filename-based and legacy folder-based routes
        const route = extractRouteInfo(fullPath, basePath, config);
        if (route) {
          routes.push(route);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to scan directory ${dir}:`, error);
  }

  return routes;
}

/**
 * Load route handler from file
 * Supports both ES6 (export default) and CommonJS (module.exports) formats
 */
function loadHandler(filePath: string): ((...args: unknown[]) => unknown) | null {
  try {
    // Convert absolute path to relative path for require()
    const absolutePath = path.resolve(filePath);

    // Clear require cache in development
    if (process.env.NODE_ENV === 'development') {
      delete require.cache[absolutePath];
    }

    const loadedModule = require(absolutePath);
    
    // Handle ES6 export default
    if (loadedModule.default && typeof loadedModule.default === 'function') {
      return loadedModule.default;
    }
    
    // Handle CommonJS module.exports with function
    if (typeof loadedModule === 'function') {
      return loadedModule;
    }
    
    // Handle CommonJS module.exports with default property
    if (loadedModule.default) {
      return loadedModule.default;
    }
    
    // Fallback: return the entire module if it's an object
    // (in case handler is exported differently)
    if (typeof loadedModule === 'object' && loadedModule !== null) {
      return loadedModule;
    }
    
    // eslint-disable-next-line no-console
    console.warn(`Handler at ${filePath} has unexpected format. Expected a function.`);
    return null;
  } catch (error) {
    console.error(`Failed to load handler from ${filePath}:`, error);
    return null;
  }
}
