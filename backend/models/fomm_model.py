"""
First Order Motion Model (FOMM) Implementation
Adapted from the original FOMM research for Motion3D Transformer
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Dict, Tuple, Optional
import torchvision.transforms as transforms

class FOMMPredictor(nn.Module):
    """
    First Order Motion Model for image animation
    """
    
    def __init__(self, config: Dict):
        super().__init__()
        self.config = config
        
        # Keypoint detector
        self.kp_detector = KeypointDetector(config)
        
        # Dense motion network
        self.dense_motion_network = DenseMotionNetwork(config)
        
        # Occlusion-aware generator
        self.generator = OcclusionAwareGenerator(config)
        
    def forward(self, source_image: torch.Tensor, driving_video: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for motion transfer
        
        Args:
            source_image: Source image tensor [B, 3, H, W]
            driving_video: Driving video tensor [B, T, 3, H, W]
            
        Returns:
            Generated video tensor [B, T, 3, H, W]
        """
        batch_size = source_image.shape[0]
        num_frames = driving_video.shape[1]
        
        # Extract keypoints from source and driving frames
        source_kp = self.kp_detector(source_image)
        driving_kp = []
        for t in range(num_frames):
            kp = self.kp_detector(driving_video[:, t])
            driving_kp.append(kp)
        driving_kp = torch.stack(driving_kp, dim=1)
        
        # Generate dense motion field
        output_frames = []
        for t in range(num_frames):
            motion_representation = self.dense_motion_network(
                source_image, source_kp, driving_kp[:, t]
            )
            
            # Generate output frame
            output = self.generator(source_image, motion_representation)
            output_frames.append(output)
            
        return torch.stack(output_frames, dim=1)

class KeypointDetector(nn.Module):
    """Detects keypoints for motion representation"""
    
    def __init__(self, config: Dict):
        super().__init__()
        self.num_keypoints = config.get('num_keypoints', 10)
        
        # Simple keypoint detector (placeholder)
        self.keypoint_net = nn.Sequential(
            nn.Conv2d(3, 32, 7, stride=2, padding=3),
            nn.ReLU(),
            nn.Conv2d(32, 64, 5, stride=2, padding=2),
            nn.ReLU(),
            nn.Conv2d(64, 128, 3, stride=2, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(128, self.num_keypoints * 2)  # x, y coordinates
        )
        
    def forward(self, x: torch.Tensor) -> Dict[str, torch.Tensor]:
        """
        Detect keypoints
        
        Returns:
            Dictionary containing keypoints and confidence
        """
        batch_size = x.shape[0]
        keypoints = self.keypoint_net(x)
        keypoints = keypoints.view(batch_size, self.num_keypoints, 2)
        
        # Normalize keypoints to [-1, 1]
        keypoints = torch.tanh(keypoints)
        
        return {
            'keypoints': keypoints,
            'confidence': torch.ones(batch_size, self.num_keypoints, device=x.device)
        }

class DenseMotionNetwork(nn.Module):
    """Generates dense motion field from keypoints"""
    
    def __init__(self, config: Dict):
        super().__init__()
        self.num_keypoints = config.get('num_keypoints', 10)
        
        # Motion field network
        self.motion_net = nn.Sequential(
            nn.Conv2d(3, 64, 7, stride=2, padding=3),
            nn.ReLU(),
            nn.Conv2d(64, 128, 5, stride=2, padding=2),
            nn.ReLU(),
            nn.Conv2d(128, 256, 3, stride=2, padding=1),
            nn.ReLU(),
            nn.Conv2d(256, 512, 3, stride=2, padding=1),
            nn.ReLU()
        )
        
        # Flow prediction head
        self.flow_head = nn.Conv2d(512, 2, 3, padding=1)
        
        # Occlusion prediction head
        self.occlusion_head = nn.Conv2d(512, 1, 3, padding=1)
        
    def forward(self, source_image: torch.Tensor, source_kp: Dict, driving_kp: Dict) -> Dict[str, torch.Tensor]:
        """
        Generate dense motion representation
        
        Args:
            source_image: Source image
            source_kp: Source keypoints
            driving_kp: Target keypoints
            
        Returns:
            Dictionary containing motion field and occlusion
        """
        # Extract motion features
        motion_features = self.motion_net(source_image)
        
        # Predict optical flow
        flow = self.flow_head(motion_features)
        
        # Predict occlusion mask
        occlusion = torch.sigmoid(self.occlusion_head(motion_features))
        
        return {
            'flow': flow,
            'occlusion': occlusion
        }

class OcclusionAwareGenerator(nn.Module):
    """Generator that handles occlusions in motion transfer"""
    
    def __init__(self, config: Dict):
        super().__init__()
        
        # Encoder
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 64, 7, stride=2, padding=3),
            nn.ReLU(),
            nn.Conv2d(64, 128, 5, stride=2, padding=2),
            nn.ReLU(),
            nn.Conv2d(128, 256, 3, stride=2, padding=1),
            nn.ReLU()
        )
        
        # Decoder with skip connections
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256 + 2 + 1, 128, 4, stride=2, padding=1),  # +flow + occlusion
            nn.ReLU(),
            nn.ConvTranspose2d(128, 64, 4, stride=2, padding=1),
            nn.ReLU(),
            nn.ConvTranspose2d(64, 3, 4, stride=2, padding=1),
            nn.Sigmoid()
        )
        
    def forward(self, source_image: torch.Tensor, motion_representation: Dict) -> torch.Tensor:
        """
        Generate output frame with occlusion awareness
        
        Args:
            source_image: Source image
            motion_representation: Motion field and occlusion
            
        Returns:
            Generated frame
        """
        # Encode source image
        encoded = self.encoder(source_image)
        
        # Combine with motion representation
        flow = motion_representation['flow']
        occlusion = motion_representation['occlusion']
        
        # Resize flow and occlusion to match encoded features
        flow_resized = nn.functional.interpolate(flow, size=encoded.shape[2:], mode='bilinear', align_corners=False)
        occlusion_resized = nn.functional.interpolate(occlusion, size=encoded.shape[2:], mode='bilinear', align_corners=False)
        
        # Concatenate features
        combined = torch.cat([encoded, flow_resized, occlusion_resized], dim=1)
        
        # Decode to generate output
        output = self.decoder(combined)
        
        return output

def load_fomm_model(model_path: str, device: str = "cuda") -> FOMMPredictor:
    """
    Load pre-trained FOMM model
    
    Args:
        model_path: Path to model checkpoint
        device: Device to load model on
        
    Returns:
        Loaded FOMMPredictor model
    """
    config = {
        "image_size": 256,
        "num_channels": 3,
        "num_keypoints": 10
    }
    
    model = FOMMPredictor(config)
    
    # Load checkpoint if available
    if os.path.exists(model_path):
        checkpoint = torch.load(model_path, map_location=device)
        model.load_state_dict(checkpoint['model_state_dict'])
        print(f"✅ Loaded FOMM model from {model_path}")
    else:
        print(f"⚠️ Model checkpoint not found at {model_path}, using randomly initialized weights")
    
    model.to(device)
    model.eval()
    return model