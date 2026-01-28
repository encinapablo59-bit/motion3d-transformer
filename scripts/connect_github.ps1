# GitHub Connection Setup Script
# Motion3D Transformer - Automated Repository Connection

Write-Host "Motion3D Transformer - GitHub Connection Setup"
Write-Host "============================================"
Write-Host ""

# Get GitHub username
$username = Read-Host "Please enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "Error: Username is required" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "STEP 1: Connecting to GitHub..." -ForegroundColor Cyan
Write-Host "Username: $username" -ForegroundColor Green
Write-Host "Repository: motion3d-transformer" -ForegroundColor Green
Write-Host ""

# Set repository URL
$repoUrl = "https://github.com/$username/motion3d-transformer.git"

Write-Host "STEP 2: Adding remote origin..." -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote origin added successfully!" -ForegroundColor Green
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Error: Failed to add remote origin" -ForegroundColor Red
    Write-Host "Make sure your username is correct and repository exists" -ForegroundColor Yellow
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "STEP 3: Ready to push!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Create repository at: https://github.com/new" -ForegroundColor White
Write-Host "   2. Repository name: motion3d-transformer" -ForegroundColor White
Write-Host "   3. Make it PUBLIC" -ForegroundColor White
Write-Host "   4. Then run: git push -u origin main" -ForegroundColor White
Write-Host ""

Write-Host "Waiting for you to create the repository..." -ForegroundColor Yellow
Write-Host "Once created, press any key to continue..." -ForegroundColor Green

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Pushing to GitHub now..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Repository deployed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is live at:" -ForegroundColor Yellow
    Write-Host "   https://github.com/$username/motion3d-transformer" -ForegroundColor White
    Write-Host ""
    Write-Host "Future demo will be at:" -ForegroundColor Yellow
    Write-Host "   https://$username.github.io/motion3d-transformer" -ForegroundColor White
    Write-Host ""
    Write-Host "Post-deployment steps:" -ForegroundColor Yellow
    Write-Host "   1. Verify all files are uploaded" -ForegroundColor White
    Write-Host "   2. Download pre-trained models if needed" -ForegroundColor White
    Write-Host "   3. Enable GitHub Pages for demo" -ForegroundColor White
    Write-Host "   4. Check GitHub Actions for CI/CD" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Failed to push to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Check if repository exists: https://github.com/$username/motion3d-transformer" -ForegroundColor White
    Write-Host "   2. Verify GitHub credentials: git config --list" -ForegroundColor White
    Write-Host "   3. Try manual push: git push -u origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host "Motion3D Transformer deployment process completed!" -ForegroundColor Green
Write-Host "============================================"
Write-Host ""