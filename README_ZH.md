# @chaeco/route-wizard# @chaeco/route-wizard# @chaeco/route-wizard# @chaeco/route-wizard



[![NPM version](https://img.shields.io/npm/v/@chaeco/route-wizard.svg)](https://npmjs.org/package/@chaeco/route-wizard)

[![Build Status](https://img.shields.io/github/actions/workflow/status/chaeco/route-wizard/ci.yml?branch=main)](https://github.com/chaeco/route-wizard/actions)

[![Test Coverage](https://img.shields.io/badge/coverage-67.47%25-yellow.svg)](https://github.com/chaeco/route-wizard)[![NPM version](https://img.shields.io/npm/v/@chaeco/route-wizard.svg)](https://npmjs.org/package/@chaeco/route-wizard)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)[![Build Status](https://img.shields.io/github/actions/workflow/status/chaeco/route-wizard/ci.yml?branch=main)](https://github.com/chaeco/route-wizard/actions)



**基于文件的自动路由注册器，为 Node.js 框架提供零配置的路由管理。**[![Test Coverage](https://img.shields.io/badge/coverage-67.47%25-yellow.svg)](https://github.com/chaeco/route-wizard)[![NPM version](https://img.shields.io/npm/v/@chaeco/route-wizard.svg)](https://npmjs.org/package/@chaeco/route-wizard)[![NPM version](https://img.shields.io/npm/v/@chaeco/route-wizard.svg)](https://npmjs.org/package/@chaeco/route-wizard)



## ✨ 特性[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)



- 📁 **文件驱动路由**: 通过文件结构自动生成路由，零配置[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)[![Build Status](https://img.shields.io/github/actions/workflow/status/chaeco/route-wizard/ci.yml?branch=main)](https://github.com/chaeco/route-wizard/actions)[![Build Status](https://img.shields.io/github/actions/workflow/status/chaeco/route-wizard/ci.yml?branch=main)](https://github.com/chaeco/route-wizard/actions)

- 🏗️ **多框架支持**: 支持 Express、Koa、Fastify 等框架

- 📝 **完整 TypeScript 支持**: 完整的类型定义

- ⚡ **高性能**: 同步扫描，零运行时开销

- 🎯 **约定优于配置**: 合理的默认值和广泛的自定义选项**基于文件的自动路由注册器，为 Node.js 框架提供零配置的路由管理。**[![Test Coverage](https://img.shields.io/badge/coverage-67.47%25-yellow.svg)](https://github.com/chaeco/route-wizard)[![Test Coverage](https://img.shields.io/badge/coverage-47.44%25-yellow.svg)](https://github.com/chaeco/route-wizard)

- 🔌 **中间件支持**: 为每个路由添加中间件

- 📊 **性能监控**: 内置性能指标跟踪



## 🚀 安装## ✨ 特性[![Codecov](https://codecov.io/gh/chaeco/route-wizard/branch/main/graph/badge.svg)](https://codecov.io/gh/chaeco/route-wizard)[![Codecov](https://codecov.io/gh/chaeco/route-wizard/branch/main/graph/badge.svg)](https://codecov.io/gh/chaeco/route-wizard)



```bash

npm install @chaeco/route-wizard

```- 📁 **文件驱动路由**: 通过文件结构自动生成路由，零配置[![Bundle Size](https://img.shields.io/bundlephobia/min/@chaeco/route-wizard)](https://bundlephobia.com/result?p=@chaeco/route-wizard)[![Bundle Size](https://img.shields.io/bundlephobia/min/@chaeco/route-wizard)](https://bundlephobia.com/result?p=@chaeco/route-wizard)



## 🎯 快速开始- 🏗️ **多框架支持**: 支持 Express、Koa、Fastify 等框架



### 1. 创建控制器文件- 📝 **完整 TypeScript 支持**: 完整的类型定义[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://github.com/chaeco/route-wizard/blob/main/package.json)[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://github.com/chaeco/route-wizard/blob/main/package.json)



在 `controllers` 目录下创建路由文件：- ⚡ **高性能**: 同步扫描，零运行时开销



```typescript- 🎯 **约定优于配置**: 合理的默认值和广泛的自定义选项[![License](https://img.shields.io/github/license/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/blob/main/LICENSE)[![License](https://img.shields.io/github/license/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/blob/main/LICENSE)

// controllers/users/get.ts

export default async (req, res) => {- 🔌 **中间件支持**: 为每个路由添加中间件

  const users = await db.users.findMany();

  res.json(users);- 📊 **性能监控**: 内置性能指标跟踪[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

};

```



### 2. 注册路由## 🚀 安装[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)



```typescript

import express from 'express';

import { registerRoutes } from '@chaeco/route-wizard';```bash[![GitHub issues](https://img.shields.io/github/issues/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/issues)[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)



const app = express();npm install @chaeco/route-wizard

registerRoutes(app, {

  dir: './controllers',```[![GitHub pull requests](https://img.shields.io/github/issues-pr/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/pulls)[![GitHub issues](https://img.shields.io/github/issues/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/issues)

  prefix: '/api',

});

```

## 🎯 快速开始[![Last commit](https://img.shields.io/github/last-commit/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/commits/main)[![GitHub pull requests](https://img.shields.io/github/issues-pr/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/pulls)

### 3. 你的路由已准备好



```text

GET  /api/users### 1. 创建控制器文件[![Last commit](https://img.shields.io/github/last-commit/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/commits/main)

POST /api/users

GET  /api/users/:id

```

在 `controllers` 目录下创建路由文件：**基于文件的自动路由注册器，为 Node.js 框架提供零配置的路由管理。停止手动注册路由，让你的文件结构为你工作！**

## 📁 路由文件约定



支持两种路由方式：

```typescript基于文件的自动路由注册器，为 Node.js 框架提供零配置的路由管理。停止手动注册路由，让你的文件结构为你工作！

### 方式一：基于文件夹

// controllers/users/get.ts

```text

controllers/export default async (req, res) => {## ✨ 特性

├── users/

│   ├── get.ts        # GET /users  const users = await db.users.findMany();

│   ├── post.ts       # POST /users

│   └── [id]/  res.json(users);## ✨ 特性

│       └── get.ts    # GET /users/:id

```};



### 方式二：基于文件名```- 📁 **文件驱动路由**: 通过文件结构自动生成路由，零配置



```text

controllers/

├── users.get.ts           # GET /users### 2. 注册路由- 🏗️ **多框架支持**: 可扩展设计，支持 Express、Koa、Fastify 和 NestJS- 📁 **文件驱动路由**: 通过文件结构自动生成路由，零配置

├── users.post.ts          # POST /users

├── users.[id].get.ts      # GET /users/:id

```

```typescript- 📝 **完整 TypeScript 支持**: 完整的类型定义，提供更好的开发体验- 🏗️ **多框架支持**: 可扩展设计，支持 Express、Koa、Hoa.js、Hono、Fastify 和 NestJS

## 🔧 中间件支持

import express from 'express';

```typescript

// controllers/users/get.tsimport { registerRoutes } from '@chaeco/route-wizard';- ⚡ **高性能**: 同步扫描，零运行时开销- 📝 **完整 TypeScript 支持**: 完整的类型定义，提供更好的开发体验

const authenticate = (req, res, next) => {

  if (!req.headers.authorization) {

    return res.status(401).json({ error: 'Unauthorized' });

  }const app = express();- 🧩 **框架无关**: 适用于任何支持路由注册的 Node.js 框架- ⚡ **高性能**: 同步扫描，零运行时开销

  next();

};registerRoutes(app, {



export default {  dir: './controllers',- 🎯 **约定优于配置**: 合理的默认值和广泛的自定义选项- 🧩 **插件架构**: 易于扩展，支持为新框架创建自定义适配器

  handler: async (req, res) => {

    const users = await db.users.findMany();  prefix: '/api',

    res.json(users);

  },});- 🛡️ **生产就绪**: 全面的测试覆盖率和生产环境验证- 🎯 **约定优于配置**: 合理的默认值和广泛的自定义选项

  middlewares: [authenticate],

};```

```

- 🔄 **动态参数**: 支持嵌套和可选参数- 🛡️ **生产就绪**: 全面的测试覆盖率和生产环境验证

## 📊 性能监控

### 3. 路由已就绪

```typescript

import { PerformanceMonitor, createRouteWizard } from '@chaeco/route-wizard';- 🔄 **动态参数**: 支持嵌套和可选参数



// 方式 1: 使用 PerformanceMonitor```

const monitor = new PerformanceMonitor();

registerRoutes(app, {GET  /api/users## 🚀 安装

  dir: './controllers',

  performanceMonitor: monitor,POST /api/users

});

```## 🚀 安装

const metrics = monitor.getMetrics();

console.log(`Route scan time: ${metrics.routeScanTime}ms`);



// 方式 2: 使用路由向导## 📁 文件约定```bash

const wizard = createRouteWizard({

  dir: './controllers',

  enableMonitoring: true,

});支持两种路由方式：npm install @chaeco/route-wizard```bash



wizard.register(app);

console.log(wizard.getMetrics());

```### 基于文件夹```npm install @chaeco/route-wizard



## 📚 API 参考



### registerRoutes(app, options)``````



#### 参数controllers/



- `app`: 框架应用实例├── users/## 🎯 快速开始

- `options`: 配置选项

│   ├── get.ts        # GET /users

#### 配置选项

│   ├── post.ts       # POST /users## 🎯 快速开始

- `dir` (string): 控制器目录路径

- `prefix` (string): 路由前缀│   └── [id]/

- `logEnabled` (boolean): 是否启用日志 (默认: true)

- `separator` (string): 文件名分隔符 (默认: '.')│       └── get.ts    # GET /users/:id### 1. 创建控制器文件

- `maxDepth` (number): 最大路由深度

- `performanceMonitor` (PerformanceMonitor): 性能监控器实例```



### createRouteWizard(options)### 1. 创建控制器文件



创建一个具有性能监控的路由向导。### 基于文件名



#### 返回值在 `controllers` 目录下创建路由文件：



- `register(app)`: 注册路由```

- `getMetrics()`: 获取性能指标

- `getSummary()`: 获取指标总结controllers/在 `controllers` 目录下创建路由文件：



### PerformanceMonitor├── users.get.ts           # GET /users



#### 公开方法├── users.post.ts          # POST /users```typescript



- `recordRouteScan(duration: number)`: 记录路由扫描时长├── users.[id].get.ts      # GET /users/:id

- `recordRequest(responseTime: number)`: 记录请求响应时间

- `recordCacheHit()`: 记录缓存命中```// controllers/users/get.ts```typescript

- `recordCacheMiss()`: 记录缓存未命中

- `getMetrics()`: 获取当前指标

- `getMetricsSummary()`: 获取格式化总结

## 🔧 中间件支持export default async (req, res) => {// controllers/users/get.ts

## 📄 许可证



MIT © [chaeco](https://github.com/chaeco)

```typescript  const users = await db.users.findMany();export default async (req, res) => {

// controllers/users/get.ts

const authenticate = (req, res, next) => {  res.json(users);  const users = await db.users.findMany();

  if (!req.headers.authorization) {

    return res.status(401).json({ error: 'Unauthorized' });};  res.json(users);

  }

  next();};

};

// controllers/users/post.ts

export default {

  handler: async (req, res) => {export default async (req, res) => {// controllers/users/post.ts

    const users = await db.users.findMany();

    res.json(users);  const user = await db.users.create({ data: req.body });export default async (req, res) => {

  },

  middlewares: [authenticate],  res.json(user);  const user = await db.users.create({ data: req.body });

};

```};  res.json(user);



## 📊 性能监控};



```typescript// controllers/users/[id]/get.ts

import { PerformanceMonitor, createRouteWizard } from '@chaeco/route-wizard';

export default async (req, res) => {// controllers/users/[id]/get.ts

// 方式 1: 使用 PerformanceMonitor

const monitor = new PerformanceMonitor();  const user = await db.users.findUnique({export default async (req, res) => {

registerRoutes(app, {

  dir: './controllers',    where: { id: req.params.id },  const user = await db.users.findUnique({

  performanceMonitor: monitor,

});  });    where: { id: req.params.id },



const metrics = monitor.getMetrics();  res.json(user);  });

console.log(`Route scan time: ${metrics.routeScanTime}ms`);

};  res.json(user);

// 方式 2: 使用路由向导

const wizard = createRouteWizard({```};

  dir: './controllers',

  enableMonitoring: true,```

});

### 2. 注册路由

wizard.register(app);

console.log(wizard.getMetrics());### 2. 注册路由

```

```typescript

## 📚 API 参考

import express from 'express';```typescript

### `registerRoutes(app, options)`

import { registerRoutes } from '@chaeco/route-wizard';import express from 'express';

#### 参数

import { registerRoutes } from '@chaeco/route-wizard';

- `app`: 框架应用实例

- `options`: 配置选项const app = express();



#### 选项app.use(express.json());const app = express();



- `dir` (string): 控制器目录路径app.use(express.json());

- `prefix` (string): 路由前缀

- `logEnabled` (boolean): 是否启用日志 (默认: `true`)// 注册路由 - 就是这么简单！

- `separator` (string): 文件名分隔符 (默认: `'.'`)

- `maxDepth` (number): 最大路由深度registerRoutes(app, {// 注册路由 - 就是这么简单！

- `performanceMonitor` (PerformanceMonitor): 性能监控器实例

  dir: './controllers',registerRoutes(app, {

### `createRouteWizard(options)`

  prefix: '/api', // 可选  dir: './controllers',

创建一个具有性能监控的路由向导。

});  prefix: '/api', // 可选

#### 返回

});

- `register(app)`: 注册路由

- `getMetrics()`: 获取性能指标app.listen(3000, () => {

- `getSummary()`: 获取指标总结

  console.log('服务器运行在 http://localhost:3000');app.listen(3000, () => {

### `PerformanceMonitor`

});  console.log('服务器运行在 http://localhost:3000');

#### 方法

```});

- `recordRouteScan(duration: number)`: 记录路由扫描时长

- `recordRequest(responseTime: number)`: 记录请求响应时间```

- `recordCacheHit()`: 记录缓存命中

- `recordCacheMiss()`: 记录缓存未命中### 3. 你的路由已就绪

- `getMetrics()`: 获取当前指标

- `getMetricsSummary()`: 获取格式化总结### 3. 你的路由已就绪



## 📄 许可证```text



MIT © [chaeco](https://github.com/chaeco)GET    /api/users          # 获取所有用户```text


POST   /api/users          # 创建用户GET    /api/users          # 获取所有用户

GET    /api/users/:id      # 根据ID获取用户POST   /api/users          # 创建用户

PUT    /api/users/:id      # 更新用户GET    /api/users/:id      # 根据ID获取用户

DELETE /api/users/:id      # 删除用户PUT    /api/users/:id      # 更新用户

```DELETE /api/users/:id      # 删除用户

```

## 📁 文件约定

## 📁 文件约定

Route-wizard 支持文件夹式和文件名嵌入式两种路由方式，同时保持向后兼容性：

Route-wizard 使用清晰直观的文件结构：

### 文件夹式（传统）

```text

```textcontrollers/

controllers/├── users/

├── users/│   ├── get.ts              # GET /users

│   ├── get.ts              # GET /users│   ├── post.ts             # POST /users

│   ├── post.ts             # POST /users│   └── [id]/

│   └── [id]/│       ├── get.ts          # GET /users/:id

│       ├── get.ts          # GET /users/:id│       ├── put.ts          # PUT /users/:id

│       ├── put.ts          # PUT /users/:id│       └── delete.ts       # DELETE /users/:id

│       └── delete.ts       # DELETE /users/:id├── users/

├── users/│   └── [userId]/

│   └── [userId]/│       └── posts/

│       └── posts/│           ├── get.ts              # GET /users/:userId/posts

│           ├── get.ts              # GET /users/:userId/posts│           └── [postId]/

│           └── [postId]/│               └── get.ts          # GET /users/:userId/posts/:postId

│               └── get.ts          # GET /users/:userId/posts/:postId└── search/

└── search/    └── [[query]]/

    └── [[query]]/        └── get.ts                  # GET /search/:query?

        └── get.ts                  # GET /search/:query?```

```

### 参数类型

### 文件名式（推荐用于深层嵌套）

- `[param]` → `:param` (必需参数)

```text- `[[param]]` → `:param?` (可选参数)

controllers/

├── users.get.ts            # GET /users## 🔧 高级用法

├── users.post.ts           # POST /users

├── users.[id].get.ts       # GET /users/:id### 多参数

├── users.[id].put.ts       # PUT /users/:id

├── users.[id].delete.ts    # DELETE /users/:id```typescript

├── users.[userId].posts.get.ts          # GET /users/:userId/posts// controllers/users/[userId]/posts/[postId]/get.ts

├── users.[userId].posts.[postId].get.ts # GET /users/:userId/posts/:postIdexport default async (req, res) => {

└── search.[[query]].get.ts               # GET /search/:query?  const { userId, postId } = req.params;

```  const post = await db.posts.findFirst({

    where: {

### 参数类型      id: parseInt(postId),

      userId: parseInt(userId),

- `[param]` → `:param` (必需参数)    },

- `[[param]]` → `:param?` (可选参数)  });

  res.json({ post });

## 🔧 高级用法};

```

### 自定义分隔符

### 可选参数

你可以为文件名路由自定义分隔符：

```typescript

```typescript// controllers/search/[[query]]/get.ts

registerRoutes(app, {export default async (req, res) => {

  dir: './controllers',  const { query } = req.params

  separator: '_', // 使用下划线代替点

});  if (query) {

```    const results = await searchDatabase(query)

    res.json({ query, results })

使用下划线分隔符：  } else {

│   ├── get-orders.js

```text│   └── post-orders.js

controllers/└── get-health.js

├── api_users.get.ts        # GET /api/users```

├── users_[id].get.ts       # GET /users/:id

└── users_[id]_posts.get.ts # GET /users/:id/posts这将生成以下路由：

```

- `POST /auth/login`

### 深度限制- `POST /auth/register`

- `POST /auth/logout`

限制路由的最大深度以防止过于复杂的 URL：- `GET /users/profile`

- `PUT /users/update-profile`

```typescript- `GET /users` (get-users.js)

registerRoutes(app, {- `DELETE /users/user` (delete-user.js)

  dir: './controllers',- `GET /products`

  maxDepth: 3, // 最多 3 个路径段- `POST /products`

});- `GET /products/product`

```- `PUT /products/product`

- `GET /orders`

超过深度限制的路由将被忽略。- `POST /orders`

- `GET /health`

### 多个参数

## API

```typescript

// controllers/users/[userId]/posts/[postId]/get.ts### `scanRoutes(options)`

export default async (req, res) => {

  const { userId, postId } = req.params;扫描路由目录并返回路由配置数组。

  const post = await db.posts.findFirst({

    where: {#### scanRoutes 参数

      id: parseInt(postId),

      userId: parseInt(userId),| 参数         | 类型      | 描述                 | 默认值            |

    },| ------------ | --------- | -------------------- | ----------------- |

  });| `dir`        | `string`  | 控制器目录路径       | `'./controllers'` |

  res.json({ post });| `prefix`     | `string`  | 为所有路由添加的前缀 | `''`              |

};| `logEnabled` | `boolean` | 是否启用日志输出     | `true`            |

```

#### 返回

### 可选参数

`RouteConfig[]` - 路由配置数组

```typescript

// controllers/search/[[query]]/get.ts#### scanRoutes 示例

export default async (req, res) => {

  const { query } = req.params;```typescript

import { scanRoutes } from '@chaeco/route-wizard';

  if (query) {

    const results = await searchDatabase(query);const routes = scanRoutes({

    res.json({ query, results });  dir: './routes',

  } else {  prefix: '/api',

    res.json({ message: '搜索端点 - 添加查询参数' });  logEnabled: false,

  }});

};

```console.log(routes);

// [

### 框架支持//   { method: 'GET', path: '/api/users', handler: [Function] },

//   { method: 'POST', path: '/api/users', handler: [Function] },

Route-wizard 支持多种框架：//   ...

// ]

```typescript```

// Express

import express from 'express';### `registerRoutes(app, options)`

import { registerRoutes } from '@chaeco/route-wizard';

扫描路由目录并直接注册到应用实例。

const app = express();

registerRoutes(app, { dir: './controllers' });#### registerRoutes 参数



// Koa| 参数         | 类型      | 描述                       | 默认值            |

import Koa from 'koa';| ------------ | --------- | -------------------------- | ----------------- |

import { registerRoutes } from '@chaeco/route-wizard';| `app`        | `any`     | 应用实例（Express、Koa等） | -                 |

| `dir`        | `string`  | 控制器目录路径             | `'./controllers'` |

const app = new Koa();| `prefix`     | `string`  | 为所有路由添加的前缀       | `''`              |

registerRoutes(app, { dir: './controllers' });| `logEnabled` | `boolean` | 是否启用日志输出           | `true`            |



// Fastify#### registerRoutes 示例

import fastify from 'fastify';

import { registerRoutes } from '@chaeco/route-wizard';```typescript

import { registerRoutes } from '@chaeco/route-wizard';

const app = fastify();

registerRoutes(app, { dir: './controllers' });registerRoutes(app, {

```  dir: './routes',

  prefix: '/api',

## 📚 API 参考  logEnabled: false,

});

### `registerRoutes(app, options)````



向应用注册路由。## 贡献指南



#### 参数欢迎贡献！请随时提交 Pull Request。对于重大更改，请先打开 issue 讨论您想要更改的内容。



- `app`: 框架应用实例（Express、Koa、Fastify 等）### 开发设置

- `options`: 配置选项

```bash

#### 选项# 克隆仓库

git clone https://github.com/chaeco/route-wizard.git

- `dir` (string): 控制器目录路径（默认：`'./controllers'`）cd route-wizard

- `prefix` (string): 路由前缀（默认：`''`）

- `logEnabled` (boolean): 是否启用日志（默认：`true`）# 安装依赖

- `separator` (string): 文件名分隔符（默认：`'.'`）npm install

- `maxDepth` (number): 最大路由深度（默认：`10`）

# 运行测试

#### 示例npm test



```typescript# 运行带覆盖率的测试

registerRoutes(app, {npm run test:coverage

  dir: './routes',

  prefix: '/api',# 构建项目

  separator: '_',npm run build

  maxDepth: 5,

  logEnabled: true,# 运行代码检查

});npm run lint

``````



## 📄 许可证## 示例



MIT © [chaeco](https://github.com/chaeco)查看 `examples/` 目录中的完整工作应用程序，演示了 route-wizard 与不同框架的集成：



## 🤝 贡献指南- **[Express.js 示例](examples/express-app/)** - 传统 Express.js 集成

- **[Koa.js 示例](examples/koa-app/)** - 下一代框架，支持 async/await 模式

欢迎贡献！请随时提交 Pull Request。对于重大更改，请先打开 issue 讨论您想要更改的内容。- **[Fastify 示例](examples/fastify-app/)** - 高性能框架，支持模式验证

- **[Hono 示例](examples/hono-app/)** - 轻量级框架，适用于边缘计算和多种运行时

### 开发设置

每个示例都包含：

```bash

# 克隆仓库- 完整的项目设置，包括 package.json

git clone https://github.com/chaeco/route-wizard.git- 示例控制器，演示不同的 HTTP 方法

cd route-wizard- 配置示例

- 开发和生产脚本

# 安装依赖- 包含详细设置说明的 README

npm install

## 许可证

# 运行测试

npm testMIT


# 运行带覆盖率的测试
npm run test:coverage

# 构建项目
npm run build

# 运行代码检查
npm run lint
```
