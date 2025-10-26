/**
 * Route Wizard - File-based automatic route registration
 */

export { scanRoutes, Route } from './scanner.js';
export {
  registerRoutes,
  routeWizard,
  createRouteWizard,
  RegisterOptions,
} from './registrar.js';
export { PerformanceMonitor, PerformanceMetrics } from './utils/performance.js';

// Simple usage example:
//
// import { registerRoutes } from '@chaeco/route-wizard'
//
// registerRoutes(app, {
//   dir: './controllers',
//   prefix: '/api',
//   logEnabled: true
// })
