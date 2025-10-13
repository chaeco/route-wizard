"use strict";
/**
 * Koa.js adapter for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.koaRouteWizard = koaRouteWizard;
const index_js_1 = require("../index.js");
/**
 * Koa.js middleware adapter for route-wizard
 * Uses route-wizard directly with Koa context
 *
 * @param options Configuration options for route-wizard
 * @returns Koa middleware function
 */
function koaRouteWizard(options = {}) {
    const { koaOptions = {}, ...wizardOptions } = options;
    const { useErrorHandler = true } = koaOptions;
    // Get the base route-wizard middleware
    const wizardMiddleware = (0, index_js_1.routeWizard)(wizardOptions);
    // Return Koa-compatible middleware
    return async (ctx, next) => {
        try {
            // Call the route-wizard middleware directly with Koa context
            await wizardMiddleware(ctx, next);
        }
        catch (error) {
            if (useErrorHandler) {
                ctx.response.status = 500;
                ctx.response.body = { error: 'Internal Server Error' };
            }
            else {
                throw error;
            }
        }
    };
}
