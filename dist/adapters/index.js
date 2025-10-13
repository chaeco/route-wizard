"use strict";
/**
 * Framework adapters for route-wizard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestjsRouteWizard = exports.fastifyRouteWizard = exports.honoRouteWizard = exports.hoaRouteWizard = exports.koaRouteWizard = exports.expressRouteWizard = void 0;
// Export all adapters
var express_js_1 = require("./express.js");
Object.defineProperty(exports, "expressRouteWizard", { enumerable: true, get: function () { return express_js_1.expressRouteWizard; } });
var koa_js_1 = require("./koa.js");
Object.defineProperty(exports, "koaRouteWizard", { enumerable: true, get: function () { return koa_js_1.koaRouteWizard; } });
var hoa_js_1 = require("./hoa.js");
Object.defineProperty(exports, "hoaRouteWizard", { enumerable: true, get: function () { return hoa_js_1.hoaRouteWizard; } });
var hono_js_1 = require("./hono.js");
Object.defineProperty(exports, "honoRouteWizard", { enumerable: true, get: function () { return hono_js_1.honoRouteWizard; } });
var fastify_js_1 = require("./fastify.js");
Object.defineProperty(exports, "fastifyRouteWizard", { enumerable: true, get: function () { return fastify_js_1.fastifyRouteWizard; } });
var nestjs_js_1 = require("./nestjs.js");
Object.defineProperty(exports, "nestjsRouteWizard", { enumerable: true, get: function () { return nestjs_js_1.nestjsRouteWizard; } });
