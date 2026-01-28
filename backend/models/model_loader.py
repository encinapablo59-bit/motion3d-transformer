"""
Model Loader for Motion3D Transformer
Handles loading and management of different motion transfer models
"""

import os
import torch
from typing import Dict, Optional
from pathlib import Path

from .motion_clone import MotionClonePredictor, load_motion_clone_model
from .fomm_model import FOMMPredictor, load_fomm_model

class ModelManager:
    """
    Manager class for loading and switching between different models
    """
    
    def __init__(self, device: str = "auto"):
        """
        Initialize model manager
        
        Args:
            device: Device to use ("auto", "cuda", "cpu")
        """
        if device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
            
        print(f"Using device: {self.device}")
        
        self.loaded_models = {}
        self.current_model = None
        self.current_model_name = None
        
    def load_model(self, model_name: str, model_path: Optional[str] = None) -> torch.nn.Module:
        """
        Load a specific model
        
        Args:
            model_name: Name of model ("motion_clone", "fomm")
            model_path: Path to model checkpoint (optional, uses default if None)
            
        Returns:
            Loaded model
        """
        if model_name in self.loaded_models:
            print(f"Model {model_name} already loaded")
            return self.loaded_models[model_name]
            
        # Determine model path
        if model_path is None:
            model_path = self._get_default_model_path(model_name)
            
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
            
        # Load appropriate model
        if model_name == "motion_clone":
            model = load_motion_clone_model(model_path, self.device)
        elif model_name == "fomm":
            model = load_fomm_model(model_path, self.device)
        else:
            raise ValueError(f"Unknown model: {model_name}")
            
        self.loaded_models[model_name] = model
        print(f"✅ Loaded {model_name} model")
        
        return model
        
    def set_current_model(self, model_name: str) -> torch.nn.Module:
        """
        Set the currently active model
        
        Args:
            model_name: Name of model to activate
            
        Returns:
            Current model
        """
        if model_name not in self.loaded_models:
            self.load_model(model_name)
            
        self.current_model = self.loaded_models[model_name]
        self.current_model_name = model_name
        print(f"🎯 Current model set to: {model_name}")
        
        return self.current_model
        
    def get_current_model(self) -> Optional[torch.nn.Module]:
        """Get the currently loaded model"""
        return self.current_model
        
    def get_available_models(self) -> Dict[str, str]:
        """
        Get list of available models and their paths
        
        Returns:
            Dictionary mapping model names to their paths
        """
        models = {}
        
        # Check for MotionClone model
        motion_clone_path = self._get_default_model_path("motion_clone")
        if os.path.exists(motion_clone_path):
            models["motion_clone"] = motion_clone_path
            
        # Check for FOMM model
        fomm_path = self._get_default_model_path("fomm")
        if os.path.exists(fomm_path):
            models["fomm"] = fomm_path
            
        return models
        
    def _get_default_model_path(self, model_name: str) -> str:
        """Get default path for a model"""
        base_dir = Path(__file__).parent.parent.parent
        
        if model_name == "motion_clone":
            return str(base_dir / "models" / "motion_clone" / "checkpoint.pth")
        elif model_name == "fomm":
            return str(base_dir / "models" / "fomm" / "vox-cpk.pth.tar")
        else:
            raise ValueError(f"Unknown model: {model_name}")
            
    def list_models(self):
        """Print information about available and loaded models"""
        print("📋 Available Models:")
        available = self.get_available_models()
        for name, path in available.items():
            status = "✅ Loaded" if name in self.loaded_models else "⏳ Available"
            current = " (CURRENT)" if name == self.current_model_name else ""
            print(f"  • {name}: {status}{current}")
            
        if not available:
            print("  No models found. Run scripts/download_models.py first.")
            
    def unload_model(self, model_name: str):
        """Unload a model to free memory"""
        if model_name in self.loaded_models:
            del self.loaded_models[model_name]
            if self.current_model_name == model_name:
                self.current_model = None
                self.current_model_name = None
            print(f"🗑️ Unloaded {model_name} model")
            
            # Clear GPU cache
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        else:
            print(f"Model {model_name} not loaded")

# Global model manager instance
_model_manager = None

def get_model_manager(device: str = "auto") -> ModelManager:
    """
    Get global model manager instance
    
    Args:
        device: Device to use
        
    Returns:
        ModelManager instance
    """
    global _model_manager
    if _model_manager is None:
        _model_manager = ModelManager(device)
    return _model_manager

def get_model(model_name: str, device: str = "auto") -> torch.nn.Module:
    """
    Convenience function to get a specific model
    
    Args:
        model_name: Name of model to load
        device: Device to use
        
    Returns:
        Loaded model
    """
    manager = get_model_manager(device)
    return manager.load_model(model_name)