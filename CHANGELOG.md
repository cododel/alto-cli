# Changelog

## [0.1.0] - 2024-01-XX

### Added
- Global installation support via `bun install -g @cododel/alto`
- bunx/npx support for one-time usage
- Build script for distribution
- Local development testing script
- Comprehensive documentation
- Publishing instructions

### Changed
- Updated shebang to use `bun` instead of `node`
- Added error handling in main entry point
- Removed `private` flag from package.json
- Added proper package metadata

### Technical
- Added `bin` field in package.json for CLI registration
- Added `exports` field for module resolution
- Created `.npmignore` for optimized package size
- Added `prepublishOnly` script for automatic builds 