/**
 * Fastify adapter for route-wizard
 */
import { RouteWizardOptions } from '../index.js';
export interface FastifyRouteWizardOptions extends RouteWizardOptions {
    /**
     * Fastify-specific options
     */
    fastifyOptions?: {
        /**
         * Whether to use Fastify-style error handling
         * @default true
         */
        useErrorHandler?: boolean;
    };
}
/**
 * Fastify plugin for route-wizard
 * Automatically registers routes from controllers directory
 *
 * @param fastify Fastify instance
 * @param options Configuration options for route-wizard
 * @param done Callback to signal plugin registration completion
 */
export declare function fastifyRouteWizard(fastify: any, options: FastifyRouteWizardOptions | undefined, done: () => void): void;
