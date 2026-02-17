@echo off
REM Deployment helper script for Windows

echo 🚀 TGPCET Backend Deployment Setup
echo ==================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Not a git repository!
    echo Initialize git first: git init ^&^& git remote add origin ^<your-repo^>
    exit /b 1
)

echo ✅ Git repository found
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Install from https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js installed
echo ✅ npm installed
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Test locally: npm run dev
echo 2. Push to GitHub: git push origin main
echo 3. Deploy to Render: Check QUICK_DEPLOY.md
echo.
pause
