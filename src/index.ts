/**
 * Route Wizard - File-based automatic route registration
 */

export { scanRoutes, Route } from './scanner.js';
export { registerRoutes, RegisterOptions } from './registrar.js';

// Simple usage example:
//
// import { registerRoutes } from '@chaeco/route-wizard'
//
// registerRoutes(app, {
//   dir: './controllers',
//   prefix: '/api',
//   logEnabled: true
// })
