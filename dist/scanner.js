"use strict";
/**
 * Route Scanner - Synchronous file-based route discovery
 *
 * File convention:
 *   users/get.ts           → GET /users
 *   users/[id]/GET.ts      → GET /users/:id
 *   users/[id]/PUT.ts      → PUT /users/:id
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRoutes = scanRoutes;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const path_2 = require("path");
const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
/**
 * Scan directory for route files synchronously
 * @param dir - Directory to scan
 * @param basePath - Base URL path (internal use)
 * @returns Array of route definitions
 */
function scanRoutes(dir, basePath = '') {
    const routes = [];
    try {
        const items = (0, fs_1.readdirSync)(dir);
        for (const item of items) {
            const fullPath = (0, path_2.join)(dir, item);
            const stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory()) {
                // Handle dynamic parameters:
                // [id] → :id (required parameter)
                // [[query]] → :query? (optional parameter)
                let segment = item;
                if (item.startsWith('[[') && item.endsWith(']]')) {
                    // Optional parameter: [[query]] → :query?
                    const paramName = item.slice(2, -2);
                    segment = `:${paramName}?`;
                }
                else if (item.startsWith('[') && item.endsWith(']')) {
                    // Required parameter: [id] → :id
                    const paramName = item.slice(1, -1);
                    segment = `:${paramName}`;
                }
                const newBasePath = basePath ? `${basePath}/${segment}` : `/${segment}`;
                routes.push(...scanRoutes(fullPath, newBasePath));
            }
            else if (stat.isFile()) {
                const ext = (0, path_2.extname)(item);
                if (ext !== '.ts' && ext !== '.js') {
                    continue;
                }
                const methodName = item.slice(0, -ext.length); // Remove extension
                if (HTTP_METHODS.includes(methodName.toLowerCase())) {
                    const path = basePath || '/';
                    const handler = loadHandler(fullPath);
                    const method = methodName.toUpperCase(); // Store as uppercase for consistency
                    routes.push({ method, path, handler });
                }
            }
        }
    }
    catch (error) {
        console.error(`Failed to scan directory ${dir}:`, error);
    }
    return routes;
}
/**
 * Load route handler from file
 */
function loadHandler(filePath) {
    try {
        // Convert absolute path to relative path for require()
        const relativePath = path_1.default.relative(__dirname, filePath);
        // Clear require cache in development
        if (process.env.NODE_ENV === 'development') {
            delete require.cache[require.resolve(relativePath)];
        }
        const module = require(relativePath);
        return module.default || module;
    }
    catch (error) {
        console.error(`Failed to load handler from ${filePath}:`, error);
        return null;
    }
}
