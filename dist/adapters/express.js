"use strict";
/**
 * Express.js adapter for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressRouteWizard = expressRouteWizard;
const index_js_1 = require("../index.js");
/**
 * Express.js middleware adapter for route-wizard
 * Converts route-wizard middleware to Express-compatible middleware
 *
 * @param options Configuration options for route-wizard
 * @returns Express middleware function
 */
function expressRouteWizard(options = {}) {
    const { expressOptions = {}, ...wizardOptions } = options;
    const { useErrorHandler = true } = expressOptions;
    // Get the base route-wizard middleware
    const wizardMiddleware = (0, index_js_1.routeWizard)(wizardOptions);
    // Return Express-compatible middleware
    return async (req, res, next) => {
        try {
            // Create a context object that mimics Express request/response
            const ctx = {
                request: {
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    body: req.body,
                    query: req.query,
                    params: req.params,
                },
                response: {
                    status: 200,
                    headers: {},
                    body: null,
                },
                state: {},
                app: req.app,
            };
            // Call the route-wizard middleware
            await wizardMiddleware(ctx, next);
            // If route was handled, convert back to Express response
            if (ctx.response.body !== null) {
                res.status(ctx.response.status);
                // Set headers
                Object.entries(ctx.response.headers).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
                // Send response body
                if (typeof ctx.response.body === 'object') {
                    res.json(ctx.response.body);
                }
                else {
                    res.send(ctx.response.body);
                }
            }
            else {
                // Route not handled, continue to next middleware
                next();
            }
        }
        catch (error) {
            if (useErrorHandler) {
                next(error);
            }
            else {
                throw error;
            }
        }
    };
}
