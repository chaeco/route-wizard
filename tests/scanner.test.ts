/**
 * Tests for RouteScanner
 */

import { RouteScanner } from '../src/scanner'

// Mock dependencies
jest.mock('fs')
jest.mock('path')
jest.mock('minimatch')
jest.mock('../src/route-parser')
jest.mock('../src/utils')

const { readdirSync, statSync } = require('fs')
const { join } = require('path')
const { minimatch } = require('minimatch')
const { createLogger } = require('../src/utils')

describe('RouteScanner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(createLogger as jest.Mock).mockReturnValue(jest.fn())
    ;(join as jest.Mock).mockImplementation((...args) => args.join('/'))
  })

  test('should throw error for empty separator', () => {
    expect(() => new RouteScanner(undefined, '', undefined, true)).toThrow('Separator cannot be empty')
  })

  test('should initialize with default values', () => {
    const scanner = new RouteScanner()
    expect(scanner).toBeDefined()
  })

  test('should initialize with custom parameters', () => {
    const customMappings = { 'get': 'GET' as const, 'post': 'POST' as const }
    const scanner = new RouteScanner(customMappings, '_', ['*.test.js'], false)
    expect(scanner).toBeDefined()
  })

  describe('shouldIgnore', () => {
    test('should return true when pattern matches', () => {
      const scanner = new RouteScanner(undefined, '-', ['*.test.js'])
      ;(minimatch as jest.Mock).mockReturnValue(true)

      const result = (scanner as any).shouldIgnore('/path/to/file.test.js')
      expect(result).toBe(true)
    })

    test('should return false when no pattern matches', () => {
      const scanner = new RouteScanner(undefined, '-', ['*.test.js'])
      ;(minimatch as jest.Mock).mockReturnValue(false)

      const result = (scanner as any).shouldIgnore('/path/to/file.js')
      expect(result).toBe(false)
    })
  })

  describe('scanDirectory', () => {
    test('should call readdirSync and return routes', async () => {
      const scanner = new RouteScanner()
      const mockLog = jest.fn()
      ;(createLogger as jest.Mock).mockReturnValue(mockLog)

      ;(readdirSync as jest.Mock).mockReturnValue([])
      ;(statSync as jest.Mock).mockReturnValue({
        isDirectory: jest.fn().mockReturnValue(false),
        isFile: jest.fn().mockReturnValue(true),
      })

      const routes = await scanner.scanDirectory('/controllers')

      expect(readdirSync).toHaveBeenCalledWith('/controllers')
      expect(Array.isArray(routes)).toBe(true)
    })

    test('should handle empty directory', async () => {
      const scanner = new RouteScanner()
      const mockLog = jest.fn()
      ;(createLogger as jest.Mock).mockReturnValue(mockLog)

      ;(readdirSync as jest.Mock).mockReturnValue([])
      ;(statSync as jest.Mock).mockReturnValue({
        isDirectory: jest.fn().mockReturnValue(false),
        isFile: jest.fn().mockReturnValue(true),
      })

      const routes = await scanner.scanDirectory('/controllers')

      expect(routes).toHaveLength(0)
    })

    test('should skip ignored files', async () => {
      const scanner = new RouteScanner(undefined, '-', ['*.test.js'])
      const mockLog = jest.fn()
      ;(createLogger as jest.Mock).mockReturnValue(mockLog)

      ;(readdirSync as jest.Mock).mockReturnValue(['file.test.js'])
      ;(statSync as jest.Mock).mockReturnValue({
        isDirectory: jest.fn().mockReturnValue(false),
        isFile: jest.fn().mockReturnValue(true),
      })
      ;(minimatch as jest.Mock).mockReturnValue(true)

      const routes = await scanner.scanDirectory('/controllers')

      expect(mockLog).toHaveBeenCalledWith('⏭️  Ignoring: /controllers/file.test.js')
      expect(routes).toHaveLength(0)
    })

    test('should recursively scan subdirectories', async () => {
      const scanner = new RouteScanner()
      const mockLog = jest.fn()
      ;(createLogger as jest.Mock).mockReturnValue(mockLog)

      ;(readdirSync as jest.Mock)
        .mockReturnValueOnce(['subdir'])
        .mockReturnValueOnce([])
      ;(statSync as jest.Mock)
        .mockReturnValueOnce({
          isDirectory: jest.fn().mockReturnValue(true),
          isFile: jest.fn().mockReturnValue(false),
        })

      const routes = await scanner.scanDirectory('/controllers')

      expect(routes).toHaveLength(0)
    })

    test('should skip invalid route files', async () => {
      const scanner = new RouteScanner()
      const mockLog = jest.fn()
      ;(createLogger as jest.Mock).mockReturnValue(mockLog)

      ;(readdirSync as jest.Mock).mockReturnValue(['invalid-file.js'])
      ;(statSync as jest.Mock).mockReturnValue({
        isDirectory: jest.fn().mockReturnValue(false),
        isFile: jest.fn().mockReturnValue(true),
      })

      const routes = await scanner.scanDirectory('/controllers')

      expect(routes).toHaveLength(0)
    })
  })

  describe('getRoutes and clear', () => {
    test('should return routes and clear them', () => {
      const scanner = new RouteScanner()
      expect(scanner.getRoutes()).toEqual([])

      scanner.clear()
      expect(scanner.getRoutes()).toEqual([])
    })
  })
})