/**
 * GET /api/users
 * Get all users
 */
module.exports = async (ctx) => {
  // Access context to demonstrate usage
  const method = ctx.method

  // Set a custom header
  ctx.set('X-API-Version', '1.0')

  ctx.body = {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ],
    timestamp: new Date().toISOString(),
    method
  }
}