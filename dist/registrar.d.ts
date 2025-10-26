/**
 * Route Registrar - Direct route registration for frameworks
 */
import { ScanOptions } from './scanner.js';
export interface RegisterOptions extends ScanOptions {
    dir: string;
    prefix?: string;
    logEnabled?: boolean;
}
/**
 * Route handler function signature
 */
export type RouteHandler = (req: unknown, res: unknown) => unknown;
/**
 * Framework app interface with HTTP method handlers
 */
export interface FrameworkApp {
    get?: (path: string, handler: RouteHandler) => unknown;
    post?: (path: string, handler: RouteHandler) => unknown;
    put?: (path: string, handler: RouteHandler) => unknown;
    delete?: (path: string, handler: RouteHandler) => unknown;
    patch?: (path: string, handler: RouteHandler) => unknown;
    head?: (path: string, handler: RouteHandler) => unknown;
    options?: (path: string, handler: RouteHandler) => unknown;
    [key: string]: unknown;
}
/**
 * Register routes to application
 * @param app - Framework app instance (Express, Koa, etc.)
 * @param options - Registration options
 */
export declare function registerRoutes(app: FrameworkApp, options: RegisterOptions): void;
/**
 * Create route wizard middleware (for backward compatibility)
 * @param options - Registration options
 */
export declare function routeWizard(options: RegisterOptions): (app: FrameworkApp) => (ctx: unknown, next: () => void) => void;
