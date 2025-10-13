import { Hoa } from 'hoa'
import { hoaRouteWizard } from '@chaeco/route-wizard/adapters'

const app = new Hoa()
const PORT = process.env.PORT || 3000

// Route wizard middleware
app.use(hoaRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api',
  logEnabled: true,
  enableCache: true,
  enableWatch: process.env.NODE_ENV === 'development'
}))

// Health check endpoint
app.use((ctx) => {
  if (ctx.req.pathname === '/health') {
    ctx.res.body = { status: 'OK', timestamp: new Date().toISOString() }
  }
})

// Export for deployment
export default app

// For local development
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`🚀 Hoa server running on http://localhost:${PORT}`)
  console.log(`📁 Controllers path: ./controllers`)
  console.log(`🔗 API prefix: /api`)

  // Start server with Node.js
  import('http').then(({ createServer }) => {
    const server = createServer((req, res) => {
      app.fetch(new Request(`http://localhost:${PORT}${req.url}`, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined
      })).then(response => {
        res.statusCode = response.status
        response.headers.forEach((value, key) => {
          res.setHeader(key, value)
        })
        response.text().then(body => {
          res.end(body)
        })
      })
    })

    server.listen(PORT, () => {
      console.log(`✅ Server started successfully`)
    })
  })
}