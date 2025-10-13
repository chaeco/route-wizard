# Hono + Route Wizard Example

This example demonstrates how to use `@chaeco/route-wizard` with [Hono](https://hono.dev/), a fast, lightweight web framework for Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js.

## Features

- ⚡ **Ultra Fast**: Built on Web Standards with zero overhead
- 🌍 **Multi-runtime**: Works across different JavaScript runtimes
- 📁 **File-based routing**: Automatic route registration from file structure
- 🚀 **Zero configuration**: No manual route registration required
- 🔄 **Hot reload**: Development-friendly with file watching
- 🛠️ **TypeScript ready**: Full type safety support

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
hono-app/
├── app.js              # Main Hono application
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
export default async (c) => {
  return c.json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  })
}
```

## Configuration

The route wizard is configured in `app.js`:

```javascript
app.use('*', honoRouteWizard({
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

## Runtime Support

This example works with any Hono-supported runtime:

- **Node.js** (recommended for development and production)
- **Deno**
- **Bun**
- **Cloudflare Workers**
- **Vercel Edge Functions**
- **Netlify Functions**
- **AWS Lambda**
- **Fastly Compute**

## Learn More

- [Route Wizard Documentation](../../README.md)
- [Hono Documentation](https://hono.dev/)
- [Web Standards](https://developer.mozilla.org/en-US/docs/Web/API)
