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

**File-based automatic route registration for Node.js frameworks with zero configuration. Stop manually registering routes and let your file structure do the work!**

## ✨ Features

- 📁 **File-driven routing**: Automatically generate routes from file structure with zero configuration
- 🏗️ **Multi-framework support**: Extensible design supporting Express, Koa, Hoa.js, Hono, Fastify, and NestJS
- 📝 **Full TypeScript support**: Complete type definitions for better development experience
- ⚡ **High performance**: Synchronous scanning with zero runtime overhead
- 🧩 **Framework agnostic**: Works with any Node.js framework that supports route registration
- 🎯 **Convention over configuration**: Sensible defaults with extensive customization options
- 🛡️ **Production ready**: Comprehensive test coverage and battle-tested in production
- 🔄 **Dynamic parameters**: Support for nested and optional parameters

## 🚀 Installation

```bash
npm install @chaeco/route-wizard
```

## 🎯 Quick Start

### 1. Create controller files

Create route files in the `controllers` directory:

```typescript
// controllers/users/get.ts
export default async (req, res) => {
  const users = await db.users.findMany();
  res.json(users);
};

// controllers/users/post.ts
export default async (req, res) => {
  const user = await db.users.create({ data: req.body });
  res.json(user);
};

// controllers/users/[id]/get.ts
export default async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
  });
  res.json(user);
};
```

### 2. Register routes

```typescript
import express from 'express';
import { registerRoutes } from '@chaeco/route-wizard';

const app = express();
app.use(express.json());

// Register routes - that's it!
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api', // optional
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 3. Your routes are ready

```text
GET    /api/users          # List all users
POST   /api/users          # Create user
GET    /api/users/:id      # Get user by ID
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

## 📁 File Convention

Route-wizard uses a clean, intuitive file structure with support for both folder-based and filename-based routing:

### Folder-based (legacy):

```text
controllers/
├── users/
│   ├── get.ts              # GET /users
│   ├── post.ts             # POST /users
│   └── [id]/
│       ├── get.ts          # GET /users/:id
│       ├── put.ts          # PUT /users/:id
│       └── delete.ts       # DELETE /users/:id
├── users/
│   └── [userId]/
│       └── posts/
│           ├── get.ts              # GET /users/:userId/posts
│           └── [postId]/
│               └── get.ts          # GET /users/:userId/posts/:postId
└── search/
    └── [[query]]/
        └── get.ts                  # GET /search/:query?
```

### Filename-based (recommended for deep nesting):

```text
controllers/
├── users.get.ts            # GET /users
├── users.post.ts           # POST /users
├── users.[id].get.ts       # GET /users/:id
├── users.[id].put.ts       # PUT /users/:id
├── users.[id].delete.ts    # DELETE /users/:id
├── users.[userId].posts.get.ts          # GET /users/:userId/posts
├── users.[userId].posts.[postId].get.ts # GET /users/:userId/posts/:postId
└── search.[[query]].get.ts               # GET /search/:query?
```

### Parameter Types

- `[param]` → `:param` (required parameter)
- `[[param]]` → `:param?` (optional parameter)

## 🔧 Advanced Usage

### Custom Separator

You can customize the separator used in filename-based routing:

```typescript
registerRoutes(app, {
  dir: './controllers',
  separator: '_', // Use underscore instead of dot
});
```

With underscore separator:

```text
controllers/
├── api_users.get.ts        # GET /api/users
├── users_[id].get.ts       # GET /users/:id
└── users_[id]_posts.get.ts # GET /users/:id/posts
```

### Depth Limiting

Limit the maximum route depth to prevent overly complex URLs:

```typescript
registerRoutes(app, {
  dir: './controllers',
  maxDepth: 3, // Maximum 3 path segments
});
```

Routes exceeding the depth limit will be ignored.

### Multiple Parameters

```typescript
// controllers/users/[userId]/posts/[postId]/get.ts
export default async (req, res) => {
  const { userId, postId } = req.params;
  const post = await db.posts.findFirst({
    where: {
      id: parseInt(postId),
      userId: parseInt(userId),
    },
  });
  res.json({ post });
};
```

### Optional Parameters

```typescript
// controllers/search/[[query]]/get.ts
export default async (req, res) => {
  const { query } = req.params;

  if (query) {
    const results = await searchDatabase(query);
    res.json({ query, results });
  } else {
    res.json({ message: 'Search endpoint - add query param' });
  }
};
```

### Framework Support

Route-wizard supports multiple frameworks:

```typescript
// Express
import express from 'express';
import { registerRoutes } from '@chaeco/route-wizard';

const app = express();
registerRoutes(app, { dir: './controllers' });

// Koa
import Koa from 'koa';
import { registerRoutes } from '@chaeco/route-wizard';

const app = new Koa();
registerRoutes(app, { dir: './controllers' });

// Fastify
import fastify from 'fastify';
import { registerRoutes } from '@chaeco/route-wizard';

const app = fastify();
registerRoutes(app, { dir: './controllers' });
```

## 📚 API Reference

### `registerRoutes(app, options)`

Register routes to your application.

#### Parameters

- `app`: Framework app instance (Express, Koa, Fastify, etc.)
- `options`: Configuration options

#### Options

- `dir` (string): Path to controllers directory (default: `'./controllers'`)
- `prefix` (string): Route prefix (default: `''`)
- `logEnabled` (boolean): Enable logging (default: `true`)

#### Example

```typescript
registerRoutes(app, {
  dir: './routes',
  prefix: '/api',
  logEnabled: false,
});
```

## 📄 License

MIT © [chaeco](https://github.com/chaeco)

## 🤝 Contributing

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
