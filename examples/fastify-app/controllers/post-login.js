/**
 * POST /api/login
 * User login endpoint
 */
module.exports = async (request, reply) => {
  const { email, password } = request.body

  // Simple validation
  if (!email || !password) {
    reply.code(400)
    return { error: 'Email and password are required' }
  }

  // Mock authentication
  if (email === 'admin@example.com' && password === 'password') {
    reply.code(200)
    return {
      success: true,
      token: 'mock-jwt-token',
      user: { id: 1, email: 'admin@example.com', role: 'admin' }
    }
  } else {
    reply.code(401)
    return { error: 'Invalid credentials' }
  }
}