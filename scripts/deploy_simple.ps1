# GitHub Auto-Deploy for encinapablo59-bit
# Motion3D Transformer - Complete Deployment

Write-Host "Motion3D Transformer - GitHub Auto-Deploy"
Write-Host "=========================================="

# Pre-configured for encinapablo59-bit
$username = "encinapablo59-bit"
$repoName = "motion3d-transformer"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "Configuration:"
Write-Host "   Username: $username"
Write-Host "   Repository: $repoName"
Write-Host "   URL: $repoUrl"
Write-Host ""

# Check if remote exists
if (git remote get-url origin) {
    Write-Host "Remote origin already exists. Updating..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
Write-Host "Adding remote origin..." -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote configured successfully!" -ForegroundColor Green
    Write-Host "Repository URL: $repoUrl" -ForegroundColor White
    
    # Push to GitHub
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    Write-Host "Repository: $username/$repoName" -ForegroundColor White
    
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Repository deployed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your Motion3D Transformer is live at:" -ForegroundColor Yellow
        Write-Host "Repository: https://github.com/$username/$repoName" -ForegroundColor White
        Write-Host "Future Demo: https://$username.github.io/$repoName" -ForegroundColor White
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Visit your repository" -ForegroundColor White
        Write-Host "2. Download pre-trained models" -ForegroundColor White
        Write-Host "3. Enable GitHub Pages for demo" -ForegroundColor White
        Write-Host "4. Check GitHub Actions for CI/CD" -ForegroundColor White
        Write-Host ""
        Write-Host "Deployment completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to push to GitHub!" -ForegroundColor Red
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Check network connection" -ForegroundColor White
        Write-Host "2. Verify GitHub credentials: git config --list" -ForegroundColor White
        Write-Host "3. Try manual push: git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host "Failed to configure remote!" -ForegroundColor Red
    Write-Host "Error: Could not connect to GitHub" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Motion3D Transformer deployment process completed!" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""