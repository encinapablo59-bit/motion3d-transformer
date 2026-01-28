# Motion3D Transformer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-^18.0.0-blue.svg)](https://reactjs.org/)
[![Demo](https://img.shields.io/badge/demo-online-orange.svg)](https://tu-demo-link.com)

> Real-time motion transfer for 3D character animation using MotionClone technology.

## 🚀 Features

- **Simple Upload Interface**: Just upload image + video
- **Real-time 3D Preview**: See results instantly in 3D space
- **MotionClone Technology**: State-of-the-art motion transfer
- **Pre-trained Models Included**: Ready to use out of box
- **WebGL 3D Rendering**: Interactive 3D visualization

## 🎯 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/tu-username/motion3d-transformer.git
cd motion3d-transformer

# Backend setup
pip install -r requirements.txt
python scripts/download_models.py

# Frontend setup  
cd frontend
npm install
```

### 2. Run Demo
```bash
# Terminal 1 - Backend
python backend/inference/api.py

# Terminal 2 - Frontend  
cd frontend && npm start
```

### 3. Try It Out
1. Open http://localhost:3000
2. Upload a portrait image
3. Upload a driving video (dance/talking)
4. Click "Generate Motion"
5. See 3D animated result!

## 📊 Requirements

- **Minimum**: GPU with 4GB VRAM
- **Recommended**: RTX 3060+ with 8GB VRAM
- **CPU-only**: Works but slower
- **Storage**: 2GB for models + data

## 🎮 Demo Gallery

| Source Image | Driving Video | Result |
|--------------|---------------|--------|
| ![Portrait](data/examples/source_images/portrait_001_thumb.jpg) | ![Video](data/examples/driving_videos/dance_thumb.gif) | ![Result](data/examples/result_thumb.gif) |

## 🔧 Usage

### Web Interface
Simply drag-and-drop your files and click generate!

### Python API
```python
from backend.inference.predictor import Motion3DPredictor

predictor = Motion3DPredictor()
result = predictor.generate_motion(
    source_image="portrait.jpg",
    driving_video="dance.mp4",
    model="motion_clone"
)
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- [MotionClone](https://github.com/MotionClone/MotionClone) research team
- [First Order Motion Model](https://github.com/AliaksandrSiarohin/first-order-motion-model)
- Three.js community for 3D rendering