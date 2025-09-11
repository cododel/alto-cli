# Publishing to npm

## Prerequisites

1. Create an npm account at https://www.npmjs.com/
2. Login to npm: `npm login`
3. Ensure you have the correct permissions for the `@cododel` scope

## Publishing Steps

### 1. Build the project

```bash
# Build JavaScript files
bun run build
```

### 2. Test the build locally

```bash
# Test local installation
bun run test:install

# Test package uninstallation
bun run test:uninstall

# Run full installation cycle test (recommended)
bun run test:full-cycle

# Or test with bunx
bunx @cododel/alto --help
```

### 3. Publish to npm

```bash
# Publish the package
npm publish --access=public

# Or if you want to publish a specific version
npm version patch  # or minor, major
npm publish --access=public
```

## Package Contents

The published package includes:

- `dist/index.js` - Main JavaScript entry point
- `dist/cli.js` - CLI module
- `dist/alto` - Standalone binary (current platform)
- `README.md` - Documentation
- `LICENSE` - License file

## Version Management

- Use semantic versioning (semver)
- Update version in `package.json`
- Use `npm version` command for automatic version bumping
- Test before publishing with `npm pack` to inspect the package contents

## Troubleshooting

### Build Issues
- Clear dist folder: `rm -rf dist`
- Rebuild: `bun run build`

### Installation Issues
- Check if package is linked: `bun link --list`
- Force unlink: `bun unlink`
- Re-test: `bun run test:full-cycle`
