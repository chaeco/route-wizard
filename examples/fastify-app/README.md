# Fastify + Route Wizard Example

This example demonstrates how to use `@chaeco/route-wizard` with [Fastify](https://www.fastify.io/), a fast and low overhead web framework for Node.js.

## Features

- ⚡ **Ultra Fast**: One of the fastest web frameworks for Node.js
- 🏗️ **Plugin Architecture**: Extensible through plugins
- 📁 **File-based routing**: Automatic route registration from file structure
- 🚀 **Zero configuration**: No manual route registration required
- 🔄 **Hot reload**: Development-friendly with file watching
- 🛡️ **Built-in validation**: Schema validation and serialization

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

```
fastify-app/
├── app.js              # Main Fastify application
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
module.exports = async (request, reply) => {
  // Access request object
  const method = request.method

  // Use reply object to set headers
  reply.header('X-API-Version', '1.0')

  return {
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
}
```

## Configuration

The route wizard is configured in `app.js` as a Fastify plugin:

```javascript
fastify.register(async (fastifyInstance, opts, done) => {
  // Route wizard middleware
  fastifyInstance.addHook('preHandler', fastifyRouteWizard({
    controllersPath: './controllers',    // Path to controllers directory
    routePrefix: 'api',                  // API prefix (/api/*)
    logEnabled: true,                    // Enable logging
    enableCache: true,                   // Cache routes for performance
    enableWatch: process.env.NODE_ENV === 'development' // Hot reload
  }))

  done()
})
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

## Performance

Fastify is known for its exceptional performance. This example leverages Fastify's:

- **Fast JSON serialization** with `fast-json-stringify`
- **Efficient routing** with radix tree
- **Plugin system** for modular architecture
- **Built-in logging** with Pino

## Learn More

- [Route Wizard Documentation](../../README.md)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Fastify Ecosystem](https://www.fastify.io/ecosystem/)
