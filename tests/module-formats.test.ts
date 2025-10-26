/**
 * Tests for CommonJS and ES6 module format support
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { scanRoutes } from '../src/index.js';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import type { Route } from '../src/scanner';

describe('Module Format Support (CommonJS and ES6)', () => {
  const testDir = join(process.cwd(), 'test-module-formats');

  beforeAll(() => {
    // Cleanup before tests
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
    mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    // Cleanup after tests
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should load ES6 export default format', () => {
    const controllerDir = join(testDir, 'es6-test', 'users');
    mkdirSync(controllerDir, { recursive: true });

    writeFileSync(
      join(controllerDir, 'get.ts'),
      'export default (req, res) => res.json({ format: "ES6" });'
    );

    const routes = scanRoutes(join(testDir, 'es6-test'));
    
    expect(routes).toHaveLength(1);
    expect(routes[0].method).toBe('GET');
    expect(routes[0].path).toBe('/users');
    expect(typeof routes[0].handler).toBe('function');
  });

  it('should load CommonJS module.exports format', () => {
    const controllerDir = join(testDir, 'cjs-test', 'products');
    mkdirSync(controllerDir, { recursive: true });

    writeFileSync(
      join(controllerDir, 'get.js'),
      'module.exports = (req, res) => res.json({ format: "CommonJS" });'
    );

    const routes = scanRoutes(join(testDir, 'cjs-test'));
    
    expect(routes).toHaveLength(1);
    expect(routes[0].method).toBe('GET');
    expect(routes[0].path).toBe('/products');
    expect(typeof routes[0].handler).toBe('function');
  });

  it('should support mixed ES6 and CommonJS in same project', () => {
    const es6Dir = join(testDir, 'mixed-test', 'api');
    const cjsDir = join(testDir, 'mixed-test', 'routes');
    mkdirSync(es6Dir, { recursive: true });
    mkdirSync(cjsDir, { recursive: true });

    // Create ES6 file
    writeFileSync(
      join(es6Dir, 'get.ts'),
      'export default (req, res) => res.json({ type: "ES6 API" });'
    );

    // Create CommonJS file
    writeFileSync(
      join(cjsDir, 'get.js'),
      'module.exports = (req, res) => res.json({ type: "CommonJS Routes" });'
    );

    const routes = scanRoutes(join(testDir, 'mixed-test'));
    
    expect(routes.length).toBe(2);
    
    const apiRoute = routes.find((r: Route) => r.path === '/api');
    const routesRoute = routes.find((r: Route) => r.path === '/routes');
    
    expect(apiRoute).toBeDefined();
    expect(routesRoute).toBeDefined();
    expect(typeof apiRoute?.handler).toBe('function');
    expect(typeof routesRoute?.handler).toBe('function');
  });

  it('should handle dynamic parameters with CommonJS format', () => {
    const controllerDir = join(testDir, 'cjs-params', 'items', '[id]');
    mkdirSync(controllerDir, { recursive: true });

    writeFileSync(
      join(controllerDir, 'get.js'),
      'module.exports = (req, res) => res.json({ id: req.params.id });'
    );

    const routes = scanRoutes(join(testDir, 'cjs-params'));
    
    expect(routes).toHaveLength(1);
    expect(routes[0].method).toBe('GET');
    expect(routes[0].path).toBe('/items/:id');
    expect(typeof routes[0].handler).toBe('function');
  });

  it('should handle filename-based routing with CommonJS format', () => {
    const controllerDir = join(testDir, 'cjs-filename');
    mkdirSync(controllerDir, { recursive: true });

    writeFileSync(
      join(controllerDir, 'users.[id].get.js'),
      'module.exports = (req, res) => res.json({ id: req.params.id });'
    );

    const routes = scanRoutes(controllerDir);
    
    expect(routes).toHaveLength(1);
    expect(routes[0].method).toBe('GET');
    expect(routes[0].path).toBe('/users/:id');
    expect(typeof routes[0].handler).toBe('function');
  });
});
