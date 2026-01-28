// Utility functions for image processing and 3D operations

export const loadImageAsTexture = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageUrl
  })
}

export const createDisplacementMap = (imageData, scale = 1.0) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = imageData.width
  canvas.height = imageData.height
  
  ctx.drawImage(imageData, 0, 0)
  
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = pixels.data
  
  // Convert to grayscale and apply scaling
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
    const scaled = Math.min(1.0, gray * scale)
    
    data[i] = scaled * 255     // R
    data[i + 1] = scaled * 255 // G
    data[i + 2] = scaled * 255 // B
    // Alpha remains unchanged
  }
  
  ctx.putImageData(pixels, 0, 0)
  return canvas
}

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.')
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Please upload images smaller than 10MB.')
  }
  
  return true
}

export const calculateOptimalMeshDensity = (imageWidth, imageHeight) => {
  const maxDimension = Math.max(imageWidth, imageHeight)
  
  if (maxDimension <= 256) return 64
  if (maxDimension <= 512) return 128
  if (maxDimension <= 1024) return 192
  return 256
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}