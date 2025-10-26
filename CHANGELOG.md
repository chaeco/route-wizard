# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.7] - 2025-10-16

### Added

- **CommonJS module format support**: Full support for `module.exports` alongside ES6 `export default`
  - Automatically detects and loads both module formats
  - Can mix CommonJS and ES6 modules in the same project
  - Examples: `export default (req, res) => {...}` and `module.exports = (req, res) => {...}`
- **Enhanced handler loading**: Improved `loadHandler()` function to properly handle multiple module formats
  - Explicit checks for ES6 default export
  - Dedicated CommonJS module.exports handling
  - Better type safety and error messages

### Changed

- **Improved handler loading logic**: More robust detection of module formats with better type checking
- **Documentation update**: Added module format section to README explaining both formats

## [0.0.6] - 2025-10-15

### Added

- **Hoa.js Framework Support**: Added automatic support for Hoa.js web framework
  - Automatic framework detection and registration
  - Support for Hoa.js-specific syntax: `app.route('METHOD /path', handler)`
  - See HOA_GUIDE.md for detailed integration instructions

### Fixed

- **Route counting bug**: Now only counts successfully registered routes instead of all discovered routes
- **Framework detection**: Improved detection logic to identify Express, Koa, Fastify, and Hoa.js

## [0.0.3] - 2025-10-15

### Added

- **Filename-based routing**: Support for embedding paths in filenames to reduce folder depth
  - Example: `users.[id].posts.[postId].get.ts` → `GET /users/:id/posts/:postId`
  - Maintains backward compatibility with folder-based structure
- **Custom separator support**: Allow custom separators for filename-based routing
  - Default: `.` (dot)
  - Configurable: `separator: '_'` for `users_[id]_posts_get.ts`
- **Depth limiting**: Prevent overly complex routes with `maxDepth` option
  - Routes exceeding depth limit are ignored
  - Default: 10 levels deep
- Enhanced file convention documentation with examples for both approaches

### Changed

- **Code refactoring**: Eliminated duplicate parameter parsing logic
- **Improved maintainability**: Split complex functions into focused, single-purpose functions
- **Better error handling**: More robust route extraction and validation

## [0.0.2] - 2025-10-14

### Added

- Complete rewrite of route scanning engine for better performance
- Enhanced TypeScript support with strict type checking
- Framework-agnostic design supporting Express, Koa, Fastify, and more
- Improved error handling and logging system
- Comprehensive test suite with 19 test cases
- Modern development tooling (ESLint, Prettier, Husky)
- GitHub Actions CI/CD pipeline
- Code coverage reporting with Codecov
- Performance benchmarks and monitoring
- Security policy and vulnerability reporting process
- Community governance with Code of Conduct
- Issue and PR templates for better contribution workflow
- Multi-language documentation (English and Chinese)

### Changed

- Migrated from V1 to V2 API with breaking changes
- Improved route registration performance
- Enhanced logging with configurable output
- Better file system error handling

### Fixed

- Path resolution issues in route loading
- TypeScript compilation errors
- ESLint configuration issues
- Console statement warnings

### Technical Improvements

- Synchronous route scanning for zero runtime overhead
- Better memory management and caching
- Improved build process with size limits
- Enhanced development experience with hot reload support

## [0.0.1] - 2024-10-13

### Added

- Initial release of @chaeco/route-wizard
- File-based automatic route registration
- Support for multiple HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Custom method mappings
- Route prefix support
- File watching for hot reload in development
- Caching mechanism with TTL
- Ignore patterns for files and directories
- TypeScript support with full type definitions
- Comprehensive test coverage
- Middleware support for individual routes

### Features

- Zero-configuration routing through file structure
- High performance with dynamic imports and caching
- Extensible design for multiple Node.js frameworks
- Detailed logging and error handling
- Production-ready with comprehensive documentation
