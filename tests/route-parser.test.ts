/**
 * Tests for route-parser utilities
 */

import { generateRoutePath, isValidRouteFile, DEFAULT_METHOD_MAPPINGS } from '../src/route-parser'

describe('generateRoutePath', () => {
  test('should generate correct route path for basic file', () => {
    const result = generateRoutePath('', 'get-users.js')
    expect(result).toEqual({
      path: '/users',
      method: 'GET'
    })
  })

  test('should handle nested directories', () => {
    const result = generateRoutePath('api', 'get-users.js')
    expect(result).toEqual({
      path: '/api/users',
      method: 'GET'
    })
  })

  test('should handle custom separator', () => {
    const result = generateRoutePath('', 'get_users.js', DEFAULT_METHOD_MAPPINGS, '_')
    expect(result).toEqual({
      path: '/users',
      method: 'GET'
    })
  })

  test('should handle complex nested paths', () => {
    const result = generateRoutePath('api/v1', 'get-users-profile.js')
    expect(result).toEqual({
      path: '/api/v1/users-profile',
      method: 'GET'
    })
  })

  test('should throw error for invalid route file', () => {
    expect(() => generateRoutePath('', 'invalid.js')).toThrow('Invalid route file name')
  })
})

describe('isValidRouteFile', () => {
  test('should return true for valid route files', () => {
    expect(isValidRouteFile('get-users.js')).toBe(true)
    expect(isValidRouteFile('post-login.js')).toBe(true)
    expect(isValidRouteFile('put-update.js')).toBe(true)
  })

  test('should return false for invalid route files', () => {
    expect(isValidRouteFile('users.js')).toBe(false)
    expect(isValidRouteFile('invalid.js')).toBe(false)
    expect(isValidRouteFile('get.js')).toBe(false)
  })

  test('should handle custom separator', () => {
    expect(isValidRouteFile('get_users.js', DEFAULT_METHOD_MAPPINGS, '_')).toBe(true)
    expect(isValidRouteFile('get-users.js', DEFAULT_METHOD_MAPPINGS, '_')).toBe(false)
  })
})