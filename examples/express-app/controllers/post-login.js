// controllers/post-login.js
module.exports = async (req, res) => {
  const { email, password } = req.body

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  // Mock authentication
  if (email === 'admin@example.com' && password === 'password') {
    res.json({
      token: 'mock-jwt-token',
      user: { id: 1, email: 'admin@example.com', role: 'admin' }
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
}