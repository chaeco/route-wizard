"use strict";
/**
 * Route parsing utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_METHOD_MAPPINGS = void 0;
exports.generateRoutePath = generateRoutePath;
exports.isValidRouteFile = isValidRouteFile;
/**
 * Default method mappings
 */
exports.DEFAULT_METHOD_MAPPINGS = {
    'get': 'GET',
    'post': 'POST',
    'put': 'PUT',
    'delete': 'DELETE',
    'patch': 'PATCH',
    'head': 'HEAD',
    'options': 'OPTIONS'
};
/**
 * Generate route path and HTTP method from file path
 * @param basePath Base path prefix for the route
 * @param fileName Name of the route file (without directory path)
 * @param methodMappings Mapping of file prefixes to HTTP methods
 * @param separator Separator used between method prefix and route name in filename
 * @returns Object containing the generated route path and HTTP method
 */
function generateRoutePath(basePath, fileName, methodMappings = exports.DEFAULT_METHOD_MAPPINGS, separator = '-') {
    if (!separator || separator.length === 0) {
        throw new Error('Separator cannot be empty. Use a non-empty string like "-" or "_".');
    }
    // 移除文件扩展名
    const nameWithoutExtension = fileName.replace(/\.(ts|js)$/, '');
    // 检查文件名是否以HTTP方法前缀开头
    const lowercaseName = nameWithoutExtension.toLowerCase();
    let method;
    let routeName = nameWithoutExtension;
    // 检查是否以配置的方法前缀开头
    for (const [prefix, httpMethod] of Object.entries(methodMappings)) {
        if (lowercaseName.startsWith(prefix + separator)) {
            method = httpMethod;
            routeName = nameWithoutExtension.substring(prefix.length + separator.length); // 移除前缀和分隔符
            break;
        }
    }
    if (!method) {
        throw new Error(`Invalid route file name: ${fileName}. Filename must start with a configured method prefix followed by '${separator}'.`);
    }
    // 构建完整路径
    const pathParts = [];
    if (basePath) {
        pathParts.push(...basePath.split('/'));
    }
    pathParts.push(routeName);
    // 生成路由路径
    const routePath = '/' + pathParts.join('/');
    return { path: routePath, method };
}
/**
 * Check if file is a valid route file
 * @param fileName Name of the file to check
 * @param methodMappings Mapping of file prefixes to HTTP methods
 * @param separator Separator used between method prefix and route name in filename
 * @returns True if the file is a valid route file, false otherwise
 */
function isValidRouteFile(fileName, methodMappings = exports.DEFAULT_METHOD_MAPPINGS, separator = '-') {
    const nameWithoutExtension = fileName.replace(/\.(ts|js)$/, '');
    const lowercaseName = nameWithoutExtension.toLowerCase();
    return Object.keys(methodMappings).some(prefix => lowercaseName.startsWith(prefix + separator));
}
