/**
 * Route Registrar - Direct route registration for frameworks
 */
import { ScanOptions } from './scanner.js';
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
export declare function registerRoutes(app: any, options: RegisterOptions): void;
/**
 * Create route wizard middleware (for backward compatibility)
 * @param options - Registration options
 */
export declare function routeWizard(options: RegisterOptions): (app: any) => (ctx: unknown, next: () => void) => void;
/**
 * Create a route wizard with integrated performance monitoring
 * @param options - Registration options
 * @returns Object with register function and monitor instance
 */
export declare function createRouteWizard(options: RegisterOptions & {
    enableMonitoring?: boolean;
}): {
    register: (app: any) => void;
    getMetrics: () => import("./utils/performance.js").PerformanceMetrics | undefined;
    getSummary: () => string | undefined;
};
