# Route Wizard V2 Example

This directory contains a complete example of how to use Route Wizard V2 with Express.js.

## Features Demonstrated

- ✅ File-based routing (folder-based)
- ✅ Filename-based routing (embedded paths)
- ✅ Dynamic parameters (`[id]`, `[userId]`, `[postId]`)
- ✅ Optional parameters (`[[query]]`)
- ✅ Nested routes
- ✅ Multiple HTTP methods (GET, POST)
- ✅ API prefix configuration
- ✅ Custom separator support
- ✅ Depth limiting
- ✅ Logging control

## Directory Structure

```text
examples/
├── app.js                 # Main Express application
├── package.json           # Dependencies
├── controllers/           # Route controllers
│   ├── users/
│   │   ├── get.js         # GET /api/users (folder-based)
│   │   ├── post.js        # POST /api/users
│   │   ├── [id]/
│   │   │   └── get.js     # GET /api/users/:id (folder-based)
│   │   ├── [userId]/
│   │   │   └── posts/
│   │   │       └── [postId]/
│   │   │           └── get.js # GET /api/users/:userId/posts/:postId
│   │   ├── [id].get.js    # GET /api/users/:id (filename-based)
│   │   └── [id].posts.get.js # GET /api/users/:id/posts (filename-based)
│   ├── api_status.get.js  # GET /api/api_status (filename-based)
│   └── search/
│       └── [[query]]/
│           └── get.js     # GET /api/search/:query?
└── README.md             # This file
```

## Route Examples

### Folder-based Routing (Legacy)
```text
controllers/users/get.js                    → GET /api/users
controllers/users/[id]/get.js               → GET /api/users/:id
controllers/users/[userId]/posts/[postId]/get.js → GET /api/users/:userId/posts/:postId
```

### Filename-based Routing (New)
```text
controllers/users.[id].get.js               → GET /api/users/:id
controllers/users.[id].posts.get.js         → GET /api/users/:id/posts
controllers/api_status.get.js               → GET /api/api_status
```

### Optional Parameters
```text
controllers/search/[[query]]/get.js         → GET /api/search/:query?
```

### Custom Separator
```javascript
registerRoutes(app, {
  dir: './controllers',
  separator: '_',  // Use underscore instead of dot
  maxDepth: 5      // Limit route depth
});
```

With custom separator:
```text
controllers/users_[id]_posts_get.js → GET /api/users/:id/posts
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
- `GET /api/users/:id` - Get user by ID (folder-based)
- `GET /api/users/:id` - Get user by ID (filename-based)
- `GET /api/users/:userId/posts/:postId` - Get specific post by user
- `GET /api/users/:id/posts` - Get user's posts (filename-based)

### Search

- `GET /api/search/:query?` - Search with optional query

### API Status

- `GET /api/api_status` - API status endpoint (filename-based)

### Health Check

- `GET /health` - Health check endpoint

## Configuration Options

The example demonstrates various configuration options:

### Default Configuration
```javascript
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api',
  logEnabled: true
});
```

### Custom Configuration
```javascript
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api/v2',
  separator: '_',  // Custom separator
  maxDepth: 5,     // Maximum route depth
  logEnabled: true
});
```

## Testing the Routes

You can test the routes using curl:

```bash
# List users
curl http://localhost:3000/api/users

# Get user by ID (folder-based)
curl http://localhost:3000/api/users/123

# Get user by ID (filename-based)
curl http://localhost:3000/api/users/456

# Get user's posts (filename-based)
curl http://localhost:3000/api/users/123/posts

# Get specific post by user
curl http://localhost:3000/api/users/123/posts/789

# Search
curl http://localhost:3000/api/search/nodejs

# API status
curl http://localhost:3000/api/api_status

# Health check
curl http://localhost:3000/health
```
