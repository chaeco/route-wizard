/**
 * GET /api/users
 * Get all users
 */
export default async (c) => {
  return c.json({
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ],
    timestamp: new Date().toISOString()
  })
}