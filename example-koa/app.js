const Koa = require('koa');
const { registerRoutes } = require('@chaeco/route-wizard');

const app = new Koa();

// 注册路由
console.log('🚀 使用 registerRoutes 注册路由...\n');
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api',
  logEnabled: true,
});

console.log('\n');

// 健康检查端点
app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = { status: 'OK', timestamp: new Date().toISOString() };
  } else {
    await next();
  }
});

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
});

// 404 处理
app.use(async (ctx) => {
  if (ctx.status === 404) {
    ctx.body = { error: 'Not Found' };
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Koa 服务器运行在 http://localhost:${PORT}`);
  console.log(`📁 控制器路径: ./controllers`);
  console.log(`🔗 API 前缀: /api`);
});
