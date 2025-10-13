/**
 * GET /api/users
 * Get all users
 */
export default async (ctx) => {
  ctx.res.body = {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ],
    timestamp: new Date().toISOString()
  }
}