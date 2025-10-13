# Route Wizard Express Example

This is an example Express.js application demonstrating how to use `@chaeco/route-wizard` for automatic route registration.

## Features Demonstrated

- File-based routing with automatic registration
- Route prefixing (`/api`)
- JSON request/response handling
- Error handling middleware
- Hot reload in development mode
- Route caching for performance

## Project Structure

```text
express-app/
├── controllers/
│   ├── get-users.js      # GET /api/users
│   └── post-login.js     # POST /api/login
├── app.js                # Main application file
├── package.json          # Dependencies
└── README.md            # This file
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

4. Test the endpoints:

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

## Available Routes

- `GET /api/users` - Returns a list of users
- `POST /api/login` - Authenticates a user
- `GET /health` - Health check endpoint

## Configuration

The route wizard is configured in `app.js` with the following options:

```javascript
app.use(expressRouteWizard({
  controllersPath: './controllers',    // Path to controllers directory
  routePrefix: 'api',                  // Prefix all routes with /api
  logEnabled: true,                    // Enable logging
  enableCache: true,                   // Enable route caching
  enableWatch: process.env.NODE_ENV === 'development' // Hot reload in dev
}))
```

## Adding New Routes

To add a new route, simply create a new file in the `controllers/` directory following the naming convention:

- `get-users.js` → `GET /api/users`
- `post-create-user.js` → `POST /api/create-user`
- `put-update-user.js` → `PUT /api/update-user`
- `delete-user.js` → `DELETE /api/user`

The file should export a function that takes Express `(req, res)` parameters.
