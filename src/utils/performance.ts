/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  routeScanTime: number;
  cacheHitRate: number;
  totalRequests: number;
  averageResponseTime: number;
  memoryUsage: ReturnType<typeof process.memoryUsage>;
  uptime: number;
}

export class PerformanceMonitor {
  private startTime: number = Date.now();
  private requestCount: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private totalResponseTime: number = 0;
  private routeScanTimes: number[] = [];

  /**
   * Record a route scan operation
   */
  recordRouteScan(duration: number): void {
    this.routeScanTimes.push(duration);
    // Keep only last 100 measurements
    if (this.routeScanTimes.length > 100) {
      this.routeScanTimes.shift();
    }
  }

  /**
   * Record a cache hit
   */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  /**
   * Record a cache miss
   */
  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  /**
   * Record a request with response time
   */
  recordRequest(responseTime: number): void {
    this.requestCount++;
    this.totalResponseTime += responseTime;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const totalCacheRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalCacheRequests > 0 ? this.cacheHits / totalCacheRequests : 0;

    const averageRouteScanTime =
      this.routeScanTimes.length > 0
        ? this.routeScanTimes.reduce((a, b) => a + b, 0) / this.routeScanTimes.length
        : 0;

    const averageResponseTime =
      this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0;

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
  reset(): void {
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
  getMetricsSummary(): string {
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
