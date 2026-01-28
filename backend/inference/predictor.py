"""
Motion3D Predictor - Main inference class
Combines different models for motion transfer and 3D visualization
"""

import os
import torch
import numpy as np
from typing import Dict, Optional, Tuple
import cv2
from PIL import Image
import imageio

from ..models.model_loader import get_model_manager

class Motion3DPredictor:
    """
    Main predictor class for motion transfer with 3D visualization
    """
    
    def __init__(self, model_name: str = "motion_clone", device: str = "auto"):
        """
        Initialize predictor
        
        Args:
            model_name: Model to use ("motion_clone", "fomm")
            device: Device to use ("auto", "cuda", "cpu")
        """
        self.model_manager = get_model_manager(device)
        self.model = self.model_manager.load_model(model_name)
        self.model_name = model_name
        self.device = device
        
        # Image preprocessing
        self.transform = self._get_transform()
        
    def _get_transform(self):
        """Get image preprocessing transform"""
        import torchvision.transforms as transforms
        return transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
        ])
        
    def preprocess_image(self, image_path: str) -> torch.Tensor:
        """
        Preprocess input image
        
        Args:
            image_path: Path to image file
            
        Returns:
            Preprocessed tensor [1, 3, H, W]
        """
        image = Image.open(image_path).convert('RGB')
        image = self.transform(image)
        return image.unsqueeze(0).to(self.device)
        
    def preprocess_video(self, video_path: str, max_frames: int = 100) -> torch.Tensor:
        """
        Preprocess driving video
        
        Args:
            video_path: Path to video file
            max_frames: Maximum number of frames to extract
            
        Returns:
            Preprocessed video tensor [1, T, 3, H, W]
        """
        # Read video
        cap = cv2.VideoCapture(video_path)
        frames = []
        
        frame_count = 0
        while cap.isOpened() and frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Convert to PIL and apply transforms
            frame_pil = Image.fromarray(frame_rgb)
            frame_tensor = self.transform(frame_pil)
            frames.append(frame_tensor)
            
            frame_count += 1
            
        cap.release()
        
        if not frames:
            raise ValueError("No frames could be extracted from video")
            
        # Stack frames: [T, 3, H, W]
        video_tensor = torch.stack(frames, dim=0)
        # Add batch dimension: [1, T, 3, H, W]
        video_tensor = video_tensor.unsqueeze(0)
        
        return video_tensor.to(self.device)
        
    def generate_motion(self, source_image_path: str, driving_video_path: str, 
                      output_path: str = None, config: Dict = None) -> str:
        """
        Generate motion transfer
        
        Args:
            source_image_path: Path to source image
            driving_video_path: Path to driving video
            output_path: Path to save output video
            config: Additional configuration options
            
        Returns:
            Path to generated video
        """
        print(f"🎬 Generating motion transfer...")
        print(f"   Source: {source_image_path}")
        print(f"   Driving: {driving_video_path}")
        
        # Set default config
        if config is None:
            config = {}
            
        # Preprocess inputs
        print("📸 Preprocessing inputs...")
        source_tensor = self.preprocess_image(source_image_path)
        driving_tensor = self.preprocess_video(driving_video_path)
        
        print(f"   Source shape: {source_tensor.shape}")
        print(f"   Video shape: {driving_tensor.shape}")
        
        # Generate motion transfer
        print(f"🎯 Running {self.model_name} model...")
        with torch.no_grad():
            output_tensor = self.model(source_tensor, driving_tensor)
            
        print(f"   Output shape: {output_tensor.shape}")
        
        # Post-process and save
        output_path = output_path or self._get_default_output_path(source_image_path, driving_video_path)
        self._save_output_video(output_tensor, output_path)
        
        print(f"✅ Motion transfer complete: {output_path}")
        return output_path
        
    def _get_default_output_path(self, source_image_path: str, driving_video_path: str) -> str:
        """Generate default output filename"""
        source_name = os.path.splitext(os.path.basename(source_image_path))[0]
        driving_name = os.path.splitext(os.path.basename(driving_video_path))[0]
        
        output_dir = "data/examples/results"
        os.makedirs(output_dir, exist_ok=True)
        
        return f"{output_dir}/{source_name}_{driving_name}_{self.model_name}.mp4"
        
    def _save_output_video(self, output_tensor: torch.Tensor, output_path: str):
        """
        Save output tensor as video file
        
        Args:
            output_tensor: Output tensor [1, T, 3, H, W]
            output_path: Path to save video
        """
        # Remove batch dimension and move to CPU
        frames = output_tensor.squeeze(0).cpu()
        
        # Denormalize from [-1, 1] to [0, 1]
        frames = (frames + 1.0) / 2.0
        frames = torch.clamp(frames, 0.0, 1.0)
        
        # Convert to numpy and save
        frame_list = []
        for i in range(frames.shape[0]):
            frame = frames[i].permute(1, 2, 0).numpy()
            frame = (frame * 255).astype(np.uint8)
            frame_list.append(frame)
            
        # Save as MP4
        imageio.mimsave(output_path, frame_list, fps=25, quality=8)
        
    def get_model_info(self) -> Dict:
        """Get information about current model"""
        return {
            "model_name": self.model_name,
            "device": str(self.device),
            "model_parameters": sum(p.numel() for p in self.model.parameters()),
            "model_size_mb": sum(p.numel() * p.element_size() for p in self.model.parameters()) / (1024 * 1024)
        }
        
    def benchmark_performance(self, test_image: str, test_video: str, 
                           num_runs: int = 3) -> Dict:
        """
        Benchmark model performance
        
        Args:
            test_image: Path to test image
            test_video: Path to test video
            num_runs: Number of benchmark runs
            
        Returns:
            Performance metrics
        """
        import time
        
        print(f"⏱️ Benchmarking {self.model_name}...")
        
        # Preprocess once
        source_tensor = self.preprocess_image(test_image)
        driving_tensor = self.preprocess_video(test_video)
        
        times = []
        
        for i in range(num_runs):
            torch.cuda.synchronize() if torch.cuda.is_available() else None
            
            start_time = time.time()
            with torch.no_grad():
                output = self.model(source_tensor, driving_tensor)
            torch.cuda.synchronize() if torch.cuda.is_available() else None
            
            end_time = time.time()
            times.append(end_time - start_time)
            
            print(f"   Run {i+1}: {times[-1]:.3f}s")
            
        avg_time = np.mean(times)
        fps = driving_tensor.shape[1] / avg_time
        
        results = {
            "avg_time_seconds": avg_time,
            "min_time_seconds": min(times),
            "max_time_seconds": max(times),
            "fps": fps,
            "model_name": self.model_name,
            "input_frames": driving_tensor.shape[1],
            "device": str(self.device)
        }
        
        print(f"📊 Average: {avg_time:.3f}s ({fps:.1f} FPS)")
        
        return results