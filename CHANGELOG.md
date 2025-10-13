# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
