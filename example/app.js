const express = require('express')
const { registerRoutes } = require('@chaeco/route-wizard')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Register routes using V2
console.log('🚀 Registering routes with V2...\n')

// Example 1: Default configuration (folder-based + filename-based)
registerRoutes(app, {
  dir: './controllers',
  prefix: '/api',
  logEnabled: true
})

console.log('\n')

// Example 2: Custom separator (uncomment to try)
// registerRoutes(app, {
//   dir: './controllers',
//   prefix: '/api/v2',
//   separator: '_',  // Use underscore instead of dot
//   maxDepth: 5,     // Limit route depth
//   logEnabled: true
// })

console.log('\n')

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📁 Controllers path: ./controllers`)
  console.log(`🔗 API prefix: /api`)
  console.log(`🔄 Hot reload: ${process.env.NODE_ENV === 'development' ? 'enabled' : 'disabled'}`)
})