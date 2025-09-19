# Alto CLI

A powerful CLI tool for generating TypeScript types and more.

## Features

- Generate TypeScript types from Directus schemas
- Skip specific collections from type generation
- Compatible with Directus SDK v19.0.0+ (DirectusComment → DirectusActivity)
- Modern CLI built with Bun and TypeScript
- Global installation support
- Works with bunx/npx for one-time usage

## Installation

### Global Installation

```bash
# Install globally using bun
bun install -g @cododel/alto

# Or using npm
npm install -g @cododel/alto

# Or using yarn
yarn global add @cododel/alto
```

### Using bunx (no installation required)

```bash
# Run directly with bunx
bunx @cododel/alto <command>

# Or with npx
npx @cododel/alto <command>
```

## Usage

After installation, you can use the CLI with the `alto` command:

```bash
# Global installation
alto <command>

# With bunx
bunx @cododel/alto <command>
```

## Available Commands

- `types` - Generate TypeScript types

## Configuration

### Skipping Collections

You can configure which collections to skip during type generation:

```bash
# Skip specific collections (default: ["directus_comments"])
alto types --skipCollections directus_comments,directus_revisions

# Skip multiple collections
alto types --skipCollections directus_comments,directus_revisions,directus_presets

# Don't skip any collections
alto types --skipCollections ""
```

### Environment Variables

```bash
# Directus connection
export DIRECTUS_URL="http://localhost:8055"
export DIRECTUS_TOKEN="your-token-here"
```

## Compatibility

- ✅ Compatible with Directus SDK v19.0.0+
- ✅ Automatic handling of DirectusComment → DirectusActivity migration
- ✅ TypeScript 5.0+
- ✅ Node.js 18+

## Development

```bash
# Install dependencies
bun install

# Run locally
bun run alto

# Test local installation
bun run test:install

# Test package uninstallation
bun run test:uninstall

# Run full installation cycle test
bun run test:full-cycle

# Build for distribution
bun run build
```

### Local Development

For local development and testing:

```bash
# Link the package globally for testing
bun link

# Now the 'alto' command will be available globally
alto --help

# Unlink the package
bun unlink @cododel/alto
```
