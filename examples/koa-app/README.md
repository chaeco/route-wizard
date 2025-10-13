# Koa + Route Wizard Example

This example demonstrates how to use `@chaeco/route-wizard` with [Koa](https://koajs.com/), a next-generation web framework for Node.js.

## Features

- 🚀 **Next-gen Framework**: Modern async/await based architecture
- 📁 **File-based routing**: Automatic route registration from file structure
- 🚀 **Zero configuration**: No manual route registration required
- 🔄 **Hot reload**: Development-friendly with file watching
- 🏗️ **Modular**: Composable middleware architecture
- ⚡ **Lightweight**: Minimal core with powerful plugins

## Installation

```bash
npm install
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

## API Endpoints

### Auto-registered Routes

- `GET /api/users` - Get all users
- `POST /api/login` - User authentication

### Manual Routes

- `GET /health` - Health check endpoint

## Project Structure

```text
koa-app/
├── app.js              # Main Koa application
├── controllers/        # Route controllers (auto-registered)
│   ├── get-users.js    # GET /api/users
│   └── post-login.js   # POST /api/login
└── package.json
```

## Controllers

Controllers are simple JavaScript modules that export a default function. The filename determines the HTTP method and route path:

- `get-users.js` → `GET /api/users`
- `post-login.js` → `POST /api/login`

Example controller:

```javascript
// controllers/get-users.js
module.exports = async (ctx) => {
  // Access context to demonstrate usage
  const method = ctx.method

  // Set a custom header
  ctx.set('X-API-Version', '1.0')

  ctx.body = {
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ],
    timestamp: new Date().toISOString(),
    method
  }
}
```

## Configuration

The route wizard is configured in `app.js`:

```javascript
const { koaRouteWizard } = require('@chaeco/route-wizard')

// Route wizard middleware
app.use(koaRouteWizard({
  controllersPath: './controllers',    // Path to controllers directory
  routePrefix: 'api',                  // API prefix (/api/*)
  logEnabled: true,                    // Enable logging
  enableCache: true,                   // Cache routes for performance
  enableWatch: process.env.NODE_ENV === 'development' // Hot reload
}))
```

## Testing the API

```bash
# Get users
curl http://localhost:3000/api/users

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Health check
curl http://localhost:3000/health
```

## Modern JavaScript

This integration leverages:

- **Koa's async context**: Modern async/await patterns
- **Route-wizard simplicity**: File-based routing with zero configuration
- **Middleware composition**: Powerful and flexible middleware system
- **ES6+ features**: Modern JavaScript throughout

## Learn More

- [Route Wizard Documentation](../../README.md)
- [Koa Documentation](https://koajs.com/)
- [Koa Ecosystem](https://github.com/koajs)
