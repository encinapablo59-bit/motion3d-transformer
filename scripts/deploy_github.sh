#!/bin/bash

# Quick Deploy Script for Motion3D Transformer
# Automates GitHub repository setup and deployment

echo "🚀 Motion3D Transformer - Quick Deploy Script"
echo "=================================================="

# Configuration
GITHUB_USERNAME=${1:-"TU_USERNAME"}
REPO_NAME="motion3d-transformer"
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"

echo "📋 Configuration:"
echo "   Username: ${GITHUB_USERNAME}"
echo "   Repository: ${REPO_NAME}"
echo "   URL: ${REPO_URL}"
echo ""

# Step 1: Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "📡 Remote origin already exists"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "   Current: ${CURRENT_REMOTE}"
else
    echo "📡 Adding remote origin..."
    git remote add origin "${REPO_URL}"
    echo "✅ Remote added: ${REPO_URL}"
fi

# Step 2: Configure Git LFS
echo ""
echo "⚙️ Configuring Git LFS..."
git lfs install

# Track large files
git lfs track "*.pth"
git lfs track "*.pt"
git lfs track "*.tar"
git lfs track "*.ckpt"

# Add .gitattributes if not tracked
if ! git ls-files | grep -q ".gitattributes"; then
    git add .gitattributes
    git commit -m "Add Git LFS tracking for model files"
    echo "✅ Git LFS configuration committed"
else
    echo "✅ Git LFS already configured"
fi

# Step 3: Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
echo "⚠️ Note: Large model files will be skipped initially"
echo ""

# Push without LFS files first
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Repository URL: ${REPO_URL}"
    echo "📄 Repository will be available at:"
    echo "   https://${GITHUB_USERNAME}.github.io/${REPO_NAME}"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Visit repository and verify files"
    echo "   2. Download pre-trained models"
    echo "   3. Place models in models/ directory"
    echo "   4. Push models with Git LFS"
    echo "   5. Enable GitHub Pages for demo"
    echo ""
    echo "📖 Follow GITHUB_SETUP.md for detailed instructions"
else
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check GitHub credentials: git config --list"
    echo "   2. Verify repository exists: ${REPO_URL}"
    echo "   3. Check network connection"
    echo "   4. Try manual push: git push -u origin main"
fi

echo ""
echo "🎯 Motion3D Transformer deployment process completed!"
echo "=================================================="