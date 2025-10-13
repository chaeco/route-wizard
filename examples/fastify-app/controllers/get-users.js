/**
 * GET /api/users
 * Get all users
 */
module.exports = async (request, reply) => {
  // Access request to demonstrate usage
  const method = request.method

  // Set a custom header using reply
  reply.header('X-API-Version', '1.0')

  return {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ],
    timestamp: new Date().toISOString(),
    method
  }
}