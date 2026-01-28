"""
Video processing utilities for Motion3D Transformer
"""

import cv2
import numpy as np
from typing import List, Tuple, Optional
import imageio
from PIL import Image

class VideoProcessor:
    """Utility class for video processing operations"""
    
    @staticmethod
    def extract_frames(video_path: str, max_frames: Optional[int] = None) -> List[np.ndarray]:
        """
        Extract frames from video file
        
        Args:
            video_path: Path to video file
            max_frames: Maximum number of frames to extract
            
        Returns:
            List of frames as numpy arrays
        """
        cap = cv2.VideoCapture(video_path)
        frames = []
        
        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frames.append(frame)
            frame_count += 1
            
            if max_frames and frame_count >= max_frames:
                break
                
        cap.release()
        return frames
        
    @staticmethod
    def save_frames(frames: List[np.ndarray], output_path: str, fps: int = 25):
        """
        Save frames as video file
        
        Args:
            frames: List of frames
            output_path: Output video path
            fps: Frames per second
        """
        if not frames:
            raise ValueError("No frames to save")
            
        height, width = frames[0].shape[:2]
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        for frame in frames:
            out.write(frame)
            
        out.release()
        
    @staticmethod
    def resize_frames(frames: List[np.ndarray], target_size: Tuple[int, int]) -> List[np.ndarray]:
        """
        Resize frames to target size
        
        Args:
            frames: Input frames
            target_size: Target (width, height)
            
        Returns:
            Resized frames
        """
        return [cv2.resize(frame, target_size) for frame in frames]
        
    @staticmethod
    def normalize_frames(frames: List[np.ndarray]) -> List[np.ndarray]:
        """
        Normalize pixel values to [0, 1]
        
        Args:
            frames: Input frames
            
        Returns:
            Normalized frames
        """
        return [frame.astype(np.float32) / 255.0 for frame in frames]
        
    @staticmethod
    def denormalize_frames(frames: List[np.ndarray]) -> List[np.ndarray]:
        """
        Denormalize pixel values from [0, 1] to [0, 255]
        
        Args:
            frames: Normalized frames
            
        Returns:
            Denormalized frames
        """
        return [(frame * 255).astype(np.uint8) for frame in frames]

class ImageProcessor:
    """Utility class for image processing operations"""
    
    @staticmethod
    def load_image(image_path: str) -> np.ndarray:
        """
        Load image from file
        
        Args:
            image_path: Path to image file
            
        Returns:
            Image as numpy array
        """
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
    @staticmethod
    def save_image(image: np.ndarray, output_path: str):
        """
        Save image to file
        
        Args:
            image: Image as numpy array
            output_path: Output path
        """
        image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        cv2.imwrite(output_path, image_bgr)
        
    @staticmethod
    def resize_image(image: np.ndarray, target_size: Tuple[int, int]) -> np.ndarray:
        """
        Resize image to target size
        
        Args:
            image: Input image
            target_size: Target (width, height)
            
        Returns:
            Resized image
        """
        return cv2.resize(image, target_size)
        
    @staticmethod
    def center_crop(image: np.ndarray, crop_size: Tuple[int, int]) -> np.ndarray:
        """
        Center crop image to specified size
        
        Args:
            image: Input image
            crop_size: Target crop (width, height)
            
        Returns:
            Cropped image
        """
        height, width = image.shape[:2]
        crop_width, crop_height = crop_size
        
        start_x = (width - crop_width) // 2
        start_y = (height - crop_height) // 2
        
        return image[start_y:start_y + crop_height, start_x:start_x + crop_width]

class FileValidator:
    """Utility class for validating input files"""
    
    @staticmethod
    def is_valid_image(file_path: str) -> bool:
        """
        Check if file is a valid image
        
        Args:
            file_path: Path to file
            
        Returns:
            True if valid image
        """
        try:
            with Image.open(file_path) as img:
                img.verify()
            return True
        except Exception:
            return False
            
    @staticmethod
    def is_valid_video(file_path: str) -> bool:
        """
        Check if file is a valid video
        
        Args:
            file_path: Path to file
            
        Returns:
            True if valid video
        """
        try:
            cap = cv2.VideoCapture(file_path)
            ret, _ = cap.read()
            cap.release()
            return ret
        except Exception:
            return False
            
    @staticmethod
    def get_video_info(file_path: str) -> dict:
        """
        Get video file information
        
        Args:
            file_path: Path to video file
            
        Returns:
            Dictionary with video info
        """
        cap = cv2.VideoCapture(file_path)
        
        if not cap.isOpened():
            raise ValueError(f"Could not open video: {file_path}")
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = frame_count / fps if fps > 0 else 0
        
        cap.release()
        
        return {
            "fps": fps,
            "frame_count": frame_count,
            "width": width,
            "height": height,
            "duration": duration
        }
        
    @staticmethod
    def get_image_info(file_path: str) -> dict:
        """
        Get image file information
        
        Args:
            file_path: Path to image file
            
        Returns:
            Dictionary with image info
        """
        try:
            with Image.open(file_path) as img:
                width, height = img.size
                mode = img.mode
                
            return {
                "width": width,
                "height": height,
                "mode": mode
            }
        except Exception as e:
            raise ValueError(f"Could not read image: {e}")

class FormatConverter:
    """Utility class for format conversion"""
    
    @staticmethod
    def video_to_gif(video_path: str, gif_path: str, fps: int = 10):
        """
        Convert video to GIF
        
        Args:
            video_path: Input video path
            gif_path: Output GIF path
            fps: Output GIF FPS
        """
        frames = VideoProcessor.extract_frames(video_path)
        
        # Convert BGR to RGB and resize for GIF
        rgb_frames = []
        for frame in frames:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # Resize to reasonable GIF size
            height, width = rgb_frame.shape[:2]
            if max(width, height) > 512:
                scale = 512 / max(width, height)
                new_size = (int(width * scale), int(height * scale))
                rgb_frame = cv2.resize(rgb_frame, new_size)
            rgb_frames.append(rgb_frame)
            
        # Save as GIF
        imageio.mimsave(gif_path, rgb_frames, fps=fps, duration=1000/fps)
        
    @staticmethod
    def frames_to_video(frames: List[np.ndarray], output_path: str, fps: int = 25):
        """
        Convert frame list to video
        
        Args:
            frames: List of frames
            output_path: Output video path
            fps: Frames per second
        """
        VideoProcessor.save_frames(frames, output_path, fps)
        
    @staticmethod
    def PIL_to_cv2(pil_image) -> np.ndarray:
        """Convert PIL Image to OpenCV format"""
        if pil_image.mode == 'RGB':
            return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        elif pil_image.mode == 'RGBA':
            return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGBA2BGRA)
        else:
            return np.array(pil_image)
            
    @staticmethod
    def cv2_to_PIL(cv_image) -> Image.Image:
        """Convert OpenCV format to PIL Image"""
        if len(cv_image.shape) == 3:
            if cv_image.shape[2] == 3:
                return Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))
            elif cv_image.shape[2] == 4:
                return Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGRA2RGBA))
        return Image.fromarray(cv_image)