"use strict";
/**
 * Utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
exports.autoRegisterRoutes = autoRegisterRoutes;
exports.registerRoutesToApp = registerRoutesToApp;
const scanner_js_1 = require("./scanner.js");
/**
 * Create a logger function based on enabled flag
 * @param enabled Whether logging is enabled
 * @returns Logger function that outputs to console if enabled, otherwise no-op
 */
function createLogger(enabled) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return enabled ? console.log : (() => undefined);
}
/**
 * Utility function for auto-registering routes
 * @param controllersPath Path to the controllers directory to scan
 * @param methodMappings Optional custom mapping of file prefixes to HTTP methods
 * @param separator Optional separator used in route file names (default: '-')
 * @param ignorePatterns Optional glob patterns for files to ignore during scanning
 * @param logEnabled Optional flag to enable/disable logging (default: true)
 * @returns Promise resolving to array of discovered route definitions
 */
async function autoRegisterRoutes(controllersPath, methodMappings, separator, ignorePatterns, logEnabled) {
    const scanner = new scanner_js_1.RouteScanner(methodMappings, separator, ignorePatterns, logEnabled);
    const routes = await scanner.scanDirectory(controllersPath);
    return routes;
}
/**
 * Register routes to app
 * @param app The application instance to register routes to
 * @param routes Array of route definitions to register
 * @param logEnabled Whether to enable logging during registration (default: true)
 */
function registerRoutesToApp(app, routes, logEnabled = true) {
    const log = createLogger(logEnabled);
    routes.forEach(route => {
        try {
            // 使用通用路由注册方式
            // 假设app支持方法 + 路径的方式注册路由
            const routeMethod = route.method.toLowerCase();
            if (app[routeMethod]) {
                if (route.middlewares && route.middlewares.length > 0) {
                    // 有中间件的情况
                    app[routeMethod](route.path, ...route.middlewares, route.handler);
                }
                else {
                    // 没有中间件的情况
                    app[routeMethod](route.path, route.handler);
                }
                log(`✅ Route registered successfully: ${route.method} ${route.path}`);
            }
            else {
                log(`❌ Unsupported HTTP method: ${route.method}`);
            }
        }
        catch (error) {
            log(`❌ Failed to register route: ${route.method} ${route.path}`, error);
        }
    });
}
