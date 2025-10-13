"use strict";
/**
 * Hoa.js adapter for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoaRouteWizard = hoaRouteWizard;
const index_js_1 = require("../index.js");
/**
 * Hoa.js middleware adapter for route-wizard
 * Uses route-wizard directly with Hoa context
 *
 * @param options Configuration options for route-wizard
 * @returns Hoa middleware function
 */
function hoaRouteWizard(options = {}) {
    const { hoaOptions = {}, ...wizardOptions } = options;
    const { useErrorHandler = true } = hoaOptions;
    // Get the base route-wizard middleware
    const wizardMiddleware = (0, index_js_1.routeWizard)(wizardOptions);
    // Return Hoa-compatible middleware
    return async (ctx, next) => {
        try {
            // Call the route-wizard middleware directly with Hoa context
            await wizardMiddleware(ctx, next);
        }
        catch (error) {
            if (useErrorHandler) {
                ctx.res.status = 500;
                ctx.res.body = { error: 'Internal Server Error' };
            }
            else {
                throw error;
            }
        }
    };
}
