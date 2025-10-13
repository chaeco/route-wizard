"use strict";
/**
 * Auto Route Registrar
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeWizard = void 0;
// Export main API
var middleware_js_1 = require("./middleware.js");
Object.defineProperty(exports, "routeWizard", { enumerable: true, get: function () { return middleware_js_1.routeWizard; } });
// Export framework adapters (conditionally exported)
// Note: These are not included in the main bundle to keep package size small
// Users should import them directly:
// import { expressRouteWizard } from '@chaeco/route-wizard/adapters/express'
// import { koaRouteWizard } from '@chaeco/route-wizard/adapters/koa'
// Re-export for convenience (only when explicitly imported)
// export { expressRouteWizard, type ExpressRouteWizardOptions } from './adapters/express.js'
// export { koaRouteWizard, type KoaRouteWizardOptions } from './adapters/koa.js'
