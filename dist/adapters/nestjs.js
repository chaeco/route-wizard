"use strict";
/**
 * NestJS adapter for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestjsRouteWizard = nestjsRouteWizard;
const index_js_1 = require("../index.js");
/**
 * NestJS middleware adapter for route-wizard
 * Uses route-wizard directly with NestJS request/response objects
 *
 * @param options Configuration options for route-wizard
 * @returns NestJS middleware function
 */
function nestjsRouteWizard(options = {}) {
    const { nestjsOptions = {}, ...wizardOptions } = options;
    const { useErrorHandler = true } = nestjsOptions;
    // Get the base route-wizard middleware
    const wizardMiddleware = (0, index_js_1.routeWizard)(wizardOptions);
    // Return NestJS-compatible middleware
    return async (req, res, next) => {
        try {
            // Create a context object that mimics the structure expected by route-wizard
            const ctx = {
                req,
                res,
                method: req.method,
                url: req.url,
                headers: req.headers,
                query: req.query,
                params: req.params,
                body: req.body
            };
            // Call the route-wizard middleware with the adapted context
            await wizardMiddleware(ctx, next);
        }
        catch {
            if (useErrorHandler) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            else {
                next();
            }
        }
    };
}
