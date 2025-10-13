# @chaeco/route-wizard

[![NPM version](https://img.shields.io/npm/v/@chaeco/route-wizard.svg)](https://npmjs.org/package/@chaeco/route-wizard)
[![Build Status](https://img.shields.io/github/actions/workflow/status/chaeco/route-wizard/ci.yml?branch=main)](https://github.com/chaeco/route-wizard/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-47.44%25-yellow.svg)](https://github.com/chaeco/route-wizard)
[![Codecov](https://codecov.io/gh/chaeco/route-wizard/branch/main/graph/badge.svg)](https://codecov.io/gh/chaeco/route-wizard)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@chaeco/route-wizard)](https://bundlephobia.com/result?p=@chaeco/route-wizard)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://github.com/chaeco/route-wizard/blob/main/package.json)
[![License](https://img.shields.io/github/license/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![GitHub issues](https://img.shields.io/github/issues/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/pulls)
[![Last commit](https://img.shields.io/github/last-commit/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/commits/main)

File-based automatic route registrar for Node.js frameworks with zero configuration. Stop manually registering routes and let your file structure do the work!

## Features

- 📁 **File-driven routing**: Automatically generate routes from file structure with zero configuration
- 🔄 **Hot reload**: Development-friendly with file watching for automatic route updates
- 🏗️ **Multi-framework support**: Extensible design supporting Express, Koa, Hoa.js, Hono, Fastify, and NestJS
- 📝 **Full TypeScript support**: Complete type definitions for better development experience
- ⚡ **High performance**: Dynamic imports and intelligent caching mechanism
- 🧩 **Plugin architecture**: Easy to extend with custom adapters for new frameworks
- 🎯 **Convention over configuration**: Sensible defaults with extensive customization options
- 🛡️ **Production ready**: Comprehensive test coverage and battle-tested in production

## Installation

```bash
npm install @chaeco/route-wizard
```

## Quick Start

### 1. Create controller files

Create route files in the `controllers` directory:

```javascript
// controllers/get-users.js
module.exports = async (ctx) => {
  ctx.body = { users: [] }
}

// controllers/post-login.js
module.exports = async (ctx) => {
  const { username, password } = ctx.request.body
  // Handle login logic
  ctx.body = { token: '...' }
}
```

### 2. Use the middleware

```javascript
const { routeWizard } = require('@chaeco/route-wizard')

// Use in your application
app.use(routeWizard({
  controllersPath: './controllers' // Optional, defaults to './controllers'
}))
```

### TypeScript Example

```typescript
import { routeWizard } from '@chaeco/route-wizard'

interface User {
  id: number
  name: string
}

// controllers/get-users.ts
export default async (ctx: any) => {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
  ctx.body = { users }
}

// controllers/post-login.ts
export default async (ctx: any) => {
  const { username, password } = ctx.request.body
  // Handle login logic
  ctx.body = { token: 'jwt-token-here' }
}

// In your main app
app.use(routeWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

## File Naming Convention

Route files must follow these naming conventions:

- `get-users.js` → `GET /users`
- `post-login.js` → `POST /login`
- `put-update-profile.js` → `PUT /update-profile`
- `delete-account.js` → `DELETE /account`

Supported HTTP methods: `get`, `post`, `put`, `delete`, `patch`, `head`, `options`

## Directory Structure

```text
controllers/
├── auth/
│   ├── post-login.js
│   ├── post-register.js
│   └── post-logout.js
├── users/
│   ├── get-profile.js
│   ├── put-update-profile.js
│   ├── get-users.js
│   └── delete-user.js
├── products/
│   ├── get-products.js
│   ├── post-products.js
│   ├── get-product.js
│   └── put-product.js
├── orders/
│   ├── get-orders.js
│   └── post-orders.js
└── get-health.js
```

This will generate the following routes:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /users/profile`
- `PUT /users/update-profile`
- `GET /users` (get-users.js)
- `DELETE /users/user` (delete-user.js)
- `GET /products`
- `POST /products`
- `GET /products/product`
- `PUT /products/product`
- `GET /orders`
- `POST /orders`
- `GET /health`

## API

### routeWizard(options)

Creates automatic route registration middleware.

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `controllersPath` | `string` | Path to controllers directory | `'./controllers'` |
| `methodMappings` | `Record<string, HttpMethod>` | Custom method mappings | Standard HTTP method mappings |
| `separator` | `string` | Separator between file prefix and route name | `'-'` |
| `ignorePatterns` | `string[]` | Array of glob patterns for files/directories to ignore | `[]` |
| `logEnabled` | `boolean` | Whether to enable logging output | `true` |
| `routePrefix` | `string` | Prefix to add to all routes | `''` |
| `enableCache` | `boolean` | Whether to enable route caching | `true` |
| `cacheTtl` | `number` | Cache expiration time in milliseconds | `30000` (30 seconds) |
| `enableWatch` | `boolean` | Whether to enable file watching for hot reload | `false` |
| `watchOptions` | `object` | File watching options | `{}` |

#### Returns

Middleware function that can be used with frameworks that support middleware.

#### Complete Configuration Example

```javascript
const { routeWizard } = require('@chaeco/route-wizard')

// Complete configuration example
app.use(routeWizard({
  controllersPath: './controllers',
  methodMappings: {
    'get': 'GET',
    'post': 'POST',
    'ip_post': 'POST'
  },
  separator: '_',
  ignorePatterns: [
    '**/*.test.js',    // Ignore test files
    '**/*.spec.js',    // Ignore spec files
    '**/index.js',     // Ignore index files
    'config/**'        // Ignore config directory
  ],
  logEnabled: true,    // Enable logging output
  routePrefix: 'api',  // Add /api prefix to all routes
  enableCache: true,   // Enable route caching
  cacheTtl: 60000      // Cache for 1 minute
}))
```

This will scan the controllers directory but ignore all test files, index files, and config directory, and add the `/api` prefix to all routes.

## Caching Mechanism

To improve performance, route-wizard enables route caching by default:

- **Cache Key**: Generated based on configuration parameters (controllersPath, methodMappings, separator, ignorePatterns, routePrefix)
- **Cache Expiration**: Default 30 seconds, customizable via `cacheTtl` option
- **Cache Invalidation**: Cache automatically invalidates when configuration changes

```javascript
// Disable caching (re-scan on every request)
app.use(routeWizard({
  enableCache: false
}))

// Custom cache time (5 minutes)
app.use(routeWizard({
  cacheTtl: 300000
}))
```

## File Watching (Hot Reload)

When file watching is enabled, route cache is automatically cleared when controller files change, ensuring hot reload experience during development:

```javascript
// Enable file watching
app.use(routeWizard({
  enableWatch: true,
  watchOptions: {
    persistent: true,
    ignored: ['**/*.log', '**/node_modules/**']
  }
}))
```

File watching will:

- Monitor controller directory for file changes
- Clear route cache when files are modified, added, or deleted
- Automatically re-scan and register routes on next request
- Support ignoring specific files or directories

**Note**: File watching is primarily for development environments. It is recommended to disable it in production for better performance.

For example, `get-users.js` will generate the route `GET /api/users` instead of `GET /users`.

## Framework Adapters

Route-wizard provides adapters for popular Node.js frameworks that can be imported individually:

### Express

```javascript
const { expressRouteWizard } = require('@chaeco/route-wizard/adapters/express')

app.use(expressRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

### Koa

```javascript
const { koaRouteWizard } = require('@chaeco/route-wizard/adapters/koa')

app.use(koaRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

### Hoa

```javascript
const { hoaRouteWizard } = require('@chaeco/route-wizard/adapters/hoa')

app.use(hoaRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

### Hono

```javascript
const { honoRouteWizard } = require('@chaeco/route-wizard/adapters/hono')

app.use('*', honoRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

### Fastify

```javascript
const { fastifyRouteWizard } = require('@chaeco/route-wizard/adapters/fastify')

fastify.register(fastifyRouteWizard, {
  controllersPath: './controllers',
  routePrefix: 'api'
})
```

### NestJS

```typescript
const { nestjsRouteWizard } = require('@chaeco/route-wizard/adapters/nestjs')

@Injectable()
export class RouteWizardService implements OnModuleInit {
  private middleware: ReturnType<typeof nestjsRouteWizard>

  onModuleInit() {
    this.middleware = nestjsRouteWizard({
      controllersPath: './src/controllers',
      routePrefix: 'api'
    })
  }

  getMiddleware() {
    return this.middleware
  }
}
```

## Examples

Check out the `examples/` directory for complete working applications demonstrating route-wizard with different frameworks:

- **[Express.js Example](examples/express-app/)** - Traditional Express.js integration with middleware support
- **[Koa.js Example](examples/koa-app/)** - Next-generation framework with async/await patterns
- **[Fastify Example](examples/fastify-app/)** - High-performance framework with schema validation
- **[Hono Example](examples/hono-app/)** - Lightweight framework for edge computing and multiple runtimes
- **[Hoa.js Example](examples/hoa-app/)** - Minimal Web Standards-based framework

Each example includes:

- Sample controllers demonstrating different HTTP methods
- Configuration examples
- Development and production scripts
- Complete project setup with package.json
- Sample controllers demonstrating different HTTP methods
- Configuration examples
- Development and production scripts
- README with detailed setup instructions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/chaeco/route-wizard.git
cd route-wizard

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Run linting
npm run lint
```

## License

MIT
