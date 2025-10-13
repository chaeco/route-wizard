const Koa = require('koa')
const { koaRouteWizard } = require('@chaeco/route-wizard')

const app = new Koa()
const PORT = process.env.PORT || 3000

// Route wizard middleware
app.use(koaRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api',
  logEnabled: true,
  enableCache: true,
  enableWatch: process.env.NODE_ENV === 'development'
}))

// Health check endpoint
app.use(async (ctx) => {
  if (ctx.path === '/health') {
    ctx.body = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      framework: 'Koa'
    }
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Koa server running on http://localhost:${PORT}`)
  console.log(`📁 Controllers path: ./controllers`)
  console.log(`🔗 API prefix: /api`)
})