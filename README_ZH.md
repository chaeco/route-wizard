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

## 特性

- 📁 **文件驱动路由**: 通过文件结构自动生成路由，零配置
- 🔄 **热重载**: 开发友好的文件监听，自动路由更新
- 🏗️ **多框架支持**: 可扩展设计，支持 Express、Koa、Hoa.js、Hono、Fastify 和 NestJS
- 📝 **完整 TypeScript 支持**: 完整的类型定义，提供更好的开发体验
- ⚡ **高性能**: 动态导入和智能缓存机制
- 🧩 **插件架构**: 易于扩展，支持为新框架创建自定义适配器
- 🎯 **约定优于配置**: 合理的默认值和广泛的自定义选项
- 🛡️ **生产就绪**: 全面的测试覆盖率和生产环境验证

## 安装

```bash
npm install @chaeco/route-wizard
```

## 快速开始

### 1. 创建控制器文件

在 `controllers` 目录下创建路由文件：

```javascript
// controllers/get-users.js
module.exports = async (ctx) => {
  ctx.body = { users: [] }
}

// controllers/post-login.js
module.exports = async (ctx) => {
  const { username, password } = ctx.request.body
  // 处理登录逻辑
  ctx.body = { token: '...' }
}
```

### 2. 使用中间件

```javascript
const { routeWizard } = require('@chaeco/route-wizard')

// 在你的应用中使用
app.use(routeWizard({
  controllersPath: './controllers' // 可选，默认 './controllers'
}))
```

### TypeScript 示例

```typescript
import { routeWizard } from '@chaeco/route-wizard'

interface User {
  id: number
  name: string
}

// controllers/get-users.ts
export default async (ctx: any) => {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
  ctx.body = { users }
}

// controllers/post-login.ts
export default async (ctx: any) => {
  const { username, password } = ctx.request.body
  // 处理登录逻辑
  ctx.body = { token: 'jwt-token-here' }
}

// 在你的主应用中
app.use(routeWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

## 文件命名规则

路由文件必须遵循以下命名约定：

- `get-users.js` → `GET /users`
- `post-login.js` → `POST /login`
- `put-update-profile.js` → `PUT /update-profile`
- `delete-account.js` → `DELETE /account`

支持的 HTTP 方法：`get`, `post`, `put`, `delete`, `patch`, `head`, `options`

## 目录结构

```text
controllers/
├── auth/
│   ├── post-login.js
│   ├── post-register.js
│   └── post-logout.js
├── users/
│   ├── get-profile.js
│   ├── put-update-profile.js
│   ├── get-users.js
│   └── delete-user.js
├── products/
│   ├── get-products.js
│   ├── post-products.js
│   ├── get-product.js
│   └── put-product.js
├── orders/
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

### routeWizard(options)

创建路由自动注册中间件。

#### 参数

| 参数 | 类型 | 描述 | 默认值 |
|------|------|------|--------|
| `controllersPath` | `string` | 控制器目录路径 | `'./controllers'` |
| `methodMappings` | `Record<string, HttpMethod>` | 自定义方法映射 | 标准HTTP方法映射 |
| `separator` | `string` | 文件名前缀和路由名之间的分隔符 | `'-'` |
| `ignorePatterns` | `string[]` | 要忽略的文件/目录glob模式数组 | `[]` |
| `logEnabled` | `boolean` | 是否启用日志输出 | `true` |
| `routePrefix` | `string` | 为所有路由添加的前缀 | `''` |
| `enableCache` | `boolean` | 是否启用路由缓存 | `true` |
| `cacheTtl` | `number` | 缓存过期时间（毫秒） | `30000` (30秒) |
| `enableWatch` | `boolean` | 是否启用文件监听以支持热重载 | `false` |
| `watchOptions` | `object` | 文件监听选项 | `{}` |

#### 返回

中间件函数，可用于支持中间件的框架。

#### 完整配置示例

```javascript
const { routeWizard } = require('@chaeco/route-wizard')

// 完整配置示例
app.use(routeWizard({
  controllersPath: './controllers',
  methodMappings: {
    'get': 'GET',
    'post': 'POST',
    'ip_post': 'POST'
  },
  separator: '_',
  ignorePatterns: [
    '**/*.test.js',    // 忽略测试文件
    '**/*.spec.js',    // 忽略规格文件
    '**/index.js',     // 忽略index文件
    'config/**'        // 忽略config目录
  ],
  logEnabled: true,    // 启用日志输出
  routePrefix: 'api',  // 为所有路由添加 /api 前缀
  enableCache: true,   // 启用路由缓存
  cacheTtl: 60000      // 缓存1分钟
}))
```

这将扫描controllers目录，但忽略所有测试文件、index文件和config目录，并为所有路由添加 `/api` 前缀。

## 缓存机制

为了提高性能，route-wizard 默认启用了路由缓存机制：

- **缓存键**: 基于配置参数（controllersPath、methodMappings、separator、ignorePatterns、routePrefix）生成
- **缓存过期**: 默认30秒，可通过 `cacheTtl` 选项自定义
- **缓存失效**: 当配置文件发生变化时，缓存会自动失效

```javascript
// 禁用缓存（每次请求都重新扫描）
app.use(routeWizard({
  enableCache: false
}))

// 自定义缓存时间（5分钟）
app.use(routeWizard({
  cacheTtl: 300000
}))
```

## 文件监听（热重载）

启用文件监听功能后，当控制器文件发生变化时，路由缓存会自动清除，确保开发时的热重载体验：

```javascript
// 启用文件监听
app.use(routeWizard({
  enableWatch: true,
  watchOptions: {
    persistent: true,
    ignored: ['**/*.log', '**/node_modules/**']
  }
}))
```

文件监听功能会：

- 监听控制器目录的文件变化
- 当文件被修改、添加或删除时清除路由缓存
- 在下次请求时自动重新扫描和注册路由
- 支持忽略特定文件或目录

**注意**: 文件监听功能主要用于开发环境，生产环境建议禁用以提高性能。

例如，`get-users.js` 将生成路由 `GET /api/users` 而不是 `GET /users`。

## 框架适配器

Route-wizard 为流行 Node.js 框架提供了适配器，可以单独引入：

### Express

```javascript
const { expressRouteWizard } = require('@chaeco/route-wizard/adapters/express')

app.use(expressRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
```

### Koa

```javascript
const { koaRouteWizard } = require('@chaeco/route-wizard/adapters/koa')

app.use(koaRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api'
}))
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

- **[Express.js 示例](examples/express-app/)** - 传统 Express.js 集成，支持中间件
- **[Koa.js 示例](examples/koa-app/)** - 下一代框架，支持 async/await 模式
- **[Fastify 示例](examples/fastify-app/)** - 高性能框架，支持模式验证
- **[Hono 示例](examples/hono-app/)** - 轻量级框架，适用于边缘计算和多种运行时
- **[Hoa.js 示例](examples/hoa-app/)** - 基于 Web 标准的极简框架

每个示例都包含：

- 完整的项目设置，包括 package.json
- 示例控制器，演示不同的 HTTP 方法
- 配置示例
- 开发和生产脚本
- 包含详细设置说明的 README

## 许可证

MIT
