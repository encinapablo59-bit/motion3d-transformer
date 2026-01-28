"""
FastAPI backend for Motion3D Transformer
Provides REST API endpoints for motion transfer
"""

import os
import io
import uuid
from typing import Dict, Optional, List
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
import uvicorn
import tempfile
import shutil

from .predictor import Motion3DPredictor

# Initialize FastAPI app
app = FastAPI(
    title="Motion3D Transformer API",
    description="Real-time motion transfer for 3D character animation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global predictor instance
predictor = None
current_tasks = {}

class MotionRequest(BaseModel):
    """Request model for motion generation"""
    model_name: str = "motion_clone"
    config: Optional[Dict] = None

class MotionResponse(BaseModel):
    """Response model for motion generation"""
    task_id: str
    status: str
    output_path: Optional[str] = None
    error: Optional[str] = None

class ModelInfo(BaseModel):
    """Model information response"""
    name: str
    device: str
    parameters: int
    size_mb: float
    available: bool

class BenchmarkResult(BaseModel):
    """Benchmark performance result"""
    avg_time_seconds: float
    fps: float
    model_name: str
    device: str

# Storage for uploaded files and results
UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

@app.on_event("startup")
async def startup_event():
    """Initialize predictor on startup"""
    global predictor
    print("🚀 Starting Motion3D Transformer API...")
    
    # Try to load default model
    try:
        predictor = Motion3DPredictor("motion_clone")
        print("✅ MotionClone model loaded successfully")
    except Exception as e:
        print(f"⚠️ Failed to load MotionClone: {e}")
        try:
            predictor = Motion3DPredictor("fomm")
            print("✅ FOMM model loaded as fallback")
        except Exception as e2:
            print(f"❌ Failed to load any model: {e2}")
            predictor = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Motion3D Transformer API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "predictor_loaded": predictor is not None,
        "device": predictor.device if predictor else None
    }

@app.get("/models", response_model=List[ModelInfo])
async def get_available_models():
    """Get list of available models"""
    if not predictor:
        raise HTTPException(status_code=503, detail="No models loaded")
        
    models = []
    model_manager = predictor.model_manager
    available_models = model_manager.get_available_models()
    
    for model_name in ["motion_clone", "fomm"]:
        model_info = ModelInfo(
            name=model_name,
            device=str(model_manager.device),
            parameters=0,  # Would need to calculate if model is loaded
            size_mb=0,
            available=model_name in available_models
        )
        models.append(model_info)
        
    return models

@app.get("/model/current")
async def get_current_model():
    """Get information about currently loaded model"""
    if not predictor:
        raise HTTPException(status_code=503, detail="No models loaded")
        
    return predictor.get_model_info()

@app.post("/model/switch/{model_name}")
async def switch_model(model_name: str):
    """Switch to a different model"""
    if not predictor:
        raise HTTPException(status_code=503, detail="No models loaded")
        
    if model_name not in ["motion_clone", "fomm"]:
        raise HTTPException(status_code=400, detail="Invalid model name")
        
    try:
        predictor.model_manager.set_current_model(model_name)
        predictor.model = predictor.model_manager.get_current_model()
        predictor.model_name = model_name
        return {"message": f"Switched to {model_name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate", response_model=MotionResponse)
async def generate_motion(
    background_tasks: BackgroundTasks,
    source_image: UploadFile = File(...),
    driving_video: UploadFile = File(...),
    model_name: str = "motion_clone"
):
    """
    Generate motion transfer from uploaded files
    
    Args:
        source_image: Source image file
        driving_video: Driving video file  
        model_name: Model to use ("motion_clone" or "fomm")
        
    Returns:
        Task ID and status
    """
    if not predictor:
        raise HTTPException(status_code=503, detail="No models loaded")
    
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Validate files
    if not source_image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Source file must be an image")
        
    if not driving_video.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="Driving file must be a video")
    
    # Save uploaded files temporarily
    source_path = os.path.join(UPLOAD_DIR, f"{task_id}_source{os.path.splitext(source_image.filename)[1]}")
    driving_path = os.path.join(UPLOAD_DIR, f"{task_id}_driving{os.path.splitext(driving_video.filename)[1]}")
    
    with open(source_path, "wb") as f:
        shutil.copyfileobj(source_image.file, f)
    with open(driving_path, "wb") as f:
        shutil.copyfileobj(driving_video.file, f)
    
    # Initialize task status
    current_tasks[task_id] = {"status": "processing", "progress": 0}
    
    # Start background processing
    background_tasks.add_task(
        process_motion_transfer,
        task_id,
        source_path,
        driving_path,
        model_name
    )
    
    return MotionResponse(
        task_id=task_id,
        status="processing"
    )

