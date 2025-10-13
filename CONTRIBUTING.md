# Contributing

Thank you for your interest in contributing to @chaeco/route-wizard! We welcome contributions from the community.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/route-wizard.git`
3. Install dependencies: `npm install`
4. Set up Git hooks: `npm run prepare`
5. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes
2. Run tests: `npm test`
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Commit your changes: `git commit -m "feat: add your feature"`

## Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **TypeScript**: Type checking

### Running Quality Checks

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Commit Convention

This project follows [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage
- Test both happy path and error scenarios

## Pull Request Process

1. Ensure your PR description clearly describes the changes
2. Reference any related issues
3. Ensure CI checks pass
4. Request review from maintainers

## Reporting Issues

When reporting bugs, please include:

- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Code samples if applicable

## Feature Requests

Feature requests are welcome! Please:

- Check if the feature already exists
- Describe the use case clearly
- Explain why it would be valuable
- Consider if it fits the project's scope
