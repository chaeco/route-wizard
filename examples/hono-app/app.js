import { Hono } from 'hono'
import { honoRouteWizard } from '@chaeco/route-wizard/adapters'

const app = new Hono()
const port = parseInt(process.env.PORT || '3000')

// Route wizard middleware
app.use('*', honoRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api',
  logEnabled: true,
  enableCache: true,
  enableWatch: process.env.NODE_ENV === 'development'
}))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    framework: 'Hono'
  })
})

// Export for deployment
export default {
  port,
  fetch: app.fetch
}

// For local development
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`🚀 Hono server running on http://localhost:${port}`)
  console.log(`📁 Controllers path: ./controllers`)
  console.log(`🔗 API prefix: /api`)

  // Start server with Node.js
  import('http').then(({ createServer }) => {
    const server = createServer((req, res) => {
      app.fetch(new Request(`http://localhost:${port}${req.url}`, {
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

    server.listen(port, () => {
      console.log(`✅ Server started successfully`)
    })
  })
}