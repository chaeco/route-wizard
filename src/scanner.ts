/**
 * Route Scanner
 */

import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { minimatch } from 'minimatch'
import type { RouteDefinition, RouteHandler, HttpMethod } from './types.js'
import { generateRoutePath, isValidRouteFile, DEFAULT_METHOD_MAPPINGS } from './route-parser.js'
import { createLogger } from './utils.js'

export class RouteScanner {
  private routes: RouteDefinition[] = []
  private methodMappings: Record<string, HttpMethod>
  private separator: string
  private ignorePatterns: string[]
  private logEnabled: boolean

  /**
   * Create a new RouteScanner instance
   * @param methodMappings Mapping of file prefixes to HTTP methods (default: standard mappings)
   * @param separator Separator used in route file names (default: '-')
   * @param ignorePatterns Glob patterns for files/directories to ignore during scanning
   * @param logEnabled Whether to enable logging during scanning (default: true)
   */
  constructor(methodMappings: Record<string, HttpMethod> = DEFAULT_METHOD_MAPPINGS, separator: string = '-', ignorePatterns: string[] = [], logEnabled: boolean = true) {
    if (!separator || separator.length === 0) {
      throw new Error('Separator cannot be empty. Use a non-empty string like "-" or "_".')
    }
    this.methodMappings = methodMappings
    this.separator = separator
    this.ignorePatterns = ignorePatterns
    this.logEnabled = logEnabled
  }

  /**
   * Check if a file or directory should be ignored
   */
  private shouldIgnore(itemPath: string): boolean {
    const relativePath = itemPath.replace(/\\/g, '/') // Normalize path separators
    return this.ignorePatterns.some(pattern => minimatch(relativePath, pattern))
  }

  /**
   * Scan directory and register routes
   * @param directoryPath Absolute or relative path to the directory to scan for route files
   * @param basePath Base path prefix for generated routes (default: empty string)
   * @returns Promise resolving to array of discovered route definitions
   */
  async scanDirectory(directoryPath: string, basePath: string = ''): Promise<RouteDefinition[]> {
    const log = createLogger(this.logEnabled)
    const items = readdirSync(directoryPath)
    let validRouteCount = 0

    for (const item of items) {
      const fullPath = join(directoryPath, item)
      const stat = statSync(fullPath)

      // Check if this item should be ignored
      if (this.shouldIgnore(fullPath)) {
        log(`⏭️  Ignoring: ${fullPath}`)
        continue
      }

      if (stat.isDirectory()) {
        // 递归扫描子目录
        const subPath = basePath ? `${basePath}/${item}` : item
        const subRoutes = await this.scanDirectory(fullPath, subPath)
        validRouteCount += subRoutes.length
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.js'))) {
        // 检查是否为有效的路由文件
        if (isValidRouteFile(item, this.methodMappings, this.separator)) {
          // 处理路由文件
          await this.processRouteFile(fullPath, basePath, item)
          validRouteCount++
        } else {
          const availablePrefixes = Object.keys(this.methodMappings).join(', ')
          log(
            `Skipping file that doesn't match naming convention: ${item} (filename must start with one of: ${availablePrefixes} followed by '${this.separator}')`
          )
        }
      }
    }

    // If no valid route files found in the entire directory, provide a hint
    if (validRouteCount === 0 && basePath === '') {
      const availablePrefixes = Object.keys(this.methodMappings).join(', ')
      log(`⚠️  No valid route files found in controllers directory`)
      log(`   Filenames must start with one of: ${availablePrefixes} followed by '${this.separator}'`)
      log(`   Examples: ${Object.keys(this.methodMappings).map(p => `${p}${this.separator}users.ts`).join(', ')}`)
    }

    return this.routes
  }

  /**
   * Process route file
   */
  private async processRouteFile(
    filePath: string,
    basePath: string,
    fileName: string
  ): Promise<void> {
    const log = createLogger(this.logEnabled)
    try {
      // 动态导入文件
      const module = await import(filePath)

      // 检查是否有默认导出
      if (!module.default) {
        log(`File ${filePath} has no default export, skipping`)
        return
      }

      // 获取路由处理函数
      const handler: RouteHandler = module.default

      // 从文件路径生成路由路径和HTTP方法
      const { path: routePath, method } = generateRoutePath(basePath, fileName, this.methodMappings, this.separator)

      // 创建路由定义
      const route: RouteDefinition = {
        method,
        path: routePath,
        handler,
        middlewares: module.middlewares || [],
      }

      this.routes.push(route)
      log(`Registered route: ${method} ${routePath} -> ${filePath}`)
    } catch (error) {
      log(`Failed to process route file ${filePath}:`, error)
    }
  }

  /**
   * Get all routes
   */
  getRoutes(): RouteDefinition[] {
    return this.routes
  }

  /**
   * Clear routes
   */
  clear(): void {
    this.routes = []
  }
}