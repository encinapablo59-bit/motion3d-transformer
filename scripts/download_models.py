#!/usr/bin/env python3
"""
Download pre-trained models for Motion3D Transformer
This script downloads and sets up all necessary model files
"""

import os
import sys
import urllib.request
from pathlib import Path
from tqdm import tqdm

# Model URLs (replace with actual URLs when available)
MODELS = {
    "motion_clone": {
        "url": "https://example.com/motion_clone_checkpoint.pth",  # Replace with actual URL
        "path": "models/motion_clone/checkpoint.pth",
        "size": "500MB"
    },
    "fomm": {
        "url": "https://example.com/vox-cpk.pth.tar",  # Replace with actual URL  
        "path": "models/fomm/vox-cpk.pth.tar",
        "size": "200MB"
    }
}

def download_file(url: str, filepath: str, description: str):
    """Download a file with progress bar"""
    print(f"Downloading {description}...")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    def progress_hook(block_num, block_size, total_size):
        if total_size > 0:
            percent = min(100, (block_num * block_size * 100) // total_size)
            bar_length = 50
            filled_length = (percent * bar_length) // 100
            bar = '█' * filled_length + '-' * (bar_length - filled_length)
            print(f'\r[{bar}] {percent}% ({block_num * block_size}/{total_size} bytes)', end='')
    
    try:
        urllib.request.urlretrieve(url, filepath, reporthook=progress_hook)
        print(f"\n✅ Successfully downloaded {description}")
        return True
    except Exception as e:
        print(f"\n❌ Failed to download {description}: {e}")
        return False

def main():
    print("🎯 Motion3D Transformer - Model Downloader")
    print("=" * 50)
    
    # Check if models directory exists
    models_dir = Path("models")
    if not models_dir.exists():
        models_dir.mkdir()
        print("Created models directory")
    
    success_count = 0
    total_count = len(MODELS)
    
    for model_name, config in MODELS.items():
        filepath = Path(config["path"])
        
        # Check if model already exists
        if filepath.exists():
            print(f"✅ {model_name} already exists ({config['size']})")
            success_count += 1
            continue
        
        # Download model
        if download_file(config["url"], str(filepath), f"{model_name} ({config['size']})"):
            success_count += 1
    
    print("\n" + "=" * 50)
    print(f"Download complete: {success_count}/{total_count} models ready")
    
    if success_count == total_count:
        print("🎉 All models are ready for use!")
    else:
        print("⚠️ Some models failed to download. You may need to download them manually.")
        print("Visit the GitHub repository for manual download links.")
    
    return success_count == total_count

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)