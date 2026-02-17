#!/bin/bash
# Deployment helper script

echo "🚀 TGPCET Backend Deployment Setup"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository!"
    echo "Initialize git first: git init && git remote add origin <your-repo>"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check Node.js and npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Check dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Push to GitHub: git push origin main"
echo "3. Deploy to Render: Check QUICK_DEPLOY.md"
echo ""
