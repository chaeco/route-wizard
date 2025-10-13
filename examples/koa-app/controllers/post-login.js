/**
 * POST /api/login
 * User login endpoint
 */
module.exports = async (ctx) => {
  const { email, password } = ctx.request.body

  // Simple validation
  if (!email || !password) {
    ctx.status = 400
    ctx.body = { error: 'Email and password are required' }
    return
  }

  // Mock authentication
  if (email === 'admin@example.com' && password === 'password') {
    ctx.body = {
      success: true,
      token: 'mock-jwt-token',
      user: { id: 1, email: 'admin@example.com', role: 'admin' }
    }
  } else {
    ctx.status = 401
    ctx.body = { error: 'Invalid credentials' }
  }
}