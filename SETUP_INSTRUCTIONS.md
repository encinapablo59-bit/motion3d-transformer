# Motion3D Transformer - Setup Instructions

## 🚀 Ruta del Proyecto

**Ubicación completa:** `C:\Users\dell\nose`

## 📋 Pasos para Probar el Funcionamiento

### **Opción 1: Setup Automático (Recomendado)**
```bash
cd C:\Users\dell\nose
bash scripts/setup_env.sh
```

### **Opción 2: Setup Manual**

#### **1. Instalar Python Dependencies**
```bash
cd C:\Users\dell\nose

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

#### **2. Instalar Node.js Dependencies**
```bash
cd C:\Users\dell\nose

# (En nueva terminal)
cd src
npm install
```

#### **3. Descargar Modelos**
```bash
cd C:\Users\dell\nose

# Con entorno virtual activado
python scripts/download_models.py
```

## 🎮 Iniciar Aplicación

### **Terminal 1 - Backend**
```bash
cd C:\Users\dell\nose
venv\Scripts\activate
python backend\inference\api.py
```

### **Terminal 2 - Frontend**
```bash
cd C:\Users\dell\nose\src
npm start
```

## 🌐 Acceso a la Aplicación

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🧪 Probar Funcionalidad

### **1. Test API Health**
```bash
curl http://localhost:8000/health
```

### **2. Test con Demo Script**
```bash
cd C:\Users\dell\nose
venv\Scripts\activate
python scripts/run_demo.py --list-models

# Luego con archivos:
python scripts/run_demo.py --source data/examples/source_images/portrait_001.jpg --driving data/examples/driving_videos/dance_short.mp4
```

### **3. Test Web Interface**
1. Abrir http://localhost:3000
2. Step 1: Upload imagen portrait
3. Step 2: Upload video de baile
4. Step 3: Seleccionar modelo y generar

## 🔧 Estructura de Archivos para Testing

```
C:\Users\dell\nose\
├── backend\inference\api.py          # Iniciar backend
├── src\App.jsx                       # Frontend app
├── scripts\run_demo.py               # CLI testing
├── scripts\download_models.py         # Model setup
└── requirements.txt                  # Python deps
```

## ⚠️ Troubleshooting

### **Problemas Comunes**

#### **Error: "No module found"**
```bash
# Asegurar entorno virtual activado
venv\Scripts\activate

# Reinstalar dependencias
pip install -r requirements.txt
```

#### **Error: "Model not found"**
```bash
# Descargar modelos
python scripts/download_models.py

# Verificar archivos
dir models\motion_clone\
dir models\fomm\
```

#### **Error: "Port already in use"**
```bash
# Matar procesos en puertos
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Matar procesos
taskkill /PID <PID> /F
```

#### **Error: Node.js no encontrado**
- Descargar desde https://nodejs.org/
- Usar versión 18+ LTS

## 🎯 Checklist de Funcionamiento

- [ ] Backend inicia sin errores
- [ ] Frontend carga en http://localhost:3000
- [ ] API responde en http://localhost:8000
- [ ] Endpoint `/health` funciona
- [ ] Subida de archivos funciona
- [ ] Demo CLI genera motion transfer
- [ ] Interfaz web completa workflow de 3 pasos

## 📞 Soporte

Si tienes problemas:
1. Revisar logs de terminal
2. Check dependencies: `pip list`, `npm list`
3. Verificar rutas de archivos
4. Limpiar caché: `npm cache clean`, `pip cache purge`

## 🚀 Ready for Development

Una vez que todo funcione:
1. Hacer commit inicial: `git init`
2. Configurar Git LFS
3. Subir a GitHub
4. Configurar GitHub Actions

**La aplicación estará lista para desarrollo y pruebas!**