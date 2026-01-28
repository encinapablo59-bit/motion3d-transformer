# GitHub Auto-Setup Script for encinapablo59-bit
# Motion3D Transformer - Complete Deployment

Write-Host "🚀 Motion3D Transformer - encinapablo59-bit"
Write-Host "=========================================="

# Pre-configured repository information
$username = "encinapablo59-bit"
$repoName = "motion3d-transformer"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "📋 Configuration:"
Write-Host "   Username: $username"
Write-Host "   Repository: $repoName"
Write-Host "   URL: $repoUrl"
Write-Host ""

# Step 1: Check if remote exists
if (git remote get-url origin) {
    Write-Host "📡 Remote origin already exists" -ForegroundColor Yellow
    $currentRemote = git remote get-url origin
    Write-Host "   Current: $currentRemote"
    Write-Host ""
    Write-Host "🔄 Updating remote..."
    git remote remove origin
}

# Step 2: Add new remote
Write-Host "🔗 Adding remote origin..." -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote configured successfully!" -ForegroundColor Green
    Write-Host "📡 Repository: $repoUrl" -ForegroundColor White
} else {
    Write-Host "❌ Failed to configure remote" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Step 3: Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Repository: $username/$repoName" -ForegroundColor White
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! Repository deployed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Your Motion3D Transformer is now live at:" -ForegroundColor Yellow
    Write-Host "   🔗 Repository: https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host "   🌐 Future Demo: https://$username.github.io/$repoName" -ForegroundColor White
    Write-Host "   📋 API Docs: https://$username.github.io/$repoName/docs" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Visit repository and verify files" -ForegroundColor White
    Write-Host "   2. Manually create repository at GitHub" -ForegroundColor White
    Write-Host "   3. Enable GitHub Pages for demo" -ForegroundColor White
    Write-Host "   4. Download pre-trained models if needed" -ForegroundColor White
    Write-Host "   5. Test by cloning: git clone https://github.com/$username/$repoName.git" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Development Commands:" -ForegroundColor Yellow
    Write-Host "   git clone https://github.com/$username/$repoName.git test-deploy" -ForegroundColor Gray
    Write-Host "   cd test-deploy && bash scripts/setup_env.sh" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎯 Motion3D Transformer deployment completed!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Check repository exists: https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host "   2. Verify GitHub credentials: git config --list" -ForegroundColor White
    Write-Host "   3. Try manual push: git push -u origin main" -ForegroundColor White
    Write-Host "   4. Check network connection" -ForegroundColor White
}

Write-Host "==========================================" -ForegroundColor Green
Write-Host ""