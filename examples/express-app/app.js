const express = require('express')
const { expressRouteWizard } = require('@chaeco/route-wizard')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Route wizard middleware
app.use(expressRouteWizard({
  controllersPath: './controllers',
  routePrefix: 'api',
  logEnabled: true,
  enableCache: true,
  enableWatch: process.env.NODE_ENV === 'development'
}))

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