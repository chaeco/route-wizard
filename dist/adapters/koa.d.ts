/**
 * Koa.js adapter for route-wizard
 */
import { RouteWizardOptions } from '../index.js';
interface KoaContext {
    method: string;
    url: string;
    headers: Record<string, string | string[]>;
    request: {
        body?: any;
        query?: Record<string, any>;
    };
    params?: Record<string, string>;
    app?: any;
    state?: Record<string, any>;
    response: {
        status: number;
        headers: Record<string, string>;
        body: any;
    };
}
type KoaNextFunction = () => Promise<void>;
export interface KoaRouteWizardOptions extends RouteWizardOptions {
    /**
     * Koa-specific options
     */
    koaOptions?: {
        /**
         * Whether to use Koa-style error handling
         * @default true
         */
        useErrorHandler?: boolean;
    };
}
/**
 * Koa.js middleware adapter for route-wizard
 * Uses route-wizard directly with Koa context
 *
 * @param options Configuration options for route-wizard
 * @returns Koa middleware function
 */
export declare function koaRouteWizard(options?: KoaRouteWizardOptions): (ctx: KoaContext, next: KoaNextFunction) => Promise<void>;
export {};
