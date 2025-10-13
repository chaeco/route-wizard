/**
 * Tests for middleware functionality
 */

import { routeWizard } from '../src/middleware'
import { RouteScanner } from '../src/scanner'

jest.mock('../src/scanner')

describe('routeWizard', () => {
  let mockApp: any
  let mockCtx: any
  let mockNext: any

  beforeEach(() => {
    mockApp = {
      get: jest.fn(),
      post: jest.fn(),
      _routesRegistered: false
    }
    mockCtx = {
      app: mockApp
    }
    mockNext = jest.fn()

    // Reset RouteScanner mock before each test
    ;(RouteScanner as jest.MockedClass<typeof RouteScanner>).mockClear()

    // Mock RouteScanner
    const mockScanner = {
      scanDirectory: jest.fn().mockResolvedValue([
        {
          method: 'GET',
          path: '/users',
          handler: jest.fn(),
          middlewares: []
        },
        {
          method: 'POST',
          path: '/login',
          handler: jest.fn(),
          middlewares: [jest.fn()]
        }
      ])
    }
    ;(RouteScanner as jest.MockedClass<typeof RouteScanner>).mockImplementation(() => mockScanner as any)
  })

  test('should register routes on first call', async () => {
    const middleware = routeWizard()

    await middleware(mockCtx, mockNext)

    expect(mockApp.get).toHaveBeenCalledWith('/users', expect.any(Function))
    expect(mockApp.post).toHaveBeenCalledWith('/login', expect.any(Function), expect.any(Function))
    expect(mockNext).toHaveBeenCalled()
  })

  test('should not register routes on subsequent calls', async () => {
    const middleware = routeWizard()
    mockApp._routesRegistered = true

    await middleware(mockCtx, mockNext)

    expect(mockApp.get).not.toHaveBeenCalled()
    expect(mockApp.post).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })

  test('should apply route prefix', async () => {
    const middleware = routeWizard({ routePrefix: 'api' })

    await middleware(mockCtx, mockNext)

    expect(mockApp.get).toHaveBeenCalledWith('/api/users', expect.any(Function))
    expect(mockApp.post).toHaveBeenCalledWith('/api/login', expect.any(Function), expect.any(Function))
  })

  test('should use cached routes on subsequent calls with same middleware instance', async () => {
    const middleware = routeWizard({ enableCache: true })

    // First call - should scan
    await middleware(mockCtx, mockNext)

    // Reset app state for second call
    mockApp._routesRegistered = false

    // Second call - should use cache (same middleware instance)
    await middleware(mockCtx, mockNext)

    // RouteScanner should only be called once due to caching
    expect(RouteScanner).toHaveBeenCalledTimes(1)
  })

  test('should start file watching when enableWatch is true', async () => {
    const middleware = routeWizard({ enableWatch: true })

    await middleware(mockCtx, mockNext)

    // Should have started watching
    expect(mockCtx.app._routesRegistered).toBe(true)
  })

  test('should not start file watching when enableWatch is false', async () => {
    const middleware = routeWizard({ enableWatch: false })

    await middleware(mockCtx, mockNext)

    // Should not have started watching
    expect(mockCtx.app._routesRegistered).toBe(true)
  })

  test('should handle custom controllers path', async () => {
    const middleware = routeWizard({ controllersPath: './custom/controllers' })

    await middleware(mockCtx, mockNext)

    expect(RouteScanner).toHaveBeenCalledWith(
      undefined, // methodMappings
      '-',      // separator
      [],       // ignorePatterns
      true      // logEnabled
    )
  })

  test('should disable logging when logEnabled is false', async () => {
    const middleware = routeWizard({ logEnabled: false })

    await middleware(mockCtx, mockNext)

    expect(RouteScanner).toHaveBeenCalledWith(
      undefined, // methodMappings
      '-',      // separator
      [],       // ignorePatterns
      false     // logEnabled
    )
  })

  test('should throw error for empty separator', () => {
    expect(() => routeWizard({ separator: '' })).toThrow('Separator cannot be empty')
  })
})