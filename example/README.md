# Route Wizard V2 Example

This directory contains a complete example of how to use Route Wizard V2 with Express.js.

## Features Demonstrated

- ✅ File-based routing
- ✅ Dynamic parameters (`[id]`, `[userId]`, `[postId]`)
- ✅ Optional parameters (`[[query]]`)
- ✅ Nested routes
- ✅ Multiple HTTP methods (GET, POST)
- ✅ API prefix configuration
- ✅ Logging control

## Directory Structure

```text
examples/
├── app.js                 # Main Express application
├── package.json           # Dependencies
├── controllers/           # Route controllers
│   ├── users/
│   │   ├── get.js         # GET /api/users
│   │   ├── post.js        # POST /api/users
│   │   └── [id]/
│   │       └── get.js     # GET /api/users/:id
│   └── search/
│       └── [[query]]/
│           └── get.js     # GET /api/search/:query?
└── README.md             # This file
```

## Running the Example

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. For development with hot reload:

   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`.

## API Endpoints

### Users

- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID

### Search

- `GET /api/search` - Search without query
- `GET /api/search/:query` - Search with query parameter

### Health Check

- `GET /health` - Server health check

## Route Registration

The routes are automatically registered using:

```javascript
const { registerRoutes } = require('@chaeco/route-wizard')

registerRoutes(app, {
  dir: './controllers',
  prefix: '/api',
  logEnabled: true
})
```

## Adding New Routes

To add a new route, simply create a new file in the `controllers` directory following the naming convention:

- `METHOD.js` for root routes (e.g., `get.js`, `post.js`)
- `[param]/METHOD.js` for dynamic routes (e.g., `[id]/get.js`)
- `[[param]]/METHOD.js` for optional parameters (e.g., `[[query]]/get.js`)

Supported HTTP methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
