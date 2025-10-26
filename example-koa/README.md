# Route Wizard Koa 示例

这是一个完整的 Koa.js 示例应用，演示如何使用 Route Wizard。

## 功能演示

- ✅ 文件名路由
- ✅ 动态参数 (`[id]`)
- ✅ Koa 框架集成
- ✅ API 前缀配置
- ✅ 日志输出

## 目录结构

```text
example-koa/
├── app.js                 # 主 Koa 应用
├── package.json           # 依赖
├── README.md             # 本文件
└── controllers/          # 路由控制器
    └── users/
        ├── get.js        # GET /api/users
        └── [id]/get.js   # GET /api/users/:id
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行应用

```bash
npm start
```

### 3. 测试 API

```bash
# 获取所有用户
curl http://localhost:3001/api/users

# 获取特定用户
curl http://localhost:3001/api/users/1

# 健康检查
curl http://localhost:3001/health
```

## API 端点

- `GET /api/users` - 获取所有用户列表
- `GET /api/users/:id` - 获取指定用户信息
- `GET /health` - 健康检查端点

## 特点

- 使用 Koa 现代的 async/await 语法
- 简洁的中间件风格
- 与 Express 不同的上下文对象 (ctx)

## 与 Express 的差异

虽然使用相同的路由扫描逻辑，但 Koa 的处理程序使用 `ctx` 对象而不是 `req` 和 `res`：

```javascript
// Koa 风格
module.exports = async (ctx) => {
  ctx.body = { message: 'Hello from Koa' };
};

// 而不是 Express 风格
module.exports = async (req, res) => {
  res.json({ message: 'Hello from Express' });
};
```

## 了解更多

参见 [主项目README](../README.md) 和 [中文文档](../README_ZH.md)
