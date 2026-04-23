@echo off
echo 🚀 Starting Deployment to Netlify...
echo.

:: 1. Stage Changes
echo [1/3] Staging changes...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to stage changes. Is Git installed?
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Commit
echo [2/3] Committing changes...
git commit -m "feat: full skills & contact redesign with elite minimalist aesthetic"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Nothing to commit or commit failed.
)

:: 3. Push
echo [3/3] Pushing to repository...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Push failed. Check your internet connection and remote settings.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Deployment Complete! 
echo Check your live site at: https://israr-ahmad.netlify.app/
echo.
pause
