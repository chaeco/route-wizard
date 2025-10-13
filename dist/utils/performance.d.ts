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
export declare class PerformanceMonitor {
    private startTime;
    private requestCount;
    private cacheHits;
    private cacheMisses;
    private totalResponseTime;
    private routeScanTimes;
    /**
     * Record a route scan operation
     */
    recordRouteScan(duration: number): void;
    /**
     * Record a cache hit
     */
    recordCacheHit(): void;
    /**
     * Record a cache miss
     */
    recordCacheMiss(): void;
    /**
     * Record a request with response time
     */
    recordRequest(responseTime: number): void;
    /**
     * Get current performance metrics
     */
    getMetrics(): PerformanceMetrics;
    /**
     * Reset all metrics
     */
    reset(): void;
    /**
     * Get metrics summary as string
     */
    getMetricsSummary(): string;
}
