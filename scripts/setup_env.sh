#!/bin/bash

# Motion3D Transformer - Environment Setup Script
# This script sets up the complete development environment

echo "🚀 Setting up Motion3D Transformer environment..."

# Check Python version
python_version=$(python3 --version 2>&1 | grep -Po '(?<=Python )\d+\.\d+')
if [[ $(echo "$python_version >= 3.8" | bc -l) -eq 0 ]]; then
    echo "❌ Python 3.8+ is required. Current version: $python_version"
    exit 1
fi
echo "✅ Python $python_version detected"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

node_version=$(node --version | grep -Po '(?<=v)\d+')
if [[ $node_version -lt 16 ]]; then
    echo "❌ Node.js 16+ is required. Current version: v$node_version"
    exit 1
fi
echo "✅ Node.js $(node --version) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/examples/source_images
mkdir -p data/examples/driving_videos  
mkdir -p data/examples/results
mkdir -p models/checkpoints
mkdir -p logs

# Download pre-trained models
echo "🎯 Downloading pre-trained models..."
python scripts/download_models.py

# Set up Git LFS for large files
echo "📋 Setting up Git LFS..."
git lfs install
git lfs track "*.pth"
git lfs track "*.pt"
git lfs track "*.tar"
git add .gitattributes

echo "✨ Environment setup complete!"
echo ""
echo "🎮 To start the development servers:"
echo "   Terminal 1 (Backend): source venv/bin/activate && python backend/inference/api.py"
echo "   Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "🌐 The app will be available at: http://localhost:5173"