/**
 * NestJS adapter for route-wizard
 */
import { RouteWizardOptions } from '../index.js';
interface NestJSRequest {
    method: string;
    url: string;
    headers: Record<string, string | string[]>;
    query: Record<string, unknown>;
    params: Record<string, string>;
    body?: unknown;
    raw: {
        method: string;
        url: string;
        headers: Record<string, string | string[]>;
    };
}
interface NestJSResponse {
    status(code: number): NestJSResponse;
    header(name: string, value: string | string[]): NestJSResponse;
    send(payload?: unknown): NestJSResponse;
    json(payload?: unknown): NestJSResponse;
    type(type: string): NestJSResponse;
    statusCode: number;
    headers: Record<string, string | string[]>;
}
type NestJSNextFunction = () => void;
export interface NestJSRouteWizardOptions extends RouteWizardOptions {
    /**
     * NestJS-specific options
     */
    nestjsOptions?: {
        /**
         * Whether to use NestJS-style error handling
         * @default true
         */
        useErrorHandler?: boolean;
    };
}
/**
 * NestJS middleware adapter for route-wizard
 * Uses route-wizard directly with NestJS request/response objects
 *
 * @param options Configuration options for route-wizard
 * @returns NestJS middleware function
 */
export declare function nestjsRouteWizard(options?: NestJSRouteWizardOptions): (req: NestJSRequest, res: NestJSResponse, next: NestJSNextFunction) => Promise<void>;
export {};
