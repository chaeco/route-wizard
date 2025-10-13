/**
 * Hono adapter for route-wizard
 */
import { RouteWizardOptions } from '../index.js';
interface HonoContext {
    req: {
        method: string;
        path: string;
        url: string;
        header(name: string): string | undefined;
        headers: Record<string, string>;
        query(name?: string): string | undefined;
        queries(name?: string): string[] | undefined;
        param(name?: string): string | undefined;
        params: Record<string, string>;
        json<T = unknown>(): Promise<T>;
        text(): Promise<string>;
        arrayBuffer(): Promise<ArrayBuffer>;
        blob(): Promise<Blob>;
        formData(): Promise<FormData>;
        raw: Request;
    };
    res: {
        status: number;
        headers: Record<string, string>;
        body: unknown;
    };
    json(data: unknown, status?: number, headers?: Record<string, string>): Response;
    text(data: string, status?: number, headers?: Record<string, string>): Response;
    html(data: string, status?: number, headers?: Record<string, string>): Response;
    redirect(location: string, status?: number): Response;
    header(name: string, value: string): void;
    status(status: number): void;
    set(key: 'Content-Type', value: string): void;
    var: Record<string, unknown>;
    event?: unknown;
    executionCtx?: unknown;
}
type HonoNextFunction = () => Promise<void>;
export interface HonoRouteWizardOptions extends RouteWizardOptions {
    /**
     * Hono-specific options
     */
    honoOptions?: {
        /**
         * Whether to use Hono-style error handling
         * @default true
         */
        useErrorHandler?: boolean;
    };
}
/**
 * Hono middleware adapter for route-wizard
 * Uses route-wizard directly with Hono context
 *
 * @param options Configuration options for route-wizard
 * @returns Hono middleware function
 */
export declare function honoRouteWizard(options?: HonoRouteWizardOptions): (c: HonoContext, next: HonoNextFunction) => Promise<Response | undefined>;
export {};
