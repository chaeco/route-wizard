/**
 * Hoa.js adapter for route-wizard
 */
import { RouteWizardOptions } from '../index.js';
interface HoaContext {
    req: {
        method: string;
        url: string;
        href: string;
        pathname: string;
        search: string;
        query: Record<string, string | string[]>;
        headers: Record<string, string | string[]>;
        body?: unknown;
        ip?: string;
    };
    res: {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        body: unknown;
        type?: string;
        length?: number;
    };
    app?: Record<string, unknown>;
    state?: Record<string, unknown>;
    throw(status: number, message?: string): never;
}
type HoaNextFunction = () => Promise<void>;
export interface HoaRouteWizardOptions extends RouteWizardOptions {
    /**
     * Hoa-specific options
     */
    hoaOptions?: {
        /**
         * Whether to use Hoa-style error handling
         * @default true
         */
        useErrorHandler?: boolean;
    };
}
/**
 * Hoa.js middleware adapter for route-wizard
 * Uses route-wizard directly with Hoa context
 *
 * @param options Configuration options for route-wizard
 * @returns Hoa middleware function
 */
export declare function hoaRouteWizard(options?: HoaRouteWizardOptions): (ctx: HoaContext, next: HoaNextFunction) => Promise<void>;
export {};
