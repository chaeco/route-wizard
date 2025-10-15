/**
 * Route Registrar - Direct route registration for frameworks
 */

import { scanRoutes, ScanOptions } from './scanner.js';

export interface RegisterOptions extends ScanOptions {
  dir: string;
  prefix?: string;
  logEnabled?: boolean;
}

/**
 * Register routes to application
 * @param app - Framework app instance (Express, Koa, etc.)
 * @param options - Registration options
 */
export function registerRoutes(app: Record<string, unknown>, options: RegisterOptions): void {
  const { dir, prefix = '', logEnabled = true, separator, maxDepth } = options;

  // eslint-disable-next-line no-console
  const log = logEnabled ? console.log : () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  // Scan routes synchronously
  log('🔍 Scanning routes from:', dir); // eslint-disable-line no-console
  const scanOptions: ScanOptions = {};
  if (separator !== undefined) {
    scanOptions.separator = separator;
  }
  if (maxDepth !== undefined) {
    scanOptions.maxDepth = maxDepth;
  }
  const routes = scanRoutes(dir, '', scanOptions);

  if (routes.length === 0) {
    log('⚠️  No routes found'); // eslint-disable-line no-console
    log('   Create files like: users/GET.ts, users/[id]/PUT.ts'); // eslint-disable-line no-console
    return;
  }

  // Register each route
  routes.forEach((route) => {
    if (!route.handler) {
      log(`❌ No handler for ${route.method} ${route.path}`); // eslint-disable-line no-console
      return;
    }

    const fullPath = prefix ? `${prefix}${route.path}` : route.path;
    const method = route.method.toLowerCase();

    if (typeof app[method] === 'function') {
      app[method](fullPath, route.handler);
      log(`✅ ${route.method} ${fullPath}`); // eslint-disable-line no-console
    } else {
      log(`❌ Unsupported method: ${route.method}`); // eslint-disable-line no-console
    }
  });

  log(`🎉 Registered ${routes.length} routes`); // eslint-disable-line no-console
}

/**
 * Create route wizard middleware (for backward compatibility)
 * @param options - Registration options
 */
export function routeWizard(options: RegisterOptions) {
  return (app: Record<string, unknown>) => {
    registerRoutes(app, options);
    // Return no-op middleware
    return (ctx: unknown, next: () => void) => next();
  };
}
