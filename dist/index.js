"use strict";
/**
 * Route Wizard - File-based automatic route registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = exports.createRouteWizard = exports.routeWizard = exports.registerRoutes = exports.scanRoutes = void 0;
var scanner_js_1 = require("./scanner.js");
Object.defineProperty(exports, "scanRoutes", { enumerable: true, get: function () { return scanner_js_1.scanRoutes; } });
var registrar_js_1 = require("./registrar.js");
Object.defineProperty(exports, "registerRoutes", { enumerable: true, get: function () { return registrar_js_1.registerRoutes; } });
Object.defineProperty(exports, "routeWizard", { enumerable: true, get: function () { return registrar_js_1.routeWizard; } });
Object.defineProperty(exports, "createRouteWizard", { enumerable: true, get: function () { return registrar_js_1.createRouteWizard; } });
var performance_js_1 = require("./utils/performance.js");
Object.defineProperty(exports, "PerformanceMonitor", { enumerable: true, get: function () { return performance_js_1.PerformanceMonitor; } });
// Simple usage example:
//
// import { registerRoutes } from '@chaeco/route-wizard'
//
// registerRoutes(app, {
//   dir: './controllers',
//   prefix: '/api',
//   logEnabled: true
// })
