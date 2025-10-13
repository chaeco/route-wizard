"use strict";
/**
 * Route Wizard - File-based automatic route registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = exports.scanRoutes = void 0;
var scanner_js_1 = require("./scanner.js");
Object.defineProperty(exports, "scanRoutes", { enumerable: true, get: function () { return scanner_js_1.scanRoutes; } });
var registrar_js_1 = require("./registrar.js");
Object.defineProperty(exports, "registerRoutes", { enumerable: true, get: function () { return registrar_js_1.registerRoutes; } });
// Simple usage example:
//
// import { registerRoutes } from '@chaeco/route-wizard'
//
// registerRoutes(app, {
//   dir: './controllers',
//   prefix: '/api',
//   logEnabled: true
// })
