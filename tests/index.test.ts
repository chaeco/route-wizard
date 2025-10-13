/**
 * Tests for Route Wizard V2
 */

import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import { scanRoutes, registerRoutes } from '../src/index.js';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

describe('Route Wizard V2', () => {
  const testDir = join(process.cwd(), 'test-controllers');
  const mockConsoleLog = jest.spyOn(console, 'log');
  const mockConsoleError = jest.spyOn(console, 'error');

  beforeAll(() => {
    // Create test directory structure
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }

    try {
      mkdirSync(testDir, { recursive: true });
      mkdirSync(join(testDir, 'users'), { recursive: true });
      mkdirSync(join(testDir, '[id]'), { recursive: true });
      mkdirSync(join(testDir, '[[optional]]'), { recursive: true });

            // Create test route files
      writeFileSync(join(testDir, 'users', 'get.ts'), 'export default (req, res) => res.json({});');
      writeFileSync(join(testDir, 'users', 'post.ts'), 'export default (req, res) => res.json({});');
      writeFileSync(join(testDir, '[id]', 'get.ts'), 'export default (req, res) => res.json({});');
      writeFileSync(join(testDir, '[[optional]]', 'get.ts'), 'export default (req, res) => res.json({});');
      
      // Create nested parameter structure for testing
      const nestedPath = join(testDir, 'api', 'v1', 'users', '[userId]', 'posts', '[postId]');
      mkdirSync(nestedPath, { recursive: true });
      writeFileSync(join(nestedPath, 'get.ts'), 'export default (req, res) => res.json({});');
    } catch {
      // Directory setup might fail
    }
  });

  afterAll(() => {
    // Clean up
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });
  describe('scanRoutes', () => {
    it('should scan routes from controllers directory', () => {
      const routes = scanRoutes(testDir);

      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBeGreaterThan(0);

      // Check that routes have the correct structure
      routes.forEach((route) => {
        expect(route).toHaveProperty('method');
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('handler');
        expect(typeof route.method).toBe('string');
        expect(typeof route.path).toBe('string');
        expect(typeof route.handler).toBe('function');
      });
    });

    it('should handle dynamic parameters', () => {
      const routes = scanRoutes(testDir);

      // Should have routes with parameters
      const paramRoutes = routes.filter((route) => route.path.includes(':'));
      expect(paramRoutes.length).toBeGreaterThan(0);

      // Check parameter syntax
      paramRoutes.forEach((route) => {
        expect(route.path).toMatch(/:[a-zA-Z_][a-zA-Z0-9_]*(\?)?/);
      });
    });

    it('should handle optional parameters', () => {
      const routes = scanRoutes(testDir);

      // Should have optional parameter routes
      const optionalRoutes = routes.filter((route) => route.path.includes('?'));
      expect(optionalRoutes.length).toBeGreaterThan(0);
    });

    it('should handle nested parameters', () => {
      const routes = scanRoutes(testDir);

      // Should have nested parameter routes
      const nestedRoutes = routes.filter(
        (route) => route.path.split('/').filter((segment) => segment.startsWith(':')).length > 1
      );
      expect(nestedRoutes.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent directory', () => {
      const routes = scanRoutes('/non/existent/directory');
      expect(routes).toEqual([]);
    });

    it('should handle files with default export', () => {
      const routes = scanRoutes(testDir);
      const userRoutes = routes.filter(route => route.path.includes('/users'));

      expect(userRoutes.length).toBeGreaterThan(0);
      userRoutes.forEach(route => {
        expect(route.handler).toBeDefined();
        expect(typeof route.handler).toBe('function');
      });
    });

    it('should handle files with module.exports', () => {
      // Create a CommonJS style file with proper HTTP method name
      writeFileSync(join(testDir, 'options.js'), 'module.exports = (req, res) => res.json({});');

      const routes = scanRoutes(testDir);
      const commonJsRoute = routes.find(route => route.method === 'OPTIONS');

      expect(commonJsRoute).toBeDefined();
      expect(commonJsRoute?.handler).toBeDefined();
    });

    it('should ignore files with unsupported extensions', () => {
      // Create files with unsupported extensions
      writeFileSync(join(testDir, 'users', 'get.txt'), 'not a route');
      writeFileSync(join(testDir, 'users', 'post.json'), '{"not": "a route"}');

      const routes = scanRoutes(testDir);
      const textRoutes = routes.filter(route => route.path.includes('.txt') || route.path.includes('.json'));

      expect(textRoutes.length).toBe(0);
    });

    it('should handle complex nested directory structures', () => {
      // Create complex nested structure
      const deepPath = join(testDir, 'api', 'v1', 'users', '[userId]', 'posts', '[postId]');
      mkdirSync(deepPath, { recursive: true });
      writeFileSync(join(deepPath, 'get.ts'), 'export default (req: any, res: any) => res.json({});');

      const routes = scanRoutes(testDir);
      const deepRoute = routes.find(route => route.path === '/api/v1/users/:userId/posts/:postId');

      expect(deepRoute).toBeDefined();
      expect(deepRoute?.method).toBe('GET');
    });
  });

  describe('registerRoutes', () => {
    it('should register routes to express app', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      };

      registerRoutes(mockApp, { dir: testDir });

      // Check that routes were registered
      expect(mockApp.get).toHaveBeenCalled();
      expect(mockApp.post).toHaveBeenCalled();
    });

    it('should apply prefix correctly', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      };

      const controllersPath = join(process.cwd(), 'examples', 'express-app', 'controllers');
      registerRoutes(mockApp, {
        dir: controllersPath,
        prefix: '/api',
      });

      // Check that all routes have the prefix
      const getCalls = mockApp.get.mock.calls;
      getCalls.forEach(([path]) => {
        expect((path as string).startsWith('/api')).toBe(true);
      });
    });

    it('should disable logging when logEnabled is false', () => {
      // Clear any previous calls to console.log
      mockConsoleLog.mockClear();

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: testDir,
        logEnabled: false,
      });

      // Console.log should not be called when logEnabled is false
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });    it('should enable logging by default', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: testDir,
      });

      // Console.log should be called
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('should handle non-existent directory gracefully', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      const nonExistentDir = join(testDir, 'non-existent');

      // Should not throw error
      expect(() => {
        registerRoutes(mockApp, {
          dir: nonExistentDir,
        });
      }).not.toThrow();

      // Should log error
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should support all HTTP methods', () => {
      // Create additional test files for different HTTP methods
      writeFileSync(join(testDir, 'put.ts'), 'export default (req: any, res: any) => res.json({});');
      writeFileSync(join(testDir, 'delete.ts'), 'export default (req: any, res: any) => res.json({});');
      writeFileSync(join(testDir, 'patch.ts'), 'export default (req: any, res: any) => res.json({});');

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: testDir,
        logEnabled: false,
      });

      // Check that all methods were called
      expect(mockApp.put).toHaveBeenCalled();
      expect(mockApp.delete).toHaveBeenCalled();
      expect(mockApp.patch).toHaveBeenCalled();
    });

    it('should handle JavaScript files', () => {
      // Create a .js file
      writeFileSync(join(testDir, 'users', 'head.js'), 'module.exports = (req, res) => res.json({});');

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
        head: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: testDir,
        logEnabled: false,
      });

      // Check that head method was called
      expect(mockApp.head).toHaveBeenCalled();
    });

    it('should ignore non-route files', () => {
      // Create non-route files
      writeFileSync(join(testDir, 'utils.ts'), 'export const helper = () => {};');
      writeFileSync(join(testDir, 'invalid.ts'), 'export default (req: any, res: any) => res.json({});');

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: testDir,
        logEnabled: false,
      });

      // Should only register valid routes (get and post from users directory)
      expect(mockApp.get).toHaveBeenCalled();
      expect(mockApp.post).toHaveBeenCalled();
    });

    it('should handle empty directory', () => {
      const emptyDir = join(testDir, 'empty');
      mkdirSync(emptyDir, { recursive: true });

      const mockApp = {
        get: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: emptyDir,
        logEnabled: true,
      });

      // Should log warning about no routes found
      expect(mockConsoleLog).toHaveBeenCalledWith('⚠️  No routes found');
    });

    it('should handle malformed route files', () => {
      // Create a malformed file
      writeFileSync(join(testDir, 'malformed.ts'), 'invalid syntax {{{');

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      registerRoutes(mockApp, {
        dir: testDir,
        logEnabled: true,
      });

      // Should still register valid routes
      expect(mockApp.get).toHaveBeenCalled();
      expect(mockApp.post).toHaveBeenCalled();

      // Should log error for malformed file
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });
});
