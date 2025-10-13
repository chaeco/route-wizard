/**
 * POST /api/login
 * User login endpoint
 */
export default async (c) => {
  const { email, password } = await c.req.json()

  // Simple validation
  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  // Mock authentication
  if (email === 'admin@example.com' && password === 'password') {
    return c.json({
      success: true,
      token: 'mock-jwt-token',
      user: { id: 1, email: 'admin@example.com', role: 'admin' }
    })
  } else {
    return c.json({ error: 'Invalid credentials' }, 401)
  }
}