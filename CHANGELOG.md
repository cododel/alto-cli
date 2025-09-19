# Changelog

## [0.1.4] - 2025-09-19

### Added
- Documentation for skipping collections during type generation

### Changed
- Updated README to reflect compatibility with Directus SDK v19.0.0+ and new configuration options

## [0.1.3] - 2025-09-19

### Changed
- Migrated from npm workspaces to pnpm workspace configuration
- Removed workspaces field from package.json
- Added pnpm-workspace.yaml with proper configuration

## [0.1.2] - 2025-09-12

### Changed
- Updated the package version to 0.1.2.
- Removed the `build:binary` script.

## [0.1.1] - 2025-09-11

### Added
- Comprehensive test scripts for installation, uninstallation, and the full cycle (`test:install`, `test:uninstall`, `test:full-cycle`).
- `SCRIPTS.md` documentation for all available package scripts.

### Changed
- **BREAKING CHANGE:** Removed support for standalone binary distribution. The package is now JavaScript-only, significantly reducing its size (from ~70MB to ~5.6MB).
- The project is now fully configured for lightweight, cross-platform publication on npm.
- Updated all documentation (`README.md`, `PUBLISH.md`) to reflect the JS-only approach.
- Streamlined build process to only produce a JavaScript bundle.
- Updated all test scripts to align with the JS-only distribution.

## [0.0.0] - 2025-08-12

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