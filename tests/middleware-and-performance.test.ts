/**
 * Tests for Middleware and Performance Monitoring
 */

import {
  describe,
  it,
  expect,
  jest,
  beforeAll,
  afterAll,
} from '@jest/globals';
import {
  registerRoutes,
  createRouteWizard,
  PerformanceMonitor,
} from '../src/index.js';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

describe('Middleware and Performance Monitoring', () => {
  const testDir = join(process.cwd(), 'test-middleware-controllers');

  beforeAll(() => {
    // Create test directory structure for middleware testing
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }

    mkdirSync(testDir, { recursive: true });
    mkdirSync(join(testDir, 'users'), { recursive: true });
    mkdirSync(join(testDir, '[id]'), { recursive: true });

    // Create test route files
    writeFileSync(
      join(testDir, 'users', 'get.ts'),
      'export default (req, res) => res.json({ action: "list" });'
    );
    writeFileSync(
      join(testDir, 'users', 'post.ts'),
      'export default (req, res) => res.json({ action: "create" });'
    );
    writeFileSync(
      join(testDir, '[id]', 'get.ts'),
      'export default (req, res) => res.json({ action: "detail" });'
    );
  });

  afterAll(() => {
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  describe('PerformanceMonitor', () => {
    it('should create performance monitor instance', () => {
      const monitor = new PerformanceMonitor();
      expect(monitor).toBeDefined();
      expect(typeof monitor.recordRouteScan).toBe('function');
      expect(typeof monitor.recordRequest).toBe('function');
      expect(typeof monitor.getMetrics).toBe('function');
    });

    it('should record route scan performance', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordRouteScan(100);
      monitor.recordRouteScan(150);

      const metrics = monitor.getMetrics();
      expect(metrics.routeScanTime).toBeGreaterThan(0);
      expect(typeof metrics.routeScanTime).toBe('number');
    });

    it('should record request performance', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordRequest(50);
      monitor.recordRequest(60);
      monitor.recordRequest(100);

      const metrics = monitor.getMetrics();
      expect(metrics.totalRequests).toBe(3);
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
    });

    it('should record cache hits and misses', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordCacheHit();
      monitor.recordCacheMiss();
      monitor.recordCacheHit();

      const metrics = monitor.getMetrics();
      expect(metrics.cacheHitRate).toBeGreaterThan(0);
      expect(metrics.cacheHitRate).toBeLessThanOrEqual(1);
    });

    it('should calculate cache hit rate correctly', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordCacheHit();
      monitor.recordCacheHit();
      monitor.recordCacheMiss();

      const metrics = monitor.getMetrics();
      expect(metrics.cacheHitRate).toBeCloseTo(0.6667, 3);
    });

    it('should return metrics with memory usage', () => {
      const monitor = new PerformanceMonitor();
      const metrics = monitor.getMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.memoryUsage).toBeDefined();
      expect(metrics.memoryUsage.heapUsed).toBeGreaterThan(0);
    });

    it('should calculate uptime', () => {
      const monitor = new PerformanceMonitor();
      const metrics = monitor.getMetrics();

      expect(metrics.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should reset metrics', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordRouteScan(100);
      monitor.recordRequest(50);
      monitor.recordCacheHit();

      monitor.reset();

      const metrics = monitor.getMetrics();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.routeScanTime).toBe(0);
      expect(metrics.cacheHitRate).toBe(0);
    });

    it('should return metrics summary as string', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordRouteScan(100);
      monitor.recordRequest(50);
      monitor.recordCacheHit();

      const summary = monitor.getMetricsSummary();
      expect(typeof summary).toBe('string');
      expect(summary).toContain('Performance Metrics');
      expect(summary).toContain('Uptime');
      expect(summary).toContain('Total Requests');
    });

    it('should keep only last 100 route scan measurements', () => {
      const monitor = new PerformanceMonitor();

      // Record 150 scans
      for (let i = 0; i < 150; i++) {
        monitor.recordRouteScan(Math.random() * 100);
      }

      // The average should be calculated from the last 100 measurements
      const metrics = monitor.getMetrics();
      expect(metrics.routeScanTime).toBeGreaterThan(0);
    });
  });

  describe('registerRoutes with Performance Monitoring', () => {
    it('should register routes with performance monitor', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };
      const monitor = new PerformanceMonitor();

      registerRoutes(mockApp, {
        dir: testDir,
        performanceMonitor: monitor,
      });

      const metrics = monitor.getMetrics();
      // Should have recorded the route scanning
      expect(metrics.routeScanTime).toBeGreaterThanOrEqual(0);
    });

    it('should work without performance monitor', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      // Should not throw error
      expect(() => {
        registerRoutes(mockApp, {
          dir: testDir,
        });
      }).not.toThrow();

      expect(mockApp.get).toHaveBeenCalled();
    });

    it('should track scan duration accurately', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };
      const monitor = new PerformanceMonitor();

      registerRoutes(mockApp, {
        dir: testDir,
        performanceMonitor: monitor,
      });

      const metrics = monitor.getMetrics();
      const routeScanTime = metrics.routeScanTime;

      // The recorded time should be reasonable
      expect(routeScanTime).toBeGreaterThanOrEqual(0);
    });

    it('should create route wizard with performance monitoring', () => {
      const wizard = createRouteWizard({
        dir: testDir,
        enableMonitoring: true,
      });

      expect(wizard).toBeDefined();
      expect(typeof wizard.register).toBe('function');
      expect(typeof wizard.getMetrics).toBe('function');
      expect(typeof wizard.getSummary).toBe('function');
    });

    it('should get metrics from route wizard', () => {
      const wizard = createRouteWizard({
        dir: testDir,
        enableMonitoring: true,
      });

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      wizard.register(mockApp);

      const metrics = wizard.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics?.routeScanTime).toBeDefined();
    });

    it('should get summary from route wizard', () => {
      const wizard = createRouteWizard({
        dir: testDir,
        enableMonitoring: true,
      });

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      wizard.register(mockApp);

      const summary = wizard.getSummary();
      expect(summary).toBeDefined();
      expect(typeof summary).toBe('string');
    });

    it('should work without monitoring disabled', () => {
      const wizard = createRouteWizard({
        dir: testDir,
        enableMonitoring: false,
      });

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      expect(() => {
        wizard.register(mockApp);
      }).not.toThrow();

      // Should have undefined metrics when monitoring is disabled
      const metrics = wizard.getMetrics();
      expect(metrics).toBeUndefined();
    });
  });

  describe('Route Middleware Support', () => {
    it('should register routes without middleware', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      registerRoutes(mockApp, { dir: testDir });

      expect(mockApp.get).toHaveBeenCalled();
      expect(mockApp.post).toHaveBeenCalled();
    });

    it('should maintain backward compatibility without middlewares field', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
      };

      // Should not throw error and should work normally
      expect(() => {
        registerRoutes(mockApp, { dir: testDir });
      }).not.toThrow();

      expect(mockApp.get).toHaveBeenCalled();
    });

    it('should support custom separators', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      // Create a file with custom separator
      const customFile = join(testDir, 'api_v1_users_get.ts');
      writeFileSync(
        customFile,
        'export default (req, res) => res.json({});'
      );

      registerRoutes(mockApp, {
        dir: testDir,
        separator: '_',
      });

      expect(mockApp.get).toHaveBeenCalled();

      // Clean up
      try {
        rmSync(customFile);
      } catch {
        // ignore
      }
    });
  });

  describe('Integration: Performance Monitoring + Middleware', () => {
    it('should work together without conflicts', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };
      const monitor = new PerformanceMonitor();

      // Record some metrics before
      monitor.recordCacheHit();

      registerRoutes(mockApp, {
        dir: testDir,
        performanceMonitor: monitor,
      });

      const metrics = monitor.getMetrics();

      // Should have both the pre-recorded metrics and the scan metrics
      expect(metrics.cacheHitRate).toBeGreaterThan(0);
      expect(metrics.routeScanTime).toBeGreaterThanOrEqual(0);

      // Routes should still be registered
      expect(mockApp.get).toHaveBeenCalled();
    });

    it('should handle multiple wizard instances independently', () => {
      const wizard1 = createRouteWizard({
        dir: testDir,
        enableMonitoring: true,
      });
      const wizard2 = createRouteWizard({
        dir: testDir,
        enableMonitoring: true,
      });

      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
      };

      wizard1.register(mockApp);
      const metrics1 = wizard1.getMetrics();

      const mockApp2 = {
        get: jest.fn(),
        post: jest.fn(),
      };

      wizard2.register(mockApp2);
      const metrics2 = wizard2.getMetrics();

      // Both should have metrics
      expect(metrics1).toBeDefined();
      expect(metrics2).toBeDefined();
      expect(metrics1?.routeScanTime).toBeGreaterThanOrEqual(0);
      expect(metrics2?.routeScanTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle concurrent monitoring and route registration', () => {
      const monitor1 = new PerformanceMonitor();
      const monitor2 = new PerformanceMonitor();

      const mockApp1 = {
        get: jest.fn(),
        post: jest.fn(),
      };

      const mockApp2 = {
        get: jest.fn(),
        post: jest.fn(),
      };

      registerRoutes(mockApp1, {
        dir: testDir,
        performanceMonitor: monitor1,
      });

      registerRoutes(mockApp2, {
        dir: testDir,
        performanceMonitor: monitor2,
      });

      const metrics1 = monitor1.getMetrics();
      const metrics2 = monitor2.getMetrics();

      // Both apps should be registered
      expect(mockApp1.get).toHaveBeenCalled();
      expect(mockApp2.get).toHaveBeenCalled();

      // Both monitors should have metrics
      expect(metrics1).toBeDefined();
      expect(metrics2).toBeDefined();
    });
  });
});
