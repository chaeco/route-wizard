/**
 * Tests for utility functions
 */

import { createLogger, autoRegisterRoutes, registerRoutesToApp } from '../src/utils'
import { RouteScanner } from '../src/scanner'

jest.mock('../src/scanner')

describe('createLogger', () => {
  test('should return console.log when enabled', () => {
    const logger = createLogger(true)
    expect(logger).toBe(console.log)
  })

  test('should return no-op function when disabled', () => {
    const logger = createLogger(false)
    expect(typeof logger).toBe('function')

    // Should not throw when called
    expect(() => logger('test')).not.toThrow()
  })
})

describe('autoRegisterRoutes', () => {
  beforeEach(() => {
    const mockScanner = {
      scanDirectory: jest.fn().mockResolvedValue([
        {
          method: 'GET',
          path: '/users',
          handler: jest.fn(),
          middlewares: []
        }
      ])
    }
    ;(RouteScanner as jest.MockedClass<typeof RouteScanner>).mockImplementation(() => mockScanner as any)
  })

  test('should create scanner with correct parameters', async () => {
    const routes = await autoRegisterRoutes('./controllers', { 'get': 'GET' }, '_', ['*.test.js'], false)

    expect(RouteScanner).toHaveBeenCalledWith(
      { 'get': 'GET' }, // methodMappings
      '_',              // separator
      ['*.test.js'],    // ignorePatterns
      false             // logEnabled
    )
    expect(routes).toHaveLength(1)
  })

  test('should use default parameters when not provided', async () => {
    await autoRegisterRoutes('./controllers')

    expect(RouteScanner).toHaveBeenCalledWith(
      undefined, // methodMappings
      undefined, // separator
      undefined, // ignorePatterns
      undefined  // logEnabled
    )
  })
})

describe('registerRoutesToApp', () => {
  let mockApp: any

  beforeEach(() => {
    mockApp = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    }
  })

  test('should register routes without middlewares', () => {
    const routes = [
      {
        method: 'GET' as const,
        path: '/users',
        handler: jest.fn(),
        middlewares: []
      },
      {
        method: 'POST' as const,
        path: '/users',
        handler: jest.fn(),
        middlewares: []
      }
    ]

    registerRoutesToApp(mockApp, routes)

    expect(mockApp.get).toHaveBeenCalledWith('/users', routes[0].handler)
    expect(mockApp.post).toHaveBeenCalledWith('/users', routes[1].handler)
  })

  test('should register routes with middlewares', () => {
    const middleware1 = jest.fn()
    const middleware2 = jest.fn()
    const routes = [
      {
        method: 'POST' as const,
        path: '/login',
        handler: jest.fn(),
        middlewares: [middleware1, middleware2]
      }
    ]

    registerRoutesToApp(mockApp, routes)

    expect(mockApp.post).toHaveBeenCalledWith('/login', middleware1, middleware2, routes[0].handler)
  })

  test('should disable logging when logEnabled is false', () => {
    const routes = [
      {
        method: 'GET' as const,
        path: '/users',
        handler: jest.fn(),
        middlewares: []
      }
    ]

    // Mock console.log to check if it's called
    const originalLog = console.log
    console.log = jest.fn()

    registerRoutesToApp(mockApp, routes, false)

    expect(console.log).not.toHaveBeenCalled()

    // Restore console.log
    console.log = originalLog
  })

  test('should log errors for unsupported methods', () => {
    const routes = [
      {
        method: 'UNSUPPORTED' as any,
        path: '/test',
        handler: jest.fn(),
        middlewares: []
      }
    ]

    const originalError = console.log
    console.log = jest.fn()

    registerRoutesToApp(mockApp, routes)

    expect(console.log).toHaveBeenCalledWith('❌ Unsupported HTTP method: UNSUPPORTED')

    console.log = originalError
  })
})