#!/bin/bash

# Figma Gemini Voice Editor - Setup Script

echo "======================================"
echo "Figma Gemini Voice Editor Setup"
echo "======================================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    echo "   Please upgrade: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your API keys:"
    echo "   - FIGMA_ACCESS_TOKEN"
    echo "   - FIGMA_FILE_KEY"
    echo "   - GEMINI_API_KEY"
    echo ""
    echo "See QUICKSTART.md for details on getting these keys."
else
    echo "✓ .env file already exists"
fi
echo ""

# Build the project
echo "Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✓ Project built successfully"
echo ""

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API keys"
echo "2. Run: npm run dev"
echo "3. Open Figma Desktop App"
echo "4. Import plugin from dist/plugin/manifest.json"
echo ""
echo "See QUICKSTART.md for detailed instructions."
echo ""
