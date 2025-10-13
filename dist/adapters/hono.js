"use strict";
/**
 * Hono adapter for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.honoRouteWizard = honoRouteWizard;
const index_js_1 = require("../index.js");
/**
 * Hono middleware adapter for route-wizard
 * Uses route-wizard directly with Hono context
 *
 * @param options Configuration options for route-wizard
 * @returns Hono middleware function
 */
function honoRouteWizard(options = {}) {
    const { honoOptions = {}, ...wizardOptions } = options;
    const { useErrorHandler = true } = honoOptions;
    // Get the base route-wizard middleware
    const wizardMiddleware = (0, index_js_1.routeWizard)(wizardOptions);
    // Return Hono-compatible middleware
    return async (c, next) => {
        try {
            // Call the route-wizard middleware directly with Hono context
            await wizardMiddleware(c, next);
        }
        catch (error) {
            if (useErrorHandler) {
                return c.json({ error: 'Internal Server Error' }, 500);
            }
            else {
                throw error;
            }
        }
    };
}
