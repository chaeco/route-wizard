# 🎯 Hoa.js 框架支持指南

从 v0.0.5 开始，`@chaeco/route-wizard` 现在**完全支持 Hoa.js 框架**！

## 🚀 快速开始

### 安装

```bash
npm install @chaeco/route-wizard
```

### 基本用法

```typescript
import { Hoa } from 'hoa'
import { nodeServer } from '@hoajs/adapter'
import { registerRoutes } from '@chaeco/route-wizard'

const app = new Hoa()

// 使用 route-wizard 自动注册路由
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api',
  framework: 'hoa', // 指定框架（可选，会自动检测）
})

app.extend(nodeServer())

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

## 📁 控制器文件结构

创建你的控制器文件，route-wizard 会自动注册它们：

```text
controllers/
├── users/
│   ├── get.ts           # GET /api/users
│   ├── post.ts          # POST /api/users
│   └── [id]/
│       ├── get.ts       # GET /api/users/:id
│       ├── put.ts       # PUT /api/users/:id
│       └── delete.ts    # DELETE /api/users/:id
├── products/
│   ├── get.ts           # GET /api/products
│   └── post.ts          # POST /api/products
```

或使用文件名嵌入路由：

```text
controllers/
├── users.get.ts           # GET /api/users
├── users.post.ts          # POST /api/users
├── users.[id].get.ts      # GET /api/users/:id
└── users.[id].put.ts      # PUT /api/users/:id
```

## 📝 控制器示例

```typescript
// controllers/users/get.ts
export default async (ctx: any) => {
  const users = await db.users.findMany()
  ctx.res.body = { success: true, data: users }
}

// controllers/users/post.ts
export default async (ctx: any) => {
  const user = await db.users.create({
    data: ctx.req.body,
  })
  ctx.res.body = { success: true, data: user }
}

// controllers/users/[id]/get.ts
export default async (ctx: any) => {
  const { id } = ctx.params
  const user = await db.users.findUnique({
    where: { id: parseInt(id) },
  })
  ctx.res.body = { success: true, data: user }
}
```

## 🔌 中间件支持

为特定路由添加中间件：

```typescript
// controllers/users/get.ts
const authenticate = (ctx: any, next: Function) => {
  if (!ctx.req.headers.authorization) {
    ctx.res.status = 401
    ctx.res.body = { error: 'Unauthorized' }
    return
  }
  next()
}

const authorize = (ctx: any, next: Function) => {
  if (ctx.user.role !== 'admin') {
    ctx.res.status = 403
    ctx.res.body = { error: 'Forbidden' }
    return
  }
  next()
}

export default {
  handler: async (ctx: any) => {
    const users = await db.users.findMany()
    ctx.res.body = { success: true, data: users }
  },
  middlewares: [authenticate, authorize],
}
```

## 🎛️ 配置选项

```typescript
registerRoutes(app, {
  // 必需: 控制器目录路径
  dir: './controllers',

  // 可选: 路由前缀
  prefix: '/api',

  // 可选: 日志输出
  logEnabled: true,

  // 可选: 指定框架 ('express', 'koa', 'fastify', 'hoa')
  // 如果不指定，会自动检测
  framework: 'hoa',

  // 可选: 文件名分隔符 (默认: '.')
  separator: '.',

  // 可选: 最大路由深度
  maxDepth: 10,

  // 可选: 性能监控
  performanceMonitor: monitor,
})
```

## 📊 完整的服务器示例

```typescript
import { Hoa } from 'hoa'
import { nodeServer } from '@hoajs/adapter'
import { bodyParser } from '@hoajs/bodyparser'
import { cors } from '@hoajs/cors'
import { json } from '@hoajs/json'
import { registerRoutes } from '@chaeco/route-wizard'

const app = new Hoa()

// 应用中间件
app.use(bodyParser())
app.use(cors())
app.use(json())

// 自动注册路由
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api',
})

app.extend(nodeServer())

// 全局错误处理
app.use(async (ctx: any) => {
  ctx.res.status = 404
  ctx.res.body = {
    success: false,
    message: '路由不存在',
  }
})

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000')
})
```

## ✨ 特性

- ✅ **自动框架检测** - 智能识别 Hoa.js 并使用正确的注册方式
- ✅ **中间件支持** - 为每个路由添加中间件
- ✅ **性能监控** - 内置性能指标跟踪
- ✅ **灵活的路由定义** - 支持文件夹式和文件名嵌入式两种方式
- ✅ **参数支持** - 支持必需参数 `[id]` 和可选参数 `[[query]]`

## 🔄 与其他框架的兼容性

route-wizard 支持多个框架，使用完全相同的API：

```typescript
// Express
import express from 'express'
const app = express()
registerRoutes(app, { dir: './controllers' })

// Koa
import Koa from 'koa'
const app = new Koa()
registerRoutes(app, { dir: './controllers' })

// Fastify
import fastify from 'fastify'
const app = fastify()
registerRoutes(app, { dir: './controllers' })

// Hoa.js
import { Hoa } from 'hoa'
const app = new Hoa()
registerRoutes(app, { dir: './controllers' })
```

## 🐛 故障排除

### 显示 "Unsupported method"

这可能意味着：

1. 应用实例未正确初始化
2. 使用了不支持的 HTTP 方法
3. 框架检测失败

**解决方案：** 显式指定 `framework: 'hoa'` 参数

```typescript
registerRoutes(app, {
  dir: './controllers',
  framework: 'hoa', // 明确指定
})
```

### 路由未被注册

检查：

1. 控制器文件是否使用正确的导出 `export default`
2. 文件名是否遵循约定 (例如 `users.get.ts`)
3. 日志输出中是否有错误信息

**启用日志调试：**

```typescript
registerRoutes(app, {
  dir: './controllers',
  logEnabled: true, // 查看详细日志
})
```

## 📚 更多文档

- [完整 API 文档](./README.md)
- [中文文档](./README_zh.md)
- [Express 示例](./examples/express-app/)
- [Koa 示例](./examples/koa-app/)

## 📄 许可证

MIT © [chaeco](https://github.com/chaeco)
