#!/bin/bash

echo "🧪 Running full installation cycle test..."

# Step 1: Build the project
echo "📦 Building project..."
bun run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Step 2: Test installation
echo "⬇️  Testing installation..."
bun run test:install

if [ $? -ne 0 ]; then
    echo "❌ Installation test failed"
    exit 1
fi

# Step 3: Test uninstallation
echo "⬆️  Testing uninstallation..."
bun run test:uninstall

if [ $? -ne 0 ]; then
    echo "❌ Uninstallation test failed"
    exit 1
fi

echo "✅ Full cycle test completed successfully!"
echo "🎉 Package is ready for publication!"
