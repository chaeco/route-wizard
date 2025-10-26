# CommonJS Module Format Support

## Overview

Route-wizard fully supports both **ES6** and **CommonJS** module formats. This guide demonstrates how to use CommonJS `module.exports` format in your controllers.

## Examples

### ES6 Format (Default)

```typescript
// controllers/users/get.ts
export default async (req, res) => {
  const users = await db.users.findMany();
  res.json(users);
};
```

### CommonJS Format

```javascript
// controllers/users/get.js
module.exports = async (req, res) => {
  const users = await db.users.findMany();
  res.json(users);
};
```

## Mixed Formats

You can freely mix both formats in the same project:

```text
controllers/
├── users/
│   ├── get.ts              # ES6 format
│   ├── post.js             # CommonJS format
│   └── [id]/
│       ├── get.ts          # ES6 format
│       └── delete.js       # CommonJS format
├── products.get.ts         # Filename-based, ES6
└── products.post.js        # Filename-based, CommonJS
```

## With Middleware

### ES6 Format with Middleware

```typescript
// controllers/admin/users/get.ts
export default {
  handler: async (req, res) => {
    const users = await db.users.findMany();
    res.json(users);
  },
  middlewares: [authenticate, authorize('admin')],
};
```

### CommonJS Format with Middleware

```javascript
// controllers/admin/users/get.js
module.exports = {
  handler: async (req, res) => {
    const users = await db.users.findMany();
    res.json(users);
  },
  middlewares: [authenticate, authorize('admin')],
};
```

## HTTP Methods Support

Both formats work with all HTTP methods:

```javascript
// controllers/users/get.js
module.exports = (req, res) => res.json({ method: 'GET' });

// controllers/users/post.js
module.exports = (req, res) => res.json({ method: 'POST' });

// controllers/users.[id]/put.js
module.exports = (req, res) => res.json({ id: req.params.id });

// controllers/users.[id]/delete.js
module.exports = (req, res) => res.json({ deleted: true });
```

## Dynamic Parameters

Both formats support dynamic parameters:

```javascript
// controllers/users/[userId]/posts/[postId]/get.js
module.exports = async (req, res) => {
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

## Optional Parameters

Both formats support optional parameters:

```javascript
// controllers/search/[[query]]/get.js
module.exports = async (req, res) => {
  const { query } = req.params;

  if (query) {
    const results = await searchDatabase(query);
    res.json({ query, results });
  } else {
    res.json({ message: 'Search endpoint - add query param' });
  }
};
```

## Framework Integration

CommonJS format works seamlessly with all supported frameworks:

### Express

```javascript
// app.js
const express = require('express');
const { registerRoutes } = require('@chaeco/route-wizard');

const app = express();
app.use(express.json());

registerRoutes(app, { dir: './controllers' });

app.listen(3000);
```

### Koa

```javascript
// app.js
const Koa = require('koa');
const { registerRoutes } = require('@chaeco/route-wizard');

const app = new Koa();
registerRoutes(app, { dir: './controllers' });

app.listen(3000);
```

### Fastify

```javascript
// app.js
const fastify = require('fastify');
const { registerRoutes } = require('@chaeco/route-wizard');

const app = fastify();
registerRoutes(app, { dir: './controllers' });

app.listen({ port: 3000 });
```

## Migration Guide

If you want to convert existing TypeScript controllers to CommonJS:

**Before (TypeScript ES6):**
```typescript
// controllers/users/get.ts
export default async (req, res) => {
  res.json({});
};
```

**After (JavaScript CommonJS):**
```javascript
// controllers/users/get.js
module.exports = async (req, res) => {
  res.json({});
};
```

Or keep your TypeScript but use CommonJS:

```typescript
// controllers/users/get.ts
export = async (req, res) => {
  res.json({});
};
```

## Performance Notes

- No performance difference between ES6 and CommonJS formats
- Module loading is cached for optimal performance
- Both formats have identical overhead during route registration

## Troubleshooting

### Handler not recognized

Ensure your CommonJS export is a **function**, not an object:

**❌ Wrong:**
```javascript
module.exports = {
  method: 'GET',
  path: '/users',
};
```

**✅ Correct:**
```javascript
module.exports = async (req, res) => {
  res.json({});
};
```

### Middleware with CommonJS

When using middleware with CommonJS, export an object with both `handler` and `middlewares`:

```javascript
module.exports = {
  handler: async (req, res) => {
    res.json({});
  },
  middlewares: [authenticate],
};
```

---

For more information, see the [main README](./README.md).