async def process_motion_transfer(task_id: str, source_path: str, driving_path: str, model_name: str):
    """
    Background task for processing motion transfer
    """
    try:
        # Update task status
        current_tasks[task_id]["status"] = "processing"
        current_tasks[task_id]["progress"] = 25
        
        # Generate output path
        output_path = os.path.join(RESULTS_DIR, f"{task_id}_output.mp4")
        
        # Switch model if needed
        if predictor.model_name != model_name:
            predictor.model_manager.set_current_model(model_name)
            predictor.model = predictor.model_manager.get_current_model()
            predictor.model_name = model_name
        
        current_tasks[task_id]["progress"] = 50
        
        # Generate motion transfer
        result_path = predictor.generate_motion(source_path, driving_path, output_path)
        
        current_tasks[task_id]["progress"] = 75
        
        # Move to final location
        final_path = os.path.join(RESULTS_DIR, f"{task_id}.mp4")
        shutil.move(result_path, final_path)
        
        # Clean up temporary files
        os.remove(source_path)
        os.remove(driving_path)
        
        # Update task status
        current_tasks[task_id] = {
            "status": "completed",
            "progress": 100,
            "output_path": final_path
        }
        
    except Exception as e:
        current_tasks[task_id] = {
            "status": "error",
            "error": str(e),
            "progress": 0
        }

@app.get("/task/{task_id}")
async def get_task_status(task_id: str):
    """Get status of a motion generation task"""
    if task_id not in current_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
        
    return current_tasks[task_id]

@app.get("/download/{task_id}")
async def download_result(task_id: str):
    """Download generated video"""
    if task_id not in current_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task = current_tasks[task_id]
    
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Task not completed")
        
    output_path = task["output_path"]
    
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Output file not found")
        
    return FileResponse(
        output_path,
        media_type="video/mp4",
        filename=f"motion3d_{task_id}.mp4"
    )

@app.post("/benchmark", response_model=BenchmarkResult)
async def benchmark_model(
    source_image: UploadFile = File(...),
    driving_video: UploadFile = File(...),
    model_name: str = "motion_clone",
    num_runs: int = 3
):
    """Benchmark model performance"""
    if not predictor:
        raise HTTPException(status_code=503, detail="No models loaded")
    
    # Save files temporarily
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as source_file:
        shutil.copyfileobj(source_image.file, source_file)
        source_path = source_file.name
        
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as driving_file:
        shutil.copyfileobj(driving_video.file, driving_file)
        driving_path = driving_file.name
    
    try:
        # Switch model if needed
        if predictor.model_name != model_name:
            predictor.model_manager.set_current_model(model_name)
            predictor.model = predictor.model_manager.get_current_model()
            predictor.model_name = model_name
        
        # Run benchmark
        results = predictor.benchmark_performance(source_path, driving_path, num_runs)
        
        return BenchmarkResult(**results)
        
    finally:
        # Clean up
        os.unlink(source_path)
        os.unlink(driving_path)

@app.delete("/task/{task_id}")
async def cleanup_task(task_id: str):
    """Clean up task files and status"""
    if task_id not in current_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = current_tasks[task_id]
    
    # Remove output file if exists
    if "output_path" in task and os.path.exists(task["output_path"]):
        os.remove(task["output_path"])
    
    # Remove task from memory
    del current_tasks[task_id]
    
    return {"message": "Task cleaned up successfully"}

@app.get("/tasks")
async def list_tasks():
    """List all current tasks"""
    return current_tasks

if __name__ == "__main__":
    uvicorn.run(
        "backend.inference.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )