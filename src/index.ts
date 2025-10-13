/**
 * Auto Route Registrar
 */

// Export types
export type { RouteHandler, RouteDefinition, RouteWizardOptions } from './types.js'

// Export main API
export { routeWizard } from './middleware.js'

// Export framework adapters (conditionally exported)
// Note: These are not included in the main bundle to keep package size small
// Users should import them directly:
// import { expressRouteWizard } from '@chaeco/route-wizard/adapters/express'
// import { koaRouteWizard } from '@chaeco/route-wizard/adapters/koa'

// Re-export for convenience (only when explicitly imported)
// export { expressRouteWizard, type ExpressRouteWizardOptions } from './adapters/express.js'
// export { koaRouteWizard, type KoaRouteWizardOptions } from './adapters/koa.js'
