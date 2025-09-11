#!/bin/bash

echo "Testing package uninstallation..."

# Test uninstalling from different package managers
echo "Testing npm uninstall..."
npm uninstall -g @cododel/alto 2>/dev/null || echo "Package not installed via npm"

echo "Testing bun unlink..."
# Try to unlink the package
bun unlink 2>/dev/null || echo "Package not linked via bun"

echo "Testing yarn uninstall..."
yarn global remove @cododel/alto 2>/dev/null || echo "Package not installed via yarn"

# Wait a moment for the system to update PATH
sleep 1

# Verify the command is no longer available
echo "Verifying 'alto' command is no longer available..."
if command -v alto >/dev/null 2>&1; then
    echo "❌ ERROR: 'alto' command is still available after uninstall"
    echo "Current PATH: $PATH"
    echo "alto location: $(which alto 2>/dev/null || echo 'not found')"
    exit 1
else
    echo "✅ SUCCESS: 'alto' command is no longer available"
fi

echo "Package uninstallation test completed successfully!"
