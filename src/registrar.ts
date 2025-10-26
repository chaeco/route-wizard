/**
 * Route Registrar - Direct route registration for frameworks
 */

import { scanRoutes, ScanOptions } from './scanner.js';
import { PerformanceMonitor } from './utils/performance.js';

export interface RegisterOptions extends ScanOptions {
  dir: string;
  prefix?: string;
  logEnabled?: boolean;
  performanceMonitor?: PerformanceMonitor;
}

/**
 * Register routes to application
 * @param app - Framework app instance (Express, Koa, Fastify, etc.)
 * @param options - Registration options
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerRoutes(app: any, options: RegisterOptions): void {
  const {
    dir,
    prefix = '',
    logEnabled = true,
    separator,
    maxDepth,
    performanceMonitor,
  } = options;

  // eslint-disable-next-line no-console
  const log = logEnabled ? console.log : () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  // Initialize performance monitor
  const monitor = performanceMonitor || new PerformanceMonitor();

  // Scan routes synchronously
  log('🔍 Scanning routes from:', dir); // eslint-disable-line no-console
  const scanOptions: ScanOptions = {};
  if (separator !== undefined) {
    scanOptions.separator = separator;
  }
  if (maxDepth !== undefined) {
    scanOptions.maxDepth = maxDepth;
  }

  const scanStartTime = Date.now();
  const routes = scanRoutes(dir, '', scanOptions);
  const scanDuration = Date.now() - scanStartTime;

  // Record scan performance
  monitor.recordRouteScan(scanDuration);

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
      // Register route with optional middlewares
      if (route.middlewares && route.middlewares.length > 0) {
        app[method](fullPath, ...route.middlewares, route.handler);
      } else {
        app[method](fullPath, route.handler);
      }
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function routeWizard(options: RegisterOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (app: any) => {
    registerRoutes(app, options);
    // Return no-op middleware
    return (ctx: unknown, next: () => void) => next();
  };
}

/**
 * Create a route wizard with integrated performance monitoring
 * @param options - Registration options
 * @returns Object with register function and monitor instance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRouteWizard(
  options: RegisterOptions & { enableMonitoring?: boolean }
) {
  const monitor = options.enableMonitoring ? new PerformanceMonitor() : undefined;

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: (app: any) => {
      registerRoutes(app, { ...options, performanceMonitor: monitor });
    },
    getMetrics: () => monitor?.getMetrics(),
    getSummary: () => monitor?.getMetricsSummary(),
  };
}

