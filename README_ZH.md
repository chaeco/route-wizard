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
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![GitHub issues](https://img.shields.io/github/issues/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/pulls)
[![Last commit](https://img.shields.io/github/last-commit/chaeco/route-wizard)](https://github.com/chaeco/route-wizard/commits/main)

基于文件的自动路由注册器，为 Node.js 框架提供零配置的路由管理。停止手动注册路由，让你的文件结构为你工作！

## ✨ 特性

- 📁 **文件驱动路由**: 通过文件结构自动生成路由，零配置
- 🏗️ **多框架支持**: 可扩展设计，支持 Express、Koa、Hoa.js、Hono、Fastify 和 NestJS
- 📝 **完整 TypeScript 支持**: 完整的类型定义，提供更好的开发体验
- ⚡ **高性能**: 同步扫描，零运行时开销
- 🧩 **插件架构**: 易于扩展，支持为新框架创建自定义适配器
- 🎯 **约定优于配置**: 合理的默认值和广泛的自定义选项
- 🛡️ **生产就绪**: 全面的测试覆盖率和生产环境验证
- 🔄 **动态参数**: 支持嵌套和可选参数

## 🚀 安装

```bash
npm install @chaeco/route-wizard
```

## 🎯 快速开始

### 1. 创建控制器文件

在 `controllers` 目录下创建路由文件：

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

### 2. 注册路由

```typescript
import express from 'express';
import { registerRoutes } from '@chaeco/route-wizard';

const app = express();
app.use(express.json());

// 注册路由 - 就是这么简单！
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api', // 可选
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

### 3. 你的路由已就绪

```text
GET    /api/users          # 获取所有用户
POST   /api/users          # 创建用户
GET    /api/users/:id      # 根据ID获取用户
PUT    /api/users/:id      # 更新用户
DELETE /api/users/:id      # 删除用户
```

## 📁 文件约定

Route-wizard 使用清晰直观的文件结构：

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

### 参数类型

- `[param]` → `:param` (必需参数)
- `[[param]]` → `:param?` (可选参数)

## 🔧 高级用法

### 多参数

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

### 可选参数

```typescript
// controllers/search/[[query]]/get.ts
export default async (req, res) => {
  const { query } = req.params

  if (query) {
    const results = await searchDatabase(query)
    res.json({ query, results })
  } else {
│   ├── get-orders.js
│   └── post-orders.js
└── get-health.js
```

这将生成以下路由：

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /users/profile`
- `PUT /users/update-profile`
- `GET /users` (get-users.js)
- `DELETE /users/user` (delete-user.js)
- `GET /products`
- `POST /products`
- `GET /products/product`
- `PUT /products/product`
- `GET /orders`
- `POST /orders`
- `GET /health`

## API

### `scanRoutes(options)`

扫描路由目录并返回路由配置数组。

#### scanRoutes 参数

| 参数         | 类型      | 描述                 | 默认值            |
| ------------ | --------- | -------------------- | ----------------- |
| `dir`        | `string`  | 控制器目录路径       | `'./controllers'` |
| `prefix`     | `string`  | 为所有路由添加的前缀 | `''`              |
| `logEnabled` | `boolean` | 是否启用日志输出     | `true`            |

#### 返回

`RouteConfig[]` - 路由配置数组

#### scanRoutes 示例

```typescript
import { scanRoutes } from '@chaeco/route-wizard';

const routes = scanRoutes({
  dir: './routes',
  prefix: '/api',
  logEnabled: false,
});

console.log(routes);
// [
//   { method: 'GET', path: '/api/users', handler: [Function] },
//   { method: 'POST', path: '/api/users', handler: [Function] },
//   ...
// ]
```

### `registerRoutes(app, options)`

扫描路由目录并直接注册到应用实例。

#### registerRoutes 参数

| 参数         | 类型      | 描述                       | 默认值            |
| ------------ | --------- | -------------------------- | ----------------- |
| `app`        | `any`     | 应用实例（Express、Koa等） | -                 |
| `dir`        | `string`  | 控制器目录路径             | `'./controllers'` |
| `prefix`     | `string`  | 为所有路由添加的前缀       | `''`              |
| `logEnabled` | `boolean` | 是否启用日志输出           | `true`            |

#### registerRoutes 示例

```typescript
import { registerRoutes } from '@chaeco/route-wizard';

registerRoutes(app, {
  dir: './routes',
  prefix: '/api',
  logEnabled: false,
});
```

## 贡献指南

欢迎贡献！请随时提交 Pull Request。对于重大更改，请先打开 issue 讨论您想要更改的内容。

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/chaeco/route-wizard.git
cd route-wizard

# 安装依赖
npm install

# 运行测试
npm test

# 运行带覆盖率的测试
npm run test:coverage

# 构建项目
npm run build

# 运行代码检查
npm run lint
```

## 示例

查看 `examples/` 目录中的完整工作应用程序，演示了 route-wizard 与不同框架的集成：

- **[Express.js 示例](examples/express-app/)** - 传统 Express.js 集成
- **[Koa.js 示例](examples/koa-app/)** - 下一代框架，支持 async/await 模式
- **[Fastify 示例](examples/fastify-app/)** - 高性能框架，支持模式验证
- **[Hono 示例](examples/hono-app/)** - 轻量级框架，适用于边缘计算和多种运行时

每个示例都包含：

- 完整的项目设置，包括 package.json
- 示例控制器，演示不同的 HTTP 方法
- 配置示例
- 开发和生产脚本
- 包含详细设置说明的 README

## 许可证

MIT
