const fastify = require('fastify')({ logger: true })
const { fastifyRouteWizard } = require('@chaeco/route-wizard')

const PORT = process.env.PORT || 3000

// Register route wizard as a Fastify plugin
fastify.register(fastifyRouteWizard, {
  controllersPath: './controllers',
  routePrefix: 'api',
  logEnabled: true,
  enableCache: true,
  enableWatch: process.env.NODE_ENV === 'development'
})

// Health check endpoint
fastify.get('/health', async () => {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    framework: 'Fastify'
  }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`🚀 Fastify server running on http://localhost:${PORT}`)
    console.log(`📁 Controllers path: ./controllers`)
    console.log(`🔗 API prefix: /api`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()