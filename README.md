# Alto CLI

A powerful CLI tool for generating TypeScript types and more.

## Features

- Generate TypeScript types from Directus schemas
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

## Development

```bash
# Install dependencies
bun install

# Run locally
bun run alto

# Test local installation
bun run test:install

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
