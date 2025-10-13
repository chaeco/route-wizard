/**
 * Route Scanner - Synchronous file-based route discovery
 *
 * File convention:
 *   users/get.ts           → GET /users
 *   users/[id]/GET.ts      → GET /users/:id
 *   users/[id]/PUT.ts      → PUT /users/:id
 */

import { readdirSync, statSync } from 'fs';
import path from 'path';
import { join, extname } from 'path';

export interface Route {
  method: string;
  path: string;
  handler: ((...args: unknown[]) => unknown) | null;
}

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];

/**
 * Scan directory for route files synchronously
 * @param dir - Directory to scan
 * @param basePath - Base URL path (internal use)
 * @returns Array of route definitions
 */
export function scanRoutes(dir: string, basePath: string = ''): Route[] {
  const routes: Route[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Handle dynamic parameters:
        // [id] → :id (required parameter)
        // [[query]] → :query? (optional parameter)
        let segment = item;

        if (item.startsWith('[[') && item.endsWith(']]')) {
          // Optional parameter: [[query]] → :query?
          const paramName = item.slice(2, -2);
          segment = `:${paramName}?`;
        } else if (item.startsWith('[') && item.endsWith(']')) {
          // Required parameter: [id] → :id
          const paramName = item.slice(1, -1);
          segment = `:${paramName}`;
        }

        const newBasePath = basePath ? `${basePath}/${segment}` : `/${segment}`;
        routes.push(...scanRoutes(fullPath, newBasePath));
      } else if (stat.isFile()) {
        const ext = extname(item);
        if (ext !== '.ts' && ext !== '.js') {
          continue;
        }

        const methodName = item.slice(0, -ext.length); // Remove extension

        if (HTTP_METHODS.includes(methodName.toLowerCase())) {
          const path = basePath || '/';
          const handler = loadHandler(fullPath);
          const method = methodName.toUpperCase(); // Store as uppercase for consistency

          routes.push({ method, path, handler });
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
 */
function loadHandler(filePath: string): ((...args: unknown[]) => unknown) | null {
  try {
    // Convert absolute path to relative path for require()
    const relativePath = path.relative(__dirname, filePath);

    // Clear require cache in development
    if (process.env.NODE_ENV === 'development') {
      delete require.cache[require.resolve(relativePath)];
    }

    const module = require(relativePath);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load handler from ${filePath}:`, error);
    return null;
  }
}
