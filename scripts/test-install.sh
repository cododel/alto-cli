#!/bin/bash

echo "Testing local installation..."

# Unlink if already linked
bun unlink alto-cli 2>/dev/null || true

# Link the package
bun link

# Test the command
echo "Testing 'alto --help'..."
alto --help

echo "Testing 'alto types --help'..."
alto types --help

echo "Local installation test completed successfully!" 