"use strict";
/**
 * Performance monitoring utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = void 0;
class PerformanceMonitor {
    constructor() {
        this.startTime = Date.now();
        this.requestCount = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.totalResponseTime = 0;
        this.routeScanTimes = [];
    }
    /**
     * Record a route scan operation
     */
    recordRouteScan(duration) {
        this.routeScanTimes.push(duration);
        // Keep only last 100 measurements
        if (this.routeScanTimes.length > 100) {
            this.routeScanTimes.shift();
        }
    }
    /**
     * Record a cache hit
     */
    recordCacheHit() {
        this.cacheHits++;
    }
    /**
     * Record a cache miss
     */
    recordCacheMiss() {
        this.cacheMisses++;
    }
    /**
     * Record a request with response time
     */
    recordRequest(responseTime) {
        this.requestCount++;
        this.totalResponseTime += responseTime;
    }
    /**
     * Get current performance metrics
     */
    getMetrics() {
        const totalCacheRequests = this.cacheHits + this.cacheMisses;
        const cacheHitRate = totalCacheRequests > 0 ? this.cacheHits / totalCacheRequests : 0;
        const averageRouteScanTime = this.routeScanTimes.length > 0
            ? this.routeScanTimes.reduce((a, b) => a + b, 0) / this.routeScanTimes.length
            : 0;
        const averageResponseTime = this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0;
        return {
            routeScanTime: averageRouteScanTime,
            cacheHitRate,
            totalRequests: this.requestCount,
            averageResponseTime,
            memoryUsage: process.memoryUsage(),
            uptime: Date.now() - this.startTime,
        };
    }
    /**
     * Reset all metrics
     */
    reset() {
        this.startTime = Date.now();
        this.requestCount = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.totalResponseTime = 0;
        this.routeScanTimes = [];
    }
    /**
     * Get metrics summary as string
     */
    getMetricsSummary() {
        const metrics = this.getMetrics();
        const uptimeMinutes = Math.floor(metrics.uptime / 60000);
        return `
Performance Metrics:
- Uptime: ${uptimeMinutes} minutes
- Total Requests: ${metrics.totalRequests}
- Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms
- Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%
- Average Route Scan Time: ${metrics.routeScanTime.toFixed(2)}ms
- Memory Usage: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB heap used
    `.trim();
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
