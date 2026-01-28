#!/usr/bin/env python3
"""
Demo script for Motion3D Transformer
Demonstrates motion transfer capabilities
"""

import os
import sys
import argparse
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from backend.inference.predictor import Motion3DPredictor
from backend.models.model_loader import get_model_manager

def main():
    parser = argparse.ArgumentParser(description="Motion3D Transformer Demo")
    parser.add_argument("--source", help="Path to source image")
    parser.add_argument("--driving", help="Path to driving video") 
    parser.add_argument("--model", choices=["motion_clone", "fomm"], default="motion_clone",
                       help="Model to use")
    parser.add_argument("--output", help="Output video path")
    parser.add_argument("--benchmark", action="store_true", help="Run benchmark")
    parser.add_argument("--list-models", action="store_true", help="List available models")
    
    args = parser.parse_args()
    
    # List models
    if args.list_models:
        manager = get_model_manager()
        manager.list_models()
        return
    
    # Check models available
    manager = get_model_manager()
    available = manager.get_available_models()
    
    if not available:
        print("❌ No models found. Please run:")
        print("   python scripts/download_models.py")
        return
    
    print(f"🎯 Motion3D Transformer Demo")
    print(f"Available models: {list(available.keys())}")
    print(f"Selected model: {args.model}")
    print()
    
    # Initialize predictor
    try:
        predictor = Motion3DPredictor(args.model)
        print(f"✅ {args.model} model loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load {args.model}: {e}")
        return
    
    # Model info
    model_info = predictor.get_model_info()
    print(f"   Parameters: {model_info['model_parameters']:,}")
    print(f"   Size: {model_info['size_mb']:.1f} MB")
    print(f"   Device: {model_info['device']}")
    print()
    
    # Default files if not provided
    if not args.source:
        source_dir = project_root / "data" / "examples" / "source_images"
        source_files = list(source_dir.glob("*.jpg")) + list(source_dir.glob("*.png"))
        if source_files:
            args.source = str(source_files[0])
            print(f"Using source: {args.source}")
        else:
            print("❌ No source image provided and no examples found")
            return
    
    if not args.driving:
        video_dir = project_root / "data" / "examples" / "driving_videos"
        video_files = list(video_dir.glob("*.mp4")) + list(video_dir.glob("*.avi"))
        if video_files:
            args.driving = str(video_files[0])
            print(f"Using driving video: {args.driving}")
        else:
            print("❌ No driving video provided and no examples found")
            return
    
    # Run benchmark if requested
    if args.benchmark:
        print("🏃 Running benchmark...")
        results = predictor.benchmark_performance(args.source, args.driving)
        
        print(f"\n📊 Benchmark Results:")
        print(f"   Model: {results['model_name']}")
        print(f"   Device: {results['device']}")
        print(f"   Avg Time: {results['avg_time_seconds']:.3f}s")
        print(f"   Min Time: {results['min_time_seconds']:.3f}s")
        print(f"   Max Time: {results['max_time_seconds']:.3f}s")
        print(f"   FPS: {results['fps']:.1f}")
        print(f"   Input Frames: {results['input_frames']}")
        return
    
    # Generate motion transfer
    try:
        output_path = predictor.generate_motion(
            args.source, 
            args.driving, 
            args.output
        )
        
        print(f"\n🎉 Motion transfer complete!")
        print(f"Output: {output_path}")
        
        # Check file size
        if os.path.exists(output_path):
            file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
            print(f"File size: {file_size_mb:.1f} MB")
        
    except Exception as e:
        print(f"❌ Generation failed: {e}")
        return

def check_dependencies():
    """Check if required dependencies are installed"""
    missing = []
    
    try:
        import torch
        print(f"✅ PyTorch {torch.__version__}")
    except ImportError:
        missing.append("torch")
    
    try:
        import torchvision
        print(f"✅ TorchVision {torchvision.__version__}")
    except ImportError:
        missing.append("torchvision")
    
    try:
        import cv2
        print(f"✅ OpenCV {cv2.__version__}")
    except ImportError:
        missing.append("opencv-python")
    
    try:
        import imageio
        print(f"✅ ImageIO {imageio.__version__}")
    except ImportError:
        missing.append("imageio")
    
    if missing:
        print(f"\n❌ Missing dependencies: {', '.join(missing)}")
        print("Install with: pip install -r requirements.txt")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Motion3D Transformer Demo")
    print("=" * 40)
    
    if not check_dependencies():
        sys.exit(1)
    
    main()