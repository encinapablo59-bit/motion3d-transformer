# GitHub Setup Instructions for Motion3D Transformer

## 🚀 **Pasos para Publicar en GitHub**

### **✅ Paso 1: Crear Repositorio GitHub**

1. Ir a https://github.com/new
2. Repository name: `motion3d-transformer`
3. Description: `Real-time motion transfer for 3D character animation`
4. Visibility: ✅ Public
5. Click: "Create repository"

### **✅ Paso 2: Conectar Local con Remoto**

```bash
# Reemplaza TU_USERNAME con tu usuario de GitHub
git remote add origin https://github.com/TU_USERNAME/motion3d-transformer.git
```

### **✅ Paso 3: Configurar Git LFS**

```bash
# Inicializar Git LFS
git lfs install

# Hacer tracking de archivos pesados
git lfs track "*.pth"
git lfs track "*.pt" 
git lfs track "*.tar"
git lfs track "*.ckpt"

# Actualizar .gitattributes
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### **✅ Paso 4: Push a GitHub**

```bash
# Primer push al main branch
git push -u origin main

# Esto subirá todo el proyecto (sin los modelos pesados todavía)
```

### **✅ Paso 5: Subir Modelos Manualmente**

Como los modelos son grandes (~700MB), necesitas subirlos manualmente:

1. **Descargar modelos pre-entrenados:**
   - MotionClone: https://example.com/motion_clone_checkpoint.pth
   - FOMM: https://example.com/vox-cpk.pth.tar

2. **Colocar en carpeta models:**
   ```bash
   mkdir -p models/motion_clone
   mkdir -p models/fomm
   
   # Colocar MotionClone model
   cp motion_clone_checkpoint.pth models/motion_clone/checkpoint.pth
   
   # Colocar FOMM model  
   cp vox-cpk.pth.tar models/fomm/vox-cpk.pth.tar
   ```

3. **Hacer commit y push:**
   ```bash
   git add models/
   git commit -m "Add pre-trained models"
   git push origin main
   ```

---

## 🌐 **Configurar GitHub Pages (Demo)**

### **Opción 1: Automatic GitHub Pages**

1. En GitHub repo → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main" → "/root"
4. Click: "Save"

### **Opción 2: Manual Deploy**

```bash
# Build frontend
cd src
npm run build

# Subir a GitHub Pages gh-pages branch
git checkout -b gh-pages
git add dist/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

---

## 🔧 **Configurar GitHub Actions**

### **Activar Actions:**

1. En GitHub repo → Actions tab
2. Enable GitHub Actions (si pregunta)
3. Los workflows en `.github/workflows/` se ejecutarán automáticamente

### **Secrets (Opcional):**

Para deployment automático, configurar en Settings → Secrets:
- `REPO_TOKEN` (para acceso personal)
- `API_KEY` (para servicios externos)

---

## 🎮 **Probar el Despliegue**

### **1. Verificar API Documentation:**
https://TU_USERNAME.github.io/motion3d-transformer/docs/

### **2. Verificar Demo Live:**
https://TU_USERNAME.github.io/motion3d-transformer/

### **3. Test API Remota:**
```bash
curl https://TU_USERNAME.github.io/motion3d-transformer/api/health
```

---

## 📊 ** Métricas de Éxito**

### **Primer Día:**
- ⭐ 10+ stars
- 🍴 2+ forks  
- 👁 100+ visitors
- 📥 10+ clones

### **Primera Semana:**
- ⭐ 50+ stars
- 🍴 10+ forks
- 👁 500+ visitors
- 📥 50+ clones

### **Primer Mes:**
- ⭐ 100+ stars  
- 🍴 20+ forks
- 👁 2000+ visitors
- 📥 100+ clones

---

## 🔍 **Troubleshooting GitHub**

### **Error: "File too large"**
```bash
# Verificar Git LFS status
git lfs ls-files

# Forzar tracking si es necesario
git lfs migrate import --include="*.pth,*.pt,*.tar"
```

### **Error: "Push rejected"**
```bash
# Pull cambios recientes
git pull origin main
# Resolver conflictos
git push origin main
```

### **Error: "Pages not deploying"**
1. Verificar que el archivo index.html exista
2. Revisar Settings → Pages configuration
3. Check Actions tab para errores

---

## 🎯 **Checklist Final de Publicación**

- [ ] **Repo creado** en GitHub
- [ ] **Git LFS configurado** 
- [ ] **Código subido** al main branch
- [ ] **Modelos descargados** y colocados
- [ ] **GitHub Pages activado**
- [ ] **GitHub Actions ejecutando**
- [ ] **Demo funcionando** online
- [ ] **Documentación accesible**
- [ ] **README con badges** funcionando

---

## 🚀 **Resultado Final**

Una vez completado, tendrás:

✅ **GitHub Repo:** https://github.com/TU_USERNAME/motion3d-transformer
✅ **Live Demo:** https://TU_USERNAME.github.io/motion3d-transformer
✅ **API Docs:** https://TU_USERNAME.github.io/motion3d-transformer/docs
✅ **CI/CD:** https://github.com/TU_USERNAME/motion3d-transformer/actions
✅ **Issues:** https://github.com/TU_USERNAME/motion3d-transformer/issues

**¡Proyecto Motion3D Transformer completamente deployado y listo para contribuciones!** 🎉