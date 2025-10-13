"use strict";
/**
 * Fastify adapter for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyRouteWizard = fastifyRouteWizard;
const index_js_1 = require("../index.js");
/**
 * Fastify plugin for route-wizard
 * Automatically registers routes from controllers directory
 *
 * @param fastify Fastify instance
 * @param options Configuration options for route-wizard
 * @param done Callback to signal plugin registration completion
 */
function fastifyRouteWizard(fastify, options = {}, done) {
    const { fastifyOptions = {}, ...wizardOptions } = options;
    const { useErrorHandler = true } = fastifyOptions;
    // Get the base route-wizard middleware
    const wizardMiddleware = (0, index_js_1.routeWizard)(wizardOptions);
    // Create a context that will be used for route registration
    const ctx = {
        app: fastify,
        method: '',
        url: '',
        headers: {},
        query: {},
        params: {},
        body: null,
        state: {}
    };
    // Call route-wizard to register routes
    wizardMiddleware(ctx, (error) => {
        if (error) {
            if (useErrorHandler) {
                fastify.log.error(error);
            }
            done();
            return;
        }
        done();
    });
}
