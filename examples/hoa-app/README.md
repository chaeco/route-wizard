# Hoa.js + Route Wizard Example

This example demonstrates how to use `@chaeco/route-wizard` with [Hoa.js](https://hoa-js.com/), a minimal Web framework built on Web Standards.

## Features

- ⚡ File-based automatic route registration
- 🚀 Zero configuration routing
- 📁 Clean controller organization
- 🔄 Hot reload in development
- 🛠️ Web Standards compatible

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
hoa-app/
├── app.js              # Main Hoa application
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
export default async (ctx) => {
  ctx.res.body = {
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
}
```

## Configuration

The route wizard is configured in `app.js`:

```javascript
app.use(hoaRouteWizard({
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

This example works with any Web Standards compatible runtime:

- **Node.js** (recommended for development and production)
- **Deno**
- **Bun**
- **Cloudflare Workers**
- **Vercel Edge Functions**

## Learn More

- [Route Wizard Documentation](../../README.md)
- [Hoa.js Documentation](https://hoa-js.com/)
- [Web Standards](https://developer.mozilla.org/en-US/docs/Web/API)
