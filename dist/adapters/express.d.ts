/**
 * Express.js adapter for route-wizard
 */
import { RouteWizardOptions } from '../index.js';
interface ExpressRequest {
    method: string;
    url: string;
    headers: Record<string, string | string[]>;
    body?: any;
    query?: Record<string, any>;
    params?: Record<string, string>;
    app?: any;
}
interface ExpressResponse {
    status(code: number): this;
    setHeader(name: string, value: string): this;
    json(data: any): void;
    send(data: any): void;
}
type ExpressNextFunction = (error?: any) => void;
export interface ExpressRouteWizardOptions extends RouteWizardOptions {
    /**
     * Express-specific options
     */
    expressOptions?: {
        /**
         * Whether to use Express-style error handling
         * @default true
         */
        useErrorHandler?: boolean;
    };
}
/**
 * Express.js middleware adapter for route-wizard
 * Converts route-wizard middleware to Express-compatible middleware
 *
 * @param options Configuration options for route-wizard
 * @returns Express middleware function
 */
export declare function expressRouteWizard(options?: ExpressRouteWizardOptions): (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<void>;
export {};
