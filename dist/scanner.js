"use strict";
/**
 * Route Scanner
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteScanner = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const minimatch_1 = require("minimatch");
const route_parser_js_1 = require("./route-parser.js");
const utils_js_1 = require("./utils.js");
class RouteScanner {
    /**
     * Create a new RouteScanner instance
     * @param methodMappings Mapping of file prefixes to HTTP methods (default: standard mappings)
     * @param separator Separator used in route file names (default: '-')
     * @param ignorePatterns Glob patterns for files/directories to ignore during scanning
     * @param logEnabled Whether to enable logging during scanning (default: true)
     */
    constructor(methodMappings = route_parser_js_1.DEFAULT_METHOD_MAPPINGS, separator = '-', ignorePatterns = [], logEnabled = true) {
        this.routes = [];
        if (!separator || separator.length === 0) {
            throw new Error('Separator cannot be empty. Use a non-empty string like "-" or "_".');
        }
        this.methodMappings = methodMappings;
        this.separator = separator;
        this.ignorePatterns = ignorePatterns;
        this.logEnabled = logEnabled;
    }
    /**
     * Check if a file or directory should be ignored
     */
    shouldIgnore(itemPath) {
        const relativePath = itemPath.replace(/\\/g, '/'); // Normalize path separators
        return this.ignorePatterns.some(pattern => (0, minimatch_1.minimatch)(relativePath, pattern));
    }
    /**
     * Scan directory and register routes
     * @param directoryPath Absolute or relative path to the directory to scan for route files
     * @param basePath Base path prefix for generated routes (default: empty string)
     * @returns Promise resolving to array of discovered route definitions
     */
    async scanDirectory(directoryPath, basePath = '') {
        const log = (0, utils_js_1.createLogger)(this.logEnabled);
        const items = (0, fs_1.readdirSync)(directoryPath);
        let validRouteCount = 0;
        for (const item of items) {
            const fullPath = (0, path_1.join)(directoryPath, item);
            const stat = (0, fs_1.statSync)(fullPath);
            // Check if this item should be ignored
            if (this.shouldIgnore(fullPath)) {
                log(`⏭️  Ignoring: ${fullPath}`);
                continue;
            }
            if (stat.isDirectory()) {
                // 递归扫描子目录
                const subPath = basePath ? `${basePath}/${item}` : item;
                const subRoutes = await this.scanDirectory(fullPath, subPath);
                validRouteCount += subRoutes.length;
            }
            else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.js'))) {
                // 检查是否为有效的路由文件
                if ((0, route_parser_js_1.isValidRouteFile)(item, this.methodMappings, this.separator)) {
                    // 处理路由文件
                    await this.processRouteFile(fullPath, basePath, item);
                    validRouteCount++;
                }
                else {
                    const availablePrefixes = Object.keys(this.methodMappings).join(', ');
                    log(`Skipping file that doesn't match naming convention: ${item} (filename must start with one of: ${availablePrefixes} followed by '${this.separator}')`);
                }
            }
        }
        // If no valid route files found in the entire directory, provide a hint
        if (validRouteCount === 0 && basePath === '') {
            const availablePrefixes = Object.keys(this.methodMappings).join(', ');
            log(`⚠️  No valid route files found in controllers directory`);
            log(`   Filenames must start with one of: ${availablePrefixes} followed by '${this.separator}'`);
            log(`   Examples: ${Object.keys(this.methodMappings).map(p => `${p}${this.separator}users.ts`).join(', ')}`);
        }
        return this.routes;
    }
    /**
     * Process route file
     */
    async processRouteFile(filePath, basePath, fileName) {
        const log = (0, utils_js_1.createLogger)(this.logEnabled);
        try {
            // 动态导入文件
            const module = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            // 检查是否有默认导出
            if (!module.default) {
                log(`File ${filePath} has no default export, skipping`);
                return;
            }
            // 获取路由处理函数
            const handler = module.default;
            // 从文件路径生成路由路径和HTTP方法
            const { path: routePath, method } = (0, route_parser_js_1.generateRoutePath)(basePath, fileName, this.methodMappings, this.separator);
            // 创建路由定义
            const route = {
                method,
                path: routePath,
                handler,
                middlewares: module.middlewares || [],
            };
            this.routes.push(route);
            log(`Registered route: ${method} ${routePath} -> ${filePath}`);
        }
        catch (error) {
            log(`Failed to process route file ${filePath}:`, error);
        }
    }
    /**
     * Get all routes
     */
    getRoutes() {
        return this.routes;
    }
    /**
     * Clear routes
     */
    clear() {
        this.routes = [];
    }
}
exports.RouteScanner = RouteScanner;
