/**
 * Route Registrar - Direct route registration for frameworks
 */
export interface RegisterOptions {
    dir: string;
    prefix?: string;
    logEnabled?: boolean;
}
/**
 * Register routes to application
 * @param app - Framework app instance (Express, Koa, etc.)
 * @param options - Registration options
 */
export declare function registerRoutes(app: Record<string, unknown>, options: RegisterOptions): void;
/**
 * Create route wizard middleware (for backward compatibility)
 * @param options - Registration options
 */
export declare function routeWizard(options: RegisterOptions): (app: Record<string, unknown>) => (ctx: unknown, next: () => void) => void;
