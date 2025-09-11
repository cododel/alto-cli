# Available Scripts

This document describes all available npm scripts in the project.

## Development Scripts

### `bun run alto`
Runs the CLI tool locally using Bun directly from source files.

### `bun run build`
Builds the project for distribution:
- Creates `dist/index.js` (JavaScript bundle)
- Minifies the code
- Excludes external dependencies

## Testing Scripts

### `bun run test:install`
Tests local package installation:
- Unlinks any existing package
- Links the current package globally
- Tests `alto --help` command
- Tests `alto types --help` command

### `bun run test:uninstall`
Tests package uninstallation:
- Attempts to uninstall via npm, bun, and yarn
- Verifies commands are no longer available
- Provides detailed error information if needed

### `bun run test:full-cycle`
Runs complete installation cycle test:
- Builds the project
- Tests installation
- Tests uninstallation
- Perfect for pre-publication testing

## Publishing Scripts

### `bun run prepublishOnly`
Automatically runs before npm publish:
- Builds JavaScript bundle
- Ensures package is ready for distribution

## Usage Examples

```bash
# Development workflow
bun run alto --help                    # Test locally
bun run build                          # Build for testing
bun run test:full-cycle               # Full test cycle

# Pre-publication
bun run test:full-cycle               # Ensure everything works
npm publish --access=public           # Publish to npm

# After publication
npm install -g @cododel/alto          # Install globally
alto --help                           # Use the tool
npm uninstall -g @cododel/alto        # Remove when done
```

## Troubleshooting

### Build Issues
- Clear `dist/` folder: `rm -rf dist`
- Rebuild: `bun run build`

### Installation Issues
- Check if package is linked: `bun link --list`
- Force unlink: `bun unlink`
- Re-test: `bun run test:full-cycle`

### Binary Issues
- Ensure Bun is installed and up to date
- Check platform compatibility
- Test binary locally: `./dist/alto --help`
