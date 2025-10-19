#!/bin/bash

# Test script to verify API connections

echo "======================================"
echo "Testing API Connections"
echo "======================================"
echo ""

# Load .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found"
    exit 1
fi

# Test Figma API
echo "Testing Figma API..."
if [ -z "$FIGMA_ACCESS_TOKEN" ] || [ -z "$FIGMA_FILE_KEY" ]; then
    echo "❌ Missing FIGMA_ACCESS_TOKEN or FIGMA_FILE_KEY"
else
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
        "https://api.figma.com/v1/files/$FIGMA_FILE_KEY")

    if [ "$RESPONSE" = "200" ]; then
        echo "✓ Figma API connection successful"
    else
        echo "❌ Figma API connection failed (HTTP $RESPONSE)"
        echo "   Check your FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY"
    fi
fi
echo ""

# Test Gemini API
echo "Testing Gemini API..."
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Missing GEMINI_API_KEY"
else
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://generativelanguage.googleapis.com/v1/models?key=$GEMINI_API_KEY")

    if [ "$RESPONSE" = "200" ]; then
        echo "✓ Gemini API connection successful"
    else
        echo "❌ Gemini API connection failed (HTTP $RESPONSE)"
        echo "   Check your GEMINI_API_KEY"
    fi
fi
echo ""

# Test local server (if running)
echo "Testing local server..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$RESPONSE" = "200" ]; then
    echo "✓ Local server is running"
    curl -s http://localhost:3000/health | python -m json.tool
else
    echo "⚠️  Local server is not running"
    echo "   Start it with: npm run dev"
fi
echo ""

echo "======================================"
echo "Test Complete"
echo "======================================"
