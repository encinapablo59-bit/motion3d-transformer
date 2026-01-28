@echo off
echo "🚀 Motion3D Transformer - GitHub Connection Setup"
echo "============================================"
echo.
echo 👤 STEP 1: Please enter your GitHub username:
set /p username=GitHub Username: 

if "%username%"=="" (
    echo ❌ Error: Username is required
    pause
    exit /b 1
)

echo.
echo 🔗 STEP 2: Connecting to GitHub...
echo Username: %username%
echo Repository: motion3d-transformer

echo.
git remote add origin https://github.com/%username%/motion3d-transformer.git

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to add remote origin
    echo 💡 Make sure your username is correct and the repository exists
    pause
    exit /b 1
)

echo.
echo ✅ Remote origin added successfully!
echo 📡 Repository URL: https://github.com/%username%/motion3d-transformer
echo.
echo 🚀 STEP 3: Ready to push!
echo.
echo 📝 Next steps:
echo    1. Create the repository at: https://github.com/new
echo    2. Repository name: motion3d-transformer
echo    3. Make it PUBLIC
echo    4. Then run: git push -u origin main
echo.
echo ⏳ Waiting for you to create the repository...
pause