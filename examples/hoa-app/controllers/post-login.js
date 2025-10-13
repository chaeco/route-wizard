/**
 * POST /api/login
 * User login endpoint
 */
export default async (ctx) => {
  const { email, password } = await ctx.req.json()

  // Simple validation
  if (!email || !password) {
    ctx.res.status = 400
    ctx.res.body = { error: 'Email and password are required' }
    return
  }

  // Mock authentication
  if (email === 'admin@example.com' && password === 'password') {
    ctx.res.body = {
      success: true,
      token: 'mock-jwt-token',
      user: { id: 1, email: 'admin@example.com', role: 'admin' }
    }
  } else {
    ctx.res.status = 401
    ctx.res.body = { error: 'Invalid credentials' }
  }
}